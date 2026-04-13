import { prisma } from "@/lib/prisma";

export type SocietyInsights = {
  featuredThread: {
    id: string;
    title: string;
    excerpt: string;
    commentCount: number;
  } | null;
  featuredLibraryEntry: {
    slug: string;
    title: string;
    summary: string;
  } | null;
  activeChallenge: {
    id: string;
    title: string;
    clanName: string;
    points: number;
  } | null;
};

export async function getSocietyInsights(): Promise<SocietyInsights | null> {
  try {
    const [featuredThread, featuredLibraryEntry, activeChallenge] = await Promise.all([
      prisma.post.findFirst({
        orderBy: { createdAt: "desc" },
        include: { comments: { select: { id: true } } },
      }),
      prisma.libraryEntry.findFirst({
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.clanChallenge.findFirst({
        where: { season: { status: "ACTIVE" } },
        orderBy: { createdAt: "desc" },
        include: { clan: true },
      }),
    ]);

    return {
      featuredThread: featuredThread
        ? {
            id: featuredThread.id,
            title: featuredThread.title,
            excerpt: featuredThread.body.slice(0, 140),
            commentCount: featuredThread.comments.length,
          }
        : null,
      featuredLibraryEntry: featuredLibraryEntry
        ? {
            slug: featuredLibraryEntry.slug,
            title: featuredLibraryEntry.title,
            summary: featuredLibraryEntry.summary,
          }
        : null,
      activeChallenge: activeChallenge
        ? {
            id: activeChallenge.id,
            title: activeChallenge.title,
            clanName: activeChallenge.clan.name,
            points: activeChallenge.points,
          }
        : null,
    };
  } catch {
    return null;
  }
}
