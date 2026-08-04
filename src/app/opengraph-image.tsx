import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic social card, generated at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#e9e7e2",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5b5952",
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 940,
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #232326",
            paddingTop: 24,
            fontSize: 19,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8f8d86",
          }}
        >
          <span>Origin · Surgical ML · Interfaces</span>
          <span>Ontario, Canada</span>
        </div>
      </div>
    ),
    size,
  );
}
