import { scrollThrough } from "../lib/harness.mjs";

export const name = "interactions";

/** Read the game's target pattern from the pip widths. 1 = long, 0 = short. */
const readPattern = (page) =>
  page.evaluate(() => {
    const game = document.querySelector(".channel-game");
    const groups = [...game.querySelectorAll("span.flex.items-center")];
    return [...groups[0].querySelectorAll("span")].map((el) =>
      el.className.includes("w-7") ? 1 : 0,
    );
  });

export async function run({ browser, baseUrl, check }) {
  /* ------------------------------ hero decode ----------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const seen = new Set();
    let sawScrambling = false;
    for (let i = 0; i < 170; i += 1) {
      const frame = await page.evaluate(() => ({
        text: document.querySelector("section p span[aria-hidden]")?.textContent.trim() ?? "",
        scrambled: document.querySelectorAll("span.decoding").length,
      }));
      if (frame.text) seen.add(frame.text);
      if (frame.scrambled > 0) sawScrambling = true;
      await page.waitForTimeout(60);
    }

    const roles = ["researcher", "engineer", "founder"].filter((r) => seen.has(r));
    check("hero resolves every role", roles.length === 3, roles.join(", "));
    check("hero passes through a noisy state", sawScrambling, String(sawScrambling));
    check("hero decodes rather than jumping", seen.size > 12, `${seen.size} distinct frames`);

    await page.close();
  }

  /* --------------------------- diagrams advance --------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });

    const progress = [];
    const packetX = [];
    for (const y of [0, 900, 1500, 2200, 3000]) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(220);
      const frame = await page.evaluate(() => {
        const plate = document.querySelector(".diagram-plate");
        const packet = plate?.querySelector(".d-packet");
        return {
          p: Number(plate?.style.getPropertyValue("--p") || 0),
          x: packet ? Math.round(packet.getBoundingClientRect().x) : 0,
        };
      });
      progress.push(frame.p);
      packetX.push(frame.x);
    }

    check(
      "diagram progress advances with scroll",
      Math.min(...progress) < 0.3 && Math.max(...progress) > 0.9,
      progress.map((n) => n.toFixed(2)).join(" to "),
    );
    check(
      "the packet travels the pipeline",
      Math.max(...packetX) - Math.min(...packetX) > 100,
      `${Math.min(...packetX)} to ${Math.max(...packetX)}`,
    );

    await page.close();
  }

  /* ------------------------------ thread rail ----------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await scrollThrough(page);

    const rail = page.locator(".thread-rail").first();
    await rail.scrollIntoViewIfNeeded();
    const chip = rail.getByRole("button").first();

    await chip.click();
    await page.waitForTimeout(200);
    const afterClick = await chip.getAttribute("aria-pressed");
    await page.mouse.move(10, 10);
    await page.waitForTimeout(350);
    const afterMoveAway = await chip.getAttribute("aria-pressed");

    check(
      "a thread stays selected after clicking",
      afterClick === "true" && afterMoveAway === "true",
      `click ${afterClick}, pointer away ${afterMoveAway}`,
    );

    const dimmed = await page.evaluate(() => {
      const rows = [...document.querySelectorAll(".thread-rail ~ div > div")];
      return rows.map((r) => Number(r.style.opacity || 1));
    });
    check(
      "non-matching entries recede but stay legible",
      dimmed.length > 0 && Math.min(...dimmed) >= 0.5,
      `min opacity ${Math.min(...dimmed)}`,
    );

    await chip.click();
    await page.waitForTimeout(200);
    check("clicking again clears the thread", (await chip.getAttribute("aria-pressed")) === "false");

    await chip.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(200);
    const viaKeyboard = await chip.getAttribute("aria-pressed");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const afterEscape = await chip.getAttribute("aria-pressed");
    check("thread rail is keyboard operable", viaKeyboard === "true", viaKeyboard);
    check("escape clears the thread", afterEscape === "false", afterEscape);

    await page.close();
  }

  /* ------------------------------- the game ------------------------------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await scrollThrough(page);

    const game = page.locator(".channel-game");
    await game.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const canvas = page.locator("canvas");
    const box = await canvas.boundingBox();
    const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

    const pulse = async (long) => {
      await page.mouse.move(centre.x, centre.y);
      await page.mouse.down();
      await page.waitForTimeout(long ? 420 : 110);
      await page.mouse.up();
      await page.waitForTimeout(220);
    };

    const scoreLine = () =>
      page.evaluate(() => document.querySelectorAll(".channel-game p")[1].textContent.trim());

    const before = await scoreLine();
    for (const kind of await readPattern(page)) await pulse(kind === 1);
    await page.waitForTimeout(400);
    const after = await scoreLine();

    check("playing the pattern scores", /Score (?!0\b)\d+/.test(after), after);
    check("a hit advances the round", before !== after, `${before} then ${after}`);

    const pattern = await readPattern(page);
    await pulse(pattern[0] !== 1);
    await page.waitForTimeout(400);
    const status = await page.evaluate(() =>
      [...document.querySelectorAll(".channel-game p")]
        .map((p) => p.textContent.trim())
        .find((t) => /lost|listening|hold|decoded/i.test(t)),
    );
    check("a wrong pulse is rejected", /lost/i.test(status ?? ""), status ?? "none");

    const painted = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      const data = c.getContext("2d").getImageData(0, 0, c.width, Math.min(c.height, 200)).data;
      let count = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) count += 1;
      return count;
    });
    check("the scope draws a live trace", painted > 500, `${painted} painted pixels`);

    await page.close();
  }
}
