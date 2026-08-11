"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decodes a short line once, the first time it enters the viewport. The hero
 * cycles forever; a chapter kicker should resolve a single time and then hold.
 *
 * Server-renders the final text, so without JavaScript or with reduced motion
 * nothing ever scrambles.
 */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789";
const LOCK_MS = 40;

export function DecodeOnView({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setRunning(true);

        let locked = 0;
        timer = setInterval(() => {
          locked += 1;
          if (locked >= text.length) {
            clearInterval(timer);
            setDisplay(text);
            setRunning(false);
            return;
          }
          setDisplay(
            text
              .split("")
              .map((ch, i) =>
                i < locked || ch === " "
                  ? ch
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
              )
              .join(""),
          );
        }, LOCK_MS);
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true" className={running ? "opacity-80" : undefined}>
        {display}
      </span>
    </span>
  );
}
