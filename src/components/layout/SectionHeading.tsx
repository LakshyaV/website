import { Reveal } from "./Reveal";

/** Editorial section marker: hairline rule, number, label. */
export function SectionHeading({ number, label }: { number: string; label: string }) {
  return (
    <Reveal className="border-t border-line pt-5">
      <div className="flex items-baseline gap-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-faint">
        <span>{number}</span>
        <span className="text-muted">{label}</span>
      </div>
    </Reveal>
  );
}
