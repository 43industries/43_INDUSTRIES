type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  level: number;
};

export function ReputationLeaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  const fullBoard = entries.map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Leaderboard and reputation</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Top contributors this week</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Reputation is earned through useful threads, validated challenge submissions, and
        meaningful library reflections.
      </p>
      <div className="mt-6 space-y-2">
        {fullBoard.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2"
          >
            <p className="text-sm text-zinc-100">
              #{entry.rank} {entry.name}
            </p>
            <p className="text-xs text-zinc-300">
              {entry.points} pts · level {entry.level}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
