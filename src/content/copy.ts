/**
 * All narrative copy for the home page, kept out of components so the
 * writing can be edited without touching layout code.
 */

export const hero = {
  name: "Lakshya Vasudeva",
  /**
   * Rendered as: "17. {cursive}machine learning{/cursive} {role}."
   * The cursive face applies to the middle fragment; `roles` is typed and
   * retyped in place. The first entry is what renders without JavaScript.
   */
  statement: {
    lead: "17.",
    cursive: "machine learning",
    roles: ["researcher", "engineer", "founder"],
  },
  support:
    "Building Origin. Researched @ Harvard Medical School. Prev @ Microsoft, Zebra Technologies, Interac.",
  enter: { label: "The work", href: "#work" },
  meta: [
    "Ontario, Canada",
    "Software Engineering · University of Waterloo",
    "Currently: Origin",
  ],
};

export const thesis = {
  number: "01",
  label: "Thesis",
  paragraphs: [
    "I'm building in order to advance human potential and performance. Machine intelligence is advancing rapidly, and we do not want humans to be the bottleneck.",
  ],
};

export const contact = {
  number: "04",
  label: "Contact",
  lead: "you can reach out at...",
  closing: "Built slowly, in the open, from Ontario.",
};

export const notesPage = {
  title: "Notes",
  intro:
    "Short technical writing: working notes on interfaces, biosignal decoding, and machine learning systems.",
  /** Shown only while nothing is published. */
  emptyNote: "Nothing is published yet — the drafts below are in progress and marked as such.",
};
