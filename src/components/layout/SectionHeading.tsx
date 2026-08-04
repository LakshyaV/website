import { Reveal } from "./Reveal";

/**
 * Editorial section marker: hairline rule, number, label.
 *
 * The label is a real <h2> — visually it is just small mono type, but it gives
 * the page a heading level between the <h1> and the per-project <h3>s, so
 * screen-reader heading navigation reflects the actual document structure.
 */
export function SectionHeading({ number, label }: { number: string; label: string }) {
  return (
    <Reveal className="border-t border-line pt-5">
      <div className="flex items-baseline gap-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-faint">
        <span aria-hidden>{number}</span>
        <h2 className="font-mono text-[0.6875rem] font-normal uppercase tracking-[0.18em] text-muted">
          {label}
        </h2>
      </div>
    </Reveal>
  );
}
