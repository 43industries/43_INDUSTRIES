import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";
import { requireClanRole } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await requireCommunityUser();
  const { id } = await context.params;
  const payload = (await request.json()) as { userId?: string };
  const targetUserId = payload.userId ?? "";

  const subClan = await prisma.subClan.findUnique({ where: { id } });
  if (!subClan) {
    return NextResponse.json({ error: "Sub-clan not found." }, { status: 404 });
  }

  try {
    await requireClanRole(user.id, subClan.clanId, "CHIEF");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const role = await prisma.subClanMembership.upsert({
    where: { userId_subClanId: { userId: targetUserId, subClanId: id } },
    create: { userId: targetUserId, subClanId: id, role: "LEAD" },
    update: { role: "LEAD" },
  });

  return NextResponse.json(role);
}
