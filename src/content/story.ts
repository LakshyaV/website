/**
 * The story page. A life in tech told in the site's own grammar, a signal
 * travelling a rail, resolving act by act into the current work.
 *
 * Structured as four acts whose headers chain into a single sentence, the
 * through-line stated outright. Chapters end by causing the next one where
 * the record supports it. Facts come from the owner directly or from
 * elsewhere on the site; the story arranges them and does not add claims.
 * House style applies, no em-dashes and no colons in prose.
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

export interface StoryAct {
  /** Mono label, e.g. "Act I". */
  label: string;
  /** One line of the chained sentence, set in the cursive face. */
  line: string;
  chapters: StoryChapter[];
}

export const storyIntro = {
  title: "The story so far",
  accent: "story",
  lead: "It starts with blocks on a screen at six years old and points at removing the interface entirely. Follow the signal down, or pull one thread through every chapter.",
};

export const storyActs: StoryAct[] = [
  {
    label: "Act I",
    line: "First I learned to speak to machines",
    chapters: [
      {
        id: "blocks",
        kicker: "Age six",
        title: "Blocks first, then Java",
        accent: "then",
        paragraphs: [
          "It started with block code, shapes snapped together on a screen until they did something. I was six, and the loop was irresistible. Change a thing, run it, watch the machine obey. Before long the blocks became Java, and the toys became programs.",
          "The obvious next step was telling everyone.",
        ],
        threads: ["Machines"],
        glyph: "blocks",
      },
      {
        id: "club",
        kicker: "Grade two",
        title: "Teaching it forward",
        accent: "forward",
        paragraphs: [
          "I started a coding club at school and taught fifth graders how to code. I was in grade two. Standing in front of kids three years older, turning what a machine does into words they could use, was my first interface problem. I have been working on that translation ever since.",
        ],
        threads: ["Interfaces"],
        glyph: "club",
      },
      {
        id: "fll",
        kicker: "Grade four",
        title: "Code gets a body",
        accent: "body",
        paragraphs: [
          "FIRST Lego League. The programs stopped living on screens and started pushing things around a mission table. A robot does not care how clever the code looks. It cares whether the wheels stop where the mission needs them.",
        ],
        threads: ["Machines"],
        glyph: "fll",
      },
    ],
  },
  {
    label: "Act II",
    line: "then I taught them to understand us",
    chapters: [
      {
        id: "vex",
        kicker: "Grades nine to eleven",
        title: "Machines that had to work",
        accent: "work",
        paragraphs: [
          "VEX Robotics. Autonomous routines, drive control, and a season of iteration compressed into runs that either worked on the first try or did not count. I led software, then the team. A provincial championship, and Worlds twice.",
          "Winning taught discipline. It did not answer the question that had started to nag, which ran in the other direction. Machines obeyed us fine. Could they understand us?",
        ],
        threads: ["Machines", "Systems"],
        glyph: "vex",
      },
      {
        id: "earlymodels",
        kicker: "The early models",
        title: "Reading people, badly at first",
        accent: "Reading",
        paragraphs: [
          "So I started building models that tried. A sign language detector that read hands. A classifier that guessed why a baby was crying from sound alone. A snake agent that taught itself to play. Small projects, simple by any research standard, and all of them the same experiment. Take a human signal that is not language and pull meaning out of it.",
        ],
        threads: ["Models", "Signals", "Interfaces"],
        glyph: "readmodels",
      },
      {
        id: "hinge",
        kicker: "The hinge",
        title: "Brain to motion",
        accent: "Brain",
        paragraphs: [
          "The same experiment, raised as high as I could take it. A wheelchair driven by brain signals. An OpenBCI headset fed raw EEG into a pipeline that filtered scalp noise, pulled frequency-band features, classified intent, smoothed the output, and drove the motors. It reached the top six nationally at HOSA.",
          "Robotics, biological signals, and human-computer interaction stopped being separate interests inside a single build. Everything since has been downstream of this chair.",
        ],
        threads: ["Machines", "Signals", "Interfaces"],
        glyph: "eeg",
      },
    ],
  },
  {
    label: "Act III",
    line: "then real systems tested both",
    chapters: [
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
        title: "A conversation becomes a partnership",
        accent: "conversation",
        paragraphs: [
          "Interac did not arrive through an application portal. I met someone, kept the conversation alive, and pushed until it became a real consulting partnership. Then the work had to be worth it. A hundred thousand transactions became embeddings over purchase sequences, association structure across baskets, and recommenders reaching 0.87 AUC-ROC, grounding a financial coaching system for young people in how they actually spend.",
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
    ],
  },
  {
    label: "Act IV",
    line: "now the interface itself is the work",
    chapters: [
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
          "The six year old snapping blocks together was teaching a machine to listen. The work has not changed. Only the signal has.",
        ],
        threads: ["Signals", "Models", "Interfaces"],
        glyph: "origin",
      },
    ],
  },
];

/** Flat view used by the rail, the index, and the thread filter. */
export const storyChapters: StoryChapter[] = storyActs.flatMap((act) => act.chapters);
