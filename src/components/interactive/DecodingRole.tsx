"use client";

import { useEffect, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";
const HOLD_MS = 2400;
const TICK_MS = 45;
const LOCK_MS = 45;

type Char = { glyph: string; locked: boolean };

const resolved = (word: string): Char[] =>
  word.split("").map((glyph) => ({ glyph, locked: true }));

/**
 * Resolves a role out of noise, character by character, then moves to the next.
 *
 * Deliberately a decode rather than a typewriter: this site argues that typing
 * is the bottleneck, so the hero shouldn't animate itself being typed. Unlocked
 * characters render at reduced opacity — that dimming *is* the confidence
 * readout, which is why there is no separate meter.
 *
 * The first role is server-rendered, so with JavaScript off — or under
 * prefers-reduced-motion — the line still reads as a finished sentence. The
 * animated text is hidden from assistive tech; a static list is exposed
 * instead, so screen readers hear the roles once rather than every frame.
 */
export function DecodingRole({ roles }: { roles: readonly string[] }) {
  const [chars, setChars] = useState<Char[]>(() => resolved(roles[0] ?? ""));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (roles.length < 2) return;

    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let decodeStart = 0;

    const scramble = (length: number, lockedCount: number, target: string): Char[] =>
      Array.from({ length }, (_, i) =>
        i < lockedCount
          ? { glyph: target[i], locked: true }
          : { glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], locked: false },
      );

    const tick = () => {
      const target = roles[index];
      const elapsed = Date.now() - decodeStart;
      const lockedCount = Math.floor(elapsed / LOCK_MS);

      if (lockedCount >= target.length) {
        setChars(resolved(target));
        index = (index + 1) % roles.length;
        timer = setTimeout(startDecode, HOLD_MS);
        return;
      }

      setChars(scramble(target.length, lockedCount, target));
      timer = setTimeout(tick, TICK_MS);
    };

    const startDecode = () => {
      decodeStart = Date.now();
      tick();
    };

    timer = setTimeout(startDecode, HOLD_MS);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <>
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden>
        {chars.map((char, i) => (
          <span key={i} className={char.locked ? undefined : "decoding"}>
            {char.glyph}
          </span>
        ))}
      </span>
    </>
  );
}
