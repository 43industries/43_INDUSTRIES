import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const planCards = [
  {
    title: "Society Platform Plan",
    text: "Roadmap for a faction-style society with shared identity, threads, library, and progression.",
    href: "/plans/society",
  },
  {
    title: "Growth Projections",
    text: "Base, best, and aggressive targets with KPI formulas and review cadence.",
    href: "/plans/projections",
  },
] as const;

export default function PlansIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Public plans</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">How 43 Industries is being built</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Transparent roadmap pages so society members can see direction, milestones, and targets.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {planCards.map((card) => (
            <article key={card.href} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <h2 className="text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-sm text-zinc-300">{card.text}</p>
              <Link href={card.href} className="mt-4 inline-flex text-sm text-yellow-300 hover:text-yellow-200">
                Open plan {"->"}
              </Link>
            </article>
          ))}
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
