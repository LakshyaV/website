import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { notesPage } from "@/content/copy";
import { getInProgress, getNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short technical writing on human-computer interaction, biosignal decoding, and machine learning systems.",
  alternates: { canonical: "/notes" },
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function NotesPage() {
  const notes = getNotes();
  const inProgress = getInProgress();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="border-t border-line pt-5">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-faint">
            {notesPage.title}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="max-w-[18ch] text-[2rem] leading-[1.08] tracking-[-0.03em] sm:text-[3rem]">
                Working notes
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-6 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
                {notesPage.intro}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20">
          {notes.length > 0 ? (
            <ul>
              {notes.map((note, i) => (
                <li key={note.slug}>
                  <Reveal delay={Math.min(i * 50, 200)}>
                    <Link
                      href={`/notes/${note.slug}`}
                      className="group grid grid-cols-1 gap-y-2 border-t border-line py-7 transition-colors duration-500 hover:border-line-strong sm:grid-cols-12 sm:gap-x-8"
                    >
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint sm:col-span-3">
                        {note.category}
                      </p>
                      <div className="sm:col-span-7">
                        <h2 className="text-lg leading-snug tracking-[-0.01em] transition-opacity duration-300 group-hover:opacity-70 sm:text-xl">
                          {note.title}
                        </h2>
                        {note.summary ? (
                          <p className="mt-2 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted">
                            {note.summary}
                          </p>
                        ) : null}
                      </div>
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint sm:col-span-2 sm:text-right">
                        {note.date ? formatDate(note.date) : ""}
                      </p>
                    </Link>
                  </Reveal>
                </li>
              ))}
              <li className="border-t border-line" />
            </ul>
          ) : (
            <>
              <Reveal>
                <div className="flex items-baseline justify-between border-t border-line pt-5">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                    In progress
                  </p>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                    Nothing published yet
                  </p>
                </div>
              </Reveal>

              <ul className="mt-8">
                {inProgress.map((topic, i) => (
                  <li key={topic.title}>
                    <Reveal delay={Math.min(i * 60, 240)}>
                      <div className="grid grid-cols-1 gap-y-2 border-t border-line py-6 sm:grid-cols-12 sm:gap-x-8">
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint sm:col-span-3">
                          {topic.category}
                        </p>
                        <h2 className="text-base leading-snug text-muted sm:col-span-7 sm:text-lg">
                          {topic.title}
                        </h2>
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint sm:col-span-2 sm:text-right">
                          Draft
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
                <li className="border-t border-line" />
              </ul>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
