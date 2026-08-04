"use client";

import { useId, useState } from "react";

import type { IndexEntry } from "@/content/types";
import { EntryRow } from "@/components/sections/EntryRow";

/**
 * Interactive thread rail.
 *
 * The index entries below are not independent — the same few capabilities run
 * through all of them. Selecting a capability recedes the entries that don't
 * use it and draws a hairline against the ones that do, so the through-line is
 * visible rather than asserted.
 *
 * Selection is click/focus driven, deliberately not hover driven: a hover
 * handler would fire before the click and cancel it, and hover doesn't exist on
 * touch at all. Entries are dimmed, never removed, so the reading order never
 * changes; the rail hides itself entirely when JavaScript is off (see
 * `.thread-rail` in globals.css).
 */
export function ThreadRail({
  capabilities,
  entries,
}: {
  capabilities: string[];
  entries: IndexEntry[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const statusId = useId();

  const matches = (entry: IndexEntry) => !active || entry.capabilities.includes(active);
  const count = active ? entries.filter(matches).length : entries.length;

  return (
    <>
      <div
        className="thread-rail mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-3 border-t border-line pt-5"
        onKeyDown={(event) => {
          if (event.key === "Escape") setActive(null);
        }}
        onBlur={(event) => {
          // Clear when focus leaves the rail entirely, so a keyboard user can
          // never leave the list stranded in a filtered state.
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setActive(null);
          }
        }}
      >
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
              onClick={() => setActive(on ? null : capability)}
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
        {entries.map((entry, i) => (
          <div
            key={entry.title}
            className="transition-opacity duration-500"
            style={{ opacity: matches(entry) ? 1 : 0.5 }}
          >
            <EntryRow
              entry={entry}
              index={i}
              dimmed={!matches(entry)}
              filtering={active !== null}
            />
          </div>
        ))}
      </div>
    </>
  );
}
