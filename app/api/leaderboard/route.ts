import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") ?? "member";

  if (scope === "clan") {
    const clans = await prisma.clan.findMany({
      include: {
        memberships: { where: { status: "ACTIVE" } },
      },
    });
    const data = clans
      .map((clan) => ({
        id: clan.id,
        name: clan.name,
        score: clan.memberships.length * 100,
      }))
      .sort((a, b) => b.score - a.score);
    return NextResponse.json(data);
  }

  if (scope === "subclan") {
    const subClans = await prisma.subClan.findMany({
      include: { memberships: true },
    });
    const data = subClans
      .map((subClan) => ({
        id: subClan.id,
        name: subClan.name,
        score: subClan.memberships.length * 80,
      }))
      .sort((a, b) => b.score - a.score);
    return NextResponse.json(data);
  }

  const members = await prisma.profileProgress.findMany({
    orderBy: [{ points: "desc" }, { seasonScore: "desc" }],
    take: 50,
    include: { user: true },
  });
  return NextResponse.json(
    members.map((member) => ({
      id: member.userId,
      name: member.user.name ?? "Member",
      points: member.points,
      seasonScore: member.seasonScore,
      title: member.title ?? "Recruit",
    })),
  );
}
