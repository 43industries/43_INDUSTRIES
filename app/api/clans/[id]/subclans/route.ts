import { NextResponse } from "next/server";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { requireClanRole } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await requireSocietyUser();
  const { id } = await context.params;
  try {
    await requireClanRole(user.id, id, "CHIEF");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = (await request.json()) as { name?: string; slug?: string; purpose?: string };
  const name = payload.name?.trim() ?? "";
  const slug = payload.slug?.trim().toLowerCase() ?? "";
  const purpose = payload.purpose?.trim() ?? "";

  if (name.length < 3 || slug.length < 3 || purpose.length < 8) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const subClan = await prisma.subClan.create({
    data: { clanId: id, name, slug, purpose },
  });
  return NextResponse.json(subClan, { status: 201 });
}
