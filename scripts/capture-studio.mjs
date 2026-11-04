// Records each Studio piece to public/studio/<slug>.mp4 plus a poster frame.
// Deterministic: a fake clock advances 1/30 s per frame, and CSS animations are
// seeked to the same clock, so recordings are smooth regardless of render speed.
// usage: npm run capture [slug ...]   (needs ffmpeg and Playwright's Chromium)
import { createServer } from "vite";
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const W = 960, H = 600, FPS = 30, SECONDS = 6;
const registry = JSON.parse(await readFile(new URL("../registry.json", import.meta.url), "utf8"));
const studio = registry.items.filter((i) => i.meta?.access === "studio").map((i) => i.name);
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : studio;

// Pointer choreography per piece: position (0–1) over normalized time, plus clicks.
const orbit = (t) => [0.5 + 0.28 * Math.cos(t * 6.283), 0.5 + 0.2 * Math.sin(t * 12.566)];
const paths = {
  "shutter-button": (t) => (t % 0.5 < 0.25 ? [0.5, 0.5] : [0.5, 0.92]),
};
const clicks = { "ascii-surface": [0.2, 0.55], "caustic-shader": [] };

const out = new URL("../public/studio/", import.meta.url);
await mkdir(out, { recursive: true });
const server = await createServer({ root: new URL("..", import.meta.url).pathname, server: { port: 0 }, logLevel: "error" });
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  for (const slug of slugs) {
    const frames = await mkdtemp(join(tmpdir(), `forme-${slug}-`));
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.clock.install({ time: 0 });
    await page.goto(`${base}studio/capture.html?slug=${slug}`);
    await page.waitForLoadState("networkidle");
    await page.clock.runFor(500);
    const path = paths[slug] || orbit;
    const pending = [...(clicks[slug] || [])];
    const total = FPS * SECONDS;
    for (let f = 0; f < total; f++) {
      const t = f / total;
      const [x, y] = path(t);
      await page.mouse.move(x * W, y * H);
      if (pending.length && t >= pending[0]) {
        pending.shift();
        await page.mouse.click(x * W, y * H);
      }
      await page.clock.runFor(1000 / FPS);
      await page.evaluate((ms) => {
        for (const a of document.getAnimations()) {
          a.pause();
          a.formeStart ??= ms;
          a.currentTime = ms - a.formeStart;
        }
      }, (f * 1000) / FPS);
      if (f % 30 === 0) process.stdout.write(`${slug} ${f}/${total}\r`);
      await page.screenshot({ path: join(frames, `${String(f).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
    }
    await page.close();
    const mp4 = new URL(`${slug}.mp4`, out).pathname;
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(frames, "%04d.jpg"),
      "-c:v", "libx264", "-preset", "slow", "-crf", slug.startsWith("ascii") ? "33" : "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(frames, "0045.jpg"), "-q:v", "5",
      new URL(`${slug}.jpg`, out).pathname]);
    await rm(frames, { recursive: true });
    console.log(`Captured ${slug}`);
  }
} finally {
  await browser.close();
  await server.close();
}
