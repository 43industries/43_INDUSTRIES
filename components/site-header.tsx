"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

const nav = [
  { href: "/library", label: "Library" },
  { href: "/society", label: "Society" },
  { href: "/factions", label: "Factions" },
  { href: "/plans", label: "Plans" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  const { userId } = useAuth();

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-wide text-yellow-400">
          43 Industries
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-violet-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!userId ? (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-300 transition hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/join"
                className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm shadow-violet-500/25 transition hover:bg-yellow-300"
              >
                Join
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-300 transition hover:text-white"
              >
                Go to app
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
