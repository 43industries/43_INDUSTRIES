import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SeasonsPage() {
  const seasons = await prisma.season.findMany({
    orderBy: { startsAt: "desc" },
    include: { challenges: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Seasons</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Campaign timeline</h1>
      <div className="mt-8 space-y-4">
        {seasons.map((season) => (
          <article key={season.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            <h2 className="text-lg font-medium text-white">{season.name}</h2>
            <p className="text-sm text-zinc-400">
              {season.status} · {season.challenges.length} clan challenges
            </p>
          </article>
        ))}
      </div>
      <Link href="/dashboard" className="mt-8 inline-flex text-sm text-yellow-300 hover:text-yellow-200">
        &larr; Back to dashboard
      </Link>
    </div>
  );
}
