/**
 * Project content: three featured projects and the supporting index.
 *
 * `outcome` and `link` are optional — entries without them render without
 * those fields. Do not add placeholder values here; leave fields out until
 * real ones exist.
 */

export type FeaturedProject = {
  id: string;
  number: string;
  status: string;
  title: string;
  oneLiner: string;
  paragraphs: string[];
  facets: { term: string; detail: string }[];
  diagramCaption: string;
};

export const origin: FeaturedProject = {
  id: "origin",
  number: "01",
  status: "In development",
  title: "Origin",
  oneLiner: "A private, hands-free interface for communicating with AI.",
  paragraphs: [
    "Speaking to a machine still means speaking — out loud, in public, or through a keyboard. Origin is an attempt to remove that constraint: recovering intended language from subtle physiological and neuromuscular signals, so a sentence can travel from a person to an AI without being spoken, typed, or visibly gestured.",
    "The long-term form is a pair of lightweight glasses. Sensors resting where glasses naturally sit — temple, sideburn, ear — pick up the faint signals produced when language is formed but not voiced, and models decode them toward open-ended natural language rather than a fixed command set.",
    "An early proof of concept made the channel concrete: sensors near the jaw, an in-house signal dataset, temporal models, semantic decoding, and computer vision wired to device control. It was built quickly to answer one question — can physiological signals carry intent to a machine? They can.",
    "What that prototype proved is a channel. What remains is language. Open-ended silent decoding is unsolved, and that is the current work: signals captured around the glasses line, decoded into speech that never has to be said.",
  ],
  facets: [
    { term: "Domain", detail: "Neuromuscular & physiological signals" },
    { term: "Methods", detail: "Temporal ML · semantic decoding" },
    { term: "Hardware", detail: "Custom sensing, glasses form factor" },
    { term: "Status", detail: "Active research & engineering" },
  ],
  diagramCaption:
    "Conceptual architecture — signal to intended language. Illustrative only; not experimental data.",
};

export const surgical: FeaturedProject = {
  id: "surgical-intelligence",
  number: "02",
  status: "Research · Ophthalmology AI Lab, Mass Eye and Ear / Harvard Medical School",
  title: "Surgical intelligence",
  oneLiner: "Teaching models to watch surgery the way surgeons do.",
  paragraphs: [
    "Cataract surgeons train in wet labs, and wet-lab video can be annotated densely — anatomy, instruments, phases, frame by frame. Clinical video from the operating room has no such labels. The research question: can dense annotation from practice procedures teach a model representations that transfer to real clinical video?",
    "The approach is annotation-guided representation learning. Spatial attention is supervised by anatomy and instrument masks so the model learns where to look; temporal modeling runs over clip sequences to capture how procedures unfold; procedure-level aggregation turns clip representations into video-level classification. Supervision from the lab shapes what the model attends to in the operating room.",
  ],
  facets: [
    { term: "Domain", detail: "Surgical video · cataract procedures" },
    { term: "Methods", detail: "Supervised spatial attention · temporal modeling" },
    { term: "Objective", detail: "Wet-lab → clinical transfer" },
    { term: "Output", detail: "Video-level classification" },
  ],
  diagramCaption:
    "Source-to-target transfer pipeline. Conceptual — masks and frames are illustrative, not patient data.",
};

export const wheelchair: FeaturedProject = {
  id: "mind-controlled-wheelchair",
  number: "03",
  status: "HOSA — top six nationally",
  title: "Mind-controlled wheelchair",
  oneLiner: "A wheelchair driven by brain signals.",
  paragraphs: [
    "Built around an OpenBCI headset: raw EEG in, motion out. The pipeline filtered noisy scalp signals, extracted frequency-domain features, classified intentional control states, smoothed the output to keep the chair from stuttering, and drove the motors through embedded hardware. It reached the top six nationally at HOSA.",
    "It was also a hinge point — the first project where robotics, biological signals, and human-computer interaction stopped being separate interests. Origin descends from it.",
  ],
  facets: [
    { term: "Signals", detail: "EEG via OpenBCI" },
    { term: "Processing", detail: "Filtering · band-power features" },
    { term: "Control", detail: "Intent classification · smoothing" },
    { term: "Hardware", detail: "Embedded motor actuation" },
  ],
  diagramCaption: "Signal chain, acquisition to actuation. Conceptual illustration.",
};

export const featured = [origin, surgical, wheelchair];

export type IndexEntry = {
  title: string;
  context: string;
  description: string;
  outcome?: string;
};

export const projectIndex: IndexEntry[] = [
  {
    title: "VEX Robotics",
    context: "Software lead · team captain",
    description:
      "Autonomous routines, drive control, and season-long iteration under competition constraints — systems that have to work on the first try.",
    outcome: "Provincial champion · 2× Worlds qualifier",
  },
  {
    title: "Data-centre optimization",
    context: "Applied AI",
    description:
      "Modeling operational behavior in large data centres to surface efficiency gains with AI.",
    outcome: "Analysis projected $2B+ potential annual savings",
  },
  {
    title: "Zebra Technologies",
    context: "AI developer intern",
    description:
      "Applied AI development inside an enterprise engineering organization — while still in high school.",
  },
  {
    title: "Interac",
    context: "Recommendation & forecasting",
    description:
      "Recommendation and forecasting systems built through work with Interac.",
  },
  {
    title: "AIcruit",
    context: "Multimodal agent",
    description:
      "A multimodal AI interview agent — conducting and assessing structured interviews across modalities.",
  },
  {
    title: "Prompt-driven video editor",
    context: "Hackathon build",
    description:
      "Describe the cut in natural language; the system performs the edit. Built end-to-end in a weekend.",
  },
];
