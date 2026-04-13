import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { requireClanRole } from "@/lib/permissions";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_: Request, context: RouteContext) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();
  const { id } = await context.params;
  const election = await prisma.election.findUnique({
    where: { id },
    include: { votes: true },
  });
  if (!election) {
    return NextResponse.json({ error: "Election not found." }, { status: 404 });
  }

  try {
    await requireClanRole(user.id, election.clanId, "CHIEF");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tallies = election.votes.reduce<Record<string, number>>((acc, vote) => {
    acc[vote.candidateId] = (acc[vote.candidateId] ?? 0) + 1;
    return acc;
  }, {});
  const winnerId = Object.entries(tallies).sort((a, b) => b[1] - a[1])[0]?.[0];

  const closed = await prisma.election.update({
    where: { id },
    data: { status: "CLOSED" },
  });

  if (winnerId) {
    await prisma.clanMembership.upsert({
      where: { userId_clanId: { userId: winnerId, clanId: election.clanId } },
      create: { userId: winnerId, clanId: election.clanId, role: "CHIEF", status: "ACTIVE" },
      update: { role: "CHIEF", status: "ACTIVE" },
    });
    await prisma.leadershipTerm.create({
      data: {
        clanId: election.clanId,
        userId: winnerId,
        role: "CHIEF",
        startsAt: new Date(),
        endsAt: new Date(Date.now() + election.termMonths * 30 * 24 * 60 * 60 * 1000),
        source: "ELECTION",
      },
    });
  }

  trackEvent("election_closed", {
    electionId: id,
    winnerId: winnerId ?? null,
    closedBy: user.id,
  });

  return NextResponse.json({ election: closed, winnerId: winnerId ?? null });
}
