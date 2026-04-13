"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function LibraryDiscussButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const createDiscussThread = () => {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/library/${slug}/discuss`, { method: "POST" });
      if (!response.ok) {
        setError("Unable to create a discuss thread right now.");
        return;
      }
      const payload = (await response.json()) as { threadId: string };
      router.push(`/society?thread=${payload.threadId}`);
      router.refresh();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={createDiscussThread}
        disabled={isPending}
        className="rounded-full border border-violet-500/40 px-4 py-2 text-sm font-medium text-violet-100 transition enabled:hover:border-violet-300 disabled:opacity-50"
      >
        {isPending ? "Opening..." : "Discuss this entry"}
      </button>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
