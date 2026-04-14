import Link from "next/link";
import { getLibraryDocs } from "@/lib/library";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LibraryIndexPage() {
  const docs = await getLibraryDocs();
  let dbUnavailable = false;

  try {
    await Promise.all(
      docs.map((doc) =>
        prisma.libraryEntry.upsert({
          where: { slug: doc.slug },
          update: {
            title: doc.title,
            summary: doc.summary,
            publishedAt: new Date(),
            tags: {
              set: [],
              connectOrCreate: doc.tags.map((label) => ({
                where: { label },
                create: { label },
              })),
            },
          },
          create: {
            slug: doc.slug,
            title: doc.title,
            summary: doc.summary,
            publishedAt: new Date(),
            tags: {
              connectOrCreate: doc.tags.map((label) => ({
                where: { label },
                create: { label },
              })),
            },
          },
        }),
      ),
    );
  } catch {
    dbUnavailable = true;
  }
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Library</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Research hub (preview)</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        MDX entries under <code className="text-zinc-200">content/library</code> are now
        rendered with shared tags and direct discuss entry points.
      </p>
      {dbUnavailable ? (
        <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          Database is not connected yet, so tag syncing and discuss thread mapping are
          temporarily unavailable.
        </p>
      ) : null}
      <ul className="mt-10 space-y-4">
        {docs.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/library/${entry.slug}`}
              className="text-lg font-medium text-yellow-300 hover:text-yellow-200"
            >
              {entry.title}
            </Link>
            <p className="mt-1 text-sm text-zinc-500">{entry.summary}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-500">
              {entry.tags.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="mt-10 inline-flex text-sm font-medium text-zinc-300 hover:text-white"
      >
        ← Back to marketing home
      </Link>
    </div>
  );
}
