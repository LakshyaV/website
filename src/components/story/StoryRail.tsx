"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * The engine behind the story page. Chapters render on the server and pass
 * through as children; this wrapper only measures and publishes.
 *
 * Three jobs, none of which re-render the chapter content.
 *
 * 1. Publish `--p` on every `[data-chapter]` as it approaches, the same
 *    contract the diagrams use, so each chapter's glyph and stages draw
 *    themselves in with pure CSS. Also publish `--rail` on the wrapper, the
 *    fraction of the story travelled, which fills the spine and positions the
 *    packet riding its leading edge.
 * 2. Track which chapter is current for the side index (the only React state
 *    that changes on scroll, and only at chapter boundaries).
 * 3. Thread filtering. Selecting a thread dims chapters it does not pass
 *    through, directly via a data attribute, mirroring the thread rail.
 */

export interface StoryNavItem {
  id: string;
  label: string;
}

export function StoryRail({
  nav,
  threads,
  chapterThreads,
  children,
}: {
  nav: StoryNavItem[];
  threads: readonly string[];
  chapterThreads: Record<string, readonly string[]>;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);

  /* ---------------------- scroll → --p / --rail / current ------------------- */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const chapters = [...wrap.querySelectorAll<HTMLElement>("[data-chapter]")];
    if (chapters.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      // Same entry tuning as the diagrams: begin once the chapter has risen
      // to 80% of the viewport, resolve over the next half screen.
      if (!reduced) {
        for (const el of chapters) {
          const { top } = el.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.5)));
          el.style.setProperty("--p", String(p));
        }
        const rect = wrap.getBoundingClientRect();
        const rail = Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / rect.height));
        wrap.style.setProperty("--rail", String(rail));
      }

      // Current chapter = the last one whose top has crossed 45% of the
      // viewport. Cheap, stable, and correct at both ends of the page.
      let id: string | null = null;
      for (const el of chapters) {
        if (el.getBoundingClientRect().top < vh * 0.45) id = el.id;
      }
      setCurrent(id);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* ------------------------------ thread filter ----------------------------- */
  const applyThread = useCallback(
    (thread: string | null) => {
      setActiveThread(thread);
      const wrap = wrapRef.current;
      if (!wrap) return;
      for (const el of wrap.querySelectorAll<HTMLElement>("[data-chapter]")) {
        const carries = thread === null || (chapterThreads[el.id] ?? []).includes(thread);
        el.setAttribute("data-dim", carries ? "false" : "true");
      }
    },
    [chapterThreads],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") applyThread(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyThread]);

  const matching = activeThread
    ? Object.values(chapterThreads).filter((t) => t.includes(activeThread)).length
    : nav.length;

  return (
    <div>
      {/* Threads that run through more than one era. JS-only, so it hides
          itself entirely without JavaScript, like the thread rail. */}
      <div className="story-threads mt-10 flex-wrap items-center gap-x-2 gap-y-2">
        <span className="mr-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
          Pull a thread
        </span>
        {threads.map((thread) => {
          const on = activeThread === thread;
          return (
            <button
              key={thread}
              type="button"
              aria-pressed={on}
              onClick={() => applyThread(on ? null : thread)}
              className={`border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                on
                  ? "border-fg text-fg"
                  : "border-line text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              {thread}
            </button>
          );
        })}
        <span role="status" className="ml-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
          {activeThread ? `${matching} of ${nav.length} chapters` : " "}
        </span>
      </div>

      <div className="mt-16 lg:grid lg:grid-cols-12 lg:gap-x-10">
        {/* Chapter index, sticky beside the rail on wide screens. Anchors, so
            it works as plain navigation everywhere. */}
        <nav aria-label="Chapters" className="hidden lg:col-span-2 lg:block">
          <ol className="sticky top-28 space-y-3">
            {nav.map((item, i) => {
              const isCurrent = current === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className={`flex items-baseline gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      isCurrent ? "text-fg" : "text-faint hover:text-muted"
                    }`}
                  >
                    <span className="w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* The rail itself plus the chapters. `--rail` lives on this element. */}
        <div ref={wrapRef} className="story-rail relative lg:col-span-10">
          <div aria-hidden className="story-spine">
            <div className="story-spine-fill" />
            <div className="story-spine-packet" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
