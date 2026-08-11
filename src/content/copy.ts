/**
 * All narrative copy for the home page, kept out of components so the
 * writing can be edited without touching layout code.
 *
 * House style: no em-dashes and no colons in prose. Use a full stop, a comma,
 * or a rewrite instead.
 */

export const hero = {
  name: "Lakshya Vasudeva",
  /**
   * Rendered as "17. {cursive}machine learning{/cursive} {role}."
   * The cursive face applies to the middle fragment; `roles` is decoded and
   * re-decoded in place. The first entry is what renders without JavaScript.
   */
  statement: {
    lead: "17.",
    cursive: "machine learning",
    roles: ["researcher", "engineer", "founder"],
  },
  support:
    "Building Origin. Researched @ Harvard. Prev @ Zebra Technologies, Interac. Worked w/ Microsoft.",
  enter: { label: "The work", href: "#work" },
  meta: ["Software Engineering · University of Waterloo", "Currently building Origin"],
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
  lead: "you can reach out here...",
  closing: "iterate. get feedback. repeat fast.",
};

export const notesPage = {
  title: "Notes",
  intro:
    "Short technical writing. Working notes on interfaces, biosignal decoding, and machine learning systems.",
  /** Shown only while nothing is published. */
  emptyNote:
    "Nothing is published yet. The drafts below are in progress and marked as such.",
};
