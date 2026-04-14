import Link from "next/link";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { ReputationLeaderboard } from "@/components/reputation-leaderboard";
import { WeeklyChallengeBoard } from "@/components/weekly-challenge-board";
import { getSocietyInsights } from "@/lib/society-insights";
import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getWeekStart(value: Date) {
  const date = new Date(value);
  const day = date.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  date.setUTCDate(date.getUTCDate() - diffToMonday);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export default async function DashboardPage() {
  const user = await requireSocietyUser();
  const weekStart = getWeekStart(new Date());

  const [onboarding, challenges, topProgress, insights] = await Promise.all([
    prisma.onboardingCompletion.findMany({
      where: { userId: user.id },
      select: { stepId: true },
    }),
    prisma.challengeCompletion.findMany({
      where: { userId: user.id, weekStart },
      select: { challengeId: true },
    }),
    prisma.profileProgress.findMany({
      orderBy: [{ points: "desc" }, { lastEventAt: "desc" }],
      take: 8,
      include: { user: true },
    }),
    getSocietyInsights(),
  ]);

  const leaderboardEntries = topProgress.map(
    (entry: { userId: string; points: number; level: number; user: { name: string | null } }) => ({
      id: entry.userId,
      name: entry.user.name ?? "Member",
      points: entry.points,
      level: entry.level,
    }),
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Dashboard</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Your hub</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Profiles will unify discussion history, library contributions, and progression
        badges in one place once the data model is connected.
      </p>
      <p className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-300">
        Signed-in identity detected:{" "}
        <span className="text-zinc-100">{user.clerkId}</span>
      </p>
      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Society snapshot</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <Link href="/society" className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700">
              <p className="text-zinc-400">Featured thread</p>
              <p className="mt-1 font-medium text-zinc-100">
                {insights?.featuredThread?.title ?? "No threads yet"}
              </p>
            </Link>
            <Link href="/library" className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700">
              <p className="text-zinc-400">Latest library entry</p>
              <p className="mt-1 font-medium text-zinc-100">
                {insights?.featuredLibraryEntry?.title ?? "No published entries"}
              </p>
            </Link>
            <Link href="/challenges" className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 hover:border-zinc-700">
              <p className="text-zinc-400">Active challenge</p>
              <p className="mt-1 font-medium text-zinc-100">
                {insights?.activeChallenge?.title ?? "No active challenge"}
              </p>
            </Link>
          </div>
        </section>
        <OnboardingChecklist
          initialCompleted={onboarding.map((row: { stepId: string }) => row.stepId)}
        />
        <WeeklyChallengeBoard
          initialClaimed={challenges.flatMap((row) => (row.challengeId ? [row.challengeId] : []))}
        />
        <ReputationLeaderboard entries={leaderboardEntries} />
      </div>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200"
      >
        ← Back to marketing home
      </Link>
    </div>
  );
}
