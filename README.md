# lakshyavasudeva.com

Personal site — a single scroll-driven narrative (curiosity → systems →
intelligence → humans → interfaces) with a notes section for short technical
writing.

Built with Next.js (App Router), TypeScript in strict mode, Tailwind CSS v4, and
Geist. There is no component library: the design system is a small set of CSS
custom properties plus a handful of layout primitives.

## Commands

```bash
npm run dev        # local dev server at http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run check      # lint + typecheck + build
npm test           # end-to-end suite (needs a build first)
```

## Tests

`npm run build && npm test` boots the production server on port 4321, drives it
with Playwright, and prints a pass or fail line per check. Filter to one suite
with `npm test -- smoke`. CI runs the same command on every push and pull
request.

| Suite | Covers |
| --- | --- |
| `smoke` | Routes, metadata, JSON-LD, sitemap, robots, headings, link integrity |
| `copy-style` | No em-dashes or colons in rendered text, aria-labels, titles, meta |
| `responsive` | No horizontal scroll 320px to 2560px; no diagram clipped without its hint |
| `a11y` | Keyboard order and focus rings, the no-JS render, reduced motion, nav state |
| `interactions` | Hero decode, scroll-driven diagram packet, thread rail, the game |
| `contact` | Form payload, success and failure states, honeypot, social links (service intercepted) |
| `theme` | Dark default, persistence, theme and `js` class applied before first paint |
| `seo-assets` | Sitemap contents, robots, social card, favicon, 404 stays noindex |
| `notes` | Draft handling, empty state, draft slugs 404, nav link |
| `thread-integrity` | Every capability chip filters correctly and reaches every entry |

Suites are auto-discovered from `tests/suites/`, so adding one is a single file
exporting `name` and `run`.

The suites target behaviours that have actually regressed here, not a coverage
number. If you fix a bug, add the check that would have caught it.

## Where the content lives

All copy and project data is centralized. Editing these files is enough to
update the site; no component changes required.

| File | Contains |
| --- | --- |
| `src/content/site.ts` | Name, email, social URLs, resume path, nav items, canonical URL |
| `src/content/copy.ts` | Hero, thesis, contact, and notes-page copy |
| `src/content/work.ts` | Origin, the Harvard research, and the earlier-roles index |
| `src/content/projects.ts` | jaw2control, the wheelchair, and the projects index |
| `src/content/types.ts` | Shared `Featured` / `IndexEntry` shapes |
| `src/content/notes/` | Published notes as `.mdx` files (see `_README.md` there) |
| `src/lib/notes.ts` | Notes loader (published and draft frontmatter parsing) |

The page splits into **Work** (roles: Origin, Harvard, Interac, Zebra,
Microsoft) and **Projects** (things built independently: jaw2control, the
wheelchair, AIcruiter, Vursor, CheetCode, VEX). Adding an entry to either index
is a matter of appending to the relevant array.

`site.ts` fields that are `null` — currently X and `resume` — are treated as
"not yet available" and are **not rendered anywhere**. Set them to real values
and the corresponding links appear automatically. Nothing in the UI links to a
placeholder.

## Architecture

```
src/
  app/                  routes, metadata, sitemap, robots, OG image
  components/
    chrome/             nav, footer, theme toggle, scroll progress, reveal init
    layout/             Container, Reveal, SectionHeading primitives
    diagrams/           conceptual SVG diagrams (one per featured project)
    interactive/        client components: hero decode, scroll plates, thread rail, game, contact form
    sections/           home page sections
  content/              all editable copy and data
  lib/                  notes loader, structured data
```

**Design tokens.** Color, motion easing, and duration are CSS custom properties
in `src/app/globals.css`, exposed to Tailwind through `@theme inline`. Use
`text-muted`, `border-line`, `bg-surface` and friends rather than raw hex
values so both themes stay consistent.

**Theming.** Dark is the default identity; light is opt-in via the toggle and
stored in `localStorage`. An inline script in `src/app/layout.tsx` applies the
stored theme before first paint, so there is no flash and no hydration
mismatch. The toggle holds no React state — the root `data-theme` attribute is
the single source of truth.

**Motion.** Scroll reveals are CSS transitions gated behind `html.js`, which
`RevealInit` adds on mount. If JavaScript is disabled or fails, every element
renders in its final visible state — the site never depends on JS to be
readable. `prefers-reduced-motion: reduce` disables reveals, diagram staggering,
and smooth scrolling.

**Thread rail.** Each index is wrapped in `ThreadRail`
(`src/components/interactive/`). Every entry declares `capabilities`, and
selecting one recedes the entries that don't share it while drawing a hairline
against the ones that do — the through-line between roles and projects made
visible rather than claimed. Entries are dimmed, never removed, so the reading
order never changes; the rail hides itself entirely when JavaScript is off.
Values in an entry's `capabilities` must appear in that section's capability
list (`workCapabilities` / `projectCapabilities`) to be selectable.

**Diagrams.** The four SVGs in `src/components/diagrams/` are hand-authored
conceptual illustrations, not plots of real data. Every one is labelled as such
in its `figcaption`, and that labelling should be preserved if they are edited.
They keep full detail on small screens by scrolling inside their own container
rather than shrinking.

Any value derived from `Math.sin`/`Math.exp` that lands in a DOM attribute must
be rounded (`.toFixed(...)`) before it is rendered. Those functions can differ
in the last floating-point bit between Node and the browser, which React reports
as a hydration mismatch.

## Notes

Add a `.mdx` file to `src/content/notes/` with `title`, `summary`, `category`,
`date`, and optional `draft: true` frontmatter. The index at `/notes` and each
`/notes/<slug>` page are generated statically at build time.

While no published notes exist, `/notes` renders an honest "nothing published
yet" state listing the titles of `draft: true` files. Publishing a note
switches the index over automatically.

There is currently one draft, `the-bandwidth-problem.mdx`, carried over as-is.
It is complete but marked `draft: true`, so it appears on `/notes` as a titled
draft and has no page of its own. Remove that flag (and add a `date`) to
publish it.

## Deployment

Deploy to Vercel (or any Node host running `next build` / `next start`).

Set one environment variable so metadata, the sitemap, and structured data use
the real domain:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Without it the build falls back to `http://localhost:3000`, which is fine
locally but wrong for anything public. A deploy from CI or Vercel fails the
build if it is missing rather than shipping localhost canonicals.

**Contact form activation.** The form posts through FormSubmit to the address
in `site.email`, with no account or key. The service activates per address on
first use: the first submission triggers a one-time confirmation email, and
nothing forwards until its link is clicked. Submit the form once after
deploying and confirm. FormSubmit then also offers a random alias endpoint
that can replace the raw address in `ContactForm.tsx` to keep it out of the
page source.

## Still to supply

- `NEXT_PUBLIC_SITE_URL` on the deploy target
- One-time FormSubmit confirmation after the first deployed submission
- X profile URL in `src/content/site.ts` (currently `null`)
- A resume PDF in `public/` plus its path in `site.resume` (currently `null`)
