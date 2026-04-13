import Link from "next/link";
import { notFound } from "next/navigation";
import { LibraryDiscussButton } from "@/components/library-discuss-button";
import { getLibraryDocBySlug } from "@/lib/library";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LibraryEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getLibraryDocBySlug(slug);
  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Library entry</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">{doc.title}</h1>
      <p className="mt-4 text-zinc-400">{doc.summary}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-zinc-500">
        {doc.tags.join(" · ")}
      </p>
      <article className="prose prose-invert mt-8 max-w-none text-zinc-200">
        {doc.body.split("\n\n").map((block) => (
          <p key={block}>{block}</p>
        ))}
      </article>
      <div className="mt-8 flex flex-wrap gap-4">
        <LibraryDiscussButton slug={slug} />
        <Link href="/library" className="text-sm text-yellow-300 hover:text-yellow-200">
          ← All library entries
        </Link>
      </div>
    </div>
  );
}
