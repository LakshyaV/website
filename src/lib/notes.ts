import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export type NoteMeta = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  /** ISO date string. Omit in frontmatter for unpublished work. */
  date?: string;
  draft?: boolean;
};

export type Note = NoteMeta & { content: string };

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

function readAll(): Note[] {
  if (!fs.existsSync(NOTES_DIR)) return [];

  return fs
    .readdirSync(NOTES_DIR)
    // Files prefixed with `_` are documentation, not notes.
    .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: String(data.title ?? "Untitled"),
        summary: String(data.summary ?? ""),
        category: String(data.category ?? "Notes"),
        date: typeof data.date === "string" ? data.date : undefined,
        draft: data.draft === true,
        content,
      };
    });
}

/** Published notes, newest first. Drafts are excluded from the site. */
export function getNotes(): Note[] {
  return readAll()
    .filter((note) => !note.draft)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getNote(slug: string): Note | undefined {
  return getNotes().find((note) => note.slug === slug);
}

export type DraftTopic = { category: string; title: string };

/** Titles of real `draft: true` files, so the UI reflects actual work. */
export function getDrafts(): DraftTopic[] {
  return readAll()
    .filter((note) => note.draft)
    .map(({ category, title }) => ({ category, title }));
}

// Note: there is deliberately no invented fallback list here. If no draft files
// exist, the notes page says so rather than advertising topics that aren't
// actually being written.
