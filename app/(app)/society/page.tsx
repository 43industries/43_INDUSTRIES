import Link from "next/link";
import { ThreadComposer } from "@/components/thread-composer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
type SocietyThread = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  author: { name: string | null };
  comments: { id: string; body: string; createdAt: Date; author: { name: string | null } }[];
  reactions: { userId: string }[];
  _count: { reactions: number };
};

type SocietyPageProps = {
  searchParams: Promise<{
    cursor?: string;
  }>;
};

export default async function SocietyPage({ searchParams }: SocietyPageProps) {
  const params = await searchParams;
  const cursor = params.cursor;

  let threads: SocietyThread[] = [];
  let nextCursor: string | null = null;
  let dbUnavailable = false;

  try {
    const rows = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        author: true,
        comments: {
          orderBy: { createdAt: "asc" },
          include: { author: true },
        },
        reactions: { select: { userId: true } },
        _count: { select: { reactions: true } },
      },
    });

    const hasMore = rows.length > PAGE_SIZE;
    threads = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
    nextCursor = hasMore ? threads[threads.length - 1]?.id ?? null : null;
  } catch {
    dbUnavailable = true;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Society</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Discussions</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Phase B now ships authenticated access with Prisma-backed thread and comment
        persistence.
      </p>
      {dbUnavailable ? (
        <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          Database is not connected yet. Set <code>DATABASE_URL</code> and run Prisma
          setup to enable persisted threads.
        </p>
      ) : null}
      <ThreadComposer
        threads={threads}
        initialNextCursor={nextCursor}
        disabled={dbUnavailable}
      />
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200"
      >
        ← Back to marketing home
      </Link>
    </div>
  );
}
