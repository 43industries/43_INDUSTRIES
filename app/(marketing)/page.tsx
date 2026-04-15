import Link from "next/link";

const divisions = [
  {
    title: "Payments & Infrastructure",
    subtitle: "Main Branch 01",
    body: "Move value across borders with remittances, payout rails, and developer APIs. Kenya-first corridors, transparent FX, and infrastructure that scales with partner volume.",
    href: "/move",
    accent: "text-purple-300",
  },
  {
    title: "Asset Management",
    subtitle: "Main Branch 02",
    body: "Grow wealth through crypto portfolios, tokenized RWAs, and structured savings products. Built with suitability gates, reporting discipline, and clear fee logic.",
    href: "/invest",
    accent: "text-amber-200",
  },
] as const;

const pillars = [
  {
    title: "One ledger",
    text: "Earn, move, and invest from a single customer graph—no disconnected silos.",
  },
  {
    title: "Licensed rails first",
    text: "Settlement through regulated partners until your own licenses and treasury scale.",
  },
  {
    title: "Developer-grade",
    text: "The same primitives that power retail will power B2B integrations.",
  },
] as const;

export default function Home() {
  return (
    <main>
      <section
        className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28"
        style={{
          background: "radial-gradient(ellipse at top, rgba(168, 85, 247, 0.08) 0%, transparent 60%)",
        }}
      >
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.25em] text-purple-400">43 Industries</p>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            One ecosystem. Two main branches. One money story.
          </h1>
          <p className="max-w-xl text-lg text-zinc-300">
            43 Industries is built around two core branches: Payments & Infrastructure and Asset
            Management. Both run on a shared identity, compliance posture, and ledger so earning,
            moving, and investing money feels seamless instead of stitched together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/join"
              className="rounded-full bg-yellow-400 px-6 py-3 font-medium text-zinc-950 shadow-md shadow-purple-500/20 transition hover:bg-yellow-300"
            >
              Create account
            </Link>
            <Link
              href="/developers"
              className="rounded-full border border-zinc-600 px-6 py-3 font-medium text-zinc-100 transition hover:border-purple-400/60 hover:text-yellow-200"
            >
              Explore APIs
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/70 p-8 shadow-2xl shadow-purple-950/40 ring-1 ring-purple-500/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">Main branches</p>
          <p className="mt-2 text-sm text-zinc-400">
            These are the primary operating branches of the company.
          </p>
          <ul className="mt-6 space-y-5">
            {divisions.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="group block rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4 transition hover:border-purple-500/35">
                  <p className={`text-xs font-medium uppercase tracking-wide ${d.accent}`}>{d.subtitle}</p>
                  <p className="mt-1 font-semibold text-white group-hover:text-yellow-200">{d.title}</p>
                  <p className="mt-2 text-sm text-zinc-400">{d.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-zinc-800 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold text-white md:text-left">Shared operating core</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <h3 className="text-lg font-semibold text-yellow-300">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
          <h2 className="text-2xl font-semibold text-white">Branch rollout status</h2>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Payments & Infrastructure and Asset Management both route through the same money hub.
            Consumer wallet, portfolio, and API console surfaces are active while integrations continue to
            harden. Legacy society features are being retired—see{" "}
            <Link href="/support#legacy" className="text-yellow-300 hover:text-yellow-200">
              Support → Legacy
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/plans"
              className="rounded-full border border-purple-400/50 px-5 py-2 text-sm font-semibold text-purple-100 hover:border-purple-300"
            >
              Public plans
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-100 hover:border-zinc-500"
            >
              Support
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-yellow-400/35 bg-gradient-to-br from-yellow-400/10 via-zinc-900/80 to-purple-600/15 p-8 text-center ring-1 ring-purple-400/20">
          <h2 className="text-3xl font-semibold text-white">Enter the ecosystem</h2>
          <p className="mt-3 text-zinc-200">
            Access both main branches through one account, or read the technical specs in{" "}
            <code className="text-zinc-400">docs/fintech/</code>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/join"
              className="inline-flex rounded-full bg-yellow-400 px-6 py-3 font-semibold text-zinc-950 shadow-lg shadow-purple-600/25 transition hover:bg-yellow-300"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full border border-zinc-600 px-6 py-3 font-semibold text-zinc-100 transition hover:border-purple-400/60"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
