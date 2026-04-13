"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ThreadComment = {
  id: string;
  body: string;
  createdAt: string | Date;
  author: {
    name: string | null;
  };
};

type Thread = {
  id: string;
  title: string;
  body: string;
  createdAt: string | Date;
  author: {
    name: string | null;
  };
  comments: ThreadComment[];
  reactions: { userId: string }[];
  _count: { reactions: number };
};

export function ThreadComposer({
  threads: initialThreads,
  initialNextCursor,
  disabled = false,
}: {
  threads: Thread[];
  initialNextCursor: string | null;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDraftingThread, setIsDraftingThread] = useState(false);
  const [draftingCommentFor, setDraftingCommentFor] = useState<string | null>(null);
  const [reportNotice, setReportNotice] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const canSubmit = useMemo(
    () => title.trim().length >= 8 && body.trim().length >= 20,
    [title, body],
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isPending || disabled) return;

    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          setError(
            `Rate limit reached for new threads. Try again in ${retryAfter ?? "a moment"}.`,
          );
          return;
        }

        setError("Unable to publish thread right now. Try again.");
        return;
      }

      const createdThread = (await response.json()) as Thread;
      setTitle("");
      setBody("");
      setThreads((prev) => [createdThread, ...prev]);
      router.refresh();
    });
  };

  const onSubmitComment = (threadId: string) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const draft = commentDrafts[threadId]?.trim() ?? "";
    if (draft.length < 8 || isPending || disabled) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const response = await fetch(`/api/threads/${threadId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          setError(
            `Rate limit reached for comments. Try again in ${retryAfter ?? "a moment"}.`,
          );
          return;
        }

        setError("Unable to publish comment right now. Try again.");
        return;
      }

      const createdComment = (await response.json()) as ThreadComment;
      setCommentDrafts((prev) => ({ ...prev, [threadId]: "" }));
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? { ...thread, comments: [...thread.comments, createdComment] }
            : thread,
        ),
      );
      router.refresh();
    });
  };

  const draftThreadWithClaude = async () => {
    if (disabled || isDraftingThread) return;
    const input = body.trim();
    if (input.length < 12) {
      setError("Add a little context first, then use Draft with Claude.");
      return;
    }

    setError(null);
    setIsDraftingThread(true);
    const response = await fetch("/api/ai/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "thread",
        input,
        context: title ? `Proposed title: ${title}` : undefined,
      }),
    });

    const payload = (await response.json()) as { draft?: string; error?: string };
    if (!response.ok || !payload.draft) {
      setError(payload.error ?? "Unable to draft with Claude right now.");
      setIsDraftingThread(false);
      return;
    }

    setBody(payload.draft);
    if (!title.trim()) {
      const firstLine = payload.draft.split("\n").find((line) => line.trim().length > 0);
      if (firstLine) {
        setTitle(firstLine.replace(/^#+\s*/, "").slice(0, 80));
      }
    }
    setIsDraftingThread(false);
  };

  const draftCommentWithClaude = async (thread: Thread) => {
    if (disabled || draftingCommentFor === thread.id) return;
    const currentDraft = (commentDrafts[thread.id] ?? "").trim();
    if (currentDraft.length < 12) {
      setError("Write at least a short note before using Claude for comment drafting.");
      return;
    }

    setError(null);
    setDraftingCommentFor(thread.id);
    const response = await fetch("/api/ai/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "comment",
        input: currentDraft,
        context: `Thread title: ${thread.title}\nThread body: ${thread.body}`,
      }),
    });
    const payload = (await response.json()) as { draft?: string; error?: string };

    if (!response.ok || !payload.draft) {
      setError(payload.error ?? "Unable to draft comment with Claude right now.");
      setDraftingCommentFor(null);
      return;
    }

    setCommentDrafts((prev) => ({ ...prev, [thread.id]: payload.draft ?? currentDraft }));
    setDraftingCommentFor(null);
  };

  const loadMoreThreads = async () => {
    if (!nextCursor || isLoadingMore || disabled) {
      return;
    }

    setError(null);
    setIsLoadingMore(true);

    try {
      const response = await fetch(`/api/threads?cursor=${nextCursor}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setError("Unable to load older threads right now. Try again.");
        return;
      }

      const payload = (await response.json()) as {
        threads: Thread[];
        nextCursor: string | null;
      };

      setThreads((prev) => [...prev, ...payload.threads]);
      setNextCursor(payload.nextCursor);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const submitReport = async (targetType: "thread" | "comment", targetId: string) => {
    if (disabled) return;
    setReportNotice(null);
    const response = await fetch("/api/moderation/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType,
        targetId,
        reason: "other",
        details: "Submitted from society quick-report action.",
      }),
    });

    if (!response.ok) {
      setError("Unable to submit report right now. Try again.");
      return;
    }

    setReportNotice(
      `${targetType === "thread" ? "Thread" : "Comment"} reported. Moderation queue stub updated.`,
    );
  };

  const toggleLike = async (threadId: string) => {
    if (disabled) return;
    const response = await fetch(`/api/threads/${threadId}/reactions`, { method: "POST" });
    if (!response.ok) {
      setError("Unable to update like right now. Try again.");
      return;
    }
    const payload = (await response.json()) as { liked: boolean; count: number };
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;
        return {
          ...thread,
          reactions: payload.liked ? [{ userId: "self" }] : [],
          _count: { reactions: payload.count },
        };
      }),
    );
  };

  const deleteThread = async (threadId: string) => {
    if (disabled) return;
    const response = await fetch(`/api/threads/${threadId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to delete this thread.");
      return;
    }
    setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
  };

  return (
    <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="text-xl font-semibold text-white">Start a thread</h2>
      <p className="mt-2 text-sm text-zinc-400">Create a persisted thread for the whole society.</p>
      {disabled ? (
        <p className="mt-2 text-sm text-rose-300">
          Thread publishing is disabled until the database connection is configured.
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Thread title (min 8 chars)"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-violet-400"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Share context, evidence, and your question (min 20 chars)"
          rows={5}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-violet-400"
        />
        <button
          type="submit"
          disabled={!canSubmit || isPending || disabled}
          className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-zinc-950 transition enabled:hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Publishing..." : "Publish thread"}
        </button>
        <button
          type="button"
          onClick={() => void draftThreadWithClaude()}
          disabled={disabled || isDraftingThread}
          className="ml-3 rounded-full border border-violet-500/50 px-5 py-2 text-sm font-semibold text-violet-200 transition enabled:hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDraftingThread ? "Claude drafting..." : "Draft with Claude"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      {reportNotice ? <p className="mt-2 text-sm text-emerald-300">{reportNotice}</p> : null}

      <div className="mt-8 space-y-3">
        {threads.length === 0 ? (
          <p className="text-sm text-zinc-500">No threads yet. Start the first society conversation.</p>
        ) : (
          threads.map((thread) => (
            <article key={thread.id} className="rounded-xl border border-zinc-700/80 bg-zinc-950 p-4">
              <h3 className="font-medium text-white">{thread.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{thread.body}</p>
              <p className="mt-3 text-xs text-zinc-500">
                By {thread.author.name ?? "Member"} on{" "}
                {new Date(thread.createdAt).toLocaleString()}
              </p>
              <button
                type="button"
                onClick={() => void submitReport("thread", thread.id)}
                className="mt-2 text-xs font-medium text-zinc-400 transition hover:text-rose-300"
              >
                Report thread
              </button>
              <div className="mt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => void toggleLike(thread.id)}
                  className="text-xs font-medium text-zinc-300 transition hover:text-emerald-300"
                >
                  {thread.reactions.length > 0 ? "Unlike" : "Like"} ({thread._count.reactions})
                </button>
                <button
                  type="button"
                  onClick={() => void deleteThread(thread.id)}
                  className="text-xs font-medium text-zinc-400 transition hover:text-rose-300"
                >
                  Delete my thread
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {thread.comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                    <p className="text-sm text-zinc-200">{comment.body}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {comment.author.name ?? "Member"} ·{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => void submitReport("comment", comment.id)}
                      className="mt-1 text-xs font-medium text-zinc-400 transition hover:text-rose-300"
                    >
                      Report comment
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={onSubmitComment(thread.id)} className="mt-4 space-y-2">
                <textarea
                  value={commentDrafts[thread.id] ?? ""}
                  onChange={(event) =>
                    setCommentDrafts((prev) => ({ ...prev, [thread.id]: event.target.value }))
                  }
                  placeholder="Add a comment (min 8 chars)"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-violet-400"
                />
                <button
                  type="submit"
                  disabled={
                    (commentDrafts[thread.id]?.trim().length ?? 0) < 8 || isPending || disabled
                  }
                  className="rounded-full border border-zinc-600 px-4 py-2 text-xs font-semibold text-zinc-200 transition enabled:hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => void draftCommentWithClaude(thread)}
                  disabled={disabled || draftingCommentFor === thread.id}
                  className="ml-2 rounded-full border border-violet-500/50 px-4 py-2 text-xs font-semibold text-violet-200 transition enabled:hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {draftingCommentFor === thread.id ? "Claude drafting..." : "Draft with Claude"}
                </button>
              </form>
            </article>
          ))
        )}
      </div>
      {nextCursor && !disabled ? (
        <button
          type="button"
          onClick={loadMoreThreads}
          disabled={isLoadingMore}
          className="mt-6 inline-flex rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition enabled:hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoadingMore ? "Loading..." : "Load older threads"}
        </button>
      ) : null}
    </section>
  );
}
