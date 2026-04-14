type Tone = "amber" | "violet" | "sky" | "emerald" | "rose" | "zinc";

type BadgeProps = {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  amber: "border-amber-400/60 text-amber-200",
  violet: "border-violet-400/60 text-violet-200",
  sky: "border-sky-400/60 text-sky-200",
  emerald: "border-emerald-400/60 text-emerald-200",
  rose: "border-rose-400/60 text-rose-200",
  zinc: "border-zinc-600 text-zinc-300",
};

export function Badge({ children, tone = "zinc", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
