export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <p className="text-lg font-semibold tracking-wide text-yellow-400">
            43 Industries
          </p>
          <nav className="hidden gap-8 text-sm text-zinc-300 md:flex">
            <a href="#services" className="transition hover:text-yellow-400">
              Services
            </a>
            <a href="#projects" className="transition hover:text-yellow-400">
              Projects
            </a>
            <a href="#about" className="transition hover:text-yellow-400">
              About
            </a>
            <a href="#contact" className="transition hover:text-yellow-400">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-full border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-yellow-400/60 hover:text-yellow-200"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm shadow-violet-500/20 transition hover:bg-yellow-300"
            >
              Join
            </a>
          </div>
        </div>
      </header>

      <main className="pb-8">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="space-y-6">
            <p className="text-sm font-medium tracking-[0.22em] text-yellow-300/90 uppercase">
              Industrial Design + Execution
            </p>
            <h1 className="text-4xl leading-tight font-bold text-white md:text-6xl">
              Built for Heavy Industry.
              <span className="block bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Designed for the Future.
              </span>
            </h1>
            <p className="max-w-xl leading-relaxed text-zinc-300 md:text-lg">
              43 Industries creates high-performance systems and visual identities for
              manufacturing, engineering, and infrastructure leaders.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/signup"
                className="rounded-full bg-yellow-400 px-6 py-3 font-medium text-zinc-950 shadow-md shadow-violet-500/20 transition hover:bg-yellow-300"
              >
                Create Account
              </a>
              <a
                href="/login"
                className="rounded-full border border-zinc-600 px-6 py-3 font-medium text-zinc-100 transition hover:border-yellow-400/60 hover:text-yellow-200"
              >
                Member Login
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/70 p-7 shadow-2xl ring-1 shadow-black/25 ring-zinc-700/30 md:p-8">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-yellow-500/20 bg-zinc-800/80 p-5">
                <p className="text-sm text-zinc-300">Systems Delivered</p>
                <p className="text-3xl font-semibold text-yellow-400">120+</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5">
                  <p className="text-sm text-zinc-300">Active Partners</p>
                  <p className="text-2xl font-semibold text-zinc-100">38</p>
                </div>
                <div className="rounded-2xl border border-zinc-700 bg-zinc-800/80 p-5">
                  <p className="text-sm text-zinc-300">Avg. Delivery</p>
                  <p className="text-2xl font-semibold">6 Weeks</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                Precision-first process from strategy to production rollout.
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Services</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Industrial Branding",
                text: "Identity systems, packaging, and marketing visuals built for technical audiences.",
              },
              {
                title: "Digital Product Design",
                text: "Dashboard, control panel, and operations software UI for mission-critical workflows.",
              },
              {
                title: "Web Presence",
                text: "Performance-focused websites that convert prospects into long-term contracts.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition hover:border-yellow-400/30"
              >
                <h3 className="text-xl font-semibold text-yellow-300">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-300">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Featured Projects
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Factory modernization portal for a global steel client.",
              "Predictive maintenance dashboard for industrial robotics.",
              "Brand and web relaunch for a logistics technology provider.",
            ].map((project, i) => (
              <div
                key={project}
                className={
                  i === 1
                    ? "min-h-44 rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 p-6"
                    : "min-h-44 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-900 p-6"
                }
              >
                <p className="leading-relaxed text-zinc-200">{project}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-20 md:grid-cols-2 md:items-start"
        >
          <div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Why 43 Industries
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-300">
              We combine strategic design thinking with practical industrial execution to
              deliver measurable business outcomes. Every engagement is built around
              reliability, scalability, and speed.
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-500/15 bg-zinc-900/70 p-6 ring-1 ring-zinc-700/30">
            <p className="text-zinc-200">
              &quot;43 Industries transformed how our operations team interacts with
              mission data. Productivity was up in under 90 days.&quot;
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              Director of Operations, Apex Forge
            </p>
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="rounded-3xl border border-yellow-400/35 bg-gradient-to-br from-yellow-400/10 via-zinc-900/80 to-zinc-900 p-8 text-center ring-1 ring-zinc-700/30 md:p-10">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Ready to Build with 43?
            </h2>
            <p className="mt-3 leading-relaxed text-zinc-200">
              Tell us your goals and we will map a design-to-delivery plan for your team.
            </p>
            <a
              href="mailto:hello@43industries.com"
              className="mt-6 inline-block rounded-full bg-yellow-400 px-6 py-3 font-semibold text-zinc-950 shadow-lg shadow-violet-600/15 transition hover:bg-yellow-300"
            >
              hello@43industries.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
