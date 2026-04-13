import { validateRewardsEnv } from "@/lib/env";

type RewardPayload = {
  userId: string;
  walletAddress: string;
  action: string;
  purchaseValue?: number | null;
  note?: string;
};

function assertRewardsEnv() {
  const validation = validateRewardsEnv();
  if (!validation.ok) {
    throw new Error(`Rewards service misconfigured. Missing env: ${validation.missing.join(", ")}`);
  }
}

export async function issueReward(payload: RewardPayload) {
  assertRewardsEnv();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const engine = require("../services/rewards-api/rewards.engine.js");
  return engine.issueReward(payload);
}

export async function checkWalletTrustLine(address: string) {
  assertRewardsEnv();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const xrplService = require("../services/rewards-api/xrpl.service.js");
  return xrplService.checkTrustLine(address);
}

export function getRewardActions() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require("../services/rewards-api/rewards.config.js") as {
    actions: Record<
      string,
      { amount?: number | null; cashbackRate?: number; description?: string; maxPerDay?: number | null }
    >;
    tiers: Record<string, unknown>;
    maxDailyRewardPerUser: number;
  };
  return {
    actions: Object.entries(config.actions).map(([key, val]) => ({
      action: key,
      baseAmount: val.amount ?? null,
      cashbackRate: val.cashbackRate ?? null,
      description: val.description ?? "",
      maxPerDay: val.maxPerDay ?? null,
    })),
    tiers: config.tiers,
    maxDailyRewardPerUser: config.maxDailyRewardPerUser,
  };
}
