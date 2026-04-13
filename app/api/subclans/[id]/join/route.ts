import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: RouteContext) {
  const user = await requireCommunityUser();
  const { id } = await context.params;

  const subClan = await prisma.subClan.findUnique({
    where: { id },
    include: { clan: true },
  });
  if (!subClan) {
    return NextResponse.json({ error: "Sub-clan not found." }, { status: 404 });
  }

  const clanMembership = await prisma.clanMembership.findUnique({
    where: { userId_clanId: { userId: user.id, clanId: subClan.clanId } },
  });
  if (!clanMembership || clanMembership.status !== "ACTIVE") {
    return NextResponse.json({ error: "Join parent clan first." }, { status: 403 });
  }

  const membership = await prisma.subClanMembership.upsert({
    where: { userId_subClanId: { userId: user.id, subClanId: id } },
    create: { userId: user.id, subClanId: id, role: "MEMBER" },
    update: {},
  });

  return NextResponse.json(membership);
}
