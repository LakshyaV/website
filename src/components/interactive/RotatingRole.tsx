"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 58;
const DELETE_MS = 34;
const HOLD_MS = 2100;
const PAUSE_MS = 340;

/**
 * Types a role, deletes it, and types the next one.
 *
 * The first role is rendered on the server, so with JavaScript off — or under
 * prefers-reduced-motion — the line still reads as a complete sentence. The
 * animated text is hidden from assistive tech; a static list is exposed
 * instead so screen readers hear the full phrase once rather than
 * character by character.
 */
export function RotatingRole({ roles }: { roles: readonly string[] }) {
  const [display, setDisplay] = useState(roles[0] ?? "");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (roles.length < 2) return;

    let timer: ReturnType<typeof setTimeout>;
    let wordIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    const tick = () => {
      if (deleting) {
        charIndex -= 1;
        setDisplay(roles[wordIndex].slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % roles.length;
          timer = setTimeout(tick, PAUSE_MS);
          return;
        }
        timer = setTimeout(tick, DELETE_MS);
        return;
      }

      charIndex += 1;
      const word = roles[wordIndex];
      setDisplay(word.slice(0, charIndex));
      if (charIndex === word.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_MS);
        return;
      }
      timer = setTimeout(tick, TYPE_MS);
    };

    timer = setTimeout(tick, HOLD_MS);

    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <>
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden>
        {display}
        {/* Shown only once JS is running, and never under reduced motion —
            both gated in CSS so this stays render-stable. */}
        <span className="caret" />
      </span>
    </>
  );
}
