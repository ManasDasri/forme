import { readFile, writeFile, mkdir } from "node:fs/promises";

// Real entry documents make every page refreshable on a plain static host.
const registry = JSON.parse(
  await readFile(new URL("../registry.json", import.meta.url), "utf8"),
);
const html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const pages = [
  "components",
  "bookmarks",
  "collections/experimental",
  "collections/buttons",
  "collections/shaders",
  "collections/ascii",
  "collections/hud",
  "collections/next",
  "collections",
  "collections/editorial",
  "collections/object",
  "collections/kinetic",
  "studio",
  "docs",
  "docs/theming",
  "docs/accessibility",
  "docs/registry",
  "docs/quality",
  ...registry.items.map((item) => `docs/${item.name}`),
];
for (const page of pages) {
  const directory = new URL(`../dist/${page}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), html);
}
await writeFile(new URL("../dist/404.html", import.meta.url), html);
console.log(`Built ${pages.length} static page entries.`);
