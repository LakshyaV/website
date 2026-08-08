export const name = "seo-assets";

/**
 * The generated routes that nothing on the page links to, so nobody notices
 * when they break: sitemap, robots, the social card, and the favicon.
 *
 * The sitemap is also where a missing NEXT_PUBLIC_SITE_URL would surface, since
 * every entry would silently point at localhost.
 */
export async function run({ browser, baseUrl, check }) {
  const page = await browser.newPage();

  /* -------------------------------- sitemap -------------------------------- */
  {
    const res = await page.request.get(`${baseUrl}/sitemap.xml`);
    check("sitemap serves", res.status() === 200, `status ${res.status()}`);

    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    check("sitemap lists the home page", locs.some((l) => /\/?$/.test(l)), `${locs.length} urls`);
    check("sitemap lists the notes index", locs.some((l) => l.endsWith("/notes")), locs.join(" "));
    check(
      "sitemap urls are absolute",
      locs.length > 0 && locs.every((l) => /^https?:\/\//.test(l)),
      locs.join(" "),
    );
    check(
      "sitemap does not advertise a draft note",
      !locs.some((l) => l.includes("bandwidth")),
      locs.join(" "),
    );
  }

  /* -------------------------------- robots --------------------------------- */
  {
    const res = await page.request.get(`${baseUrl}/robots.txt`);
    check("robots serves", res.status() === 200, `status ${res.status()}`);

    const body = await res.text();
    check("robots allows crawling", /Allow:\s*\/$/m.test(body), body.split("\n")[1] ?? "");
    check("robots points at the sitemap", /Sitemap:\s*https?:\/\//.test(body), body.trim().split("\n").pop() ?? "");
  }

  /* ------------------------------ social card ------------------------------ */
  {
    const res = await page.request.get(`${baseUrl}/opengraph-image`);
    check("social card renders", res.status() === 200, `status ${res.status()}`);
    check(
      "social card is a png",
      (res.headers()["content-type"] ?? "").includes("image/png"),
      res.headers()["content-type"] ?? "none",
    );
    const bytes = (await res.body()).length;
    check("social card has real content", bytes > 5000, `${bytes} bytes`);
  }

  /* -------------------------------- favicon -------------------------------- */
  {
    const res = await page.request.get(`${baseUrl}/icon.svg`);
    check("favicon serves", res.status() === 200, `status ${res.status()}`);
    check(
      "favicon is an svg",
      (res.headers()["content-type"] ?? "").includes("svg"),
      res.headers()["content-type"] ?? "none",
    );
  }

  /* --------------------------- 404 stays unindexed -------------------------- */
  {
    await page.goto(`${baseUrl}/no-such-page`, { waitUntil: "networkidle" });
    const robots = await page.evaluate(
      () => document.querySelector("meta[name=robots]")?.content ?? "",
    );
    check("the 404 is noindex", robots.includes("noindex"), robots || "no robots meta");

    const canonical = await page.evaluate(
      () => document.querySelector("link[rel=canonical]")?.getAttribute("href") ?? "",
    );
    check("the 404 does not canonicalise to home", !/\/$/.test(canonical), canonical || "none");
  }

  await page.close();
}
