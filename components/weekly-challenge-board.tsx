"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { weeklyChallenges } from "@/lib/member-experience-data";

export function WeeklyChallengeBoard({ initialClaimed }: { initialClaimed: string[] }) {
  const router = useRouter();
  const [claimed, setClaimed] = useState<string[]>(initialClaimed);
  const [isSaving, setIsSaving] = useState(false);

  const totalEarned = weeklyChallenges
    .filter((challenge) => claimed.includes(challenge.id))
    .reduce((sum, challenge) => sum + challenge.reward, 0);

  const toggleChallenge = async (challengeId: string, nextValue: boolean) => {
    if (isSaving) return;
    setIsSaving(true);
    setClaimed((prev) =>
      nextValue ? [...new Set([...prev, challengeId])] : prev.filter((id) => id !== challengeId),
    );
    const response = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, completed: nextValue }),
    });
    if (!response.ok) {
      setClaimed((prev) =>
        nextValue ? prev.filter((id) => id !== challengeId) : [...new Set([...prev, challengeId])],
      );
    } else {
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Weekly challenge system</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Challenges that drive momentum</h2>
        <p className="text-sm text-zinc-300">Earned this week: {totalEarned} pts</p>
      </div>
      <div className="mt-6 space-y-3">
        {weeklyChallenges.map((challenge) => {
          const done = claimed.includes(challenge.id);
          return (
            <article key={challenge.id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="text-sm font-semibold text-zinc-100">{challenge.title}</p>
              <p className="mt-1 text-sm text-zinc-300">{challenge.prompt}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-violet-300">Reward: +{challenge.reward}</p>
                <button
                  type="button"
                  onClick={() => toggleChallenge(challenge.id, !done)}
                  className="rounded-full border border-zinc-600 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:border-zinc-400"
                >
                  {done ? "Marked complete" : "Mark complete"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
