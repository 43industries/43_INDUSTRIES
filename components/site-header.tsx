"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const nav = [
  { href: "/library", label: "Library" },
  { href: "/society", label: "Society" },
  { href: "/factions", label: "Factions" },
  { href: "/plans", label: "Plans" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-wide text-yellow-400">
          43 Industries
        </Link>

        {/* Desktop nav */}
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
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="text-sm text-zinc-300 transition hover:text-white">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm shadow-violet-500/25 transition hover:bg-yellow-300">
                Join
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="hidden text-sm text-zinc-300 transition hover:text-white md:inline"
            >
              Go to app
            </Link>
            <UserButton />
          </Show>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
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

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-zinc-800 px-6 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-zinc-300 transition hover:text-violet-200"
              >
                {item.label}
              </Link>
            ))}
            <Show when="signed-in">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-sm text-zinc-300 transition hover:text-white"
              >
                Go to app
              </Link>
            </Show>
          </div>
        </nav>
      )}
    </header>
  );
}
