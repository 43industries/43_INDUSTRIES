"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

const memberNav = [
  { href: "/onboarding", label: "Onboarding" },
  { href: "/profile", label: "Profile" },
  { href: "/moderation", label: "Moderation" },
  { href: "/challenges", label: "Challenges" },
  { href: "/clans", label: "Clans" },
  { href: "/seasons", label: "Seasons" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/", label: "Marketing site" },
] as const;

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 bg-zinc-900/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <p className="text-sm text-zinc-400">Member area</p>

          {/* Desktop nav */}
          <div className="hidden items-center gap-4 lg:flex">
            {memberNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:text-white"
              aria-label={open ? "Close member menu" : "Open member menu"}
              aria-expanded={open}
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="border-t border-zinc-800 px-6 pb-4 pt-2 lg:hidden">
            <div className="flex flex-col gap-2">
              {memberNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
