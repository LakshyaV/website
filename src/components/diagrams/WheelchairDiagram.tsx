/**
 * Mind-controlled wheelchair — conceptual signal chain.
 * Waveforms are hand-authored illustration, not recorded EEG.
 */

function wave(seed: number, amp: number, noise: number, width = 200, y = 0, points = 140) {
  let d = "";
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = t * width;
    const base = Math.sin(t * 26 + seed) * amp;
    const jitter =
      (Math.sin(t * 121 + seed * 3.7) + Math.sin(t * 83 + seed * 1.9)) * amp * noise;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${(y - base - jitter).toFixed(2)} `;
  }
  return d.trim();
}

const BANDS = [
  { label: "θ", value: 0.32 },
  { label: "α", value: 0.86 },
  { label: "β", value: 0.54 },
  { label: "γ", value: 0.21 },
];

export function WheelchairDiagram() {
  return (
    <svg
      viewBox="0 0 900 260"
      className="w-full text-fg"
      role="img"
      aria-label="Conceptual diagram: raw EEG is filtered, converted to frequency-band features, classified into an intentional control state, smoothed, and sent to embedded motor actuation."
    >
      {/* stage 1 — raw */}
      <g className="d-step" style={{ "--d": "0ms" } as React.CSSProperties}>
        <text x="0" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          01 · RAW EEG
        </text>
        <path d={wave(1, 12, 0.55, 190, 62)} fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        <path d={wave(4.2, 9, 0.7, 190, 96)} fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
      </g>

      {/* stage 2 — filtered */}
      <g className="d-step" style={{ "--d": "220ms" } as React.CSSProperties}>
        <text x="228" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          02 · FILTERED
        </text>
        <g transform="translate(228 0)">
          <path d={wave(1, 12, 0.05, 190, 62)} fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
          <path d={wave(4.2, 9, 0.05, 190, 96)} fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
        </g>
      </g>

      {/* stage 3 — bands */}
      <g className="d-step" style={{ "--d": "440ms" } as React.CSSProperties}>
        <text x="456" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          03 · BAND POWER
        </text>
        {BANDS.map((band, i) => (
          <g key={band.label}>
            <rect x={456 + i * 32} y={38} width="18" height="70" fill="currentColor" opacity="0.08" />
            <rect
              x={456 + i * 32}
              y={38 + 70 * (1 - band.value)}
              width="18"
              height={70 * band.value}
              fill="currentColor"
              opacity={0.3 + band.value * 0.4}
            />
            <text
              x={465 + i * 32}
              y={122}
              textAnchor="middle"
              className="fill-[var(--faint)] font-mono"
              fontSize="10"
            >
              {band.label}
            </text>
          </g>
        ))}
      </g>

      {/* stage 4 — intent state */}
      <g className="d-step" style={{ "--d": "640ms" } as React.CSSProperties}>
        <text x="612" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          04 · INTENT STATE
        </text>
        {["IDLE", "FORWARD", "TURN"].map((state, i) => (
          <g key={state}>
            <rect
              x={612}
              y={34 + i * 28}
              width="118"
              height="20"
              fill={i === 1 ? "currentColor" : "none"}
              fillOpacity={i === 1 ? 0.14 : 0}
              stroke="currentColor"
              strokeWidth="0.75"
              opacity={i === 1 ? 0.7 : 0.28}
            />
            <text
              x={624}
              y={48 + i * 28}
              className="font-mono"
              fontSize="10"
              letterSpacing="1.2"
              fill={i === 1 ? "var(--fg)" : "var(--faint)"}
            >
              {state}
            </text>
          </g>
        ))}
        <text x="612" y="130" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          SMOOTHED OVER TIME
        </text>
      </g>

      {/* stage 5 — actuation */}
      <g className="d-step" style={{ "--d": "840ms" } as React.CSSProperties}>
        <text x="770" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          05 · MOTORS
        </text>
        <circle cx="806" cy="62" r="17" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        <circle cx="806" cy="62" r="5" fill="currentColor" opacity="0.5" />
        <circle cx="862" cy="62" r="17" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        <circle cx="862" cy="62" r="5" fill="currentColor" opacity="0.5" />
        <path d="M789 96 L879 96" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
        <text x="770" y="122" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          EMBEDDED DRIVE
        </text>
      </g>

      {/* connecting rail */}
      <g className="d-step" style={{ "--d": "1020ms" } as React.CSSProperties}>
        <path
          className="d-path"
          style={{ "--d": "1020ms" } as React.CSSProperties}
          d="M0 176 L900 176"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.25"
          fill="none"
        />
        {[0, 228, 456, 612, 806].map((x) => (
          <circle key={x} cx={x === 0 ? 2 : x} cy="176" r="2.5" fill="currentColor" opacity="0.55" />
        ))}
        <text x="0" y="202" className="fill-[var(--muted)] font-mono" fontSize="9" letterSpacing="1.4">
          ACQUISITION → FEATURES → CLASSIFICATION → SMOOTHING → ACTUATION
        </text>
      </g>
    </svg>
  );
}
