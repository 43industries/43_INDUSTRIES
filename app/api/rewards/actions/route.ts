import { NextResponse } from "next/server";
import { getRewardActions } from "@/lib/rewards";

export async function GET() {
  try {
    return NextResponse.json(getRewardActions());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load reward actions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
