import { requireSocietyUser } from "@/lib/society-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireSocietyUser();
  const progress = await prisma.profileProgress.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Profile</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Member identity</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        This profile unifies your account identity and progression state across society
        threads, library discussions, and weekly challenges.
      </p>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Account</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-6 border-b border-zinc-800 pb-2">
            <dt className="text-zinc-400">Display name</dt>
            <dd className="text-zinc-100">{user.name ?? "Member"}</dd>
          </div>
          <div className="flex justify-between gap-6 border-b border-zinc-800 pb-2">
            <dt className="text-zinc-400">Role</dt>
            <dd className="text-zinc-100">{user.role}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-zinc-400">Clerk ID</dt>
            <dd className="truncate text-zinc-100">{user.clerkId}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Progression</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
            <dt className="text-zinc-500">Points</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">{progress?.points ?? 0}</dd>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
            <dt className="text-zinc-500">Level</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">{progress?.level ?? 1}</dd>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
            <dt className="text-zinc-500">Reputation</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">
              {progress?.reputation ?? 0}
            </dd>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
            <dt className="text-zinc-500">Current title</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-100">
              {progress?.title ?? "Recruit"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
