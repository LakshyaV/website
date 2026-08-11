/**
 * The story page. A life in tech told in the site's own grammar, a signal
 * travelling a rail, resolving stage by stage into the current work.
 *
 * Every fact here already appears elsewhere in the site's content. The story
 * arranges them; it does not add claims. House style applies, no em-dashes
 * and no colons in prose.
 */

/** Threads that run through more than one chapter. Selecting one on the page
 *  lights the chapters it passes through. */
export const storyThreads = [
  "Machines",
  "Signals",
  "Models",
  "Systems",
  "Interfaces",
] as const;

export type StoryThread = (typeof storyThreads)[number];

export interface StoryChapter {
  id: string;
  /** Short mono line above the title. Decoded in as the chapter arrives. */
  kicker: string;
  title: string;
  /** Substring of `title` rendered in the cursive accent face, if present. */
  accent?: string;
  paragraphs: string[];
  threads: StoryThread[];
  /** Key into the glyph map. Each chapter draws a small schematic. */
  glyph: string;
}

export const storyIntro = {
  title: "The story so far",
  accent: "story",
  lead: "How it started and where it points. Follow the signal down, or pull one thread through every chapter.",
};

export const storyChapters: StoryChapter[] = [
  {
    id: "machines",
    kicker: "The start",
    title: "Machines that had to work",
    accent: "work",
    paragraphs: [
      "Competitive robotics was the first arena. Autonomous routines, drive control, and a season of iteration compressed into runs that either worked on the first try or did not count. I led software, then the team. A provincial championship, and Worlds twice.",
      "The lasting lesson was not mechanical. A system is only real once it survives contact with the field.",
    ],
    threads: ["Machines", "Systems"],
    glyph: "vex",
  },
  {
    id: "hinge",
    kicker: "The hinge",
    title: "Signals enter the picture",
    accent: "Signals",
    paragraphs: [
      "A wheelchair driven by brain signals. An OpenBCI headset fed raw EEG into a pipeline that filtered scalp noise, pulled frequency-band features, classified intent, smoothed the output, and drove the motors. It reached the top six nationally at HOSA.",
      "More importantly, it was the first project where robotics, biological signals, and human-computer interaction stopped being separate interests. Everything since has been downstream of this chair.",
    ],
    threads: ["Machines", "Signals", "Interfaces"],
    glyph: "eeg",
  },
  {
    id: "fifteen",
    kicker: "Age fifteen",
    title: "The system around the model",
    accent: "around",
    paragraphs: [
      "An AI consulting project with Microsoft, modelling operational behaviour inside AI data centres. The analysis projected over two billion dollars in potential annual savings.",
      "It was the first real lesson that the largest wins often sit in the system around the model, not in the model.",
    ],
    threads: ["Models", "Systems"],
    glyph: "datacenter",
  },
  {
    id: "sixteen",
    kicker: "Age sixteen",
    title: "Constraints as the product",
    accent: "Constraints",
    paragraphs: [
      "A software engineering internship at Zebra Technologies, building a medical documentation tool for low-compute medical hardware. There was no server to fall back to, so every modelling choice traded against latency on the device in hand. The constraint was the product.",
    ],
    threads: ["Systems", "Interfaces"],
    glyph: "handheld",
  },
  {
    id: "seventeen",
    kicker: "Age seventeen",
    title: "Behaviour in the data",
    accent: "Behaviour",
    paragraphs: [
      "A machine learning consulting role with Interac. A hundred thousand transactions became embeddings over purchase sequences, association structure across baskets, and recommenders reaching 0.87 AUC-ROC, grounding a financial coaching system for young people in how they actually spend.",
    ],
    threads: ["Models"],
    glyph: "embeddings",
  },
  {
    id: "research",
    kicker: "The research",
    title: "Learning to watch surgery",
    accent: "watch",
    paragraphs: [
      "Machine learning research at the Ophthalmology AI Lab, Mass Eye and Ear and Harvard Medical School. Cataract surgeons practise in wet labs, where video can be annotated densely. The question was whether that annotation could teach models representations that transfer to real clinical video, where no labels exist.",
      "Attention supervised by anatomy and instrument masks, temporal modelling over clip sequences, aggregation up to the level of a whole procedure. Supervision from practice shaping what a model attends to in the operating room.",
    ],
    threads: ["Models", "Signals"],
    glyph: "surgery",
  },
  {
    id: "experiments",
    kicker: "Built fast",
    title: "Experiments in public",
    accent: "Experiments",
    paragraphs: [
      "Alongside all of it, hackathons and side builds. CheetCode read a proctored screen and typed the answer back. AIcruiter ran interviews end to end with about a second of latency. Vursor turned plain English into video edits and earned a Y Combinator interview out of a field of fifteen hundred.",
      "Weekend builds prove a different thing than research does. Mostly they prove what you can ship while nothing is certain yet.",
    ],
    threads: ["Models", "Interfaces"],
    glyph: "experiments",
  },
  {
    id: "proof",
    kicker: "The proof",
    title: "Say it without saying it",
    accent: "without",
    paragraphs: [
      "jaw2control. Two IMUs at the jaw picked up the movement of speech that never becomes sound, a temporal network read phonetic structure out of that motion, and a camera routed the decoded command to whatever I was looking at. It answered one question. Physiological signals can carry intent to a machine.",
    ],
    threads: ["Signals", "Machines", "Interfaces"],
    glyph: "jaw",
  },
  {
    id: "now",
    kicker: "Now",
    title: "Origin",
    paragraphs: [
      "Software Engineering at the University of Waterloo, and Origin. Machine output is effectively infinite while human input still crawls through keyboards and speech. I am building the interface that removes that bottleneck, recovering intended language from the body's own signals.",
      "The signal continues.",
    ],
    threads: ["Signals", "Models", "Interfaces"],
    glyph: "origin",
  },
];
