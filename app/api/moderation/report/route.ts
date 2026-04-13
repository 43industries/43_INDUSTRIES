import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { moderationReportSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = moderationReportSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report payload." }, { status: 400 });
  }
  const { targetType, targetId, reason, details } = parsed.data;

  return NextResponse.json(
    {
      accepted: true,
      report: {
        id: `stub_${Date.now()}`,
        reporterId: userId,
        targetType,
        targetId,
        reason,
        details,
        status: "pending",
      },
      message: "Report recorded in moderation stub queue.",
    },
    { status: 202 },
  );
}
