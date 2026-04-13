type ElectionTimerProps = {
  startsAt: Date;
  endsAt: Date;
};

export function ElectionTimer({ startsAt, endsAt }: ElectionTimerProps) {
  const label = `Window: ${startsAt.toLocaleString()} - ${endsAt.toLocaleString()}`;

  return <p className="text-xs text-zinc-400">{label}</p>;
}
