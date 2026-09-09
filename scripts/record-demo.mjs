import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { states } from "../src/data.js";
mkdirSync("media/raw", { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: "media/raw", size: { width: 1600, height: 900 } },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const events = [];
let start;
const beat = async (label, seconds) => {
  events.push({ label, time: Math.round((Date.now() - start) / 100) / 10 });
  await page.waitForTimeout(seconds * 1000);
};
try {
  await page.goto(
    process.env.APP_URL || "http://127.0.0.1:5173/fun/statewise/",
  );
  await page.locator(".state").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  start = Date.now();
  // A visible pointer makes the recorded interactions easier to follow.
  await page.evaluate(() => {
    const el = document.createElement("div");
    el.id = "demo-pointer";
    el.style.cssText =
      "position:fixed;left:-30px;top:-30px;width:18px;height:18px;border:2px solid #335d45;border-radius:50%;background:#ffffffbb;pointer-events:none;z-index:9999;transition:left .25s,top .25s;";
    document.body.append(el);
  });
  const click = async (locator) => {
    await locator.scrollIntoViewIfNeeded();
    const r = await locator.boundingBox();
    await page.evaluate(
      ({ x, y }) => {
        const el = document.querySelector("#demo-pointer");
        el.style.left = `${x - 9}px`;
        el.style.top = `${y - 9}px`;
      },
      { x: r.x + r.width / 2, y: r.y + r.height / 2 },
    );
    await page.waitForTimeout(350);
    await locator.click();
  };
  await beat("Explore all 50 states", 4);
  await click(page.locator('path[aria-label="Texas"]'));
  await beat("Discover state capitals and facts", 4);
  await click(page.locator(".learn-button"));
  await beat("Save your discoveries", 3);
  await click(page.getByRole("button", { name: "Enter fullscreen map" }));
  await beat("Explore the fullscreen map", 3);
  await click(page.getByRole("button", { name: "Exit fullscreen map" }));
  await click(page.locator(".practice-card.green"));
  await beat("Find the state", 3);
  const prompt = await page.locator("#quiz-title").textContent();
  const target = states.find((s) => prompt === `Where is ${s.name}?`);
  const wrong =
    states.find((s) => s.id !== target.id && s.abbr === "TX") ||
    states.find((s) => s.id !== target.id);
  const wrongIndex = await page
    .locator(".quiz-dialog .state")
    .evaluateAll(
      (els, name) =>
        els.findIndex(
          (el) =>
            el.querySelector("path").getAttribute("d") ===
            document
              .querySelector(`.map-panel path[aria-label="${name}"]`)
              .getAttribute("d"),
        ),
      wrong.name,
    );
  await click(page.locator(".quiz-dialog .state>path").nth(wrongIndex));
  await beat("Instant feedback and the correct outline", 5);
  await click(page.locator(".answer-feedback .primary"));
  const nextPrompt = await page.locator("#quiz-title").textContent();
  const correct = states.find((s) => nextPrompt === `Where is ${s.name}?`);
  const correctIndex = await page
    .locator(".quiz-dialog .state")
    .evaluateAll(
      (els, name) =>
        els.findIndex(
          (el) =>
            el.querySelector("path").getAttribute("d") ===
            document
              .querySelector(`.map-panel path[aria-label="${name}"]`)
              .getAttribute("d"),
        ),
      correct.name,
    );
  await click(page.locator(".quiz-dialog .state>path").nth(correctIndex));
  await beat("Learn by doing", 4);
  await click(page.getByRole("button", { name: "Close quiz" }));
  await click(page.getByRole("button", { name: "My progress", exact: true }));
  await beat("Track your learning", 3);
  await click(page.getByRole("button", { name: "Explore", exact: true }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await beat("Small steps. Big country.", 3);
} finally {
  const video = page.video();
  await context.close();
  await video.saveAs("media/statewise-demo-source.webm");
  writeFileSync(
    "media/demo-timeline.json",
    JSON.stringify(events, null, 2) + "\n",
  );
  await browser.close();
  console.log("Saved media/statewise-demo-source.webm");
}
