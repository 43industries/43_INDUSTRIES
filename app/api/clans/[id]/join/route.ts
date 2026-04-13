import { NextResponse } from "next/server";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: RouteContext) {
  const user = await requireSocietyUser();
  const { id } = await context.params;

  const membership = await prisma.clanMembership.upsert({
    where: { userId_clanId: { userId: user.id, clanId: id } },
    create: { userId: user.id, clanId: id, status: "ACTIVE", role: "MEMBER" },
    update: { status: "ACTIVE" },
  });

  trackEvent("clan_joined", { userId: user.id, clanId: id });
  return NextResponse.json(membership);
}
