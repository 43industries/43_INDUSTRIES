import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await requireCommunityUser();
  const rateLimit = checkRateLimit({
    key: `vote:${user.id}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "Rate limited." }, { status: 429 });
  }

  const { id } = await context.params;
  const payload = (await request.json()) as { candidateId?: string };
  const candidateId = payload.candidateId ?? "";

  const election = await prisma.election.findUnique({
    where: { id },
    include: { clan: true },
  });
  if (!election || election.status !== "OPEN") {
    return NextResponse.json({ error: "Election unavailable." }, { status: 400 });
  }

  const membership = await prisma.clanMembership.findUnique({
    where: { userId_clanId: { userId: user.id, clanId: election.clanId } },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ error: "Only active members can vote." }, { status: 403 });
  }

  const vote = await prisma.electionVote.upsert({
    where: { electionId_voterId: { electionId: id, voterId: user.id } },
    create: { electionId: id, voterId: user.id, candidateId },
    update: { candidateId },
  });
  trackEvent("election_vote_cast", {
    electionId: id,
    voterId: user.id,
    candidateId,
  });

  return NextResponse.json(vote);
}
