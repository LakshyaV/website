import { watchErrors } from "../lib/harness.mjs";

export const name = "smoke";

/** Routes render, metadata is present, and nothing throws. */
export async function run({ browser, baseUrl, check }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = watchErrors(page);

  for (const [path, expected] of [
    ["/", 200],
    ["/notes", 200],
    ["/this-route-does-not-exist", 404],
  ]) {
    const response = await page.goto(baseUrl + path, { waitUntil: "networkidle" });
    check(`${path} responds ${expected}`, response.status() === expected, `got ${response.status()}`);
  }

  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector("meta[name=description]")?.content ?? "",
    ogImage: document.querySelector("meta[property='og:image']")?.content ?? "",
    jsonLd: document.querySelector("script[type='application/ld+json']")?.textContent ?? "",
    h1: document.querySelectorAll("h1").length,
    h2: document.querySelectorAll("h2").length,
    lang: document.documentElement.lang,
    imagesMissingAlt: [...document.querySelectorAll("img")].filter((i) => !i.alt).length,
    svgsMissingLabel: [...document.querySelectorAll("svg[role=img]")].filter(
      (s) => !s.getAttribute("aria-label"),
    ).length,
  }));

  check("title names the site owner", meta.title.includes("Lakshya Vasudeva"), meta.title);
  check("meta description present", meta.description.length > 50, `${meta.description.length} chars`);
  check("og:image present", meta.ogImage.length > 0, meta.ogImage);
  check("html lang is en", meta.lang === "en", meta.lang);
  check("exactly one h1", meta.h1 === 1, `found ${meta.h1}`);
  check("at least one h2", meta.h2 > 0, `found ${meta.h2}`);
  check("all images have alt text", meta.imagesMissingAlt === 0, `${meta.imagesMissingAlt} missing`);
  check(
    "all role=img svgs are labelled",
    meta.svgsMissingLabel === 0,
    `${meta.svgsMissingLabel} missing`,
  );

  let person = null;
  try {
    person = JSON.parse(meta.jsonLd);
  } catch {
    // handled by the check below
  }
  check("JSON-LD parses as a Person", person?.["@type"] === "Person", person?.["@type"] ?? "none");

  for (const path of ["/sitemap.xml", "/robots.txt"]) {
    const res = await page.request.get(baseUrl + path);
    check(`${path} serves`, res.status() === 200, `status ${res.status()}`);
  }

  // Every internal link should resolve.
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
  );
  const placeholders = links.filter(
    (href) => !href || href === "#" || /TODO|placeholder|example\.com/i.test(href),
  );
  check("no placeholder links", placeholders.length === 0, placeholders.join(", "));

  for (const href of [...new Set(links.filter((h) => h.startsWith("/")))]) {
    const res = await page.request.get(baseUrl + href);
    check(`internal link ${href} resolves`, res.status() < 400, `status ${res.status()}`);
  }

  const unexpected = errors.filter((e) => !e.includes("404"));
  check("no console or page errors", unexpected.length === 0, unexpected.slice(0, 3).join(" | "));

  await page.close();
}
