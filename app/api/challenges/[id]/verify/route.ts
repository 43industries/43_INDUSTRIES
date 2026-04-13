import { NextResponse } from "next/server";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { requireClanRole } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await requireSocietyUser();
  const { id } = await context.params;
  const payload = (await request.json()) as { completionId?: string };
  const completionId = payload.completionId ?? "";

  const challenge = await prisma.clanChallenge.findUnique({ where: { id } });
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
  }

  try {
    await requireClanRole(user.id, challenge.clanId, "ELDER");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const completion = await prisma.challengeCompletion.update({
    where: { id: completionId },
    data: { verifiedAt: new Date(), verifiedById: user.id },
  });
  return NextResponse.json(completion);
}
