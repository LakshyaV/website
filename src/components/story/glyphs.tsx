import type { CSSProperties, ReactNode } from "react";

/**
 * One small schematic per story chapter, hand-authored like the project
 * diagrams. They reuse the same animation grammar, `.d-step` stages and
 * `.d-path` strokes driven by the chapter's `--p`, so arriving at a chapter
 * draws its glyph with zero client JavaScript.
 *
 * All decorative; the chapter text carries the content, so every glyph is
 * aria-hidden. Stage indices stay in the 0..4 range because a chapter's run
 * is much shorter than a full diagram's.
 */

const s = (n: number) => ({ "--s": n }) as CSSProperties;

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 220 140" aria-hidden="true" className="w-full max-w-[15rem] text-fg">
      {children}
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
} as const;

/** Snapped blocks becoming typed syntax. */
function Blocks() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="24" y={34 + i * 24} width="56" height="20" rx="3" {...stroke} />
            {/* the snap notch */}
            <path d={`M40 ${34 + i * 24} v-4 h12 v4`} {...stroke} />
          </g>
        ))}
      </g>
      <g className="d-step" style={s(1.6)}>
        <path className="d-path" pathLength="1" d="M92 68 H120" {...stroke} strokeDasharray="2 3" />
        <path d="M116 64 L122 68 L116 72" {...stroke} />
      </g>
      <g className="d-step" style={s(2.6)}>
        <rect x="130" y="36" width="72" height="64" {...stroke} />
        <text x="140" y="58" className="fill-[var(--fg)] font-mono" fontSize="10" opacity="0.85">
          {"class M {"}
        </text>
        <text x="148" y="74" className="fill-[var(--fg)] font-mono" fontSize="10" opacity="0.6">
          {"run();"}
        </text>
        <text x="140" y="90" className="fill-[var(--fg)] font-mono" fontSize="10" opacity="0.85">
          {"}"}
        </text>
      </g>
      <g className="d-step" style={s(3.4)}>
        <text x="24" y="122" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          BLOCKS TO JAVA
        </text>
      </g>
    </Frame>
  );
}

/** One screen at the front, a room of screens learning from it. */
function Club() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <rect x="24" y="28" width="44" height="30" {...stroke} />
        <text x="34" y="48" className="fill-[var(--fg)] font-mono" fontSize="11" opacity="0.85">
          &lt;/&gt;
        </text>
      </g>
      <g className="d-step" style={s(1.4)}>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            className="d-path"
            pathLength="1"
            d={`M70 46 C 96 ${52 + i * 4}, 104 ${70 + i * 18}, ${118} ${76 + i * 22}`}
            {...stroke}
            strokeDasharray="2 3"
            opacity="0.55"
          />
        ))}
      </g>
      <g className="d-step" style={s(2.4)}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={122 + i * 32} y={70 + i * 4} width="24" height="17" {...stroke} opacity="0.75" />
        ))}
      </g>
      <g className="d-step" style={s(3.2)}>
        <text x="24" y="122" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          GRADE TWO TEACHING GRADE FIVE
        </text>
      </g>
    </Frame>
  );
}

/** A brick robot and the mission it has to reach. */
function Fll() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <line x1="16" x2="204" y1="96" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <rect x="28" y="64" width="40" height="24" {...stroke} />
        <path d="M36 64 v-6 h8 v6 M52 64 v-6 h8 v6" {...stroke} />
        <circle cx="38" cy="92" r="6" {...stroke} />
        <circle cx="58" cy="92" r="6" {...stroke} />
      </g>
      <g className="d-step" style={s(1.6)}>
        <path
          className="d-path"
          pathLength="1"
          d="M72 76 C 104 68, 128 84, 158 78"
          {...stroke}
          strokeDasharray="3 4"
        />
      </g>
      <g className="d-step" style={s(2.6)}>
        <line x1="166" x2="166" y1="52" y2="96" stroke="currentColor" strokeWidth="1.1" />
        <path d="M166 52 L184 58 L166 64 Z" fill="currentColor" opacity="0.7" />
      </g>
      <g className="d-step" style={s(3.4)}>
        <text x="16" y="122" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          MISSION TABLE
        </text>
      </g>
    </Frame>
  );
}

/** A hand's landmarks and a cry's waveform, both resolving to meaning. */
function ReadModels() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        {/* five fingers as landmark chains from a palm point */}
        {[
          "M48 84 L38 58 L34 44",
          "M48 84 L48 52 L48 36",
          "M48 84 L58 54 L62 40",
          "M48 84 L66 62 L74 52",
          "M48 84 L68 76 L80 72",
        ].map((d, i) => (
          <path key={i} className="d-path" pathLength="1" d={d} {...stroke} opacity="0.75" />
        ))}
        {[
          [34, 44], [48, 36], [62, 40], [74, 52], [80, 72], [48, 84],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="currentColor" />
        ))}
      </g>
      <g className="d-step" style={s(1.6)}>
        <path
          className="d-path"
          pathLength="1"
          d="M36 110 L44 110 48 102 54 118 60 106 66 112 74 110 84 110"
          {...stroke}
          opacity="0.7"
        />
      </g>
      <g className="d-step" style={s(2.6)}>
        <path className="d-path" pathLength="1" d="M96 84 H126" {...stroke} strokeDasharray="2 3" />
        <path d="M122 80 L128 84 L122 88" {...stroke} />
        <rect x="134" y="70" width="68" height="28" {...stroke} />
        <text x="146" y="88" className="fill-[var(--fg)] font-mono" fontSize="9" letterSpacing="1" opacity="0.85">
          MEANING
        </text>
      </g>
      <g className="d-step" style={s(3.4)}>
        <text x="36" y="34" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          HUMAN SIGNAL IN
        </text>
      </g>
    </Frame>
  );
}

/** Chassis, wheels, and the autonomous path it must hold. */
function Vex() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <rect x="24" y="66" width="64" height="34" {...stroke} />
        <circle cx="38" cy="106" r="9" {...stroke} />
        <circle cx="74" cy="106" r="9" {...stroke} />
      </g>
      <g className="d-step" style={s(1.4)}>
        <path
          className="d-path"
          pathLength="1"
          d="M88 82 C 130 78, 138 46, 168 42 S 202 58, 196 30"
          {...stroke}
          strokeDasharray="3 4"
        />
        <circle cx="196" cy="30" r="2.5" fill="currentColor" />
      </g>
      <g className="d-step" style={s(2.6)}>
        <text x="24" y="34" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          AUTONOMOUS RUN
        </text>
      </g>
    </Frame>
  );
}

/** Raw EEG becoming motion. */
function Eeg() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <path
          className="d-path"
          pathLength="1"
          d="M16 52 L34 52 40 30 48 74 56 44 62 58 72 52 88 52 94 38 102 66 110 52 126 52"
          {...stroke}
        />
      </g>
      <g className="d-step" style={s(1.6)}>
        <path className="d-path" pathLength="1" d="M126 52 H154" {...stroke} strokeDasharray="2 3" />
        <path d="M150 48 L156 52 L150 56" {...stroke} />
      </g>
      <g className="d-step" style={s(2.6)}>
        <circle cx="182" cy="52" r="18" {...stroke} />
        <circle cx="182" cy="52" r="3" fill="currentColor" />
        <path className="d-path" pathLength="1" d="M182 34 A18 18 0 0 1 199 58" {...stroke} strokeWidth="2.2" />
      </g>
      <g className="d-step" style={s(3.4)}>
        <text x="16" y="110" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          EEG TO MOTION
        </text>
      </g>
    </Frame>
  );
}

/** Racks, and the operating cost bending down. */
function Datacenter() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={20 + i * 34} y="34" width="24" height="72" {...stroke} />
            {[0, 1, 2, 3].map((r) => (
              <line
                key={r}
                x1={24 + i * 34}
                x2={40 + i * 34}
                y1={44 + r * 16}
                y2={44 + r * 16}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
            ))}
          </g>
        ))}
      </g>
      <g className="d-step" style={s(1.8)}>
        <path className="d-path" pathLength="1" d="M138 44 C 160 46, 168 74, 202 96" {...stroke} />
        <path d="M196 96 L203 97 L200 89" {...stroke} />
      </g>
      <g className="d-step" style={s(3)}>
        <text x="138" y="30" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          COST CURVE
        </text>
      </g>
    </Frame>
  );
}

/** A device that has to do everything itself. */
function Handheld() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <rect x="72" y="18" width="76" height="104" rx="8" {...stroke} />
        <line x1="92" x2="128" y1="112" y2="112" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>
      <g className="d-step" style={s(1.4)}>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="84"
            x2={i === 3 ? 116 : 136}
            y1={40 + i * 12}
            y2={40 + i * 12}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.6"
          />
        ))}
      </g>
      <g className="d-step" style={s(2.4)}>
        <rect x="84" y="88" width="14" height="14" {...stroke} />
        <text x="72" y="136" className="fill-[var(--faint)] font-mono" fontSize="8" letterSpacing="1">
          ON-DEVICE
        </text>
      </g>
    </Frame>
  );
}

/** Transactions resolving into structure. */
function Embeddings() {
  const dots: Array<[number, number]> = [
    [40, 44], [52, 56], [34, 62], [48, 38],
    [110, 92], [122, 100], [104, 104], [118, 84],
    [176, 40], [188, 52], [170, 54], [184, 34],
  ];
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity="0.75" />
        ))}
      </g>
      <g className="d-step" style={s(1.6)}>
        <circle cx="44" cy="50" r="20" {...stroke} strokeDasharray="2 3" />
        <circle cx="113" cy="95" r="20" {...stroke} strokeDasharray="2 3" />
        <circle cx="180" cy="45" r="20" {...stroke} strokeDasharray="2 3" />
      </g>
      <g className="d-step" style={s(2.8)}>
        <path className="d-path" pathLength="1" d="M62 58 C 80 70, 88 80, 95 88" {...stroke} opacity="0.6" />
        <path className="d-path" pathLength="1" d="M130 88 C 146 74, 152 60, 162 52" {...stroke} opacity="0.6" />
      </g>
    </Frame>
  );
}

/** A labelled practice frame teaching an unlabelled clinical one. */
function Surgery() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <rect x="18" y="34" width="76" height="56" {...stroke} />
        <path
          d="M36 72 C 42 56, 62 50, 76 60 C 82 66, 72 76, 56 76 Z"
          fill="currentColor"
          opacity="0.18"
        />
        <path d="M36 72 C 42 56, 62 50, 76 60 C 82 66, 72 76, 56 76 Z" {...stroke} />
        <text x="18" y="104" className="fill-[var(--faint)] font-mono" fontSize="8" letterSpacing="1">
          WET LAB · LABELLED
        </text>
      </g>
      <g className="d-step" style={s(1.8)}>
        <path className="d-path" pathLength="1" d="M94 62 H124" {...stroke} strokeDasharray="2 3" />
        <path d="M120 58 L126 62 L120 66" {...stroke} />
      </g>
      <g className="d-step" style={s(2.8)}>
        <rect x="126" y="34" width="76" height="56" {...stroke} strokeDasharray="3 3" />
        <text x="126" y="104" className="fill-[var(--faint)] font-mono" fontSize="8" letterSpacing="1">
          CLINICAL · NONE
        </text>
      </g>
    </Frame>
  );
}

/** Three quick builds, three small tiles. */
function Experiments() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <rect x="20" y="42" width="52" height="40" {...stroke} />
        <text x="28" y="66" className="fill-[var(--fg)] font-mono" fontSize="11" opacity="0.8">
          &gt;_
        </text>
      </g>
      <g className="d-step" style={s(1.2)}>
        <rect x="84" y="42" width="52" height="40" {...stroke} />
        <path className="d-path" pathLength="1" d="M92 56 H128 M92 64 H118" {...stroke} opacity="0.6" />
      </g>
      <g className="d-step" style={s(2.4)}>
        <rect x="148" y="42" width="52" height="40" {...stroke} />
        <line x1="156" x2="192" y1="62" y2="62" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <rect x="162" y="56" width="12" height="12" fill="currentColor" opacity="0.35" />
      </g>
      <g className="d-step" style={s(3.2)}>
        <text x="20" y="106" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          SHIPPED IN A WEEKEND
        </text>
      </g>
    </Frame>
  );
}

/** Movement without sound, resolved into units. */
function Jaw() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <path className="d-path" pathLength="1" d="M22 46 C 30 74, 52 92, 84 92 C 100 92, 108 84, 110 74" {...stroke} />
        <circle cx="46" cy="82" r="3" fill="currentColor" />
        <circle cx="76" cy="92" r="3" fill="currentColor" />
      </g>
      <g className="d-step" style={s(1.6)}>
        <path
          className="d-path"
          pathLength="1"
          d="M118 66 L126 66 130 54 136 78 142 60 148 70 154 66 162 66"
          {...stroke}
        />
      </g>
      <g className="d-step" style={s(2.8)}>
        {["/s/", "/ɛ/", "/n/"].map((u, i) => (
          <g key={u}>
            <rect x={126 + i * 28} y="86" width="24" height="18" {...stroke} opacity="0.7" />
            <text
              x={138 + i * 28}
              y="98"
              textAnchor="middle"
              className="fill-[var(--fg)] font-mono"
              fontSize="8"
              opacity="0.85"
            >
              {u}
            </text>
          </g>
        ))}
      </g>
      <g className="d-step" style={s(3.6)}>
        <text x="22" y="30" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          NO SOUND PRODUCED
        </text>
      </g>
    </Frame>
  );
}

/** The target form factor, signal leaving the frame. */
function Origin() {
  return (
    <Frame>
      <g className="d-step" style={s(0)}>
        <rect x="40" y="52" width="54" height="34" rx="10" {...stroke} />
        <rect x="112" y="52" width="54" height="34" rx="10" {...stroke} />
        <path d="M94 62 C 100 56, 106 56, 112 62" {...stroke} />
        <path d="M40 60 L26 54" {...stroke} />
        <path d="M166 60 L180 54" {...stroke} />
      </g>
      <g className="d-step" style={s(1.6)}>
        <circle cx="44" cy="56" r="2.5" fill="currentColor" />
        <circle cx="162" cy="56" r="2.5" fill="currentColor" />
        <circle cx="26" cy="54" r="2.5" fill="currentColor" />
      </g>
      <g className="d-step" style={s(2.6)}>
        <path className="d-path" pathLength="1" d="M186 48 C 194 42, 198 38, 204 30" {...stroke} opacity="0.7" />
        <path className="d-path" pathLength="1" d="M190 58 C 200 54, 206 50, 214 44" {...stroke} opacity="0.45" />
      </g>
      <g className="d-step" style={s(3.4)}>
        <text x="40" y="116" className="fill-[var(--faint)] font-mono" fontSize="9" letterSpacing="1.4">
          INTENT, PRIVATELY
        </text>
      </g>
    </Frame>
  );
}

export const storyGlyphs: Record<string, () => ReactNode> = {
  blocks: Blocks,
  club: Club,
  fll: Fll,
  readmodels: ReadModels,
  vex: Vex,
  eeg: Eeg,
  datacenter: Datacenter,
  handheld: Handheld,
  embeddings: Embeddings,
  surgery: Surgery,
  experiments: Experiments,
  jaw: Jaw,
  origin: Origin,
};
