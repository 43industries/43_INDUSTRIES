import { NextResponse } from "next/server";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { challengeRewardsById } from "@/lib/member-experience-data";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/progression";

function getWeekStart(value: Date) {
  const date = new Date(value);
  const day = date.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  date.setUTCDate(date.getUTCDate() - diffToMonday);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export async function POST(request: Request) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();
  const payload = (await request.json()) as { challengeId?: string; completed?: boolean };
  const challengeId = payload.challengeId ?? "";
  const completed = Boolean(payload.completed);
  const reward = challengeRewardsById[challengeId];

  if (!challengeId || typeof reward !== "number") {
    return NextResponse.json({ error: "Unknown challenge." }, { status: 400 });
  }

  const weekStart = getWeekStart(new Date());

  if (completed) {
    const created = await prisma.$transaction(async (tx) => {
      const existing = await tx.challengeCompletion.findFirst({
        where: { userId: user.id, challengeId: null, weekStart, proof: challengeId },
        select: { id: true },
      });

      if (existing) {
        return false;
      }

      await tx.challengeCompletion.create({
        data: {
          userId: user.id,
          challengeId: null,
          weekStart,
          // Store weekly challenge key as proof to keep this loop server validated
          // without requiring every weekly prompt to exist in ClanChallenge.
          proof: challengeId,
        },
      });

      return true;
    });

    if (created) {
      await awardPoints(user.id, reward);
    }
  } else {
    await prisma.challengeCompletion.deleteMany({
      where: { userId: user.id, challengeId: null, weekStart, proof: challengeId },
    });
  }

  return NextResponse.json({ ok: true });
}
