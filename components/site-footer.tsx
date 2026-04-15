import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-purple-500/20 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-sm text-zinc-400">
          <p className="font-medium text-zinc-200">Trust</p>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            Main branches: Payments & Infrastructure + Asset Management
          </p>
          <p className="max-w-xl">
            43 is building regulated-grade money movement and investment products with partner-led settlement
            and clear disclosures. Nothing on this site is an offer of financial services until partners and
            licenses are in place. See{" "}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/support" className="text-purple-400 hover:text-purple-300">
              Support
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/support" className="hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
