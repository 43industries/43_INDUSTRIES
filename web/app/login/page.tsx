export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Log in to continue</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Login flow placeholder. Auth wiring comes in Phase B.
        </p>

        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Email</span>
            <input
              type="email"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-zinc-100 outline-none ring-yellow-400/40 transition focus:ring-2"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Password</span>
            <input
              type="password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-zinc-100 outline-none ring-yellow-400/40 transition focus:ring-2"
              placeholder="Your password"
            />
          </label>
          <button
            type="button"
            className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-yellow-300"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-300">
          Need an account?{" "}
          <a href="/signup" className="font-medium text-yellow-300 hover:text-yellow-200">
            Create one
          </a>
        </p>
        <a href="/" className="mt-4 inline-block text-sm text-zinc-400 hover:text-zinc-300">
          Back to homepage
        </a>
      </div>
    </main>
  );
}
