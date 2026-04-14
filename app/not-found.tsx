import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 max-w-md text-zinc-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300"
        >
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
