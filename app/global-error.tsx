"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-300">Critical error</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Something broke</h1>
        <p className="mt-4 max-w-md text-zinc-400">
          {error.message || "A critical error occurred. Please refresh the page."}
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-zinc-600">Digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="mt-8 rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-yellow-300"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
