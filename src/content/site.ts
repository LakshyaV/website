/**
 * Central site configuration.
 *
 * Everything identity-related lives here so it can be updated in one place.
 * Fields set to `null` are treated as "not yet available" and are never
 * rendered — replace them with real values when they exist.
 */

/**
 * Silently falling back to localhost in production would ship a live site whose
 * canonicals, sitemap, robots, and JSON-LD all point at localhost — a total SEO
 * failure with no build error. Fail the build instead.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel supplies this at build time, so a normal deploy needs no config.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  // Only hard-fail in an actual deploy: a plain local `next build` should still
  // work on a fresh clone. Guarded to the server so the client never diverges.
  const deploying = Boolean(process.env.VERCEL ?? process.env.CI);
  if (typeof window === "undefined" && process.env.NODE_ENV === "production" && deploying) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Set it to the deployed origin (e.g. https://example.com) so canonicals, the sitemap, robots, and JSON-LD do not point at localhost.",
    );
  }

  return "http://localhost:3000";
}

export const site = {
  name: "Lakshya Vasudeva",
  monogram: "LV",
  location: "Ontario, Canada",

  /** One-line identity used in metadata and structured data. */
  tagline: "Machine learning researcher, engineer, and founder.",

  description:
    "Lakshya Vasudeva is a machine learning researcher, engineer, and founder working on biosignals and new interfaces between human intent and machine intelligence. Currently building Origin; previously machine learning research on surgical video at Mass Eye and Ear / Harvard Medical School.",

  /**
   * Absolute site URL, used for metadata, canonicals, sitemap, robots, and
   * structured data. Set NEXT_PUBLIC_SITE_URL to the deployed domain (e.g. in
   * Vercel project settings); see resolveSiteUrl below for why it is enforced.
   */
  url: resolveSiteUrl(),

  email: "lakyvasu22@gmail.com",

  /** Social profiles. `null` entries are hidden from the UI. */
  social: {
    github: "https://github.com/LakshyaV",
    linkedin: "https://www.linkedin.com/in/lakshyav/" as string | null,
    x: null as string | null, // TODO: add X / Twitter profile URL
  },

  /** Path to a real resume file in /public, or null to hide the link. */
  resume: null as string | null, // TODO: add e.g. "/lakshya-vasudeva-resume.pdf"

  /** `secondary` items are hidden on the narrowest screens so the bar fits. */
  nav: [
    { label: "Work", href: "/#work", secondary: false },
    { label: "Projects", href: "/#projects", secondary: false },
    { label: "Notes", href: "/notes", secondary: true },
    { label: "Contact", href: "/#contact", secondary: false },
  ],
} as const;
