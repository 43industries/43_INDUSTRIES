"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

type ElectionTimerProps = {
  startsAt: Date | string;
  endsAt: Date | string;
};

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function computeTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatCountdown(t: TimeLeft) {
  if (t.days > 0) return `${t.days}d ${pad(t.hours)}h ${pad(t.minutes)}m`;
  return `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
}

type Status = "upcoming" | "open" | "closed";

function getStatus(start: Date, end: Date): Status {
  const now = Date.now();
  if (now < start.getTime()) return "upcoming";
  if (now < end.getTime()) return "open";
  return "closed";
}

const statusConfig: Record<Status, { label: string; tone: "sky" | "emerald" | "zinc" }> = {
  upcoming: { label: "Starting soon", tone: "sky" },
  open: { label: "Voting open", tone: "emerald" },
  closed: { label: "Voting closed", tone: "zinc" },
};

export function ElectionTimer({ startsAt, endsAt }: ElectionTimerProps) {
  const startMs = new Date(startsAt).getTime();
  const endMs = new Date(endsAt).getTime();

  const [status, setStatus] = useState<Status>(() => getStatus(new Date(startMs), new Date(endMs)));
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const start = new Date(startMs);
    const end = new Date(endMs);

    function tick() {
      const s = getStatus(start, end);
      setStatus(s);

      if (s === "upcoming") {
        const left = computeTimeLeft(start);
        setCountdown(left ? `Starts in ${formatCountdown(left)}` : "");
      } else if (s === "open") {
        const left = computeTimeLeft(end);
        setCountdown(left ? `Ends in ${formatCountdown(left)}` : "");
      } else {
        setCountdown(`Ended ${end.toLocaleDateString()}`);
      }
    }

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [startMs, endMs]);

  const cfg = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <Badge tone={cfg.tone}>{cfg.label}</Badge>
      <span className="text-xs tabular-nums text-zinc-400">{countdown}</span>
    </div>
  );
}
