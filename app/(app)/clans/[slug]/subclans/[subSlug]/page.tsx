import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string; subSlug: string }> };

export default async function SubClanDetailPage({ params }: PageProps) {
  const { slug, subSlug } = await params;
  const clan = await prisma.clan.findUnique({ where: { slug } });
  if (!clan) notFound();

  const subClan = await prisma.subClan.findFirst({
    where: { clanId: clan.id, slug: subSlug },
    include: { memberships: { include: { user: true } } },
  });
  if (!subClan) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Sub-clan</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{subClan.name}</h1>
      <p className="mt-3 text-zinc-300">{subClan.purpose}</p>

      <div className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-white">Operators</h2>
        {subClan.memberships.length === 0 ? (
          <p className="text-sm text-zinc-500">No members yet.</p>
        ) : (
          subClan.memberships.map((membership) => (
            <p key={membership.id} className="text-sm text-zinc-300">
              {membership.user.name ?? "Member"} · {membership.role}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
