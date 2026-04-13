import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";
import { requireClanRole } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const user = await requireCommunityUser();
  const { id } = await context.params;
  try {
    await requireClanRole(user.id, id, "CHIEF");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = (await request.json()) as {
    startsAt?: string;
    endsAt?: string;
    termMonths?: number;
    candidateUserIds?: string[];
  };
  const startsAt = payload.startsAt ? new Date(payload.startsAt) : new Date();
  const endsAt = payload.endsAt
    ? new Date(payload.endsAt)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const election = await prisma.election.create({
    data: {
      clanId: id,
      createdById: user.id,
      startsAt,
      endsAt,
      status: "OPEN",
      termMonths: payload.termMonths ?? 3,
      candidates: {
        create: (payload.candidateUserIds ?? []).map((candidateId) => ({
          userId: candidateId,
        })),
      },
    },
    include: { candidates: true },
  });

  return NextResponse.json(election, { status: 201 });
}
