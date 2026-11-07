// Install smoke test: every component, installed with the real shadcn CLI from a
// built registry into fresh Next.js and Vite apps, built in strict TypeScript,
// then rendered in Chromium. Fails on install, type, build, page, or console errors,
// or if any component renders nothing.
//
// usage: node scripts/smoke/run.mjs <registry base url, e.g. http://127.0.0.1:4173>
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const registryBase = (process.argv[2] || "http://127.0.0.1:4173").replace(/\/$/, "");
const root = new URL("../..", import.meta.url).pathname;
const work = mkdtempSync(join(process.env.RUNNER_TEMP || tmpdir(), "forme-smoke-"));
const slugs = JSON.parse(readFileSync(join(root, "registry.json"), "utf8")).items.map((i) => i.name);
const fixtures = join(root, "scripts/smoke/fixtures.tsx");
const run = (cmd, args, cwd) => {
  console.log(`$ ${cmd} ${args.join(" ")}`.slice(0, 200));
  execFileSync(cmd, args, { cwd, stdio: "inherit", env: { ...process.env, CI: "1" } });
};
const components = (rsc, css) =>
  JSON.stringify({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc,
    tsx: true,
    tailwind: { css, baseColor: "neutral", cssVariables: true },
    aliases: { components: "@/components", utils: "@/lib/utils", ui: "@/components/ui", lib: "@/lib", hooks: "@/hooks" },
  });
const install = (cwd) =>
  run("npx", ["--yes", "shadcn@latest", "add", ...slugs.map((s) => `${registryBase}/r/${s}.json`), "--yes", "--overwrite"], cwd);
const serve = (cmd, args, cwd, url) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "ignore", detached: true });
    const started = Date.now();
    const poll = async () => {
      try {
        if ((await fetch(url)).ok) return resolve(child);
      } catch {}
      if (Date.now() - started > 60000) return reject(new Error(`Server did not start: ${url}`));
      setTimeout(poll, 500);
    };
    poll();
  });

async function check(name, url) {
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  const problems = [];
  page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console error: ${m.text()}`);
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const empty = await page.$$eval("section[data-slug]", (sections) =>
    sections.filter((s) => !s.querySelector("*") && !s.textContent.trim()).map((s) => s.dataset.slug),
  );
  const rendered = await page.$$eval("section[data-slug]", (s) => s.length);
  await browser.close();
  // The Toaster renders an empty list until a toast is shown; that is correct.
  const blank = empty.filter((slug) => slug !== "toast");
  if (rendered !== slugs.length) problems.push(`rendered ${rendered} of ${slugs.length} fixtures`);
  if (blank.length) problems.push(`rendered nothing: ${blank.join(", ")}`);
  console.log(problems.length ? `✗ ${name}\n  ${problems.join("\n  ")}` : `✓ ${name}: ${rendered} components rendered with no errors`);
  return problems;
}

const missing = slugs.filter((s) => !readFileSync(fixtures, "utf8").includes(`"${s}":`) && !readFileSync(fixtures, "utf8").includes(`  ${s}:`));
if (missing.length) throw new Error(`No fixture for: ${missing.join(", ")}`);

// Next.js App Router
const next = join(work, "next-app");
run("npx", ["--yes", "create-next-app@16", next, "--ts", "--app", "--no-tailwind", "--no-eslint", "--no-src-dir", "--import-alias", "@/*", "--use-npm", "--yes", "--disable-git"], work);
writeFileSync(join(next, "components.json"), components(true, "app/globals.css"));
install(next);
copyFileSync(fixtures, join(next, "app/fixtures.tsx"));
writeFileSync(join(next, "app/page.tsx"), 'import { Smoke } from "./fixtures";\nexport default function Page() {\n  return <Smoke />;\n}\n');
run("npx", ["next", "build"], next);

// Vite + React
const vite = join(work, "vite-app");
run("npx", ["--yes", "create-vite@8", "vite-app", "--template", "react-ts", "--no-interactive"], work);
run("npm", ["install", "--silent"], vite);
// The shadcn CLI reads the @ alias from the root tsconfig; Vite's template only sets it in tsconfig.app.json.
const rootConfig = JSON.parse(readFileSync(join(vite, "tsconfig.json"), "utf8"));
rootConfig.compilerOptions = { ...rootConfig.compilerOptions, paths: { "@/*": ["./src/*"] } };
writeFileSync(join(vite, "tsconfig.json"), JSON.stringify(rootConfig, null, 2));
const appConfig = readFileSync(join(vite, "tsconfig.app.json"), "utf8").replace('"compilerOptions": {', '"compilerOptions": {\n    "paths": { "@/*": ["./src/*"] },');
writeFileSync(join(vite, "tsconfig.app.json"), appConfig);
writeFileSync(
  join(vite, "vite.config.ts"),
  'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()], resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } } });\n',
);
writeFileSync(join(vite, "components.json"), components(false, "src/index.css"));
install(vite);
copyFileSync(fixtures, join(vite, "src/fixtures.tsx"));
writeFileSync(join(vite, "src/App.tsx"), 'import { Smoke } from "./fixtures";\nexport default function App() {\n  return <Smoke />;\n}\n');
writeFileSync(join(vite, "src/index.css"), "");
if (existsSync(join(vite, "src/App.css"))) writeFileSync(join(vite, "src/App.css"), "");
run("npx", ["tsc", "-b"], vite);
run("npx", ["vite", "build"], vite);

const problems = [];
const nextServer = await serve("npx", ["next", "start", "-p", "4310"], next, "http://127.0.0.1:4310/");
problems.push(...(await check("Next.js", "http://127.0.0.1:4310/")));
process.kill(-nextServer.pid);
const viteServer = await serve("npx", ["vite", "preview", "--port", "4311", "--strictPort", "--host", "127.0.0.1"], vite, "http://127.0.0.1:4311/");
problems.push(...(await check("Vite", "http://127.0.0.1:4311/")));
process.kill(-viteServer.pid);
if (problems.length) process.exit(1);
