import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export default async function PublicFactionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let clan: {
    name: string;
    description: string;
    manifesto: string | null;
    visibility: "PUBLIC" | "PRIVATE";
    memberships: { id: string }[];
    subClans: { id: string }[];
    leadershipTerm: { id: string }[];
  } | null = null;

  try {
    clan = await prisma.clan.findUnique({
      where: { slug },
      include: {
        memberships: { where: { status: "ACTIVE" } },
        subClans: true,
        leadershipTerm: { orderBy: { startsAt: "desc" }, include: { user: true }, take: 3 },
      },
    });
  } catch {
    notFound();
  }

  if (!clan || clan.visibility !== "PUBLIC") notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
    <div className="mx-auto max-w-4xl px-6 py-16 text-zinc-100">
      <h1 className="text-4xl font-semibold text-white">{clan.name}</h1>
      <p className="mt-4 text-zinc-300">{clan.description}</p>
      {clan.manifesto ? <p className="mt-4 text-sm text-zinc-400">Manifesto: {clan.manifesto}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-center">
          <p className="text-2xl font-semibold text-white">{clan.memberships.length}</p>
          <p className="text-xs text-zinc-400">Active members</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-center">
          <p className="text-2xl font-semibold text-white">{clan.subClans.length}</p>
          <p className="text-xs text-zinc-400">Sub-clans</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-center">
          <p className="text-2xl font-semibold text-white">{clan.leadershipTerm.length}</p>
          <p className="text-xs text-zinc-400">Recent leadership terms</p>
        </div>
      </div>
    </div>
    </div>
  );
}
