import type { ReactNode } from "react";

import { Reveal } from "@/components/layout/Reveal";
import { ScrollPlate } from "@/components/interactive/ScrollPlate";
import type { Facet } from "@/content/types";

/** Compact technical metadata, rendered as a definition list. */
export function Facets({
  items,
  layout = "row",
}: {
  items: readonly Facet[];
  layout?: "row" | "stack";
}) {
  return (
    <dl
      className={
        layout === "row"
          ? "grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4"
          : "space-y-5"
      }
    >
      {items.map((item) => (
        <div key={item.term} className="border-t border-line pt-3">
          <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
            {item.term}
          </dt>
          <dd className="mt-1.5 text-[0.8125rem] leading-snug text-muted">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A framed conceptual diagram with a mandatory clarifying caption. */
export function DiagramPlate({
  children,
  caption,
  className = "",
}: {
  children: ReactNode;
  caption: string;
  className?: string;
}) {
  return (
    // min-w-0 matters: as a grid item this would otherwise take its automatic
    // minimum size from the wide diagram inside and stretch the whole track.
    <Reveal className={`min-w-0 ${className}`}>
      <ScrollPlate caption={caption}>{children}</ScrollPlate>
    </Reveal>
  );
}

/** Project title block: editorial number, status, title, one-line summary. */
export function ProjectTitle({
  number,
  status,
  title,
  oneLiner,
  scale = "lg",
}: {
  number: string;
  status: string;
  title: string;
  oneLiner: string;
  scale?: "xl" | "lg" | "md";
}) {
  const titleClass = {
    xl: "text-[2.75rem] sm:text-[4.25rem] lg:text-[5.5rem]",
    lg: "text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]",
    md: "text-[1.75rem] sm:text-[2.25rem] lg:text-[2.5rem]",
  }[scale];

  return (
    <>
      <Reveal>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.16em]">
          <span className="text-faint">{number}</span>
          <span className="text-muted">{status}</span>
        </div>
      </Reveal>
      <Reveal delay={70}>
        <h3 className={`mt-5 tracking-[-0.03em] leading-[1.02] ${titleClass}`}>{title}</h3>
      </Reveal>
      <Reveal delay={130}>
        <p className="mt-4 max-w-[46ch] text-lg leading-snug text-muted sm:text-xl">
          {oneLiner}
        </p>
      </Reveal>
    </>
  );
}
