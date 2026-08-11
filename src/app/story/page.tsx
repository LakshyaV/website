import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { DecodeOnView } from "@/components/story/DecodeOnView";
import { StoryRail } from "@/components/story/StoryRail";
import { storyGlyphs } from "@/components/story/glyphs";
import { storyActs, storyChapters, storyIntro, storyThreads } from "@/content/story";

export const metadata: Metadata = {
  title: "Story",
  description:
    "How it started, from competition robots to decoding intended language from the body's own signals.",
  alternates: { canonical: "/story" },
};

/** Split a title around its cursive accent fragment, if one is declared. */
function accentSplit(title: string, accent?: string): [string, string, string] {
  if (!accent) return [title, "", ""];
  const at = title.indexOf(accent);
  if (at === -1) return [title, "", ""];
  return [title.slice(0, at), accent, title.slice(at + accent.length)];
}

export default function StoryPage() {
  const nav = storyChapters.map((c) => ({ id: c.id, label: c.kicker }));
  const chapterThreads = Object.fromEntries(storyChapters.map((c) => [c.id, c.threads]));
  const [introPre, introAccent, introPost] = accentSplit(storyIntro.title, storyIntro.accent);

  return (
    <main id="content" className="pb-28 pt-16 sm:pt-24">
      <Container>
        <Reveal>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-faint">
            One signal, so far
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[2.5rem] leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem]">
            {introPre}
            {introAccent ? (
              <em className="font-cursive font-normal not-italic">{introAccent}</em>
            ) : null}
            {introPost}
          </h1>
          <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            {storyIntro.lead}
          </p>
        </Reveal>

        <StoryRail nav={nav} threads={storyThreads} chapterThreads={chapterThreads}>
          {storyActs.map((act, actIndex) => (
              <section key={act.label} className="pl-8 sm:pl-14">
                {/* The act headers chain into one sentence as the page is
                    travelled, the through-line stated in four lines. */}
                <Reveal>
                  <header className={actIndex === 0 ? "pt-4 pb-2" : "pt-24 pb-2"}>
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-faint">
                      {act.label}
                    </p>
                    <h2 className="mt-3 font-cursive text-[1.75rem] leading-snug tracking-[-0.01em] text-fg sm:text-[2.375rem]">
                      {act.line}
                    </h2>
                  </header>
                </Reveal>

                <ol>
                  {act.chapters.map((chapter) => {
                    // Global position across acts, derived rather than counted.
                    const number = storyChapters.findIndex((c) => c.id === chapter.id) + 1;
                    const Glyph = storyGlyphs[chapter.glyph];
                    const [pre, accent, post] = accentSplit(chapter.title, chapter.accent);
                    return (
                      <li
                        key={chapter.id}
                        id={chapter.id}
                        data-chapter
                        className="story-chapter relative scroll-mt-28 py-14 sm:py-16"
                      >
                        {/* Node on the spine, lit by this chapter's own --p
                            and centred on the kicker line. Offset spans the
                            section padding to reach the rail. */}
                        <span
                          aria-hidden
                          className="d-step absolute -left-8 top-[3.65rem] h-2.5 w-2.5 -translate-x-[4.5px] rounded-full bg-fg sm:-left-14"
                          style={{ "--s": 0 } as React.CSSProperties}
                        />

                        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
                          <div className="lg:col-span-7">
                            <p className="flex items-baseline gap-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-faint">
                              <span>{String(number).padStart(2, "0")}</span>
                              <DecodeOnView text={chapter.kicker} />
                            </p>
                            <h3 className="mt-4 text-[1.75rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.25rem]">
                              {pre}
                              {accent ? (
                                <em className="font-cursive font-normal not-italic">{accent}</em>
                              ) : null}
                              {post}
                            </h3>
                            {chapter.paragraphs.map((paragraph, i) => (
                              <p
                                key={i}
                                className={`max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted ${
                                  i === 0 ? "mt-6" : "mt-4"
                                }`}
                              >
                                {paragraph}
                              </p>
                            ))}
                            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
                              {chapter.threads.map((thread) => (
                                <span
                                  key={thread}
                                  className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint"
                                >
                                  {thread}
                                </span>
                              ))}
                            </p>
                          </div>
                          <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
                            <Glyph />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
          ))}

          {/* The rail runs past the last chapter into what comes next. */}
          <div className="relative pb-2 pl-8 sm:pl-14">
            <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted">
              The next chapter is being written.{" "}
              <Link
                href="/#contact"
                className="border-b border-line pb-0.5 text-fg transition-colors duration-300 hover:border-fg"
              >
                Be part of it
              </Link>
              .
            </p>
          </div>
        </StoryRail>
      </Container>
    </main>
  );
}
