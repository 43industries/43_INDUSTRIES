import { NextResponse } from "next/server";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { requireClanRole } from "@/lib/permissions";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const actor = await requireSocietyUser();
  const { id } = await context.params;
  const payload = (await request.json()) as { userId?: string };
  const targetUserId = payload.userId ?? "";

  try {
    await requireClanRole(actor.id, id, "FOUNDER");
  } catch {
    return NextResponse.json({ error: "Only founders can appoint chiefs." }, { status: 403 });
  }

  await prisma.clanMembership.upsert({
    where: { userId_clanId: { userId: targetUserId, clanId: id } },
    create: {
      userId: targetUserId,
      clanId: id,
      role: "CHIEF",
      status: "ACTIVE",
    },
    update: {
      role: "CHIEF",
      status: "ACTIVE",
    },
  });

  const term = await prisma.leadershipTerm.create({
    data: {
      clanId: id,
      userId: targetUserId,
      role: "CHIEF",
      startsAt: new Date(),
      source: "APPOINTMENT",
    },
  });

  trackEvent("chief_appointed", { clanId: id, userId: targetUserId, actorId: actor.id });
  return NextResponse.json(term);
}
