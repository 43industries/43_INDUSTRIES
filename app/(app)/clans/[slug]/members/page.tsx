import { notFound } from "next/navigation";
import { RoleBadge } from "@/components/role-badge";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ClanMembersPage({ params }: PageProps) {
  const { slug } = await params;
  const clan = await prisma.clan.findUnique({
    where: { slug },
    include: {
      memberships: {
        where: { status: "ACTIVE" },
        include: { user: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });
  if (!clan) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">{clan.name} members</h1>
      <div className="mt-8 space-y-3">
        {clan.memberships.map((membership) => (
          <div key={membership.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-white">{membership.user.name ?? "Member"}</p>
            <div className="mt-2">
              <RoleBadge role={membership.role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
