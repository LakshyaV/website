/**
 * jaw2control — conceptual signal path and command routing.
 *
 * Two lanes converge: what was said (silently) and what it was said to.
 * Hand-authored illustration; no recorded sensor data.
 */

function jawTrace(seed: number, width = 210, y = 0, amp = 13) {
  let d = "";
  const points = 130;
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = t * width;
    // bursts of articulation separated by rest
    const burst =
      Math.exp(-(((t - 0.2) * 13) ** 2)) +
      Math.exp(-(((t - 0.54) * 15) ** 2)) +
      Math.exp(-(((t - 0.84) * 14) ** 2));
    const v = Math.sin(t * 58 + seed) * burst;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${(y - v * amp).toFixed(2)} `;
  }
  return d.trim();
}

export function Jaw2ControlDiagram() {
  return (
    <svg
      viewBox="0 0 900 320"
      className="w-full text-fg"
      role="img"
      aria-label="Conceptual diagram: two jaw-mounted inertial sensors feed a temporal convolutional network that recovers phonetic units and decodes them into intended speech, while a camera identifies the device being looked at and the command is routed to that device."
    >
      {/* lane A — silent articulation */}
      <g className="d-step" style={{ "--d": "0ms" } as React.CSSProperties}>
        <text x="0" y="16" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          A · JAW MOTION — 2× IMU
        </text>
        <path d={jawTrace(1, 210, 62)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.75" />
        <path d={jawTrace(3.4, 210, 96)} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <text x="218" y="66" className="fill-[var(--faint)] font-mono" fontSize="9">
          IMU-L
        </text>
        <text x="218" y="100" className="fill-[var(--faint)] font-mono" fontSize="9">
          IMU-R
        </text>
        <text x="0" y="126" className="fill-[var(--muted)] font-mono" fontSize="9" letterSpacing="1.2">
          NO SOUND PRODUCED
        </text>
      </g>

      {/* TCN → phonetic units */}
      <g className="d-step" style={{ "--d": "240ms" } as React.CSSProperties}>
        <rect x="292" y="44" width="96" height="60" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={310 + col * 20}
              cy={60 + row * 16}
              r="1.8"
              fill="currentColor"
              opacity={0.25 + ((row + col) % 3) * 0.22}
            />
          )),
        )}
        <text x="292" y="122" className="fill-[var(--fg)] font-mono" fontSize="10" letterSpacing="1">
          TCN
        </text>
        <text x="292" y="138" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1">
          IN-HOUSE DATASET
        </text>

        <path d="M232 74 L288 74" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
        <path d="M282 70 L290 74 L282 78 Z" fill="currentColor" opacity="0.35" />
      </g>

      <g className="d-step" style={{ "--d": "440ms" } as React.CSSProperties}>
        {["/o/", "/p/", "/ə/", "/n/"].map((unit, i) => (
          <g key={unit}>
            <rect x={412 + i * 44} y="52" width="36" height="26" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
            <text
              x={430 + i * 44}
              y="70"
              textAnchor="middle"
              className="fill-[var(--fg)] font-mono"
              fontSize="11"
              opacity="0.85"
            >
              {unit}
            </text>
          </g>
        ))}
        <text x="412" y="102" className="fill-[var(--fg)]" fontSize="15" opacity="0.9">
          “open the notes”
        </text>
        <text x="412" y="122" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          SEMANTIC DECODE → INTENDED SPEECH
        </text>
      </g>

      {/* lane B — gaze target */}
      <g className="d-step" style={{ "--d": "620ms" } as React.CSSProperties}>
        <text x="0" y="188" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          B · GAZE TARGET — OAK-1
        </text>
        {/* camera frustum */}
        <path d="M6 232 L86 208 L86 260 Z" fill="currentColor" opacity="0.1" />
        <path d="M6 232 L86 208 L86 260 Z" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        <circle cx="6" cy="232" r="3" fill="currentColor" opacity="0.6" />

        {/* candidate targets, one recognised */}
        <g>
          <rect x="118" y="208" width="66" height="44" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
          <text x="122" y="266" className="fill-[var(--fg)] font-mono" fontSize="9" letterSpacing="1">
            LAPTOP
          </text>
          <text x="122" y="204" className="fill-[var(--faint)] font-mono" fontSize="8" letterSpacing="1">
            DETECTED
          </text>
        </g>
        <g opacity="0.32">
          <rect x="206" y="216" width="52" height="36" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <text x="206" y="266" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1">
            CIRCUIT
          </text>
        </g>
      </g>

      {/* routing */}
      <g className="d-step" style={{ "--d": "820ms" } as React.CSSProperties}>
        <path
          className="d-path"
          style={{ "--d": "820ms" } as React.CSSProperties}
          d="M556 130 Q596 190 640 230"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.4"
          fill="none"
        />
        <path
          className="d-path"
          style={{ "--d": "820ms" } as React.CSSProperties}
          d="M300 236 L636 232"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.4"
          fill="none"
        />
        <text x="330" y="224" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          INTENT + TARGET
        </text>

        <rect x="644" y="206" width="176" height="52" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
        <text x="660" y="230" className="fill-[var(--fg)] font-mono" fontSize="11" letterSpacing="0.8">
          ROUTE COMMAND
        </text>
        <text x="660" y="246" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1">
          → EXECUTE ON DEVICE
        </text>
      </g>

      <g className="d-step" style={{ "--d": "1000ms" } as React.CSSProperties}>
        <path d="M0 296 L140 296" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        <text x="0" y="314" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          NO SPEECH · NO KEYBOARD · NO VISIBLE GESTURE
        </text>
      </g>
    </svg>
  );
}
