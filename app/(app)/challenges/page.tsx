import Link from "next/link";
import { WeeklyChallengeBoard } from "@/components/weekly-challenge-board";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";

function getWeekStart(value: Date) {
  const date = new Date(value);
  const day = date.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  date.setUTCDate(date.getUTCDate() - diffToMonday);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export default async function ChallengesPage() {
  const user = await requireCommunityUser();
  const weekStart = getWeekStart(new Date());
  const completions = await prisma.challengeCompletion.findMany({
    where: { userId: user.id, weekStart },
    select: { challengeId: true },
  });
  const activeSeason = await prisma.season.findFirst({
    where: { status: "ACTIVE" },
    include: {
      challenges: {
        include: { clan: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Challenges</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Weekly challenge system</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Each challenge pushes useful behavior: practical contribution, peer feedback, and
        library-to-thread knowledge loops.
      </p>
      <div className="mt-8">
        <WeeklyChallengeBoard
          initialClaimed={completions
            .map((row: { challengeId: string | null }) => row.challengeId)
            .filter((value): value is string => Boolean(value))}
        />
      </div>
      <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Seasonal clan missions</h2>
        {activeSeason ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-zinc-400">Season: {activeSeason.name}</p>
            {activeSeason.challenges.map((challenge) => (
              <article key={challenge.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-sm font-medium text-zinc-100">{challenge.title}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {challenge.clan.name} · {challenge.points} pts
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">No active season yet.</p>
        )}
      </section>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
