import { readdir } from "node:fs/promises";
import { chromium } from "playwright";

import { createRecorder, startServer, stopServer } from "./lib/harness.mjs";

/**
 * Runs every suite against a real production build.
 *
 * Usage: npm run build && npm test
 * Filter with: npm test -- smoke a11y
 *
 * Suites are discovered from ./suites, so adding one is a single file. Each
 * must export `name` and `run({ browser, baseUrl, check })`.
 */

const suiteDir = new URL("./suites/", import.meta.url);
const files = (await readdir(suiteDir)).filter((f) => f.endsWith(".mjs")).sort();

const ALL = [];
for (const file of files) {
  const suite = await import(new URL(file, suiteDir).href);
  if (typeof suite.run !== "function" || !suite.name) {
    console.error(`Suite ${file} must export \`name\` and \`run\`.`);
    process.exit(1);
  }
  ALL.push(suite);
}
const PORT = Number(process.env.TEST_PORT ?? 4321);

const filters = process.argv.slice(2);
const suites = filters.length ? ALL.filter((s) => filters.includes(s.name)) : ALL;

if (suites.length === 0) {
  console.error(`No suites matched. Available: ${ALL.map((s) => s.name).join(", ")}`);
  process.exit(1);
}

let server;
let browser;
let failed = 0;

try {
  console.log(`Starting production server on port ${PORT}`);
  ({ server } = await startServer(PORT));
  browser = await chromium.launch();
  const baseUrl = `http://localhost:${PORT}`;

  for (const suite of suites) {
    const { results, check } = createRecorder();
    const started = Date.now();

    try {
      await suite.run({ browser, baseUrl, check });
    } catch (error) {
      check(`${suite.name} suite completed`, false, error.message);
    }

    const passed = results.filter((r) => r.passed).length;
    const suiteFailed = results.length - passed;
    failed += suiteFailed;

    const mark = suiteFailed === 0 ? "PASS" : "FAIL";
    console.log(
      `\n${mark}  ${suite.name}  (${passed}/${results.length} in ${((Date.now() - started) / 1000).toFixed(1)}s)`,
    );
    for (const result of results) {
      if (result.passed) console.log(`  ok    ${result.name}${result.detail ? `  [${result.detail}]` : ""}`);
      else console.log(`  FAIL  ${result.name}${result.detail ? `  [${result.detail}]` : ""}`);
    }
  }
} catch (error) {
  console.error(`\nHarness error: ${error.message}`);
  failed += 1;
} finally {
  if (browser) await browser.close();
  await stopServer(server);
}

console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
