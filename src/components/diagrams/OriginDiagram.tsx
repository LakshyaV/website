/**
 * Origin — conceptual signal-to-language architecture.
 *
 * Every trace here is hand-authored illustration. Nothing on this diagram is
 * measured data, and the caption in the section states so explicitly.
 */

const STAGES = [
  { x: 0, label: "Sensing", detail: "temple · sideburn · ear" },
  { x: 1, label: "Segmentation", detail: "windowed activity" },
  { x: 2, label: "Temporal model", detail: "sequence encoding" },
  { x: 3, label: "Semantic decode", detail: "units → language" },
  { x: 4, label: "Action", detail: "AI response" },
];

/** A deterministic quasi-random waveform: stable across renders, no hydration drift. */
function trace(seed: number, amplitude: number, points = 160, width = 300, y = 0) {
  let d = "";
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = t * width;
    const envelope = Math.sin(Math.PI * t) ** 0.7;
    const value =
      Math.sin(t * 34 + seed) * 0.55 +
      Math.sin(t * 71 + seed * 2.3) * 0.28 +
      Math.sin(t * 13 + seed * 0.7) * 0.34;
    const py = y - value * amplitude * envelope;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${py.toFixed(2)} `;
  }
  return d.trim();
}

export function OriginDiagram() {
  return (
    <svg
      viewBox="0 0 900 340"
      className="w-full text-fg"
      role="img"
      aria-label="Conceptual diagram: physiological signals captured near the temple, sideburn and ear are segmented, encoded by a temporal model, decoded into language units, and dispatched as an AI action."
    >
      {/* signal band */}
      <g className="d-step" style={{ "--s": 0 } as React.CSSProperties}>
        <text
          x="0"
          y="18"
          className="fill-[var(--faint)] font-mono"
          fontSize="10"
          letterSpacing="1.6"
        >
          RAW CHANNELS
        </text>
        {[0, 1, 2].map((channel) => (
          <g key={channel}>
            <path
              d={trace(channel * 3.1 + 1, 15, 160, 300, 62 + channel * 34)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity={0.75 - channel * 0.16}
            />
            <text
              x="308"
              y={66 + channel * 34}
              className="fill-[var(--faint)] font-mono"
              fontSize="9"
              letterSpacing="1.2"
            >
              CH{channel + 1}
            </text>
          </g>
        ))}
      </g>

      {/* segmentation windows */}
      <g className="d-step" style={{ "--s": 1 } as React.CSSProperties}>
        {[40, 118, 196].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="40"
            width="52"
            height="112"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity={0.3}
            strokeDasharray={i === 1 ? undefined : "2 3"}
          />
        ))}
        <text
          x="40"
          y="168"
          className="fill-[var(--muted)] font-mono"
          fontSize="9"
          letterSpacing="1.2"
        >
          WINDOWED SEGMENTS
        </text>
      </g>

      {/* decoded units */}
      <g className="d-step" style={{ "--s": 2 } as React.CSSProperties}>
        <text
          x="400"
          y="18"
          className="fill-[var(--faint)] font-mono"
          fontSize="10"
          letterSpacing="1.6"
        >
          DECODED UNITS
        </text>
        {["/s/", "/ɛ/", "/n/", "/d/"].map((unit, i) => (
          <g key={unit}>
            <rect
              x={400 + i * 62}
              y="38"
              width="48"
              height="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity={0.45}
            />
            <text
              x={424 + i * 62}
              y="58"
              textAnchor="middle"
              className="fill-[var(--fg)] font-mono"
              fontSize="12"
              opacity={0.85}
            >
              {unit}
            </text>
          </g>
        ))}
        <path
          d="M400 88 L648 88"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.25"
        />
        <text x="400" y="112" className="fill-[var(--fg)]" fontSize="15" opacity="0.9">
          “send it”
        </text>
        <text
          x="400"
          y="136"
          className="fill-[var(--faint)] font-mono"
          fontSize="9"
          letterSpacing="1.2"
        >
          INTENDED LANGUAGE · CONFIDENCE 0.00—1.00
        </text>
      </g>

      {/* confidence bars */}
      <g className="d-step" style={{ "--s": 3 } as React.CSSProperties}>
        <text
          x="700"
          y="18"
          className="fill-[var(--faint)] font-mono"
          fontSize="10"
          letterSpacing="1.6"
        >
          DECODE CONFIDENCE
        </text>
        {[0.82, 0.61, 0.74, 0.44].map((value, i) => (
          <g key={i}>
            <rect
              x={700 + i * 22}
              y={40}
              width="10"
              height="96"
              fill="currentColor"
              opacity="0.08"
            />
            <rect
              x={700 + i * 22}
              y={40 + 96 * (1 - value)}
              width="10"
              height={96 * value}
              fill="currentColor"
              opacity={0.35 + value * 0.35}
            />
          </g>
        ))}
      </g>

      {/* pipeline rail — the packet advances with scroll and lights each stage
          as it arrives, so the diagram reads as a machine running */}
      <g className="d-step" style={{ "--s": 1 } as React.CSSProperties}>
        <line
          x1="0"
          y1="232"
          x2="900"
          y2="232"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.28"
        />
        <path
          className="d-trail"
          d="M0 232 L860 232"
          pathLength="1"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          opacity="0.85"
        />
        <circle className="d-packet" cx="0" cy="232" r="4.5" fill="currentColor" />
        {STAGES.map((stage, i) => {
          const x = (stage.x / (STAGES.length - 1)) * 860;
          return (
            <g
              key={stage.label}
              className="d-step"
              style={{ "--s": i * 2.2 } as React.CSSProperties}
            >
              <circle cx={x} cy="232" r="3" fill="currentColor" opacity="0.7" />
              <text
                x={x}
                y="258"
                className="fill-[var(--fg)] font-mono"
                fontSize="11"
                letterSpacing="0.6"
                textAnchor={i === 0 ? "start" : i === STAGES.length - 1 ? "end" : "middle"}
              >
                {stage.label}
              </text>
              <text
                x={x}
                y="276"
                className="fill-[var(--faint)] font-mono"
                fontSize="9"
                letterSpacing="0.8"
                textAnchor={i === 0 ? "start" : i === STAGES.length - 1 ? "end" : "middle"}
              >
                {stage.detail}
              </text>
              <text
                x={x}
                y="212"
                className="fill-[var(--faint)] font-mono"
                fontSize="9"
                letterSpacing="1.2"
                textAnchor={i === 0 ? "start" : i === STAGES.length - 1 ? "end" : "middle"}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          );
        })}
      </g>

      {/* form-factor note */}
      <g className="d-step" style={{ "--s": 5 } as React.CSSProperties}>
        <path
          d="M0 312 L120 312"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.3"
        />
        <text
          x="0"
          y="332"
          className="fill-[var(--faint)] font-mono"
          fontSize="9"
          letterSpacing="1.4"
        >
          TARGET FORM FACTOR — GLASSES · NO SPEECH · NO VISIBLE GESTURE
        </text>
      </g>
    </svg>
  );
}
