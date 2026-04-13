import Link from "next/link";
import { LiveSignals } from "@/components/live-signals";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCommunityInsights } from "@/lib/community-insights";

const pillars = [
  {
    title: "Discovery",
    text: "A public surface that explains what 43 Industries is and why the community exists.",
  },
  {
    title: "Participation",
    text: "Authenticated profiles, threads, and shared spaces with moderation hooks from day one.",
  },
  {
    title: "Engagement",
    text: "Light progression—seasonal challenges and badges tied to real participation, not a separate game client.",
  },
  {
    title: "Depth",
    text: "A research hub with tagged library entries, datasets or links, and discuss threads per article.",
  },
] as const;

const differentiators = [
  "One identity across discussions, library depth, and progression",
  "Server-validated reputation so effort and quality are rewarded fairly",
  "Shared tags connect discovery, conversation, and challenges in one loop",
  "Live homepage signals keep the brand surface fresh and community-driven",
] as const;

export default async function Home() {
  const insights = await getCommunityInsights();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-violet-950/15 to-zinc-950 text-zinc-100">
      <SiteHeader />

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300/90">
              Community platform
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              The most electric industrial community on the internet.
            </h1>
            <p className="max-w-xl text-lg text-zinc-300">
              43 Industries turns passive readers into active builders through one
              connected experience: premium storytelling, serious member discussion,
              challenge-based momentum, and a research hub that compounds insight.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/join"
                className="rounded-full bg-yellow-400 px-6 py-3 font-medium text-zinc-950 shadow-md shadow-violet-500/20 transition hover:bg-yellow-300"
              >
                Create account
              </Link>
              <Link
                href="/library"
                className="rounded-full border border-zinc-600 px-6 py-3 font-medium text-zinc-100 transition hover:border-violet-400/60 hover:text-yellow-200"
              >
                Browse the library
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/70 p-8 shadow-2xl shadow-violet-950/40 ring-1 ring-violet-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Phased delivery
            </p>
            <ul className="mt-6 space-y-4 text-sm text-zinc-300">
              <li>
                <span className="font-semibold text-white">Phase A</span> — Skeleton,
                marketing shell, and live teaser hooks (this page).
              </li>
              <li>
                <span className="font-semibold text-white">Phase B</span> — Auth,
                profiles, and first discussion flows.
              </li>
              <li>
                <span className="font-semibold text-white">Phase C–E</span> — Library
                MDX, game loop, polish, and moderation depth.
              </li>
            </ul>
            <p className="mt-6 text-xs text-zinc-500">
              Deploy target: Vercel + managed Postgres when the data layer is wired.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-white">Why this wins attention</h2>
          <p className="mt-3 max-w-3xl text-zinc-400">
            The best communities feel alive, useful, and earned. This product is built
            so every visit reveals activity, every contribution matters, and every member
            sees momentum in their profile.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {differentiators.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-200 transition hover:border-violet-500/30"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white">Live community signals</h2>
              <p className="mt-2 max-w-2xl text-zinc-400">
                Real activity from the community, library, and challenge system appears here.
              </p>
            </div>
          </div>
          <LiveSignals insights={insights} />
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
            <h2 className="text-3xl font-semibold text-white">World map and public plans</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">
              Explore clans, sub-clans, and the open roadmap before you join the member layer.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/factions"
                className="rounded-full border border-violet-400/50 px-5 py-2 text-sm font-semibold text-violet-100 hover:border-violet-300"
              >
                Explore factions
              </Link>
              <Link
                href="/plans"
                className="rounded-full border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-100 hover:border-zinc-500"
              >
                View public plans
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-white">Four layers, one community</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition hover:border-violet-500/30"
              >
                <h3 className="text-xl font-semibold text-yellow-300">{pillar.title}</h3>
                <p className="mt-3 text-zinc-300">{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-violet-400/20 bg-zinc-900/70 p-8 ring-1 ring-violet-500/20">
            <h2 className="text-3xl font-semibold text-white">Momentum loop</h2>
            <p className="mt-3 max-w-3xl text-zinc-300">
              The loop is simple and addictive: discover a signal, join the discussion,
              complete a challenge, and earn visible credibility that unlocks deeper
              participation.
            </p>
            <div className="mt-8 grid gap-4 text-sm md:grid-cols-4">
              {[
                "Discover: featured thread, article, challenge",
                "Contribute: post, reflect, or complete task",
                "Earn: points, badges, and trusted reputation",
                "Return: fresh signals and higher-impact opportunities",
              ].map((step) => (
                <div key={step} className="rounded-xl border border-zinc-800 p-4 text-zinc-300">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="rounded-3xl border border-yellow-400/35 bg-gradient-to-br from-yellow-400/10 via-zinc-900/80 to-violet-600/15 p-8 text-center ring-1 ring-violet-400/20">
            <h2 className="text-3xl font-semibold text-white">Help shape the hub</h2>
            <p className="mt-3 text-zinc-200">
              Join the waitlist for member tools, library contributions, and weekly
              industry challenges.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/join"
                className="inline-flex rounded-full bg-yellow-400 px-6 py-3 font-semibold text-zinc-950 shadow-lg shadow-violet-600/25 transition hover:bg-yellow-300"
              >
                Join the community
              </Link>
              <Link
                href="/community"
                className="inline-flex rounded-full border border-zinc-600 px-6 py-3 font-semibold text-zinc-100 transition hover:border-violet-400/60"
              >
                Preview discussions
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
