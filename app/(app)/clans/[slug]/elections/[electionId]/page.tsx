import { notFound } from "next/navigation";
import { ElectionTimer } from "@/components/election-timer";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string; electionId: string }> };

export default async function ElectionDetailPage({ params }: PageProps) {
  const { slug, electionId } = await params;
  const clan = await prisma.clan.findUnique({ where: { slug } });
  if (!clan) notFound();

  const election = await prisma.election.findFirst({
    where: { id: electionId, clanId: clan.id },
    include: { candidates: { include: { user: true } }, votes: true },
  });
  if (!election) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">Election</h1>
      <p className="mt-2 text-zinc-300">Status: {election.status}</p>
      <ElectionTimer startsAt={election.startsAt} endsAt={election.endsAt} />

      <h2 className="mt-8 text-xl font-semibold text-white">Candidates</h2>
      <div className="mt-3 space-y-2">
        {election.candidates.map((candidate) => {
          const voteCount = election.votes.filter((vote) => vote.candidateId === candidate.userId).length;
          return (
            <div key={candidate.id} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-sm">
              <p className="text-zinc-200">
                {candidate.user.name ?? "Member"} · {voteCount} votes
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
