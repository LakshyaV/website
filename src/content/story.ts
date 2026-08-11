/**
 * The story page. A life told the way a life actually accumulates, in small
 * dated entries, the misses kept in beside the wins. Three section lines
 * chain into one sentence and carry the emotional argument.
 *
 * Facts come from the owner directly or from elsewhere on the site. A few
 * lines are voice rather than record (the ones that say how something felt);
 * the owner should read those closely and edit freely. House style applies,
 * no em-dashes and no colons in prose.
 *
 * Stamps are ages, grades, or places as the owner tells them. No dates are
 * invented.
 */

export interface StoryEntry {
  /** Mono time-or-place marker in the left column. */
  stamp: string;
  text: string;
  /** Optional trailing link rendered after the text. */
  link?: { label: string; href: string };
}

export interface StorySection {
  /** One line of the chained sentence, set in the cursive face. */
  line: string;
  entries: StoryEntry[];
}

export const storyIntro = {
  title: "The story so far",
  accent: "story",
  lead: "Everything below actually happened, in order. The short version.",
};

export const storySections: StorySection[] = [
  {
    line: "I was always the youngest in the room",
    entries: [
      { stamp: "Zero", text: "Born in Ontario." },
      {
        stamp: "Six",
        text: "Found block code. Snapped shapes together until the screen did what I said. Watched a thing I made actually move.",
      },
      {
        stamp: "Six",
        text: "Outgrew the blocks and started typing Java for real. The toys became programs.",
      },
      {
        stamp: "Grade two",
        text: "Started a coding club at school and taught it myself. My students were in grade five. I was seven, explaining loops to kids a head taller than me.",
      },
      {
        stamp: "Grade two",
        text: "First lesson about interfaces, learned in a classroom. It does not matter what a machine can do if you cannot put it into words a person understands.",
      },
      {
        stamp: "Grade four",
        text: "FIRST Lego League. The code got wheels. The robot did not care how clever I was, only whether it stopped where the mission needed it.",
      },
      {
        stamp: "Grade nine",
        text: "Joined VEX robotics and found out what a season clock does to a codebase.",
      },
      {
        stamp: "VEX years",
        text: "Software lead, then team captain. A provincial championship. Worlds, twice. A run either works on the first try or it does not count.",
      },
      {
        stamp: "Meanwhile",
        text: "Built a sign language detector that read hands. The first time I pulled words out of a body instead of a keyboard.",
      },
      {
        stamp: "Meanwhile",
        text: "Built a classifier that guessed why a baby was crying. It was wrong a lot. It was also the point. A cry is a signal, and signals carry meaning.",
      },
      {
        stamp: "Meanwhile",
        text: "Taught a snake to play itself with reinforcement learning. Small, useless, completely formative.",
      },
    ],
  },
  {
    line: "so I let the building do the talking",
    entries: [
      {
        stamp: "High school",
        text: "Built a mind-controlled wheelchair around an OpenBCI headset. Raw EEG in, motion out.",
      },
      {
        stamp: "Nationals",
        text: "Top six in the country at HOSA. Not first. The chair mattered more than the placing. Robotics, biosignals, and interfaces stopped being separate hobbies that week.",
      },
      {
        stamp: "Fifteen",
        text: "Microsoft took an AI consulting project from a fifteen year old. Modelled data centre operations, projected two billion dollars in annual savings, and learned that the real wins sit in the system around the model.",
      },
      {
        stamp: "Sixteen",
        text: "Zebra Technologies. Medical documentation tooling for hardware with no server to lean on. Learned to love a compute budget.",
      },
      {
        stamp: "Seventeen",
        text: "Met someone from Interac and would not let the conversation die. It became a real partnership project. A hundred thousand transactions, embeddings over purchase behaviour, recommenders at 0.87 AUC-ROC.",
      },
      {
        stamp: "Seventeen",
        text: "Rooms do not open for you at this age. You open them.",
      },
      {
        stamp: "Hackathons",
        text: "CheetCode. An AI that beats the coding interview by reading the screen and typing the answer back. Partly a tool, mostly an argument about what the interview actually measures.",
      },
      {
        stamp: "Hackathons",
        text: "AIcruiter. Interviews run end to end by an agent that answers in about a second.",
      },
      {
        stamp: "Hackathons",
        text: "Vursor. Plain English in, video edits out. Y Combinator called. An interview, out of fifteen hundred builders.",
      },
      {
        stamp: "And then",
        text: "YC passed. Too broad a market, too thin an edge. The first no that stung.",
      },
      {
        stamp: "Harvard",
        text: "Mass Eye and Ear, Harvard Medical School. Research on surgical video, wet lab annotation teaching models to watch real operating rooms. The signals got higher stakes.",
      },
    ],
  },
  {
    line: "now I am teaching machines to listen",
    entries: [
      {
        stamp: "The proof",
        text: "jaw2control. Two sensors on the jaw, a temporal network, a camera watching where I look. I said a sentence without making a sound and the right device obeyed.",
      },
      {
        stamp: "The question",
        text: "Machine output became effectively infinite. Human input still moves at typing speed. Somebody has to remove that bottleneck.",
      },
      {
        stamp: "Now",
        text: "Building Origin. Recovering intended language from the body's own signals, sensors where glasses already sit.",
      },
      {
        stamp: "Now",
        text: "Software Engineering at the University of Waterloo. The youngest in the room thing is expiring. The work is not.",
      },
      {
        stamp: "Next",
        text: "This entry is not written yet.",
        link: { label: "Be part of it", href: "/#contact" },
      },
    ],
  },
];

/** Flat count used by the page and tests. */
export const storyEntryCount = storySections.reduce((n, s) => n + s.entries.length, 0);
