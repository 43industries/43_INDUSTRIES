import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "library");

export type LibraryDoc = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  body: string;
};

export function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---\n")) {
    throw new Error("Library docs must include frontmatter.");
  }

  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("Library doc frontmatter is malformed.");
  }

  const frontmatterRaw = raw.slice(4, end);
  const body = raw.slice(end + 5).trim();
  const data: Record<string, string> = {};

  for (const line of frontmatterRaw.split("\n")) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    data[key.trim()] = rest.join(":").trim();
  }

  const tags = (data.tags ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return {
    title: data.title ?? "Untitled",
    summary: data.summary ?? "",
    tags,
    body,
  };
}

async function readDoc(fileName: string): Promise<LibraryDoc> {
  const slug = fileName.replace(/\.mdx?$/, "");
  const fullPath = path.join(CONTENT_DIR, fileName);
  const raw = await fs.readFile(fullPath, "utf8");
  const parsed = parseFrontmatter(raw);
  return { slug, ...parsed };
}

export async function getLibraryDocs() {
  const files = await fs.readdir(CONTENT_DIR);
  const docFiles = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  const docs = await Promise.all(docFiles.map(readDoc));
  return docs.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getLibraryDocBySlug(slug: string) {
  const files = await fs.readdir(CONTENT_DIR);
  const file = files.find((entry) => entry === `${slug}.md` || entry === `${slug}.mdx`);
  if (!file) return null;
  return readDoc(file);
}
