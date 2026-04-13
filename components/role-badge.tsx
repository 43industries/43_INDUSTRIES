type RoleBadgeProps = {
  role: string;
};

const roleStyles: Record<string, string> = {
  FOUNDER: "border-amber-400/60 text-amber-200",
  CHIEF: "border-violet-400/60 text-violet-200",
  ELDER: "border-sky-400/60 text-sky-200",
  MEMBER: "border-zinc-600 text-zinc-300",
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${roleStyles[role] ?? roleStyles.MEMBER}`}
    >
      {role}
    </span>
  );
}
