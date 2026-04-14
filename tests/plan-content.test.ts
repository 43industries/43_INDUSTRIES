import { describe, expect, it } from "vitest";
import {
  societyPlanHighlights,
  growthProjectionHighlights,
} from "@/lib/plan-content";

describe("societyPlanHighlights", () => {
  it("exports a non-empty array of strings", () => {
    expect(societyPlanHighlights.length).toBeGreaterThanOrEqual(1);
    for (const item of societyPlanHighlights) {
      expect(typeof item).toBe("string");
      expect(item.length).toBeGreaterThan(0);
    }
  });
});

describe("growthProjectionHighlights", () => {
  it("exports a non-empty array of strings", () => {
    expect(growthProjectionHighlights.length).toBeGreaterThanOrEqual(1);
    for (const item of growthProjectionHighlights) {
      expect(typeof item).toBe("string");
      expect(item.length).toBeGreaterThan(0);
    }
  });
});
