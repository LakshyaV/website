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
    "Academically, I'm heading into Software Engineering at the University of Waterloo, with the goal of training my brain to take overload, think critically, and solve problems. As of now I work in machine learning, computer vision, neurotech applications, systems thinking, and user-first development.",
    "The through-line is narrow: everything I build sits at the boundary where a person's intent has to become a machine's action. That boundary is currently the slowest part of computing, and it is the part I want to move.",
  ],
};

export const about = {
  number: "04",
  label: "About",
  paragraphs: [
    "I started programming at seven and spent the next few years finding out how much of the world is programmable. By middle school I was teaching older students through a school coding club. FIRST LEGO League turned code into machines; VEX Robotics — software lead, team captain, provincial champion, two-time Worlds qualifier — turned machines into a discipline.",
    "The work got professional early. A consulting project with Microsoft on AI data-centre efficiency at fifteen, a software engineering internship at Zebra Technologies at sixteen building for constrained medical hardware, a machine learning partnership project with Interac at seventeen, and research on surgical video at Harvard. Different domains, same pattern: I kept ending up on the seam between a person and a system.",
    "Along the way the projects got stranger and more specific — a wheelchair driven by EEG, a jaw-sensing wearable that let you command a device by looking at it. Those were the ones that told me where to go. Origin is where that went.",
  ],
};

export const contact = {
  number: "05",
  label: "Contact",
  lead: "If you're working on interfaces, biosignals, medical AI — or a problem that doesn't fit a category yet — write to me.",
  closing: "Built slowly, in the open, from Ontario.",
};

export const notesPage = {
  title: "Notes",
  intro:
    "Short technical writing: working notes on interfaces, biosignal decoding, and machine learning systems.",
  /** Shown only while nothing is published. */
  emptyNote: "Nothing is published yet — the drafts below are in progress and marked as such.",
};
