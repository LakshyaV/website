/** Shared shapes for work and project content. */

export type Facet = { term: string; detail: string };

/** A project or role given full-width treatment with its own diagram. */
export type Featured = {
  id: string;
  number: string;
  status: string;
  title: string;
  oneLiner: string;
  paragraphs: string[];
  facets: Facet[];
  diagramCaption: string;
};

/**
 * A compact index entry. `capabilities` drives the interactive thread rail —
 * every value must also appear in that section's capability list.
 */
export type IndexEntry = {
  title: string;
  context: string;
  /** Right-hand editorial annotation: an age, an outcome, a result. */
  annotation?: string;
  description: string;
  bullets?: string[];
  capabilities: string[];
};
