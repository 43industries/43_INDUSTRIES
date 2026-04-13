import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/lib/library";

describe("parseFrontmatter", () => {
  it("parses title, summary, tags, and body", () => {
    const raw = `---
title: Test entry
summary: Summary text
tags: research, operations
---
Body paragraph one.

Body paragraph two.`;

    const parsed = parseFrontmatter(raw);

    expect(parsed.title).toBe("Test entry");
    expect(parsed.summary).toBe("Summary text");
    expect(parsed.tags).toEqual(["research", "operations"]);
    expect(parsed.body).toContain("Body paragraph one.");
  });

  it("throws for missing frontmatter", () => {
    expect(() => parseFrontmatter("No frontmatter")).toThrow();
  });
});
