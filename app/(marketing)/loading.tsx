export default function MarketingLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-yellow-400" />
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    </div>
  );
}
