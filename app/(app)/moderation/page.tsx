import Link from "next/link";

const moderationQueueStub = [
  {
    id: "rpt_1001",
    target: "Thread",
    summary: "Possible spam-style promotional pitch",
    status: "Pending review",
    receivedAt: "Today",
  },
  {
    id: "rpt_1002",
    target: "Comment",
    summary: "Potentially disrespectful tone",
    status: "Pending review",
    receivedAt: "Today",
  },
];

export default function ModerationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Moderation</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Trust and safety queue (stub)</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Phase E moderation is intentionally lightweight for now. Reports are accepted via API
        and surfaced here as queue placeholders until full reviewer workflows ship.
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Queue preview</h2>
        <div className="mt-4 space-y-3">
          {moderationQueueStub.map((item) => (
            <article key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.target}</p>
              <p className="mt-1 text-sm font-medium text-zinc-100">{item.summary}</p>
              <p className="mt-2 text-xs text-zinc-400">
                {item.status} · {item.receivedAt} · {item.id}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">Policy hooks</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>Report categories: spam, abuse, misinformation, off-topic.</li>
          <li>Future queue states: pending, acknowledged, actioned, dismissed.</li>
          <li>Future actions: warn member, hide content, temporary posting cooldown.</li>
        </ul>
      </div>

      <Link
        href="/society"
        className="mt-8 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200"
      >
        ← Back to society
      </Link>
    </div>
  );
}
