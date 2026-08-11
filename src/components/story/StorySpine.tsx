"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * The only moving part of the story page. Entries render on the server and
 * pass through; this wrapper measures scroll and publishes two things, with
 * no React state at all.
 *
 * `--rail` on the wrapper is the fraction of the story travelled, filling
 * the spine and carrying the packet at its leading edge. `--p` on each
 * `[data-entry]` fades that entry and its node in as it arrives, through the
 * same CSS contract the diagrams use. Both default to the finished state, so
 * without JavaScript or with reduced motion the page renders complete.
 */
export function StorySpine({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const entries = [...wrap.querySelectorAll<HTMLElement>("[data-entry]")];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of entries) {
        const { top } = el.getBoundingClientRect();
        // Entries are short, so they resolve over a third of a screen,
        // starting once they rise past 85% of the viewport.
        const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.35)));
        el.style.setProperty("--p", String(p));
      }
      const rect = wrap.getBoundingClientRect();
      const rail = Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / rect.height));
      wrap.style.setProperty("--rail", String(rail));
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

  return (
    <div ref={wrapRef} className="story-rail relative mt-14 sm:mt-16">
      <div aria-hidden className="story-spine">
        <div className="story-spine-fill" />
        <div className="story-spine-packet" />
      </div>
      {children}
    </div>
  );
}
