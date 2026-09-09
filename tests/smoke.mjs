import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { states } from "../src/data.js";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(
    process.env.APP_URL || "http://127.0.0.1:5173/fun/statewise/",
  );
  await page.locator(".state").first().waitFor();
  assert.equal(await page.locator(".state").count(), 50);
  await page.getByRole("button", { name: "Enter fullscreen map" }).click();
  await page.locator(".map-expanded").waitFor();
  assert.equal(
    await page.evaluate(
      () =>
        Math.round(
          document.querySelector(".map-panel").getBoundingClientRect().width,
        ) === window.innerWidth,
    ),
    true,
  );
  await page.getByRole("button", { name: "Exit fullscreen map" }).click();
  await page.locator(".map-expanded").waitFor({ state: "detached" });
  await page.evaluate(
    () => (document.querySelector(".map-panel").requestFullscreen = undefined),
  );
  await page.getByRole("button", { name: "Enter fullscreen map" }).click();
  await page.locator(".map-expanded").waitFor();
  await page.keyboard.press("Escape");
  await page.locator(".map-expanded").waitFor({ state: "detached" });
  assert.equal(
    await page.evaluate(() => document.querySelector("header").inert),
    false,
  );

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `Overflow at ${width}px`,
    );
  }
  await page.locator('path[aria-label="Texas"]').click();
  assert.equal(await page.locator(".photo-title h2").textContent(), "Texas");
  await page.locator(".learn-button").click();
  await page.reload();
  await page.getByLabel("Find a state").fill("Austin");
  await page.locator(".search-results button").click();
  assert.match(await page.locator(".learn-button").textContent(), /Added/);
  await page.getByLabel("Filter by region").selectOption("Southwest");
  assert.equal(await page.locator(".state:not(.dim)").count(), 4);
  await page.getByLabel("Filter by region").selectOption("All regions");
  await page.locator(".practice-card.green").click();
  const prompt = await page.locator("#quiz-title").textContent();
  const target = states.find((s) => prompt === `Where is ${s.name}?`);
  const index = await page
    .locator(".quiz-dialog .state")
    .evaluateAll(
      (els, id) =>
        els.findIndex(
          (el) =>
            el.querySelector("path").getAttribute("d") ===
            document
              .querySelector(`.map-panel path[aria-label="${id}"]`)
              .getAttribute("d"),
        ),
      target.name,
    );
  await page.locator(".quiz-dialog .state path").nth(index).click();
  assert.match(
    await page.locator(".answer-feedback strong").textContent(),
    /right/,
  );
  assert.match(await page.locator(".map-verdict").textContent(), /Correct!/);
  assert.equal(await page.locator(".quiz-dialog .answer-correct").count(), 1);
  assert.equal(await page.locator(".quiz-dialog .answer-wrong").count(), 0);
  await page.locator(".answer-feedback .primary").click();
  const nextPrompt = await page.locator("#quiz-title").textContent();
  const correctState = states.find((s) => nextPrompt === `Where is ${s.name}?`);
  const wrongState = states.find((s) => s.id !== correctState.id);
  await page.getByLabel("Choose state answer").selectOption(wrongState.id);
  assert.match(await page.locator(".map-verdict").textContent(), /Incorrect/);
  assert.match(
    await page.locator(".map-verdict").textContent(),
    new RegExp(correctState.name),
  );
  assert.equal(
    await page
      .locator(".quiz-dialog .answer-correct>path")
      .getAttribute("aria-label"),
    correctState.name,
  );
  assert.equal(
    await page
      .locator(".quiz-dialog .answer-wrong>path")
      .getAttribute("aria-label"),
    wrongState.name,
  );

  await page.getByLabel("Close quiz").click();
  await page.getByRole("button", { name: "Practice", exact: true }).click();
  await page.locator(".practice-card.lavender").click();
  for (let i = 0; i < 10; i++) {
    const question = await page.locator("#quiz-title").textContent();
    const state = states.find((s) => question.includes(`“${s.nickname}”`));
    await page
      .locator(".answers button")
      .filter({ hasText: new RegExp("^[A-D]\\s*" + state.name + "$") })
      .click();
    assert.match(
      await page.locator(".answer-feedback strong").textContent(),
      /right/,
    );
    await page.locator(".answer-feedback .primary").click();
  }
  assert.match(await page.locator(".quiz-result").textContent(), /10 \/ 10/);
  await page.reload();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  assert.equal(
    await page.locator(".stats>div").nth(2).locator("strong").textContent(),
    "1",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 50 map states, 5 responsive widths, selection, search, filters, persisted bookmarks, location quiz, perfect nickname quiz, persisted results, no browser errors.",
  );
} finally {
  await browser.close();
}
