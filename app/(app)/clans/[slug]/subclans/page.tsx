import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ClanSubClansPage({ params }: PageProps) {
  const { slug } = await params;
  const clan = await prisma.clan.findUnique({
    where: { slug },
    include: { subClans: { orderBy: { createdAt: "desc" } } },
  });
  if (!clan) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">{clan.name} sub-clans</h1>
      <div className="mt-8 space-y-3">
        {clan.subClans.map((subClan) => (
          <article key={subClan.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            <h2 className="text-lg font-medium text-white">{subClan.name}</h2>
            <p className="mt-2 text-sm text-zinc-300">{subClan.purpose}</p>
            <Link
              href={`/clans/${slug}/subclans/${subClan.slug}`}
              className="mt-3 inline-flex text-sm text-yellow-300 hover:text-yellow-200"
            >
              Open sub-clan &rarr;
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
