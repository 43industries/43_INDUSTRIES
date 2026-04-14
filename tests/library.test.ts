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
    expect(parsed.body).toContain("Body paragraph two.");
  });

  it("throws for missing frontmatter", () => {
    expect(() => parseFrontmatter("No frontmatter")).toThrow();
  });

  it("throws for malformed frontmatter (no closing ---)", () => {
    expect(() =>
      parseFrontmatter(`---
title: Broken
summary: No closing fence
`),
    ).toThrow("malformed");
  });

  it("defaults title to Untitled when missing", () => {
    const raw = `---
summary: Only summary here
tags: test
---
Body content.`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.title).toBe("Untitled");
  });

  it("handles empty tags gracefully", () => {
    const raw = `---
title: No tags entry
summary: A summary
---
Body.`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.tags).toEqual([]);
  });

  it("lowercases and trims tags", () => {
    const raw = `---
title: Tag test
summary: Summary
tags:  Research ,  OPERATIONS , Mixed Case
---
Body.`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.tags).toEqual(["research", "operations", "mixed case"]);
  });

  it("handles values containing colons", () => {
    const raw = `---
title: Time is: 12:00
summary: A note: with colons
tags: test
---
Body.`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.title).toBe("Time is: 12:00");
    expect(parsed.summary).toBe("A note: with colons");
  });

  it("trims body whitespace", () => {
    const raw = `---
title: Whitespace test
summary: Summary
---

  Leading and trailing whitespace body.

`;
    const parsed = parseFrontmatter(raw);
    expect(parsed.body).not.toMatch(/^\s/);
    expect(parsed.body).not.toMatch(/\s$/);
  });
});
