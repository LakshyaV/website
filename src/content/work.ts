import type { Featured, IndexEntry } from "./types";

/**
 * Professional and research work. Origin and the Harvard research get full
 * treatment; earlier roles run as a dense editorial index.
 */

export const origin: Featured = {
  number: "01",
  status: "Founding · in development",
  title: "Origin",
  oneLiner: "A private, hands-free interface for communicating with AI.",
  paragraphs: [
    "Speaking to a machine still means speaking — out loud, in public, or through a keyboard. Origin is an attempt to remove that constraint: recovering intended language from subtle physiological and neuromuscular signals, so a sentence can travel from a person to an AI without being spoken, typed, or visibly gestured.",
    "The long-term form is a pair of lightweight glasses. Sensors resting where glasses naturally sit — temple, sideburn, ear — pick up the faint signals produced when language is formed but not voiced, and models decode them toward open-ended natural language rather than a fixed command set.",
    "jaw2control was the proof that the channel exists at all: IMUs at the jaw, an in-house dataset, a temporal model reading phonetic structure out of movement, and a camera deciding which device the command belonged to. It answered one question — can physiological signals carry intent to a machine? They can.",
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

export const surgical: Featured = {
  number: "02",
  status:
    "Machine learning research intern · Ophthalmology AI Lab, Mass Eye and Ear / Harvard Medical School",
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

/** Capability vocabulary for the work thread rail. */
export const workCapabilities = [
  "Temporal models",
  "Recommender systems",
  "Medical AI",
  "On-device",
  "Systems optimization",
];

export const workIndex: IndexEntry[] = [
  {
    title: "Interac",
    context: "Machine learning consultant · partnership project",
    annotation: "17",
    description:
      "Behavioural modelling over payments data: what people buy together, and what they are about to need next.",
    bullets: [
      "Analyzed 100K+ transactions to surface purchasing patterns and behavioural segments",
      "Word2Vec embeddings over transaction sequences and FP-Growth association mining for market-basket structure",
      "LSTM and neural collaborative filtering recommenders reaching 0.87 AUC-ROC",
      "A youth-focused financial coaching system grounding personalized guidance in learned spending embeddings",
    ],
    capabilities: ["Temporal models", "Recommender systems"],
  },
  {
    title: "Zebra Technologies",
    context: "Software engineering intern",
    annotation: "16",
    description:
      "A medical documentation tool running on Zebra's low-compute medical hardware — the constraint was the product.",
    bullets: [
      "Built documentation tooling targeted at a constrained on-device compute budget",
      "Traded model and runtime cost against latency on hardware that could not fall back to a server",
    ],
    capabilities: ["On-device", "Medical AI"],
  },
  {
    title: "Microsoft",
    context: "AI consulting project",
    annotation: "15",
    description:
      "Modelling operational behaviour inside AI data centres to find efficiency that was being left on the table.",
    bullets: [
      "Analysis projected $2B+ in potential annual savings across data-centre operations",
      "First real lesson that the largest wins are often in the system around the model, not the model",
    ],
    capabilities: ["Systems optimization"],
  },
];
