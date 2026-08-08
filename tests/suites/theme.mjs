export const name = "theme";

/**
 * Dark is the default identity, light is opt-in and remembered.
 *
 * The interesting part is ordering. The theme is written by an inline script
 * before first paint, so a stored light preference must never flash dark. The
 * same script sets `js`, which arms the scroll reveals. Applying that after
 * hydration used to blank content that had already painted.
 */
export async function run({ browser, baseUrl, check }) {
  /* ------------------------------ defaults -------------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const state = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      background: getComputedStyle(document.body).backgroundColor,
    }));
    check("defaults to dark", state.theme === "dark", state.theme ?? "unset");

    const toggle = page.locator("button[aria-label*='theme']");
    const labelBefore = await toggle.getAttribute("aria-label");
    await toggle.click();
    await page.waitForTimeout(250);

    const after = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      stored: window.localStorage.getItem("theme"),
      background: getComputedStyle(document.body).backgroundColor,
    }));
    const labelAfter = await toggle.getAttribute("aria-label");

    check("toggling switches to light", after.theme === "light", after.theme ?? "unset");
    check("the choice is stored", after.stored === "light", after.stored ?? "nothing");
    check("the background actually changes", after.background !== state.background, `${state.background} to ${after.background}`);
    check("the toggle label reflects state", labelBefore !== labelAfter, `${labelBefore} to ${labelAfter}`);

    await page.reload({ waitUntil: "networkidle" });
    const persisted = await page.evaluate(() => document.documentElement.dataset.theme);
    check("the choice survives a reload", persisted === "light", persisted ?? "unset");

    await page.close();
  }

  /* --------------------- applied before the first paint -------------------- */
  {
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    await context.addInitScript(() => window.localStorage.setItem("theme", "light"));
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

    const early = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      js: document.documentElement.classList.contains("js"),
    }));

    check("stored theme is set before paint", early.theme === "light", early.theme ?? "unset");
    check("the js class is set before paint", early.js, String(early.js));

    // Nothing should start visible and then be hidden: that is the reveal flash.
    const flashed = await page.evaluate(async () => {
      const el = document.querySelector("section [data-reveal]");
      const samples = [];
      for (let i = 0; i < 20; i += 1) {
        samples.push(Number(getComputedStyle(el).opacity));
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return samples;
    });
    const startedVisibleThenHid = flashed[0] > 0.9 && flashed.some((o) => o < 0.1);
    check("content does not flash out after hydration", !startedVisibleThenHid, `first ${flashed[0]}`);

    await context.close();
  }
}
