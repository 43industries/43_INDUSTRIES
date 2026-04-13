import { NextResponse } from "next/server";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/progression";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: RouteContext) {
  const user = await requireSocietyUser();
  const { id } = await context.params;
  const post = await prisma.post.findUnique({ where: { id }, select: { id: true } });
  if (!post) {
    return NextResponse.json({ error: "Thread not found." }, { status: 404 });
  }

  const existing = await prisma.threadReaction.findUnique({
    where: { postId_userId: { postId: id, userId: user.id } },
  });

  if (existing) {
    await prisma.threadReaction.delete({ where: { id: existing.id } });
    const count = await prisma.threadReaction.count({ where: { postId: id } });
    return NextResponse.json({ liked: false, count });
  }

  await prisma.threadReaction.create({
    data: { postId: id, userId: user.id },
  });
  await awardPoints(user.id, 2);
  const count = await prisma.threadReaction.count({ where: { postId: id } });
  return NextResponse.json({ liked: true, count }, { status: 201 });
}
