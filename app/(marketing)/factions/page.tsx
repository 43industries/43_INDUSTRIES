import Link from "next/link";
import { ClanCard } from "@/components/clan-card";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export default async function PublicFactionsPage() {
  let clans: Awaited<ReturnType<typeof prisma.clan.findMany>> = [];
  let dbUnavailable = false;

  try {
    clans = await prisma.clan.findMany({
      where: { visibility: "PUBLIC" },
      include: {
        _count: { select: { memberships: true, subClans: true, posts: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbUnavailable = true;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Faction atlas</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Public clans</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Explore the world structure before joining: clans, sub-clans, and live momentum.
        </p>
        {dbUnavailable ? (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            Faction data is temporarily unavailable until the database connection is configured.
          </p>
        ) : null}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {clans.map((clan) => (
            <ClanCard key={clan.id} clan={clan} publicHref={`/factions/${clan.slug}`} />
          ))}
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
