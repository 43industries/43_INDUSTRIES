import Link from "next/link";

type ClanCardProps = {
  clan: {
    id: string;
    name: string;
    slug: string;
    description: string;
    _count?: { memberships: number; posts: number; subClans: number };
  };
  publicHref?: string;
};

export function ClanCard({ clan, publicHref }: ClanCardProps) {
  const href = publicHref ?? `/clans/${clan.slug}`;
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">{clan.name}</h3>
      <p className="mt-2 text-sm text-zinc-300">{clan.description}</p>
      <div className="mt-4 flex gap-4 text-xs text-zinc-500">
        <span>{clan._count?.memberships ?? 0} members</span>
        <span>{clan._count?.subClans ?? 0} sub-clans</span>
        <span>{clan._count?.posts ?? 0} threads</span>
      </div>
      <Link href={href} className="mt-4 inline-flex text-sm font-medium text-yellow-300 hover:text-yellow-200">
        Enter clan &rarr;
      </Link>
    </article>
  );
}
