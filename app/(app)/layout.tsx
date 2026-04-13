import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 bg-zinc-900/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <p className="text-sm text-zinc-400">Member area</p>
          <div className="flex items-center gap-4">
            <Link href="/onboarding" className="text-sm text-zinc-300 transition hover:text-white">
              Onboarding
            </Link>
            <Link href="/profile" className="text-sm text-zinc-300 transition hover:text-white">
              Profile
            </Link>
            <Link href="/moderation" className="text-sm text-zinc-300 transition hover:text-white">
              Moderation
            </Link>
            <Link href="/challenges" className="text-sm text-zinc-300 transition hover:text-white">
              Challenges
            </Link>
            <Link href="/clans" className="text-sm text-zinc-300 transition hover:text-white">
              Clans
            </Link>
            <Link href="/seasons" className="text-sm text-zinc-300 transition hover:text-white">
              Seasons
            </Link>
            <Link href="/leaderboard" className="text-sm text-zinc-300 transition hover:text-white">
              Leaderboard
            </Link>
            <Link href="/" className="text-sm text-zinc-300 transition hover:text-white">
              Marketing site
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
