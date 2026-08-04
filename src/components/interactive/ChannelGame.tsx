"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * THE CHANNEL — a playable silent-input game.
 *
 * You articulate by holding (pointer, touch, or space). Your press durations
 * are the signal: short bursts and long bursts, separated by rest. A decoder
 * reads that pattern live and matches it against the round's target command.
 *
 * Nothing here is canned. The waveform is generated from your actual input
 * timing, the confidence is a real match score over your real pulses, and the
 * rounds escalate. It is the site's thesis made playable: intent reaching a
 * machine through a channel that isn't a keyboard.
 */

const SHORT_MAX_MS = 260; // press shorter than this reads as a short pulse
const GAP_RESET_MS = 1100; // rest longer than this ends the attempt
const MAX_PRESS_MS = 900; // clamp so a stuck press can't run away

const COMMANDS = [
  "send it",
  "mute this",
  "call a car",
  "open notes",
  "lights off",
  "start recording",
];

/** Round n gets a longer pattern. 0 = short pulse, 1 = long pulse. */
function patternFor(round: number): number[] {
  const length = Math.min(2 + Math.floor(round / 2), 6);
  // Deterministic per round, so a given round always asks the same thing.
  const out: number[] = [];
  let seed = round * 2654435761;
  for (let i = 0; i < length; i += 1) {
    seed = (seed ^ (seed << 13)) >>> 0;
    seed = (seed ^ (seed >>> 17)) >>> 0;
    out.push(seed % 2);
  }
  // Never all-identical; that's dull to play.
  if (out.every((v) => v === out[0])) out[out.length - 1] = out[0] === 0 ? 1 : 0;
  return out;
}

type Status = "idle" | "listening" | "hit" | "miss";

export function ChannelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [pulses, setPulses] = useState<number[]>([]);
  const [target, setTarget] = useState<number[]>(() => patternFor(0));

  // 60fps state lives in refs — none of this should ever trigger a render.
  const pressedRef = useRef(false);
  const pressStartRef = useRef(0);
  const lastEventRef = useRef(0);
  const envelopeRef = useRef(0);
  const samplesRef = useRef<number[]>([]);
  const colorRef = useRef("#e9e7e2");
  const flashRef = useRef(0);
  const pulsesRef = useRef<number[]>([]);
  const engagedRef = useRef(false);
  const visibleRef = useRef(false);

  const command = COMMANDS[round % COMMANDS.length];

  /* ----------------------------- game logic ------------------------------ */

  const endAttempt = useCallback((hit: boolean) => {
    if (hit) {
      flashRef.current = 1;
      setStatus("hit");
      setScore((s) => {
        const next = s + 100 + round * 25;
        setBest((b) => Math.max(b, next));
        return next;
      });
      setRound((r) => {
        const next = r + 1;
        setTarget(patternFor(next));
        return next;
      });
    } else {
      setStatus("miss");
    }
    pulsesRef.current = [];
    setPulses([]);
  }, [round]);

  const registerPulse = useCallback(
    (duration: number) => {
      const kind = duration < SHORT_MAX_MS ? 0 : 1;
      const next = [...pulsesRef.current, kind];
      pulsesRef.current = next;
      setPulses(next);

      // Wrong pulse at any position ends the attempt immediately.
      if (next[next.length - 1] !== target[next.length - 1]) {
        endAttempt(false);
        return;
      }
      if (next.length === target.length) endAttempt(true);
      else setStatus("listening");
    },
    [endAttempt, target],
  );

  const press = useCallback(() => {
    if (pressedRef.current) return;
    engagedRef.current = true;
    pressedRef.current = true;
    pressStartRef.current = performance.now();
    lastEventRef.current = performance.now();
    setStatus("listening");
  }, []);

  const release = useCallback(() => {
    if (!pressedRef.current) return;
    pressedRef.current = false;
    const now = performance.now();
    lastEventRef.current = now;
    registerPulse(Math.min(now - pressStartRef.current, MAX_PRESS_MS));
  }, [registerPulse]);

  /* ------------------------------- rendering ----------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cache the resolved colour; re-read only when the theme flips.
    const readColor = () => {
      colorRef.current = getComputedStyle(canvas).color || "#e9e7e2";
    };
    readColor();
    const themeWatcher = new MutationObserver(readColor);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      samplesRef.current = new Array(width).fill(0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Don't burn a 60fps loop while the visitor is reading another section.
    const visibility = new IntersectionObserver(
      (entries) => {
        const wasVisible = visibleRef.current;
        visibleRef.current = entries.some((e) => e.isIntersecting);
        if (visibleRef.current && !wasVisible) {
          last = performance.now(); // don't fast-forward the sweep on return
          if (!raf) raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: "120px" },
    );

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let carry = 0;
    const SWEEP_PX_PER_SEC = 240; // ~4s of history across a desktop scope

    const frame = () => {
      if (!visibleRef.current) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);

      // Reduced motion: hold the scope still until the visitor chooses to play.
      // Their own input is the only thing that should set it moving.
      if (reduced && !engagedRef.current) {
        const color = colorRef.current;
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 0.16;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        return;
      }

      // --- advance the signal ------------------------------------------------
      // Time-based, not per-frame: the sweep must read the same on a 60Hz and a
      // 120Hz display, and one-pixel-per-frame left the scope looking dead.
      const now = performance.now();
      const dt = Math.min(now - last, 100);
      last = now;
      carry += (dt * SWEEP_PX_PER_SEC) / 1000;
      const steps = Math.floor(carry);
      carry -= steps;

      const samples = samplesRef.current;
      for (let n = 0; n < steps; n += 1) {
        t += 1;
        const targetEnv = pressedRef.current ? 1 : 0;
        envelopeRef.current += (targetEnv - envelopeRef.current) * 0.09;
        const env = envelopeRef.current;

        // A restless noise floor, so the channel reads as live even at rest.
        const noise =
          (Math.random() - 0.5) * 0.07 + Math.sin(t * 0.09) * 0.02 + Math.sin(t * 0.37) * 0.015;
        const carrier =
          Math.sin(t * 0.75) * 0.6 + Math.sin(t * 0.31 + 1.7) * 0.3 + Math.sin(t * 1.6) * 0.18;
        samples.push(noise + carrier * env * 0.92);
      }
      while (samples.length > width) samples.shift();

      // --- draw --------------------------------------------------------------
      const color = colorRef.current;
      ctx.clearRect(0, 0, width, height);
      const mid = height / 2;

      // baseline + faint ticks
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();

      ctx.globalAlpha = 0.1;
      for (let x = width % 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, mid - 6);
        ctx.lineTo(x, mid + 6);
        ctx.stroke();
      }

      // the trace itself
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let i = 0; i < samples.length; i += 1) {
        const y = mid - samples[i] * (mid - 8);
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      // live edge marker
      ctx.globalAlpha = pressedRef.current ? 0.9 : 0.35;
      ctx.beginPath();
      ctx.arc(width - 1, mid - samples[samples.length - 1] * (mid - 8), 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // success: a brief wash, kept well below anything that could read as a glow
      if (flashRef.current > 0) {
        flashRef.current = Math.max(0, flashRef.current - 0.03);
        ctx.globalAlpha = flashRef.current * 0.16;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.globalAlpha = 1;

      // --- attempt timeout ---------------------------------------------------
      if (
        !pressedRef.current &&
        pulsesRef.current.length > 0 &&
        performance.now() - lastEventRef.current > GAP_RESET_MS
      ) {
        pulsesRef.current = [];
        setPulses([]);
        setStatus("idle");
      }
    };

    visibility.observe(canvas);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      themeWatcher.disconnect();
      visibility.disconnect();
    };
  }, []);

  /* ------------------------------- controls ------------------------------ */

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault(); // only while the scope has focus, so page scroll is safe
      press();
    }
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      release();
    }
  };

  const statusLine = {
    idle: "Hold to articulate. Pointer, touch, or space",
    listening: "Listening…",
    hit: `Decoded. “${COMMANDS[(round - 1 + COMMANDS.length) % COMMANDS.length]}” sent`,
    miss: "Pattern lost. Try again",
  }[status];

  const pip = (kind: number, key: string, dim = false) => (
    <span
      key={key}
      aria-hidden
      className={`inline-block h-1 ${kind === 1 ? "w-7" : "w-2.5"} ${
        dim ? "bg-line-strong" : "bg-fg"
      }`}
    />
  );

  return (
    <section
      aria-label="The Channel, a silent input game"
      className="channel-game mt-6 border border-line bg-surface"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line px-5 py-3 sm:px-7">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-fg">
          The Channel
        </p>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
          Round {String(round + 1).padStart(2, "0")} · Score {score} · Best {best}
        </p>
      </header>

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
              Send
            </span>
            <span className="text-lg tracking-[-0.01em] sm:text-xl">“{command}”</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
              Pattern
            </span>
            <span className="flex items-center gap-1.5">
              {target.map((k, i) => pip(k, `t${i}`, i >= pulses.length))}
            </span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-label="Signal scope. Hold space to articulate a pulse. Short and long presses form the pattern."
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            press();
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={release}
          className="mt-5 h-40 w-full cursor-pointer touch-pan-y select-none border border-line text-fg sm:h-48"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p
            className={`font-mono text-[0.625rem] uppercase tracking-[0.16em] ${
              status === "hit" ? "text-fg" : status === "miss" ? "text-muted" : "text-faint"
            }`}
          >
            {statusLine}
          </p>
          <span className="flex items-center gap-1.5">
            {pulses.length === 0 ? (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                No pulses
              </span>
            ) : (
              pulses.map((k, i) => pip(k, `p${i}`))
            )}
          </span>
        </div>
      </div>

      <p className="border-t border-line px-5 py-3 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-faint sm:px-7">
        Your press timing is the signal, short and long bursts decoded live. A toy,
        not the real system.
      </p>
    </section>
  );
}
