import { prisma } from "@/lib/prisma";

export async function awardPoints(userId: string, points: number) {
  const profile = await prisma.profileProgress.upsert({
    where: { userId },
    update: {
      points: { increment: points },
      lastEventAt: new Date(),
    },
    create: {
      userId,
      points,
      level: 1,
      lastEventAt: new Date(),
    },
  });

  const level = Math.max(1, Math.floor(profile.points / 250) + 1);
  if (level !== profile.level) {
    await prisma.profileProgress.update({
      where: { userId },
      data: { level },
    });
  }
}
