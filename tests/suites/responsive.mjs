import { scrollThrough } from "../lib/harness.mjs";

export const name = "responsive";

const WIDTHS = [320, 360, 375, 768, 1024, 1440, 1920, 2560];

/**
 * The page must never scroll sideways, and a diagram must never be silently
 * clipped. Both have regressed before: grid items default to `min-width: auto`,
 * so a wide diagram can stretch its track past the viewport, and a hardcoded
 * breakpoint once hid the scroll hint on widths where the plate really did
 * overflow.
 */
export async function run({ browser, baseUrl, check }) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await scrollThrough(page);

    const horizontal = await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ left: 600, top: 300, behavior: "instant" });
      const scrolled = window.scrollX;
      window.scrollTo({ left: 0, top: 0, behavior: "instant" });
      return scrolled;
    });
    check(`${width}px does not scroll horizontally`, horizontal === 0, `scrollX ${horizontal}`);

    const plates = await page.evaluate(() =>
      [...document.querySelectorAll("figure.diagram-plate")].map((figure) => {
        const frame = figure.querySelector("div");
        const caption = figure.querySelector("figcaption");
        return {
          overflow: frame.scrollWidth - frame.clientWidth,
          hintShown: /Scroll/.test(caption?.textContent ?? ""),
        };
      }),
    );

    check(`${width}px renders every diagram plate`, plates.length === 4, `${plates.length} plates`);

    const silent = plates.filter((p) => p.overflow > 1 && !p.hintShown).length;
    check(`${width}px never clips a diagram silently`, silent === 0, `${silent} silent`);

    const falseHint = plates.filter((p) => p.overflow <= 1 && p.hintShown).length;
    check(`${width}px only hints when scrollable`, falseHint === 0, `${falseHint} false hints`);

    if (width >= 1024) {
      const clipped = plates.filter((p) => p.overflow > 1).length;
      check(
        `${width}px fits every diagram without scrolling`,
        clipped === 0,
        plates.map((p) => p.overflow).join(","),
      );
    }

    const nav = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      return [...document.querySelectorAll("nav a")]
        .filter((a) => a.getBoundingClientRect().right > viewport + 1)
        .map((a) => a.textContent.trim());
    });
    check(`${width}px keeps every nav item reachable`, nav.length === 0, nav.join(", "));

    await page.close();
  }
}
