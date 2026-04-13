import { NextResponse } from "next/server";
import { ClanVisibility } from "@prisma/client";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEvent } from "@/lib/events";

export async function GET() {
  const clans = await prisma.clan.findMany({
    where: { visibility: ClanVisibility.PUBLIC },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true, posts: true, subClans: true } },
    },
  });
  return NextResponse.json(clans);
}

export async function POST(request: Request) {
  const user = await requireCommunityUser();
  const rateLimit = checkRateLimit({
    key: `create-clan:${user.id}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!rateLimit.ok) {
    return NextResponse.json({ error: "Rate limited." }, { status: 429 });
  }

  const payload = (await request.json()) as {
    name?: string;
    slug?: string;
    description?: string;
    manifesto?: string;
    rules?: string;
    visibility?: "PUBLIC" | "PRIVATE";
  };
  const name = payload.name?.trim() ?? "";
  const slug = payload.slug?.trim().toLowerCase() ?? "";
  const description = payload.description?.trim() ?? "";
  if (name.length < 3 || slug.length < 3 || description.length < 12) {
    return NextResponse.json({ error: "Invalid clan payload." }, { status: 400 });
  }

  const clan = await prisma.clan.create({
    data: {
      name,
      slug,
      description,
      manifesto: payload.manifesto?.trim(),
      rules: payload.rules?.trim(),
      visibility: payload.visibility === "PRIVATE" ? ClanVisibility.PRIVATE : ClanVisibility.PUBLIC,
      createdById: user.id,
      memberships: {
        create: { userId: user.id, role: "FOUNDER", status: "ACTIVE" },
      },
      leadershipTerm: {
        create: {
          userId: user.id,
          role: "FOUNDER",
          startsAt: new Date(),
          source: "APPOINTMENT",
        },
      },
    },
  });

  trackEvent("clan_created", { clanId: clan.id, userId: user.id });
  return NextResponse.json(clan, { status: 201 });
}
