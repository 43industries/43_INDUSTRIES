import Link from "next/link";
import type { CommunityInsights } from "@/lib/community-insights";

type SignalTone = "violet" | "amber";

function toneClasses(tone: SignalTone) {
  return tone === "violet"
    ? "border-violet-500/25 bg-violet-950/30 text-violet-200"
    : "border-amber-400/25 bg-amber-950/20 text-amber-100";
}

function LiveSignalCard({
  label,
  title,
  body,
  footnote,
  tone,
  href,
}: {
  label: string;
  title: string;
  body: string;
  footnote: string;
  tone: SignalTone;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col gap-3 rounded-2xl border p-6 shadow-lg shadow-black/20 transition hover:border-zinc-500 ${toneClasses(tone)}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </p>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-300">{body}</p>
      <p className="text-xs text-zinc-500">{footnote}</p>
    </Link>
  );
}

export function LiveSignals({ insights }: { insights: CommunityInsights | null }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <LiveSignalCard
        label="Featured discussion"
        title={insights?.featuredThread?.title ?? "No thread yet"}
        body={
          insights?.featuredThread
            ? insights.featuredThread.excerpt
            : "Start a first thread and it will appear here."
        }
        footnote={
          insights?.featuredThread
            ? `${insights.featuredThread.commentCount} comments`
            : "Community feed is ready"
        }
        tone="violet"
        href="/community"
      />
      <LiveSignalCard
        label="Research hub"
        title={insights?.featuredLibraryEntry?.title ?? "No published library entry yet"}
        body={
          insights?.featuredLibraryEntry?.summary ??
          "Publish a library entry to surface cross-linked research here."
        }
        footnote={insights?.featuredLibraryEntry ? "Latest published resource" : "Library ready"}
        tone="amber"
        href="/library"
      />
      <LiveSignalCard
        label="This season"
        title={insights?.activeChallenge?.title ?? "No active challenge yet"}
        body={
          insights?.activeChallenge
            ? `Clan ${insights.activeChallenge.clanName} is running this mission for ${insights.activeChallenge.points} points.`
            : "Activate a season challenge to drive participation and visible momentum."
        }
        footnote={insights?.activeChallenge ? "Season mission in progress" : "Challenge system online"}
        tone="violet"
        href="/challenges"
      />
    </div>
  );
}
