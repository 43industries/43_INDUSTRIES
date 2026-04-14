import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { type ReportStatus } from "@prisma/client";

const ALLOWED_ROLES = new Set(["MODERATOR", "ADMIN"]);

export async function GET(request: Request) {
  const user = await loadSocietyUser();
  if (!user || !ALLOWED_ROLES.has(user.role)) {
    return societyUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status")?.toUpperCase() as
    | ReportStatus
    | undefined;

  const reports = await prisma.moderationReport.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      reporter: { select: { id: true, name: true, image: true } },
      targetPost: { select: { id: true, title: true, body: true } },
      targetComment: { select: { id: true, body: true } },
      reviewedBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(reports);
}
