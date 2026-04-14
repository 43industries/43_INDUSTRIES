import { describe, expect, it, vi, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows first request within window", () => {
    const result = checkRateLimit({ key: "test-a", limit: 3, windowMs: 60_000 });
    expect(result.ok).toBe(true);
  });

  it("allows requests up to the limit", () => {
    const config = { key: "test-b", limit: 3, windowMs: 60_000 };
    expect(checkRateLimit(config).ok).toBe(true);
    expect(checkRateLimit(config).ok).toBe(true);
    expect(checkRateLimit(config).ok).toBe(true);
  });

  it("blocks requests exceeding the limit", () => {
    const config = { key: "test-c", limit: 2, windowMs: 60_000 };
    checkRateLimit(config);
    checkRateLimit(config);
    const third = checkRateLimit(config);
    expect(third.ok).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after window expires", () => {
    const config = { key: "test-d", limit: 1, windowMs: 10_000 };
    checkRateLimit(config);
    expect(checkRateLimit(config).ok).toBe(false);

    vi.advanceTimersByTime(10_001);
    expect(checkRateLimit(config).ok).toBe(true);
  });

  it("isolates keys from each other", () => {
    const configA = { key: "iso-a", limit: 1, windowMs: 60_000 };
    const configB = { key: "iso-b", limit: 1, windowMs: 60_000 };

    checkRateLimit(configA);
    expect(checkRateLimit(configA).ok).toBe(false);
    expect(checkRateLimit(configB).ok).toBe(true);
  });

  it("returns retryAfterSeconds reflecting remaining window time", () => {
    const config = { key: "test-retry", limit: 1, windowMs: 30_000 };
    checkRateLimit(config);

    vi.advanceTimersByTime(10_000);
    const result = checkRateLimit(config);
    expect(result.ok).toBe(false);
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(20);
    expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(19);
  });
});
