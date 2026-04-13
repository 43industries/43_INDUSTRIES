import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, context: RouteContext) {
  const user = await requireCommunityUser();
  const { id } = await context.params;

  const thread = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found." }, { status: 404 });
  }

  if (thread.authorId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
