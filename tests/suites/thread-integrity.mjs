import { scrollThrough } from "../lib/harness.mjs";

export const name = "thread-integrity";

/**
 * The thread rails are driven by string matching between an entry's
 * `capabilities` and its section's capability list. A typo in either place
 * fails silently: the chip filters to nothing, or an entry can never be
 * surfaced. Neither throws, and neither is visible unless you click every chip.
 *
 * So click every chip, on every rail, and assert the relationship holds.
 */
export async function run({ browser, baseUrl, check }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await scrollThrough(page);

  const railCount = await page.locator(".thread-rail").count();
  check("both sections have a thread rail", railCount === 2, `${railCount} rails`);

  for (let index = 0; index < railCount; index += 1) {
    const rail = page.locator(".thread-rail").nth(index);
    await rail.scrollIntoViewIfNeeded();

    const chips = rail.getByRole("button");
    const chipCount = await chips.count();
    check(`rail ${index + 1} has capability chips`, chipCount > 0, `${chipCount} chips`);

    const matchedByAnyChip = new Set();
    let totalEntries = 0;

    for (let c = 0; c < chipCount; c += 1) {
      const chip = chips.nth(c);
      const label = (await chip.textContent())?.trim() ?? `chip ${c}`;

      await chip.click();
      await page.waitForTimeout(120);

      const rows = await page.evaluate((railIndex) => {
        const list = document.querySelectorAll(".thread-rail")[railIndex].nextElementSibling;
        return [...list.children].map((row) => ({
          opacity: Number(row.style.opacity || 1),
          title: row.querySelector("h3")?.textContent.trim() ?? "",
        }));
      }, index);

      totalEntries = rows.length;
      const matches = rows.filter((r) => r.opacity > 0.9);
      matches.forEach((m) => matchedByAnyChip.add(m.title));

      check(
        `"${label}" matches at least one entry`,
        matches.length > 0,
        `${matches.length}/${rows.length}`,
      );
      check(
        `"${label}" is a filter, not a no-op`,
        matches.length < rows.length,
        `${matches.length}/${rows.length} matched`,
      );

      // The counter in the rail should agree with what is actually shown.
      const status = (await rail.getByRole("status").textContent())?.trim() ?? "";
      const reported = Number(status.split(" ")[0]);
      check(
        `"${label}" counter agrees with the list`,
        reported === matches.length,
        `${status} vs ${matches.length} lit`,
      );

      await chip.click();
      await page.waitForTimeout(80);
    }

    check(
      `rail ${index + 1} leaves no entry unreachable`,
      matchedByAnyChip.size === totalEntries,
      `${matchedByAnyChip.size}/${totalEntries} reachable`,
    );
  }

  await page.close();
}
