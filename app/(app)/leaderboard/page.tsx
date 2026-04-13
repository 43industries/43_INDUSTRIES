import Link from "next/link";
import { ReputationLeaderboard } from "@/components/reputation-leaderboard";
import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const topProgress = await prisma.profileProgress.findMany({
    orderBy: [{ points: "desc" }, { lastEventAt: "desc" }],
    take: 25,
    include: { user: true },
  });
  const entries = topProgress.map((entry) => ({
    id: entry.userId,
    name: entry.user.name ?? "Member",
    points: entry.points,
    level: entry.level,
  }));
  const clanScores = await prisma.clan.findMany({
    include: { memberships: { where: { status: "ACTIVE" } } },
  });
  const subClanScores = await prisma.subClan.findMany({
    include: { memberships: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Leaderboard</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Reputation standings</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Rankings reward consistency and quality. High-signal contributions move you up.
      </p>
      <div className="mt-8">
        <ReputationLeaderboard entries={entries} />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Clan standings</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            {clanScores
              .map((clan) => ({ name: clan.name, score: clan.memberships.length * 100 }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 8)
              .map((clan) => (
                <p key={clan.name}>
                  {clan.name} · {clan.score}
                </p>
              ))}
          </div>
        </section>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Sub-clan standings</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            {subClanScores
              .map((subClan) => ({ name: subClan.name, score: subClan.memberships.length * 80 }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 8)
              .map((subClan) => (
                <p key={subClan.name}>
                  {subClan.name} · {subClan.score}
                </p>
              ))}
          </div>
        </section>
      </div>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
