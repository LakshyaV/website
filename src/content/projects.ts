import type { Featured, IndexEntry } from "./types";

/** Things built outside of work. jaw2control and the wheelchair get diagrams. */

export const jaw2control: Featured = {
  id: "jaw2control",
  number: "01",
  status: "Origin's predecessor",
  title: "jaw2control",
  oneLiner: "Silent commands to whatever you happen to be looking at.",
  paragraphs: [
    "Controlling AI still means speaking or typing. Neither works in a room full of people, and typing means going back to a screen. jaw2control was the first attempt at a third option: say it without saying it.",
    "Two IMUs at the jaw pick up the movement of speech that never becomes sound. A temporal convolutional network, trained on a dataset recorded in-house, reads phonetic structure out of that movement, and the recovered units are decoded semantically into the sentence that was intended.",
    "The other half is addressing. An OAK-1 camera identifies what the wearer is looking at and routes the decoded command there — glance at a laptop and it becomes a software action, glance at a circuit and it drives hardware. Intent and target arrive together, which is what makes it usable without a screen.",
  ],
  facets: [
    { term: "Sensing", detail: "2× IMU at the jaw" },
    { term: "Model", detail: "TCN over in-house dataset" },
    { term: "Decoding", detail: "Phonetic units → intended speech" },
    { term: "Targeting", detail: "OAK-1 vision → device routing" },
  ],
  diagramCaption:
    "Signal path and command routing. Conceptual illustration; not recorded sensor data.",
};

export const wheelchair: Featured = {
  id: "mind-controlled-wheelchair",
  number: "02",
  status: "HOSA — top six nationally",
  title: "Mind-controlled wheelchair",
  oneLiner: "A wheelchair driven by brain signals.",
  paragraphs: [
    "Built around an OpenBCI headset: raw EEG in, motion out. The pipeline filtered noisy scalp signals, extracted frequency-domain features, classified intentional control states, smoothed the output to keep the chair from stuttering, and drove the motors through embedded hardware. It reached the top six nationally at HOSA.",
    "It was also a hinge point — the first project where robotics, biological signals, and human-computer interaction stopped being separate interests. Everything since has been downstream of it.",
  ],
  facets: [
    { term: "Signals", detail: "EEG via OpenBCI" },
    { term: "Processing", detail: "Filtering · band-power features" },
    { term: "Control", detail: "Intent classification · smoothing" },
    { term: "Hardware", detail: "Embedded motor actuation" },
  ],
  diagramCaption: "Signal chain, acquisition to actuation. Conceptual illustration.",
};

export const featuredProjects = [jaw2control, wheelchair];

/** Capability vocabulary for the projects thread rail. */
export const projectCapabilities = [
  "LLM agents",
  "Real-time systems",
  "Computer vision",
  "Video understanding",
  "Embedded",
];

export const projectIndex: IndexEntry[] = [
  {
    title: "AIcruiter",
    context: "Autonomous interview agent",
    description:
      "Interviews are biased and expensive, so the agent conducts them end to end — and the hard part is making a conversation feel like one.",
    bullets: [
      "HR configures an agent against the role and candidate; the candidate gets a link live for 48 hours",
      "Audio streams to Deepgram speech-to-text, with live transcripts fed to a streaming Gemini model so it reasons while the candidate is still talking (~1s latency)",
      "Retrieval over the résumé and company values shapes follow-up questions in real time",
      "Speech synthesis drives a Tavus-rendered agent; a semantic regression model scores the transcript and results are returned automatically",
    ],
    capabilities: ["LLM agents", "Real-time systems"],
  },
  {
    title: "Vursor",
    context: "Cursor, for video editing",
    annotation: "YC interview · 1500+ hackers",
    description:
      "Describe the edit and the system performs it: “zoom in on X when he puts the drink down” resolves to a moment in the timeline and an operation applied to it.",
    bullets: [
      "Grounds natural-language edit instructions against the actual contents of the footage",
      "Interviewed by Y Combinator out of a 1500+ person field; it did not reach the final three — too broad a market, and too thin a differentiator against other AI editors",
    ],
    capabilities: ["Video understanding", "LLM agents"],
  },
  {
    title: "CheetCode",
    context: "Chrome extension",
    description:
      "Reads the screen during a technical interview, solves the problem, and drives the keyboard to type the answer — including staying under the platform's cheating detection.",
    bullets: [
      "Screen understanding and synthetic input control running against a live proctored session",
      "An honest look at how little a remote coding screen actually verifies",
    ],
    capabilities: ["Computer vision", "Real-time systems"],
  },
  {
    title: "VEX Robotics",
    context: "Software lead · team captain",
    annotation: "Provincial champion · 2× Worlds",
    description:
      "Autonomous routines, drive control, and season-long iteration under competition constraints — systems that have to work on the first try.",
    capabilities: ["Embedded"],
  },
];
