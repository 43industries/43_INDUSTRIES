import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCommunityUser } from "@/lib/community-user";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClanDetailPage({ params }: PageProps) {
  const user = await requireCommunityUser();
  const { slug } = await params;
  const clan = await prisma.clan.findUnique({
    where: { slug },
    include: {
      memberships: { include: { user: true } },
      subClans: true,
      posts: { include: { author: true }, orderBy: { createdAt: "desc" }, take: 25 },
    },
  });

  if (!clan) notFound();

  const membership = clan.memberships.find((m) => m.userId === user.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Clan</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{clan.name}</h1>
      <p className="mt-3 max-w-3xl text-zinc-300">{clan.description}</p>
      <p className="mt-2 text-sm text-zinc-500">Your status: {membership?.status ?? "NOT_JOINED"}</p>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href={`/clans/${slug}/members`} className="text-yellow-300 hover:text-yellow-200">
          Members
        </Link>
        <Link href={`/clans/${slug}/subclans`} className="text-yellow-300 hover:text-yellow-200">
          Sub-clans
        </Link>
        <Link href={`/clans/${slug}/governance`} className="text-yellow-300 hover:text-yellow-200">
          Governance
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-white">Clan feed</h2>
        {clan.posts.length === 0 ? (
          <p className="text-sm text-zinc-500">No clan threads yet.</p>
        ) : (
          clan.posts.map((post) => (
            <article key={post.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <h3 className="font-medium text-white">{post.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{post.body}</p>
              <p className="mt-2 text-xs text-zinc-500">{post.author.name ?? "Member"}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
