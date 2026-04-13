import { z } from "zod";

export const createThreadSchema = z.object({
  title: z.string().trim().min(8).max(160),
  body: z.string().trim().min(20).max(5000),
});

export const createCommentSchema = z.object({
  body: z.string().trim().min(8).max(2000),
});

export const moderationReportSchema = z.object({
  targetType: z.enum(["thread", "comment"]),
  targetId: z.string().trim().min(1),
  reason: z.enum(["spam", "abuse", "misinformation", "off-topic", "other"]).default("other"),
  details: z.string().trim().max(2000).optional(),
});
