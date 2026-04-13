import Link from "next/link";
import { notFound } from "next/navigation";
import { ElectionTimer } from "@/components/election-timer";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ClanGovernancePage({ params }: PageProps) {
  const { slug } = await params;
  const clan = await prisma.clan.findUnique({
    where: { slug },
    include: {
      elections: { orderBy: { createdAt: "desc" }, take: 10 },
      leadershipTerm: { include: { user: true }, orderBy: { startsAt: "desc" }, take: 10 },
    },
  });
  if (!clan) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">{clan.name} governance</h1>
      <p className="mt-3 text-zinc-400">
        Hybrid model: founders appoint initial chiefs, then elections manage succession.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">Leadership terms</h2>
        <div className="mt-3 space-y-2">
          {clan.leadershipTerm.map((term) => (
            <div key={term.id} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-sm">
              <p className="text-zinc-200">
                {term.user.name ?? "Member"} · {term.role} · {term.source}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">Elections</h2>
        <div className="mt-3 space-y-2">
          {clan.elections.map((election) => (
            <div key={election.id} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-sm text-zinc-200">Status: {election.status}</p>
              <ElectionTimer startsAt={election.startsAt} endsAt={election.endsAt} />
              <Link
                href={`/clans/${slug}/elections/${election.id}`}
                className="mt-2 inline-flex text-sm text-yellow-300 hover:text-yellow-200"
              >
                View election &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
