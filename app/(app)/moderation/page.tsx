"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type Report = {
  id: string;
  reporterId: string;
  targetType: string;
  targetPostId: string | null;
  targetCommentId: string | null;
  reason: string;
  details: string | null;
  status: "PENDING" | "REVIEWED" | "ACTIONED" | "DISMISSED";
  reviewNote: string | null;
  createdAt: string;
  reporter: { id: string; name: string | null; image: string | null };
  targetPost: { id: string; title: string; body: string } | null;
  targetComment: { id: string; body: string } | null;
  reviewedBy: { id: string; name: string | null } | null;
};

type Filter = "ALL" | "PENDING" | "REVIEWED" | "ACTIONED" | "DISMISSED";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Actioned", value: "ACTIONED" },
  { label: "Dismissed", value: "DISMISSED" },
];

const STATUS_TONE: Record<string, "amber" | "emerald" | "sky" | "zinc" | "rose"> = {
  PENDING: "amber",
  REVIEWED: "sky",
  ACTIONED: "emerald",
  DISMISSED: "zinc",
};

function snippet(text: string, max = 120) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<Filter>("PENDING");
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await fetch(`/api/moderation/reports${qs}`);
      if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized — you must be a Moderator or Admin." : "Failed to load reports.");
      setReports(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function handleAction(id: string, status: "REVIEWED" | "ACTIONED" | "DISMISSED") {
    setActioningId(id);
    try {
      const res = await fetch(`/api/moderation/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Action failed.");
      await fetchReports();
    } catch {
      setError("Failed to update report.");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Moderation</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Trust &amp; safety queue</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        Review community reports and take action. Reports are surfaced from the moderation
        API and can be dismissed, reviewed, or actioned.
      </p>

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              filter === f.value
                ? "bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <Card className="mt-6 border-rose-500/40 bg-rose-950/30">
          <p className="text-sm text-rose-300">{error}</p>
        </Card>
      )}

      {/* Report list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <Card>
            <p className="text-center text-sm text-zinc-500">Loading reports…</p>
          </Card>
        ) : reports.length === 0 ? (
          <EmptyState
            title="No reports found"
            description={filter === "ALL" ? "The moderation queue is empty." : `No reports with status "${filter.toLowerCase()}".`}
          />
        ) : (
          reports.map((report) => {
            const contentSnippet =
              report.targetPost
                ? snippet(report.targetPost.body)
                : report.targetComment
                  ? snippet(report.targetComment.body)
                  : "Content unavailable";

            const contentTitle =
              report.targetPost?.title ?? (report.targetComment ? "Comment" : "Unknown");

            return (
              <Card key={report.id} padded={false} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={STATUS_TONE[report.status] ?? "zinc"}>
                      {report.status}
                    </Badge>
                    <Badge tone="rose">{report.reason}</Badge>
                    <span className="ml-auto text-xs text-zinc-500">
                      {relativeTime(report.createdAt)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-zinc-100">{contentTitle}</p>
                  <p className="mt-1 text-sm text-zinc-400">{contentSnippet}</p>

                  <p className="mt-3 text-xs text-zinc-500">
                    Reported by {report.reporter.name ?? "Unknown"}
                    {report.reviewedBy ? ` · Reviewed by ${report.reviewedBy.name}` : ""}
                  </p>
                  {report.reviewNote && (
                    <p className="mt-1 text-xs italic text-zinc-500">
                      Note: {report.reviewNote}
                    </p>
                  )}
                </div>

                {report.status === "PENDING" && (
                  <div className="flex gap-2 border-t border-zinc-800 bg-zinc-950/50 px-5 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={actioningId === report.id}
                      onClick={() => handleAction(report.id, "DISMISSED")}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={actioningId === report.id}
                      onClick={() => handleAction(report.id, "REVIEWED")}
                    >
                      Warn
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={actioningId === report.id}
                      onClick={() => handleAction(report.id, "ACTIONED")}
                    >
                      Remove content
                    </Button>
                  </div>
                )}
              </Card>
            );
          })
        )}
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
