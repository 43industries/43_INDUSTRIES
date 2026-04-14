import Link from "next/link";
import { ClanCard } from "@/components/clan-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ClansPage() {
  const clans = await prisma.clan.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true, subClans: true, posts: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Clans</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Faction directory</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Join multiple clans, rise through ranks, and build influence across the network.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {clans.map((clan) => (
          <ClanCard key={clan.id} clan={clan} />
        ))}
      </div>

      <Link href="/dashboard" className="mt-8 inline-flex text-sm text-yellow-300 hover:text-yellow-200">
        &larr; Back to dashboard
      </Link>
    </div>
  );
}
