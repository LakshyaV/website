import type { MetadataRoute } from "next";

import { site } from "@/content/site";
import { getNotes } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/notes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...getNotes().map((note) => ({
      url: `${site.url}/notes/${note.slug}`,
      lastModified: note.date ? new Date(`${note.date}T00:00:00Z`) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
