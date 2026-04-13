import { NextResponse } from "next/server";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { getClanMembership } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const threads = await prisma.post.findMany({
    where: { clanId: id },
    orderBy: { createdAt: "desc" },
    include: { author: true, comments: true },
  });
  return NextResponse.json(threads);
}

export async function POST(request: Request, context: RouteContext) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();
  const { id } = await context.params;
  const membership = await getClanMembership(user.id, id);
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ error: "Join the clan first." }, { status: 403 });
  }

  const payload = (await request.json()) as { title?: string; body?: string };
  const title = payload.title?.trim() ?? "";
  const body = payload.body?.trim() ?? "";
  if (title.length < 8 || body.length < 20) {
    return NextResponse.json({ error: "Invalid thread." }, { status: 400 });
  }

  const thread = await prisma.post.create({
    data: { title, body, authorId: user.id, clanId: id },
  });
  return NextResponse.json(thread, { status: 201 });
}
