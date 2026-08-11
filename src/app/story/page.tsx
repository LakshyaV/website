import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { DecodeOnView } from "@/components/story/DecodeOnView";
import { StorySpine } from "@/components/story/StorySpine";
import { storyIntro, storySections } from "@/content/story";

export const metadata: Metadata = {
  title: "Story",
  description:
    "A life in small entries, from block code at six to decoding intended language from the body's own signals.",
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
  const [introPre, introAccent, introPost] = accentSplit(storyIntro.title, storyIntro.accent);

  return (
    <main id="content" className="pb-28 pt-16 sm:pt-24">
      <Container>
        <div className="max-w-[44rem]">
          <Reveal>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-faint">
              One signal, so far
            </p>
            <h1 className="mt-4 text-[2.5rem] leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem]">
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

          <StorySpine>
            <div className="pl-7 sm:pl-12">
              {storySections.map((section) => (
                <section key={section.line}>
                  {/* The three section lines chain into one sentence as the
                      page is travelled. They carry the argument; the entries
                      carry the record. */}
                  <Reveal>
                    <h2 className="pt-16 pb-8 font-cursive text-[1.625rem] leading-snug tracking-[-0.01em] text-fg first:pt-2 sm:text-[2.125rem]">
                      {section.line}
                    </h2>
                  </Reveal>

                  <ol>
                    {section.entries.map((entry, i) => (
                      <li
                        key={`${entry.stamp}-${i}`}
                        data-entry
                        className="story-chapter relative py-4 sm:py-5"
                      >
                        {/* Node on the spine, lit as this entry arrives. */}
                        <span
                          aria-hidden
                          className="d-step absolute -left-7 top-[1.55rem] h-1.5 w-1.5 -translate-x-[2.5px] rounded-full bg-fg sm:-left-12 sm:top-[1.85rem]"
                          style={{ "--s": 0 } as React.CSSProperties}
                        />
                        <div
                          className="d-step grid gap-y-1 sm:grid-cols-[7.5rem_1fr] sm:gap-x-6"
                          style={{ "--s": 0 } as React.CSSProperties}
                        >
                          <DecodeOnView
                            text={entry.stamp}
                            className="pt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint"
                          />
                          <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-muted">
                            {entry.text}
                            {entry.link ? (
                              <>
                                {" "}
                                <Link
                                  href={entry.link.href}
                                  className="border-b border-line pb-0.5 text-fg transition-colors duration-300 hover:border-fg"
                                >
                                  {entry.link.label}
                                </Link>
                                .
                              </>
                            ) : null}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </StorySpine>
        </div>
      </Container>
    </main>
  );
}
