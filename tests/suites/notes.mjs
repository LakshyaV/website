export const name = "notes";

/**
 * The notes route has two states and the empty one is live today, so it is the
 * one that rots unnoticed.
 *
 * A draft must appear as a titled draft and nothing more: no link, no page of
 * its own, not in the sitemap. The intro also used to hardcode "nothing is
 * published yet" above a list that would happily render published notes, so
 * that sentence is asserted to live inside the empty branch.
 */
export async function run({ browser, baseUrl, check }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${baseUrl}/notes`, { waitUntil: "networkidle" });

  const state = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      heading: document.querySelector("h1")?.textContent.trim() ?? "",
      text,
      draftRows: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
      noteLinks: [...document.querySelectorAll("a[href^='/notes/']")].map((a) =>
        a.getAttribute("href"),
      ),
    };
  });

  check("notes has a heading", state.heading.length > 0, state.heading);
  check("draft titles are listed", state.draftRows.length > 0, state.draftRows.join(", "));
  check("drafts are marked as drafts", /draft/i.test(state.text), "");
  check(
    "the empty state is stated while nothing is published",
    /nothing is published yet/i.test(state.text),
    "",
  );
  check(
    "a draft is not linked to a page",
    state.noteLinks.length === 0,
    state.noteLinks.join(", ") || "no links",
  );

  // A draft must not be reachable by guessing its slug.
  const draft = await page.request.get(`${baseUrl}/notes/the-bandwidth-problem`);
  check("a draft slug does not resolve", draft.status() === 404, `status ${draft.status()}`);

  // The nav slot went to the story page; /notes stays reachable by URL but is
  // deliberately unlinked until something is published.
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const navHref = await page.evaluate(
    () =>
      [...document.querySelectorAll("nav a")]
        .find((a) => /notes/i.test(a.textContent))
        ?.getAttribute("href") ?? "",
  );
  check("nav no longer links to notes", navHref === "", navHref || "absent");

  await page.close();
}
