import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Move money",
  description:
    "Fast, low-cost cross-border payments and remittances. Kenya-first infrastructure with M-Pesa in mind.",
};

export default function MoveProductPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Main Branch 01 — Payments &amp; Infrastructure</p>
      <h1 className="mt-3 text-4xl font-bold text-white">Move money like mission-critical infrastructure</h1>
      <p className="mt-4 text-lg text-zinc-300">
        This is one of 43 Industries' two primary branches. It handles money movement across borders with
        transparent pricing, settlement discipline, and developer-first rails that connect directly into the
        same ecosystem powering Asset Management.
      </p>
      <ul className="mt-8 list-inside list-disc space-y-2 text-zinc-400">
        <li>Quotes and payment intents with clear fees and FX disclosure</li>
        <li>Partner-led settlement and compliance (licensed rails first)</li>
        <li>Developer APIs for businesses on the same ledger primitives</li>
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
          Sign in for wallet
        </Link>
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        Product under construction. Nothing on this page is an offer of regulated payment services until
        partners and licenses are in place.
      </p>
    </main>
  );
}
