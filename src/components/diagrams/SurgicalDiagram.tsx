/**
 * Surgical intelligence — conceptual wet-lab → clinical transfer pipeline.
 * Abstract shapes only: no patient data, no real surgical imagery.
 */

function Frame({
  x,
  y,
  masked,
  opacity = 1,
}: {
  x: number;
  y: number;
  masked?: boolean;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect
        width="86"
        height="62"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.5"
      />
      {/* abstract anatomy: concentric arcs standing in for the eye */}
      <circle cx="43" cy="31" r="20" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx="43" cy="31" r="11" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
      {masked ? (
        <>
          <circle cx="43" cy="31" r="20" fill="currentColor" opacity="0.1" />
          <circle cx="43" cy="31" r="11" fill="currentColor" opacity="0.16" />
          {/* instrument */}
          <path d="M72 6 L48 27" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
          <path d="M76 2 L70 8" stroke="currentColor" strokeWidth="2.4" opacity="0.45" />
        </>
      ) : (
        <path d="M72 6 L48 27" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      )}
    </g>
  );
}

export function SurgicalDiagram() {
  return (
    <svg
      viewBox="0 0 900 380"
      className="w-full text-fg"
      role="img"
      aria-label="Conceptual diagram: densely annotated wet-lab frames supervise spatial attention; a temporal model encodes clip sequences; representations aggregate to a video-level classification and transfer to unlabelled clinical video."
    >
      {/* source */}
      <g className="d-step" style={{ "--s": 0 } as React.CSSProperties}>
        <text x="0" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          SOURCE — WET LAB · DENSE ANNOTATION
        </text>
        <Frame x={0} y={30} masked />
        <Frame x={98} y={30} masked />
        <Frame x={196} y={30} masked />
        <text x="0" y="112" className="fill-[var(--muted)] font-mono" fontSize="9" letterSpacing="1.2">
          ANATOMY + INSTRUMENT MASKS
        </text>
      </g>

      {/* supervision arrow into attention */}
      <g className="d-step" style={{ "--s": 1 } as React.CSSProperties}>
        <path
          className="d-path"
          pathLength="1"
          style={{ "--s": 1 } as React.CSSProperties}
          d="M300 61 L392 61"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.45"
          fill="none"
        />
        <path d="M386 57 L394 61 L386 65 Z" fill="currentColor" opacity="0.45" />
        <text x="304" y="52" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          SUPERVISES
        </text>
      </g>

      {/* attention grid */}
      <g className="d-step" style={{ "--s": 2 } as React.CSSProperties}>
        <text x="404" y="14" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          SPATIAL ATTENTION
        </text>
        {Array.from({ length: 8 }).map((_, col) =>
          Array.from({ length: 6 }).map((__, row) => {
            const dx = col - 3.4;
            const dy = row - 2.6;
            const weight = Math.exp(-(dx * dx + dy * dy) / 5.2);
            return (
              <rect
                key={`${col}-${row}`}
                x={404 + col * 15}
                y={30 + row * 11}
                width="14"
                height="10"
                fill="currentColor"
                // Rounded: Math.exp can differ in the last bit between Node and
                // the browser, which would render as a hydration mismatch.
                opacity={(0.06 + weight * 0.5).toFixed(4)}
              />
            );
          }),
        )}
        <text x="404" y="112" className="fill-[var(--muted)] font-mono" fontSize="9" letterSpacing="1.2">
          LEARNED WHERE-TO-LOOK
        </text>
      </g>

      {/* temporal sequence */}
      <g className="d-step" style={{ "--s": 3 } as React.CSSProperties}>
        <text x="0" y="168" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          TEMPORAL MODEL — CLIP SEQUENCE
        </text>
        <line x1="0" y1="212" x2="640" y2="212" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
        {Array.from({ length: 16 }).map((_, i) => {
          const h = Number((8 + Math.abs(Math.sin(i * 1.27)) * 26).toFixed(3));
          return (
            <rect
              key={i}
              x={i * 40}
              y={Number((212 - h).toFixed(3))}
              width="26"
              height={h}
              fill="currentColor"
              opacity={0.18 + (i % 4) * 0.1}
            />
          );
        })}
        <text x="0" y="232" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          t →
        </text>
      </g>

      {/* aggregation */}
      <g className="d-step" style={{ "--s": 4 } as React.CSSProperties}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${120 + i * 140} 224 Q${420} 268 700 286`}
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.28"
            fill="none"
          />
        ))}
        <rect x="700" y="268" width="180" height="38" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
        <text x="716" y="292" className="fill-[var(--fg)] font-mono" fontSize="11" letterSpacing="0.8">
          VIDEO-LEVEL CLASS
        </text>
        <text x="700" y="326" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          PROCEDURE AGGREGATION
        </text>
      </g>

      {/* target */}
      <g className="d-step" style={{ "--s": 5 } as React.CSSProperties}>
        <text x="644" y="168" className="fill-[var(--faint)] font-mono" fontSize="10" letterSpacing="1.6">
          TARGET — CLINICAL
        </text>
        <Frame x={644} y={182} opacity={0.55} />
        <Frame x={742} y={182} opacity={0.4} />
        <text x="644" y="262" className="fill-[var(--muted)] font-mono" fontSize="9" letterSpacing="1.2">
          NO DENSE LABELS
        </text>
        <path
          className="d-path"
          pathLength="1"
          style={{ "--s": 5 } as React.CSSProperties}
          d="M600 120 Q700 140 690 176"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="3 3"
          opacity="0.4"
          fill="none"
        />
        <text x="604" y="150" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.2">
          TRANSFER
        </text>
      </g>
    </svg>
  );
}
