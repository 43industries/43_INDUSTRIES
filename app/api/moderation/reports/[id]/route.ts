import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { loadSocietyUser, societyUnauthorized } from "@/lib/society-user";
import { trackEvent } from "@/lib/events";

const ALLOWED_ROLES = new Set(["MODERATOR", "ADMIN"]);

const patchSchema = z.object({
  status: z.enum(["REVIEWED", "ACTIONED", "DISMISSED"]),
  reviewNote: z.string().trim().max(2000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const user = await loadSocietyUser();
  if (!user || !ALLOWED_ROLES.has(user.role)) {
    return societyUnauthorized();
  }

  const { id } = await context.params;

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.moderationReport.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const updated = await prisma.moderationReport.update({
    where: { id },
    data: {
      status: parsed.data.status,
      reviewNote: parsed.data.reviewNote ?? null,
      reviewedById: user.id,
    },
    include: {
      reporter: { select: { id: true, name: true } },
      reviewedBy: { select: { id: true, name: true } },
    },
  });

  await trackEvent("REPORT_REVIEWED", {
    actorId: user.id,
    reportId: id,
    newStatus: parsed.data.status,
  });

  return NextResponse.json(updated);
}
