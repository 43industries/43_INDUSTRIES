import { describe, expect, it, vi, afterEach } from "vitest";
import { validateBaseEnv, validateRewardsEnv } from "@/lib/env";

describe("validateBaseEnv", () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.restoreAllMocks();
  });

  it("passes when all required vars are set", () => {
    process.env = {
      ...ORIGINAL_ENV,
      DATABASE_URL: "postgresql://localhost:5432/test",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_abc",
      CLERK_SECRET_KEY: "sk_test_xyz",
    };
    const result = validateBaseEnv();
    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("fails when DATABASE_URL is missing", () => {
    process.env = {
      ...ORIGINAL_ENV,
      DATABASE_URL: "",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_abc",
      CLERK_SECRET_KEY: "sk_test_xyz",
    };
    const result = validateBaseEnv();
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("DATABASE_URL");
  });

  it("fails when Clerk keys are missing", () => {
    process.env = {
      ...ORIGINAL_ENV,
      DATABASE_URL: "postgresql://localhost:5432/test",
    };
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;
    const result = validateBaseEnv();
    expect(result.ok).toBe(false);
    expect(result.missing.length).toBeGreaterThanOrEqual(1);
  });
});

describe("validateRewardsEnv", () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("passes when all reward vars are set", () => {
    process.env = {
      ...ORIGINAL_ENV,
      XRPL_NODE: "wss://test.ripple.com",
      DISTRIBUTOR_ADDRESS: "rABC",
      DISTRIBUTOR_SECRET: "sABC",
      ISSUER_ADDRESS: "rDEF",
      CURRENCY_CODE: "43",
    };
    const result = validateRewardsEnv();
    expect(result.ok).toBe(true);
  });

  it("fails when XRPL_NODE is missing", () => {
    process.env = {
      ...ORIGINAL_ENV,
      DISTRIBUTOR_ADDRESS: "rABC",
      DISTRIBUTOR_SECRET: "sABC",
      ISSUER_ADDRESS: "rDEF",
      CURRENCY_CODE: "43",
    };
    delete process.env.XRPL_NODE;
    const result = validateRewardsEnv();
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("XRPL_NODE");
  });
});
