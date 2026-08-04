import type { ReactNode } from "react";

/**
 * Marks a subtree for scroll-reveal. The animation is CSS-only and applies
 * exclusively when `html.js` is set (see globals.css), so content stays
 * visible without JavaScript and under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
