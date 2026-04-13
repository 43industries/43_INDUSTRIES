import { NextResponse } from "next/server";
import { checkWalletTrustLine } from "@/lib/rewards";

type RouteContext = { params: Promise<{ address: string }> };

export async function GET(_: Request, context: RouteContext) {
  const { address } = await context.params;
  if (!address) {
    return NextResponse.json({ error: "Wallet address is required." }, { status: 400 });
  }

  try {
    const hasTrustLine = await checkWalletTrustLine(address);
    return NextResponse.json({ address, hasTrustLine });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to check wallet trust line.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
