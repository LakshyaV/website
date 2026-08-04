"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Conceptual decode replay.
 *
 * Pick a phrase and watch the pipeline resolve it: signal, phonetic units,
 * per-unit confidence, sentence. Every number and waveform here is authored,
 * not measured — the panel replays a canned example so the idea behind Origin
 * can be seen rather than described. It never claims to decode the visitor,
 * and the caption says so.
 *
 * Motion is pure CSS keyframes restarted by changing `runKey`, so there is no
 * animation loop and no per-frame React work.
 */

type Phrase = {
  id: string;
  sentence: string;
  units: string[];
  confidence: number[];
  seed: number;
};

const PHRASES: Phrase[] = [
  {
    id: "send it",
    sentence: "send it",
    units: ["/s/", "/ɛ/", "/n/", "/d/", "/ɪ/", "/t/"],
    confidence: [0.94, 0.88, 0.91, 0.72, 0.83, 0.9],
    seed: 1.7,
  },
  {
    id: "mute this",
    sentence: "mute this",
    units: ["/m/", "/j/", "/u/", "/t/", "/ð/", "/ɪs/"],
    confidence: [0.89, 0.64, 0.86, 0.79, 0.58, 0.81],
    seed: 4.2,
  },
  {
    id: "call a car",
    sentence: "call a car",
    units: ["/k/", "/ɔ/", "/l/", "/ə/", "/k/", "/ɑr/"],
    confidence: [0.92, 0.77, 0.85, 0.61, 0.9, 0.74],
    seed: 6.9,
  },
];

/** Deterministic articulation trace: bursts of movement separated by rest. */
function trace(seed: number, width: number, height: number) {
  const points = 220;
  const mid = height / 2;
  let d = "";
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = t * width;
    const burst =
      Math.exp(-(((t - 0.18) * 11) ** 2)) +
      Math.exp(-(((t - 0.44) * 13) ** 2)) +
      Math.exp(-(((t - 0.72) * 12) ** 2)) +
      Math.exp(-(((t - 0.9) * 16) ** 2));
    const v =
      (Math.sin(t * 61 + seed) * 0.7 + Math.sin(t * 113 + seed * 2.1) * 0.3) * burst;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${(mid - v * (mid - 4)).toFixed(2)} `;
  }
  return d.trim();
}

export function DecodePanel() {
  const [active, setActive] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Hold the run until the panel is actually on screen, so the visitor sees it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const phrase = PHRASES[active];
  const mean =
    phrase.confidence.reduce((sum, c) => sum + c, 0) / phrase.confidence.length;

  const select = (index: number) => {
    setActive(index);
    setRunKey((k) => k + 1);
    setStarted(true);
  };

  return (
    <div ref={rootRef} className="mt-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-3 border-t border-line pt-5">
        <span className="mr-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-faint">
          Send a phrase
        </span>
        {PHRASES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={i === active}
            onClick={() => select(i)}
            className={`border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
              i === active
                ? "border-fg text-fg"
                : "border-line text-muted hover:border-line-strong hover:text-fg"
            }`}
          >
            {p.id}
          </button>
        ))}
        <button
          type="button"
          onClick={() => select(active)}
          className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint transition-colors duration-300 hover:text-fg"
        >
          Replay ↻
        </button>
      </div>

      <div
        key={runKey}
        data-run={started ? "" : undefined}
        className="decode-run mt-6 border border-line bg-surface px-5 py-7 sm:px-8 sm:py-8"
      >
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10 [&>*]:min-w-0">
          {/* signal */}
          <div className="lg:col-span-5">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
              Neuromuscular signal
            </p>
            <svg
              viewBox="0 0 320 76"
              className="mt-3 w-full text-fg"
              role="img"
              aria-label={`Conceptual articulation trace for the phrase “${phrase.sentence}”.`}
            >
              <line x1="0" y1="38" x2="320" y2="38" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
              <path
                className="dp-trace"
                d={trace(phrase.seed, 320, 76)}
                pathLength="1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                opacity="0.8"
              />
            </svg>
            <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
              No sound produced
            </p>
          </div>

          {/* units + confidence */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
              Decoded units · confidence
            </p>
            <div className="mt-3 flex gap-2">
              {phrase.units.map((unit, i) => (
                <div
                  key={`${unit}-${i}`}
                  className="dp-unit flex-1"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className="border border-line px-1 py-1.5 text-center font-mono text-[0.6875rem] text-fg">
                    {unit}
                  </div>
                  {/* Height alone encodes confidence — a second channel like
                      opacity would only make the values harder to compare. */}
                  <div className="mt-1.5 h-14 border-t border-line bg-[color-mix(in_srgb,var(--fg)_7%,transparent)]">
                    <div
                      className="dp-bar h-full w-full origin-bottom bg-fg opacity-80"
                      style={{ "--v": phrase.confidence[i] } as React.CSSProperties}
                    />
                  </div>
                  <p className="mt-1 text-center font-mono text-[0.5625rem] tracking-[0.06em] text-faint">
                    {phrase.confidence[i].toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-4">
              <p className="text-[1.375rem] tracking-[-0.02em] sm:text-[1.75rem]">
                {phrase.sentence.split(" ").map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="dp-word"
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {i > 0 ? " " : ""}
                    {word}
                  </span>
                ))}
              </p>
              <p className="dp-verdict font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                Decoded · {mean.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-faint">
        Conceptual replay — authored signals and confidences, not live inference or
        recorded data.
      </p>
    </div>
  );
}
