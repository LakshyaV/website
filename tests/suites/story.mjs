import { scrollThrough } from "../lib/harness.mjs";

export const name = "story";

/**
 * The story page is the site's grammar applied to a life. What can break is
 * specific: the rail must advance with scroll, chapters must light as they
 * arrive, thread filtering must dim exactly the chapters that lack the
 * thread, and all of it must degrade to a complete, readable page without
 * JavaScript or motion.
 */
export async function run({ browser, baseUrl, check }) {
  /* ------------------------------ structure ------------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${baseUrl}/story`, { waitUntil: "networkidle" });

    const shape = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent.trim() ?? "",
      chapters: [...document.querySelectorAll("[data-chapter]")].map((el) => el.id),
      h3s: document.querySelectorAll("[data-chapter] h3").length,
      acts: [...document.querySelectorAll("main section header h2")].map((h) => h.textContent.trim()),
      glyphs: document.querySelectorAll("[data-chapter] svg").length,
      navLinks: [...document.querySelectorAll("nav[aria-label=Chapters] a")].map((a) =>
        a.getAttribute("href"),
      ),
      threadButtons: document.querySelectorAll(".story-threads button").length,
    }));

    check("story renders a heading", shape.h1.length > 0, shape.h1);
    check("thirteen chapters render", shape.chapters.length === 13, shape.chapters.join(","));
    check("every chapter has a title", shape.h3s === 13, `${shape.h3s} titles`);
    check("every chapter draws a glyph", shape.glyphs === 13, `${shape.glyphs} glyphs`);
    check(
      "four act headers chain the through-line",
      shape.acts.length === 4 &&
        shape.acts[0].startsWith("First") &&
        shape.acts[1].startsWith("then") &&
        shape.acts[2].startsWith("then") &&
        shape.acts[3].startsWith("now"),
      shape.acts.join(" | "),
    );
    check(
      "the index links to every chapter",
      shape.navLinks.length === 13 &&
        shape.navLinks.every((href, i) => href === `#${shape.chapters[i]}`),
      shape.navLinks.join(" "),
    );
    check("five threads are offered", shape.threadButtons === 5, `${shape.threadButtons}`);

    // Site nav points here now.
    const navHref = await page.evaluate(
      () =>
        [...document.querySelectorAll("header nav a")]
          .find((a) => /story/i.test(a.textContent))
          ?.getAttribute("href") ?? "",
    );
    check("site nav links to the story", navHref === "/story", navHref || "missing");

    /* ---------------------------- rail motion ----------------------------- */
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });
    const rails = [];
    const chapterP = [];
    for (const y of [0, 1200, 2600, 99999]) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(200);
      const s = await page.evaluate(() => ({
        rail: Number(document.querySelector(".story-rail")?.style.getPropertyValue("--rail") || 0),
        p3: Number(document.getElementById("fifteen")?.style.getPropertyValue("--p") || 0),
      }));
      rails.push(s.rail);
      chapterP.push(s.p3);
    }
    check(
      "the rail fills as the page is travelled",
      rails[0] < 0.1 && rails[rails.length - 1] > 0.9,
      rails.map((n) => n.toFixed(2)).join(" to "),
    );
    check(
      "a chapter resolves as it arrives",
      Math.min(...chapterP) < 0.1 && Math.max(...chapterP) >= 1,
      chapterP.map((n) => n.toFixed(2)).join(" to "),
    );

    // The index tracks the current chapter once deep into the page.
    const current = await page.evaluate(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              document
                .querySelector("nav[aria-label=Chapters] a[aria-current]")
                ?.getAttribute("href") ?? "",
            ),
          400,
        ),
      );
    });
    check("the index tracks the current chapter", current === "#now", current || "none");

    /* -------------------------- thread filtering --------------------------- */
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Signals" }).click();
    await page.waitForTimeout(600);

    const filtered = await page.evaluate(() =>
      [...document.querySelectorAll("[data-chapter]")].map((el) => ({
        id: el.id,
        dim: el.getAttribute("data-dim") === "true",
      })),
    );
    const dimmed = filtered.filter((c) => c.dim).map((c) => c.id);
    const lit = filtered.filter((c) => !c.dim).map((c) => c.id);
    check(
      "pulling Signals lights exactly the chapters that carry it",
      lit.join(",") === "earlymodels,hinge,research,proof,now",
      `lit ${lit.join(",")} dim ${dimmed.join(",")}`,
    );

    const floor = await page.evaluate(() =>
      Math.min(
        ...[...document.querySelectorAll('[data-chapter][data-dim="true"]')].map((el) =>
          Number(getComputedStyle(el).opacity),
        ),
      ),
    );
    check("dimmed chapters stay legible", floor >= 0.35, `floor ${floor}`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const cleared = await page.evaluate(
      () => document.querySelectorAll('[data-chapter][data-dim="true"]').length,
    );
    check("escape clears the thread", cleared === 0, `${cleared} still dim`);

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
        chapters: document.querySelectorAll("[data-chapter]").length,
        minStep: Math.min(...steps.map((el) => Number(getComputedStyle(el).opacity))),
        spineFull: fill ? getComputedStyle(fill).transform : "missing",
        threadsHidden: (() => {
          const el = document.querySelector(".story-threads");
          return el ? getComputedStyle(el).display === "none" : false;
        })(),
      };
    });

    check("no-JS renders all chapters", state.chapters === 13, `${state.chapters}`);
    check("no-JS chapters are fully lit", state.minStep > 0.99, `min ${state.minStep}`);
    check(
      "no-JS spine renders complete",
      state.spineFull === "none" || state.spineFull.includes("matrix(1,"),
      state.spineFull,
    );
    check("no-JS hides the thread legend", state.threadsHidden, String(state.threadsHidden));
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
