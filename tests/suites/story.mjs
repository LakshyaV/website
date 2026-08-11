import { scrollThrough } from "../lib/harness.mjs";

export const name = "story";

/**
 * The story page is a dated diary on a signal spine. What can break is
 * specific: the entries and the three chained section lines must render, the
 * spine must fill with scroll while entries fade in as they arrive, and all
 * of it must degrade to a complete, readable page without JavaScript or
 * motion.
 */
export async function run({ browser, baseUrl, check }) {
  /* ------------------------------ structure ------------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/story`, { waitUntil: "networkidle" });

    const shape = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent.trim() ?? "",
      entries: document.querySelectorAll("[data-entry]").length,
      stamps: [...document.querySelectorAll("[data-entry] span[aria-label]")].map(
        (el) => el.getAttribute("aria-label") ?? "",
      ),
      lines: [...document.querySelectorAll("main h2")].map((h) => h.textContent.trim()),
      closingHref:
        [...document.querySelectorAll("[data-entry] a")].pop()?.getAttribute("href") ?? "",
    }));

    check("story renders a heading", shape.h1.length > 0, shape.h1);
    check("the diary holds at least 25 entries", shape.entries >= 25, `${shape.entries} entries`);
    check(
      "every entry carries a stamp",
      shape.stamps.length === shape.entries && shape.stamps.every((s) => s.length > 0),
      `${shape.stamps.length} stamps`,
    );
    check(
      "three section lines chain the sentence",
      shape.lines.length === 3 &&
        shape.lines[0].startsWith("I was") &&
        shape.lines[1].startsWith("so I") &&
        shape.lines[2].startsWith("now I"),
      shape.lines.join(" | "),
    );
    check(
      "the last entry points at contact",
      shape.closingHref === "/#contact",
      shape.closingHref || "missing",
    );

    const navHref = await page.evaluate(
      () =>
        [...document.querySelectorAll("header nav a")]
          .find((a) => /story/i.test(a.textContent))
          ?.getAttribute("href") ?? "",
    );
    check("site nav links to the story", navHref === "/story", navHref || "missing");

    /* ---------------------------- spine motion ----------------------------- */
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });
    const rails = [];
    const entryP = [];
    for (const y of [0, 900, 2000, 99999]) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(200);
      const s = await page.evaluate(() => {
        const mid = document.querySelectorAll("[data-entry]")[14];
        return {
          rail: Number(
            document.querySelector(".story-rail")?.style.getPropertyValue("--rail") || 0,
          ),
          p: Number(mid?.style.getPropertyValue("--p") || 0),
        };
      });
      rails.push(s.rail);
      entryP.push(s.p);
    }
    check(
      "the spine fills as the page is travelled",
      rails[0] < 0.1 && rails[rails.length - 1] > 0.9,
      rails.map((n) => n.toFixed(2)).join(" to "),
    );
    check(
      "an entry resolves as it arrives",
      Math.min(...entryP) < 0.1 && Math.max(...entryP) >= 1,
      entryP.map((n) => n.toFixed(2)).join(" to "),
    );

    await page.close();
  }

  /* ------------------------------ without JS ------------------------------ */
  {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/story`, { waitUntil: "load" });

    const state = await page.evaluate(() => {
      const steps = [...document.querySelectorAll(".story-chapter .d-step")];
      const fill = document.querySelector(".story-spine-fill");
      return {
        entries: document.querySelectorAll("[data-entry]").length,
        minStep: Math.min(...steps.map((el) => Number(getComputedStyle(el).opacity))),
        spineFull: fill ? getComputedStyle(fill).transform : "missing",
        hasStamps: document.body.innerText.includes("GRADE TWO"),
      };
    });

    check("no-JS renders every entry", state.entries >= 25, `${state.entries}`);
    check("no-JS entries are fully visible", state.minStep > 0.99, `min ${state.minStep}`);
    check(
      "no-JS spine renders complete",
      state.spineFull === "none" || state.spineFull.includes("matrix(1,"),
      state.spineFull,
    );
    check("no-JS stamps render as final text", state.hasStamps, String(state.hasStamps));
    await context.close();
  }

  /* ---------------------------- reduced motion ---------------------------- */
  {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/story`, { waitUntil: "networkidle" });
    await scrollThrough(page);
    const min = await page.evaluate(() =>
      Math.min(
        ...[...document.querySelectorAll(".story-chapter .d-step")].map((el) =>
          Number(getComputedStyle(el).opacity),
        ),
      ),
    );
    check("reduced motion shows everything", min > 0.99, `min ${min}`);
    await context.close();
  }

  /* ------------------------------- sitemap -------------------------------- */
  {
    const page = await browser.newPage();
    const res = await page.request.get(`${baseUrl}/sitemap.xml`);
    const xml = await res.text();
    check("sitemap lists the story", xml.includes("/story"), "");
    await page.close();
  }
}
