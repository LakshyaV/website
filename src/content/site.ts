/**
 * Central site configuration.
 *
 * Everything identity-related lives here so it can be updated in one place.
 * Fields set to `null` are treated as "not yet available" and are never
 * rendered — replace them with real values when they exist.
 */

export const site = {
  name: "Lakshya Vasudeva",
  monogram: "LV",
  location: "Ontario, Canada",

  /** One-line identity used in metadata and structured data. */
  tagline: "Machine learning researcher, engineer, and founder.",

  description:
    "Lakshya Vasudeva is an engineer and researcher working on machine learning, biosignals, and new interfaces between human intent and machine intelligence. Currently building Origin and researching ML for surgical video.",

  /**
   * Absolute site URL, used for metadata, sitemap, and structured data.
   * Set NEXT_PUBLIC_SITE_URL to the deployed domain (e.g. in Vercel project
   * settings). Falls back to localhost for local builds.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  email: "lakyvasu22@gmail.com",

  /** Social profiles. `null` entries are hidden from the UI. */
  social: {
    github: "https://github.com/LakshyaV",
    linkedin: null as string | null, // TODO: add LinkedIn profile URL
    x: null as string | null, // TODO: add X / Twitter profile URL
  },

  /** Path to a real resume file in /public, or null to hide the link. */
  resume: null as string | null, // TODO: add e.g. "/lakshya-vasudeva-resume.pdf"

  /** `secondary` items are hidden on the narrowest screens so the bar fits. */
  nav: [
    { label: "Work", href: "/#work", secondary: false },
    { label: "Projects", href: "/#projects", secondary: false },
    { label: "About", href: "/#about", secondary: true },
    { label: "Notes", href: "/notes", secondary: false },
    { label: "Contact", href: "/#contact", secondary: false },
  ],
} as const;
