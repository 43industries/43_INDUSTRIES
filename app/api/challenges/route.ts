import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
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
  const user = await requireCommunityUser();
  const payload = (await request.json()) as { challengeId?: string; completed?: boolean };
  const challengeId = payload.challengeId ?? "";
  const completed = Boolean(payload.completed);
  const reward = challengeRewardsById[challengeId];

  if (!challengeId || typeof reward !== "number") {
    return NextResponse.json({ error: "Unknown challenge." }, { status: 400 });
  }

  const weekStart = getWeekStart(new Date());

  if (completed) {
    const created = await prisma.challengeCompletion.createMany({
      data: { userId: user.id, challengeId, weekStart },
      skipDuplicates: true,
    });
    if (created.count > 0) {
      await awardPoints(user.id, reward);
    }
  } else {
    await prisma.challengeCompletion.deleteMany({
      where: { userId: user.id, challengeId, weekStart },
    });
  }

  return NextResponse.json({ ok: true });
}
