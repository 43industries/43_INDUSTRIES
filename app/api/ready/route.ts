import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBaseEnv, validateRewardsEnv } from "@/lib/env";

export async function GET() {
  const base = validateBaseEnv();
  const rewards = validateRewardsEnv();
  const checks = {
    env: {
      base,
      rewards,
    },
    database: {
      ok: true,
      error: null as string | null,
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    checks.database.ok = false;
    checks.database.error = error instanceof Error ? error.message : "Database check failed.";
  }

  const ok = checks.env.base.ok && checks.database.ok;
  return NextResponse.json(
    {
      status: ok ? "ready" : "not_ready",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: ok ? 200 : 503 },
  );
}
