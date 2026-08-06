import { scrollThrough } from "../lib/harness.mjs";

export const name = "a11y";

/**
 * The site has to stay usable without a mouse, without JavaScript, and without
 * motion. Each of those has caught a real defect: a nav indicator that stuck on
 * the wrong section, a caret that kept blinking under reduced motion, and
 * content that blanked out after hydration.
 */
export async function run({ browser, baseUrl, check }) {
  /* ------------------------------- keyboard ------------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const order = [];
    let missingOutline = 0;
    for (let i = 0; i < 10; i += 1) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return {
          label: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24),
          outlined: style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0,
        };
      });
      if (!focused) break;
      order.push(focused.label);
      if (!focused.outlined) missingOutline += 1;
    }

    check("skip link is the first tab stop", /skip/i.test(order[0] ?? ""), order[0] ?? "none");
    check("every focused element shows an outline", missingOutline === 0, `${missingOutline} without`);

    await page.close();
  }

  /* ------------------------------ without JS ------------------------------ */
  {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    const state = await page.evaluate(() => {
      const reveals = [...document.querySelectorAll("[data-reveal]")];
      const steps = [...document.querySelectorAll(".diagram-plate .d-step")];
      const game = document.querySelector(".channel-game");
      return {
        reveals: reveals.length,
        hiddenReveals: reveals.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9).length,
        minStepOpacity: Math.min(...steps.map((el) => parseFloat(getComputedStyle(el).opacity))),
        gameHidden: game ? getComputedStyle(game).display === "none" : false,
        emailPresent: Boolean(document.querySelector("a[href^='mailto:']")),
        textLength: document.body.innerText.length,
      };
    });

    check("content is readable without JS", state.hiddenReveals === 0, `${state.hiddenReveals}/${state.reveals} hidden`);
    check("diagrams render complete without JS", state.minStepOpacity > 0.99, `min ${state.minStepOpacity}`);
    check("the game hides itself without JS", state.gameHidden, String(state.gameHidden));
    check("contact email is present without JS", state.emailPresent, String(state.emailPresent));
    check("page has substantial text without JS", state.textLength > 4000, `${state.textLength} chars`);

    await context.close();
  }

  /* ---------------------------- reduced motion ---------------------------- */
  {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await scrollThrough(page);

    const state = await page.evaluate(() => {
      const steps = [...document.querySelectorAll(".diagram-plate .d-step")];
      return {
        role: document.querySelector("section p span[aria-hidden]")?.textContent.trim() ?? "",
        scrambled: document.querySelectorAll("span.decoding").length,
        minStepOpacity: Math.min(...steps.map((el) => parseFloat(getComputedStyle(el).opacity))),
      };
    });

    check("hero role stays static under reduced motion", state.role === "researcher", state.role);
    check("no scrambling under reduced motion", state.scrambled === 0, `${state.scrambled} chars`);
    check("diagrams fully visible under reduced motion", state.minStepOpacity > 0.99, `min ${state.minStepOpacity}`);

    await context.close();
  }

  /* --------------------------- nav section state --------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    });
    await page.waitForTimeout(600);
    const atBottom = await page.evaluate(() =>
      [...document.querySelectorAll("nav a[aria-current]")].map((a) => a.textContent.trim()),
    );
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(700);
    const atTop = await page.evaluate(() =>
      [...document.querySelectorAll("nav a[aria-current]")].map((a) => a.textContent.trim()),
    );

    check("nav marks a section at the page bottom", atBottom.length === 1, atBottom.join(", "));
    check("nav clears its marker at the page top", atTop.length === 0, atTop.join(", "));

    await page.close();
  }
}
