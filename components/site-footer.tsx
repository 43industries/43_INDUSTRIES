import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-sm text-zinc-400">
          <p className="font-medium text-zinc-200">Safety and trust</p>
          <p className="max-w-xl">
            User-generated discussion is moderated with clear reporting paths. This
            placeholder will link to society guidelines when Phase B ships.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
