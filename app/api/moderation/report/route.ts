import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { moderationReportSchema } from "@/lib/validators";
import { trackEvent } from "@/lib/events";

export async function POST(request: Request) {
  const user = await loadSocietyUser();
  if (!user) return societyUnauthorized();

  const parsed = moderationReportSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report payload." }, { status: 400 });
  }
  const { targetType, targetId, reason, details } = parsed.data;

  const report = await prisma.moderationReport.create({
    data: {
      reporterId: user.id,
      targetType,
      targetPostId: targetType === "thread" ? targetId : null,
      targetCommentId: targetType === "comment" ? targetId : null,
      reason,
      details: details ?? null,
    },
  });

  await trackEvent("REPORT_CREATED", {
    actorId: user.id,
    reportId: report.id,
    targetType,
    targetId,
  });

  return NextResponse.json({ accepted: true, report }, { status: 202 });
}
