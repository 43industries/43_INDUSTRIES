import { prisma } from "@/lib/prisma";
import { type AuditAction } from "@prisma/client";

type EventPayload = Record<string, unknown>;

const AUDIT_ACTIONS = new Set<string>([
  "REPORT_CREATED",
  "REPORT_REVIEWED",
  "CONTENT_REMOVED",
  "MEMBER_WARNED",
  "ELECTION_CREATED",
  "ELECTION_CLOSED",
  "VOTE_CAST",
  "CHIEF_APPOINTED",
  "CLAN_CREATED",
  "CLAN_JOINED",
  "CLAN_LEFT",
]);

export async function trackEvent(
  event: string,
  payload: EventPayload & { actorId?: string },
) {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[event] ${event}`, payload);
  }

  if (AUDIT_ACTIONS.has(event) && payload.actorId) {
    try {
      const { actorId, ...rest } = payload;
      await prisma.auditEvent.create({
        data: {
          action: event as AuditAction,
          actorId,
          metadata: JSON.stringify(rest),
        },
      });
    } catch (err) {
      console.error("[audit] Failed to persist AuditEvent", err);
    }
  }
}
