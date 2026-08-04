# Notes

Drop `.mdx` (or `.md`) files in this folder to publish a note. Frontmatter:

```yaml
---
title: Why a clean channel is not yet a language
summary: One or two sentences shown in the notes index.
category: Biosignal decoding
date: 2026-03-14 # ISO date; sorts newest first
draft: false # true keeps it out of the built site entirely
---
```

The body is standard Markdown/MDX. Files are read at build time by
`src/lib/notes.ts`; the index at `/notes` and each `/notes/<slug>` page are
generated statically.

While no published notes exist, `/notes` renders a "notes soon" state with the
draft topics listed in `draftTopics` in `src/lib/notes.ts`. Once a real note is
added here, the index switches to listing published notes automatically.

Files prefixed with `_` (like this one) are documentation and are skipped by the
loader.
