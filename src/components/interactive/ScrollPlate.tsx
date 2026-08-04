"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * The scrollable frame around a diagram, plus its caption.
 *
 * The "scroll" affordance is driven by measurement rather than a breakpoint —
 * a hardcoded `lg:hidden` claimed the diagram always fitted on desktop, which
 * was not true for every layout. Children are rendered on the server and passed
 * through, so the diagrams themselves stay out of the client bundle.
 */
export function ScrollPlate({
  children,
  caption,
}: {
  children: ReactNode;
  caption: string;
}) {
  const figureRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      setScrollable(frame.scrollWidth - frame.clientWidth > 1);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  /**
   * Publishes the plate's approach through the viewport as `--p` (0→1), which
   * the diagrams read in CSS to advance their stages and drive a packet along
   * the pipeline. Progress completes while the plate is still arriving, so a
   * diagram sitting in view is fully resolved rather than frozen mid-run.
   *
   * Written straight to the node inside rAF — this must never trigger a render.
   * If it never runs (JS off, reduced motion) the CSS falls back to `1`, i.e.
   * the finished state.
   */
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const { top } = figure.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - top) / (vh * 0.55);
      figure.style.setProperty("--p", String(Math.min(1, Math.max(0, progress))));
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
    <figure ref={figureRef} className="diagram-plate min-w-0">
      {/* Diagrams keep their full detail and scroll inside this frame on narrow
          screens rather than shrinking to illegibility. */}
      <div
        ref={frameRef}
        tabIndex={scrollable ? 0 : -1}
        role={scrollable ? "group" : undefined}
        aria-label={scrollable ? "Scrollable diagram" : undefined}
        className="overflow-x-auto border border-line bg-surface px-5 py-7 sm:px-8 sm:py-10"
      >
        <div className="min-w-[36rem]">{children}</div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-faint">
        <span className="max-w-[60ch]">{caption}</span>
        {scrollable ? (
          <span aria-hidden className="shrink-0">
            Scroll →
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
