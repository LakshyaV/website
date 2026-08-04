import type { IndexEntry } from "@/content/types";

/**
 * One row of an editorial index. Shared by the work and projects sections so
 * both read as the same document rather than two different components.
 */
export function EntryRow({
  entry,
  index,
  dimmed = false,
  filtering = false,
}: {
  entry: IndexEntry;
  index: number;
  dimmed?: boolean;
  filtering?: boolean;
}) {
  const threaded = filtering && !dimmed;

  return (
    <article className="group relative grid grid-cols-1 gap-y-4 border-t border-line py-8 sm:grid-cols-12 sm:gap-x-8">
      {/* Hairline that draws in when this entry matches the selected thread. */}
      <span
        aria-hidden
        className="absolute -top-px left-0 h-px w-full origin-left bg-fg transition-transform duration-500"
        style={{ transform: `scaleX(${threaded ? 1 : 0})` }}
      />

      <div className="flex items-baseline gap-4 sm:col-span-4">
        <span className="font-mono text-[0.625rem] tracking-[0.16em] text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="text-lg leading-snug tracking-[-0.01em] sm:text-xl">{entry.title}</h3>
          <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
            {entry.context}
          </p>
        </div>
      </div>

      <div className="sm:col-span-6">
        <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">
          {entry.description}
        </p>
        {entry.bullets ? (
          <ul className="mt-4 space-y-2">
            {entry.bullets.map((bullet) => (
              <li
                key={bullet}
                className="relative max-w-[58ch] pl-4 text-[0.8125rem] leading-relaxed text-faint before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-line-strong"
              >
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <p className="font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.12em] text-faint sm:col-span-2 sm:text-right">
        {entry.annotation ?? ""}
      </p>
    </article>
  );
}
