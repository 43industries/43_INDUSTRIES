import { NextResponse } from "next/server";
import { requireCommunityUser } from "@/lib/community-user";
import { issueReward } from "@/lib/rewards";

type IssueRewardRequest = {
  walletAddress?: string;
  action?: string;
  purchaseValue?: number;
  note?: string;
};

export async function POST(request: Request) {
  const user = await requireCommunityUser();
  const payload = (await request.json()) as IssueRewardRequest;

  if (!payload.walletAddress || !payload.action) {
    return NextResponse.json({ error: "walletAddress and action are required." }, { status: 400 });
  }

  try {
    const result = await issueReward({
      userId: user.id,
      walletAddress: payload.walletAddress,
      action: payload.action,
      purchaseValue: payload.purchaseValue ?? null,
      note: payload.note,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: result.limitReached ? 429 : 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reward issuance failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
