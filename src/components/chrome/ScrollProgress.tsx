"use client";

import { useEffect, useRef } from "react";

/**
 * Hairline scroll progress rule pinned under the navigation.
 *
 * Writes the transform directly to the node inside rAF rather than through
 * React state — scroll updates should never trigger a render pass.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      bar.style.transform = `scaleX(${progress})`;
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
    <div aria-hidden className="h-px w-full bg-line">
      <div
        ref={barRef}
        className="h-px origin-left bg-fg"
        style={{ transform: "scaleX(0)", transition: "transform 120ms linear" }}
      />
    </div>
  );
}
