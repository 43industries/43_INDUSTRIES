import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSocietyUser } from "@/lib/society-user";
import { checkRateLimit } from "@/lib/rate-limit";
import { awardPoints } from "@/lib/progression";
import { createCommentSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const rate = checkRateLimit({
    key: `comment:${userId}:${id}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many comments on this thread. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  const parsed = createCommentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid comment payload." },
      { status: 400 },
    );
  }
  const { body } = parsed.data;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Thread not found." }, { status: 404 });
  }

  const user = await requireSocietyUser();

  const comment = await prisma.comment.create({
    data: {
      body,
      postId: id,
      authorId: user.id,
    },
    include: {
      author: true,
    },
  });

  await awardPoints(user.id, 12);

  return NextResponse.json(comment, { status: 201 });
}
