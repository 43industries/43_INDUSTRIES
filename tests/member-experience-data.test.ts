import { describe, expect, it } from "vitest";
import {
  onboardingSteps,
  weeklyChallenges,
  onboardingPointsById,
  challengeRewardsById,
  leaderboardSeed,
} from "@/lib/member-experience-data";

describe("onboardingSteps", () => {
  it("has at least one step", () => {
    expect(onboardingSteps.length).toBeGreaterThanOrEqual(1);
  });

  it("each step has required fields", () => {
    for (const step of onboardingSteps) {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.detail).toBeTruthy();
      expect(step.points).toBeGreaterThan(0);
    }
  });

  it("has unique step ids", () => {
    const ids = onboardingSteps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("weeklyChallenges", () => {
  it("has at least one challenge", () => {
    expect(weeklyChallenges.length).toBeGreaterThanOrEqual(1);
  });

  it("each challenge has positive reward", () => {
    for (const challenge of weeklyChallenges) {
      expect(challenge.reward).toBeGreaterThan(0);
    }
  });

  it("has unique challenge ids", () => {
    const ids = weeklyChallenges.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("derived maps", () => {
  it("onboardingPointsById maps every step id to its points", () => {
    for (const step of onboardingSteps) {
      expect(onboardingPointsById[step.id]).toBe(step.points);
    }
  });

  it("challengeRewardsById maps every challenge id to its reward", () => {
    for (const challenge of weeklyChallenges) {
      expect(challengeRewardsById[challenge.id]).toBe(challenge.reward);
    }
  });
});

describe("leaderboardSeed", () => {
  it("has entries with positive points", () => {
    expect(leaderboardSeed.length).toBeGreaterThanOrEqual(1);
    for (const entry of leaderboardSeed) {
      expect(entry.points).toBeGreaterThan(0);
    }
  });

  it("is sorted by points descending", () => {
    for (let i = 1; i < leaderboardSeed.length; i++) {
      expect(leaderboardSeed[i - 1].points).toBeGreaterThanOrEqual(leaderboardSeed[i].points);
    }
  });
});
