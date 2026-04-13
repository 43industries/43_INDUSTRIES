import { NextResponse } from "next/server";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: RouteContext) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();
  const { id } = await context.params;

  await prisma.clanMembership.updateMany({
    where: { userId: user.id, clanId: id },
    data: { status: "LEFT" },
  });

  trackEvent("clan_left", { userId: user.id, clanId: id });
  return NextResponse.json({ ok: true });
}
