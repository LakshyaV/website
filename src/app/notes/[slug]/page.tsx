import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Container } from "@/components/layout/Container";
import { getNote, getNotes } from "@/lib/notes";

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: { title: note.title, description: note.summary, type: "article" },
  };
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <article className="py-20 sm:py-28">
      <Container>
        <Link
          href="/notes"
          className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint transition-colors duration-300 hover:text-fg"
        >
          ← Notes
        </Link>

        <header className="mt-10 border-t border-line pt-8">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
            <span>{note.category}</span>
            {note.date ? (
              <time dateTime={note.date}>
                {new Date(`${note.date}T00:00:00Z`).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-[24ch] text-[2rem] leading-[1.08] tracking-[-0.03em] sm:text-[2.75rem]">
            {note.title}
          </h1>
          {note.summary ? (
            <p className="mt-5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              {note.summary}
            </p>
          ) : null}
        </header>

        <div className="note-body mt-14 max-w-[68ch]">
          <MDXRemote source={note.content} />
        </div>
      </Container>
    </article>
  );
}
