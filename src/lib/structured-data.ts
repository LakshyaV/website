import { site } from "@/content/site";

/** Person structured data. Only real, non-null profile URLs are included. */
export function personJsonLd() {
  const sameAs = Object.values(site.social).filter(
    (url): url is string => typeof url === "string",
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    description: site.description,
    jobTitle: "Machine learning researcher, engineer, and founder",
    knowsAbout: [
      "Machine learning",
      "Biosignal decoding",
      "Human-computer interaction",
      "Medical AI",
      "Robotics",
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
