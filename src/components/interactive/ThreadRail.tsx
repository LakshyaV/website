"use client";

import { useId, useState } from "react";

import type { IndexEntry } from "@/content/types";

/**
 * Interactive thread rail.
 *
 * The index entries below are not independent — the same few capabilities run
 * through all of them. Selecting a capability recedes everything that doesn't
 * use it and draws a hairline against the entries that do, so the through-line
 * is visible rather than asserted.
 *
 * Entries are dimmed, never removed: the page reads identically without the
 * interaction, and the rail itself is hidden unless JavaScript is running
 * (see `.thread-rail` in globals.css).
 */
export function ThreadRail({
  capabilities,
  entries,
  renderEntry,
}: {
  capabilities: string[];
  entries: IndexEntry[];
  renderEntry: (
    entry: IndexEntry,
    index: number,
    state: { dimmed: boolean; filtering: boolean },
  ) => React.ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const statusId = useId();

  const matches = (entry: IndexEntry) => !active || entry.capabilities.includes(active);
  const count = active ? entries.filter(matches).length : entries.length;

  return (
    <>
      <div className="thread-rail mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-3 border-t border-line pt-5">
        <span className="mr-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-faint">
          Threads
        </span>

        {capabilities.map((capability) => {
          const on = active === capability;
          return (
            <button
              key={capability}
              type="button"
              aria-pressed={on}
              aria-describedby={statusId}
              onClick={() => setActive(on ? null : capability)}
              onMouseEnter={() => setActive(capability)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(capability)}
              className={`border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                on
                  ? "border-fg text-fg"
                  : "border-line text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              {capability}
            </button>
          );
        })}

        <span
          id={statusId}
          role="status"
          className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint"
        >
          {active ? `${count} of ${entries.length}` : `${entries.length} entries`}
        </span>
      </div>

      <div>
        {entries.map((entry, i) => {
          const dimmed = !matches(entry);
          return (
            <div
              key={entry.title}
              className="transition-opacity duration-500"
              style={{ opacity: dimmed ? 0.22 : 1 }}
            >
              {renderEntry(entry, i, { dimmed, filtering: active !== null })}
            </div>
          );
        })}
      </div>
    </>
  );
}
