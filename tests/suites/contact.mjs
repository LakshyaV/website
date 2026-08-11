import { scrollThrough } from "../lib/harness.mjs";

export const name = "contact";

/**
 * The contact form posts to FormSubmit, which cannot be hit from a test run
 * without spamming a real inbox. Every request to it is intercepted, so what
 * is verified is the contract: what the form sends, and how it behaves on
 * success, on failure, and when the honeypot is tripped.
 */
export async function run({ browser, baseUrl, check }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const requests = [];
  let respondWith = 200;
  await page.route("**/formsubmit.co/**", async (route) => {
    const request = route.request();
    requests.push({ url: request.url(), method: request.method(), post: request.postData() ?? "" });
    if (respondWith === 200) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: "true", message: "intercepted" }),
      });
    } else {
      await route.fulfill({ status: respondWith, contentType: "text/plain", body: "nope" });
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await scrollThrough(page);
  await page.locator("#contact").scrollIntoViewIfNeeded();

  const form = page.locator("#contact form");
  check("contact section renders the form", (await form.count()) === 1, `${await form.count()} forms`);

  /* ------------------------------- success -------------------------------- */
  await page.fill("#contact-email", "visitor@example.com");
  await page.fill("#contact-message", "Testing the channel end to end.");
  await form.locator("button[type=submit]").click();
  await page.waitForTimeout(400);

  check("submitting posts to the form service", requests.length === 1, `${requests.length} requests`);
  check(
    "the ajax endpoint is used, not a navigation",
    (requests[0]?.url ?? "").includes("/ajax/") && page.url().startsWith(baseUrl),
    requests[0]?.url ?? "none",
  );
  check(
    "the payload carries the message and reply address",
    (requests[0]?.post ?? "").includes("Testing the channel") &&
      (requests[0]?.post ?? "").includes("visitor@example.com"),
    `${(requests[0]?.post ?? "").length} bytes`,
  );

  const sentStatus = (await page.locator("#contact [role=status]").textContent())?.trim();
  check("success is announced", /sent/i.test(sentStatus ?? ""), sentStatus ?? "empty");
  check(
    "fields clear after a successful send",
    (await page.inputValue("#contact-message")) === "",
    "",
  );

  /* ------------------------------- failure -------------------------------- */
  respondWith = 500;
  await page.fill("#contact-email", "visitor@example.com");
  await page.fill("#contact-message", "This one will fail.");
  await form.locator("button[type=submit]").click();
  await page.waitForTimeout(400);

  const errorStatus = (await page.locator("#contact [role=status]").textContent())?.trim();
  check("failure is announced", /failed/i.test(errorStatus ?? ""), errorStatus ?? "empty");
  check(
    "the message survives a failed send",
    (await page.inputValue("#contact-message")) === "This one will fail.",
    await page.inputValue("#contact-message"),
  );

  /* ------------------------------- honeypot -------------------------------- */
  respondWith = 200;
  const before = requests.length;
  await page.evaluate(() => {
    const trap = document.querySelector("#contact form input[name=_honey]");
    trap.value = "definitely a bot";
  });
  await page.fill("#contact-email", "bot@example.com");
  await page.fill("#contact-message", "Spam.");
  await form.locator("button[type=submit]").click();
  await page.waitForTimeout(400);
  check(
    "a tripped honeypot sends nothing",
    requests.length === before,
    `${requests.length - before} extra requests`,
  );

  /* ------------------------------ social links ----------------------------- */
  const socials = await page.evaluate(() => {
    const section = document.querySelector("#contact");
    return [...section.querySelectorAll("a[target=_blank]")].map((a) => ({
      label: a.textContent.trim().replace(/\s*↗$/, ""),
      href: a.getAttribute("href"),
    }));
  });
  check(
    "GitHub link is present",
    socials.some((s) => s.href === "https://github.com/LakshyaV"),
    socials.map((s) => s.label).join(", "),
  );
  check(
    "LinkedIn link is present",
    socials.some((s) => s.href === "https://www.linkedin.com/in/lakshyav/"),
    socials.map((s) => s.label).join(", "),
  );

  await page.close();
}
