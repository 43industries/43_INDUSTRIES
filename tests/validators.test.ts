import { describe, expect, it } from "vitest";
import {
  createCommentSchema,
  createThreadSchema,
  moderationReportSchema,
} from "@/lib/validators";

describe("validators", () => {
  it("accepts valid thread payload", () => {
    const result = createThreadSchema.safeParse({
      title: "Valid thread title",
      body: "This is a sufficiently long body for a valid thread payload.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short comment payload", () => {
    const result = createCommentSchema.safeParse({ body: "short" });
    expect(result.success).toBe(false);
  });

  it("defaults moderation reason", () => {
    const result = moderationReportSchema.parse({
      targetType: "thread",
      targetId: "abc123",
    });
    expect(result.reason).toBe("other");
  });
});
