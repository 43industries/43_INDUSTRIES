"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingSteps } from "@/lib/member-experience-data";

export function OnboardingChecklist({ initialCompleted }: { initialCompleted: string[] }) {
  const router = useRouter();
  const [completed, setCompleted] = useState<Record<string, boolean>>(
    Object.fromEntries(initialCompleted.map((id) => [id, true])),
  );
  const [isSaving, setIsSaving] = useState(false);

  const progress = useMemo(() => {
    const done = onboardingSteps.filter((step) => completed[step.id]).length;
    const total = onboardingSteps.length;
    return { done, total, pct: Math.round((done / total) * 100) };
  }, [completed]);

  const toggleStep = async (stepId: string, nextValue: boolean) => {
    if (isSaving) return;
    setIsSaving(true);
    setCompleted((prev) => ({ ...prev, [stepId]: nextValue }));
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId, completed: nextValue }),
    });
    if (!response.ok) {
      setCompleted((prev) => ({ ...prev, [stepId]: !nextValue }));
    } else {
      router.refresh();
    }
    setIsSaving(false);
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Onboarding flow</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Launch your member profile safely</h2>
        </div>
        <p className="text-sm text-zinc-300">
          {progress.done}/{progress.total} complete
        </p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-violet-400 transition-all"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
      <div className="mt-6 space-y-3">
        {onboardingSteps.map((step) => (
          <label
            key={step.id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3"
          >
            <input
              type="checkbox"
              checked={Boolean(completed[step.id])}
              onChange={(event) => toggleStep(step.id, event.target.checked)}
              className="mt-1"
            />
            <div>
              <p className="text-sm font-medium text-zinc-100">{step.title}</p>
              <p className="text-xs text-zinc-400">{step.detail}</p>
              <p className="mt-1 text-xs text-yellow-300">+{step.points} reputation</p>
            </div>
          </label>
        ))}
      </div>
      <p className="mt-5 text-xs text-zinc-500">
        Complete these in order for the best start: profile clarity, thoughtful first post, and
        constructive participation standards.
      </p>
    </section>
  );
}
