import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { onboardingPointsById } from "@/lib/member-experience-data";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/progression";

export async function POST(request: Request) {
  const user = await requireCommunityUser();
  const payload = (await request.json()) as { stepId?: string; completed?: boolean };
  const stepId = payload.stepId ?? "";
  const completed = Boolean(payload.completed);
  const points = onboardingPointsById[stepId];

  if (!stepId || typeof points !== "number") {
    return NextResponse.json({ error: "Unknown onboarding step." }, { status: 400 });
  }

  if (completed) {
    const created = await prisma.onboardingCompletion.createMany({
      data: { userId: user.id, stepId },
      skipDuplicates: true,
    });
    if (created.count > 0) {
      await awardPoints(user.id, points);
    }
  } else {
    await prisma.onboardingCompletion.deleteMany({
      where: { userId: user.id, stepId },
    });
  }

  return NextResponse.json({ ok: true });
}
