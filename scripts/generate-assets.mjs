import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoPath } from "d3-geo";
import { states, colors, displayRegion } from "../src/data.js";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const atlas = JSON.parse(
    readFileSync("node_modules/us-atlas/states-albers-10m.json", "utf8"),
  );
  const paths = feature(atlas, atlas.objects.states)
    .features.filter((f) => states.some((s) => s.id === f.id))
    .map((f) => {
      const s = states.find((s) => s.id === f.id);
      return `<path d="${geoPath()(f)}" fill="${colors[displayRegion(s)]}" stroke="#f7f8f4" stroke-width="2.5"/>`;
    })
    .join("");
  const icon = readFileSync("public/favicon.svg", "utf8");
  await page.setContent(
    `<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;background:#f7f8f4;color:#263d33;font-family:Arial,sans-serif}main{width:1200px;height:630px;padding:52px 58px;position:relative;overflow:hidden}.brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:32px;letter-spacing:-1.3px}.brand svg{width:40px;height:40px;transform:rotate(-7deg)}.eyebrow{font-size:11px;letter-spacing:2px;color:#607455;font-weight:bold;margin-top:57px}h1{font-size:64px;line-height:1.04;letter-spacing:-3px;margin:20px 0}h1 span{color:#84937e}p{color:#697763;font-size:19px;line-height:1.65;max-width:355px}.map{position:absolute;right:5px;top:142px;width:700px;height:430px}.map svg{width:100%;height:100%}.footer{position:absolute;bottom:38px;left:58px;right:58px;border-top:1px solid #dce2d4;padding-top:20px;font-size:13px;color:#6b7b61;display:flex;justify-content:space-between}.tag{position:absolute;top:64px;right:58px;border:1px solid #d6dfcc;background:#eaf0e2;border-radius:20px;padding:10px 16px;font-size:11px;letter-spacing:1px}</style></head><body><main><div class="brand">${icon}statewise.</div><div class="tag">50 STATES. ENDLESS DISCOVERIES.</div><div class="eyebrow">PUT YOUR CURIOSITY ON THE MAP</div><h1>Small steps.<br/><span>Big country.</span></h1><p>Explore the states.<br/>Learn their stories.<br/>Make it stick with a quiz.</p><div class="map"><svg viewBox="-20 -10 1010 650">${paths}</svg></div><div class="footer"><span>Interactive maps · State facts · Geography quizzes</span><strong>h3manth.com/fun/statewise</strong></div></main></body></html>`,
  );
  await page.screenshot({ path: "public/og-image.png" });
  for (const [size, name] of [
    [32, "favicon-32"],
    [180, "apple-touch-icon"],
    [192, "icon-192"],
    [512, "icon-512"],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${icon}`,
    );
    await page.screenshot({ path: `public/${name}.png`, omitBackground: true });
  }
  console.log("Generated 1200×630 social image and favicon/app icon sizes.");
} finally {
  await browser.close();
}
