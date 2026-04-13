import { NextResponse } from "next/server";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/progression";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

function getWeekStart(value: Date) {
  const date = new Date(value);
  const day = date.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  date.setUTCDate(date.getUTCDate() - diffToMonday);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export async function POST(request: Request, context: RouteContext) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();
  const { id } = await context.params;
  const payload = (await request.json()) as { proof?: string };

  const challenge = await prisma.clanChallenge.findUnique({ where: { id } });
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
  }

  const weekStart = getWeekStart(new Date());
  const created = await prisma.challengeCompletion.createMany({
    data: {
      userId: user.id,
      challengeId: id,
      weekStart,
      proof: payload.proof?.trim(),
    },
    skipDuplicates: true,
  });

  if (created.count > 0) {
    await awardPoints(user.id, challenge.points);
    await prisma.profileProgress.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        points: challenge.points,
        xp: challenge.points,
        reputation: Math.floor(challenge.points / 5),
        seasonScore: challenge.points,
      },
      update: {
        xp: { increment: challenge.points },
        reputation: { increment: Math.floor(challenge.points / 5) },
        seasonScore: { increment: challenge.points },
      },
    });
  }

  trackEvent("challenge_completed", { userId: user.id, challengeId: id });
  return NextResponse.json({ ok: true });
}
