import { NextResponse } from "next/server";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { getLibraryDocBySlug } from "@/lib/library";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/progression";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_: Request, context: RouteContext) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();
  const { slug } = await context.params;
  const doc = await getLibraryDocBySlug(slug);

  if (!doc) {
    return NextResponse.json({ error: "Library entry not found." }, { status: 404 });
  }

  const entry = await prisma.libraryEntry.upsert({
    where: { slug },
    update: {
      title: doc.title,
      summary: doc.summary,
      publishedAt: new Date(),
      tags: {
        set: [],
        connectOrCreate: doc.tags.map((label) => ({
          where: { label },
          create: { label },
        })),
      },
    },
    create: {
      slug,
      title: doc.title,
      summary: doc.summary,
      publishedAt: new Date(),
      tags: {
        connectOrCreate: doc.tags.map((label) => ({
          where: { label },
          create: { label },
        })),
      },
    },
    include: { tags: true, discussThread: true },
  });

  if (entry.discussThreadId) {
    return NextResponse.json({ threadId: entry.discussThreadId });
  }

  const thread = await prisma.post.create({
    data: {
      title: `Discuss: ${entry.title}`,
      body: `Auto-created discussion for library entry "${entry.title}". Share reflections, critiques, and implementation ideas.`,
      authorId: user.id,
      tags: {
        connect: entry.tags.map((tag) => ({ id: tag.id })),
      },
    },
  });

  await prisma.libraryEntry.update({
    where: { id: entry.id },
    data: { discussThreadId: thread.id },
  });

  await awardPoints(user.id, 15);
  return NextResponse.json({ threadId: thread.id }, { status: 201 });
}
