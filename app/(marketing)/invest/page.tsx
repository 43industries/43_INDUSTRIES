import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invest",
  description:
    "Crypto portfolios, tokenized real-world assets, and savings—built with a BlackRock-style focus on risk, fees, and transparency.",
};

export default function InvestProductPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-200/90">Main Branch 02 — Asset Management</p>
      <h1 className="mt-3 text-4xl font-bold text-white">Invest with discipline</h1>
      <p className="mt-4 text-lg text-zinc-300">
        This is one of 43 Industries' two primary branches. It focuses on wealth growth through crypto
        portfolios, tokenized RWAs, and savings products connected to the same identity, compliance, and
        ledger core used by Payments & Infrastructure.
      </p>
      <ul className="mt-8 list-inside list-disc space-y-2 text-zinc-400">
        <li>Suitability and risk labels before any subscription</li>
        <li>Reporting designed for serious wealth building, not gamification</li>
        <li>Optional XRPL-native rewards separate from regulated balances</li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/join"
          className="rounded-full bg-yellow-400 px-6 py-3 font-medium text-zinc-950 transition hover:bg-yellow-300"
        >
          Get access
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-zinc-600 px-6 py-3 font-medium text-zinc-100 transition hover:border-purple-400/60"
        >
          Sign in for portfolio
        </Link>
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        Not investment advice. Products subject to jurisdiction, partner availability, and onboarding
        completion.
      </p>
    </main>
  );
}
