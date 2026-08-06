import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

/**
 * Minimal end-to-end harness.
 *
 * Deliberately dependency-light: one browser, a real production server, and a
 * flat list of pass/fail records. There is no test framework here because the
 * suites are checks against a running site rather than unit tests, and a
 * framework would add more configuration than it removes.
 */

export function createRecorder() {
  const results = [];
  return {
    results,
    /** Record a check. `detail` is printed either way, so failures are debuggable. */
    check(name, passed, detail = "") {
      results.push({ name, passed: Boolean(passed), detail: String(detail) });
    },
  };
}

/** Boot `next start` on `port` and resolve once it answers. */
export async function startServer(port) {
  if (!existsSync(".next")) {
    throw new Error("No .next build found. Run `npm run build` before the tests.");
  }

  const server = spawn("npx", ["next", "start", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });

  let stderr = "";
  server.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const baseUrl = `http://localhost:${port}`;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited early (${server.exitCode}).\n${stderr}`);
    }
    try {
      const res = await fetch(baseUrl, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return { server, baseUrl };
    } catch {
      // not up yet
    }
    await sleep(500);
  }

  server.kill("SIGKILL");
  throw new Error(`Server did not start within 30s.\n${stderr}`);
}

export async function stopServer(server) {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    sleep(4000).then(() => server.kill("SIGKILL")),
  ]);
}

/**
 * Scroll a page top to bottom so every scroll-triggered effect fires, then
 * return to the top. Smooth scrolling is disabled first, or the loop outruns
 * the animation and never reaches the lower sections.
 */
export async function scrollThrough(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.5;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 70));
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(400);
}

/** Collect console errors and page errors for the lifetime of a page. */
export function watchErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}
