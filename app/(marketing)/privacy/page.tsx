import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-16 text-zinc-200">
      <h1 className="text-3xl font-semibold text-white">Privacy (placeholder)</h1>
      <p className="mt-4 text-zinc-400">
        This page reserves space for a production privacy policy. Replace with legal
        review before launch.
      </p>
      </div>
    </div>
  );
}
