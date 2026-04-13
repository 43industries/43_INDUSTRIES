import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSocietyUser } from "@/lib/society-user";
import { checkRateLimit } from "@/lib/rate-limit";
import { awardPoints } from "@/lib/progression";
import { createThreadSchema } from "@/lib/validators";

const THREAD_PAGE_SIZE = 10;

export async function GET(request: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const requestedLimit = Number(searchParams.get("limit"));
  const take =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 20)
      : THREAD_PAGE_SIZE;

  const rows = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      author: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
      reactions: userId
        ? {
            where: { user: { clerkId: userId } },
            select: { userId: true },
          }
        : { select: { userId: true } },
      _count: {
        select: { reactions: true },
      },
    },
  });

  const hasMore = rows.length > take;
  const threads = hasMore ? rows.slice(0, take) : rows;
  const nextCursor = hasMore ? threads[threads.length - 1]?.id ?? null : null;

  return NextResponse.json({ threads, nextCursor });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit({
    key: `thread:${userId}`,
    limit: 5,
    windowMs: 60_000,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many new threads. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  const parsed = createThreadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid thread payload." },
      { status: 400 },
    );
  }
  const { title, body } = parsed.data;

  const user = await requireSocietyUser();

  const post = await prisma.post.create({
    data: {
      title,
      body,
      authorId: user.id,
    },
    include: {
      author: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
      reactions: {
        where: { userId: user.id },
        select: { userId: true },
      },
      _count: {
        select: { reactions: true },
      },
    },
  });

  await awardPoints(user.id, 30);

  return NextResponse.json(post, { status: 201 });
}
