import Link from "next/link";
import { communityPlanHighlights } from "@/lib/plan-content";

export default function CommunityPlanPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-zinc-100">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Plan</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Community platform plan</h1>
      <p className="mt-4 text-zinc-300">
        This plan defines the layered community model: public discovery, member participation,
        progression systems, and research depth in one connected experience.
      </p>
      <ul className="mt-8 space-y-3 text-zinc-300">
        {communityPlanHighlights.map((item) => (
          <li key={item} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            {item}
          </li>
        ))}
      </ul>
      <Link href="/plans" className="mt-8 inline-flex text-sm text-yellow-300 hover:text-yellow-200">
        {"<-"} All plans
      </Link>
    </div>
  );
}
