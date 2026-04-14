import { describe, expect, it } from "vitest";
import {
  createCommentSchema,
  createThreadSchema,
  moderationReportSchema,
} from "@/lib/validators";

describe("createThreadSchema", () => {
  it("accepts valid thread payload", () => {
    const result = createThreadSchema.safeParse({
      title: "Valid thread title",
      body: "This is a sufficiently long body for a valid thread payload.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects title shorter than 8 chars", () => {
    const result = createThreadSchema.safeParse({
      title: "Short",
      body: "This is a sufficiently long body for a valid thread payload.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects body shorter than 20 chars", () => {
    const result = createThreadSchema.safeParse({
      title: "Valid thread title",
      body: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 160 chars", () => {
    const result = createThreadSchema.safeParse({
      title: "A".repeat(161),
      body: "This is a sufficiently long body for a valid thread payload.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects body longer than 5000 chars", () => {
    const result = createThreadSchema.safeParse({
      title: "Valid thread title",
      body: "A".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from title and body", () => {
    const result = createThreadSchema.safeParse({
      title: "   Padded title here   ",
      body: "   This body has extra whitespace around it which should be trimmed.   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Padded title here");
      expect(result.data.body).not.toMatch(/^\s/);
    }
  });

  it("rejects missing fields", () => {
    expect(createThreadSchema.safeParse({}).success).toBe(false);
    expect(createThreadSchema.safeParse({ title: "Valid title" }).success).toBe(false);
  });
});

describe("createCommentSchema", () => {
  it("accepts valid comment", () => {
    const result = createCommentSchema.safeParse({ body: "A valid comment body" });
    expect(result.success).toBe(true);
  });

  it("rejects short comment payload", () => {
    const result = createCommentSchema.safeParse({ body: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects body longer than 2000 chars", () => {
    const result = createCommentSchema.safeParse({ body: "A".repeat(2001) });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 8-char comment after trimming", () => {
    const result = createCommentSchema.safeParse({ body: " 12345678 " });
    expect(result.success).toBe(true);
  });
});

describe("moderationReportSchema", () => {
  it("defaults reason to other", () => {
    const result = moderationReportSchema.parse({
      targetType: "thread",
      targetId: "abc123",
    });
    expect(result.reason).toBe("other");
  });

  it("accepts all valid reason types", () => {
    for (const reason of ["spam", "abuse", "misinformation", "off-topic", "other"]) {
      const result = moderationReportSchema.safeParse({
        targetType: "comment",
        targetId: "xyz",
        reason,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid targetType", () => {
    const result = moderationReportSchema.safeParse({
      targetType: "post",
      targetId: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty targetId", () => {
    const result = moderationReportSchema.safeParse({
      targetType: "thread",
      targetId: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional details", () => {
    const result = moderationReportSchema.safeParse({
      targetType: "thread",
      targetId: "abc",
      details: "Additional context about the report.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects details longer than 2000 chars", () => {
    const result = moderationReportSchema.safeParse({
      targetType: "thread",
      targetId: "abc",
      details: "A".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
