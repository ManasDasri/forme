import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const registry = JSON.parse(
  await readFile(new URL("../registry.json", import.meta.url), "utf8"),
);
for (const path of [
  "components",
  "bookmarks",
  "collections/experimental",
  "collections/buttons",
  "collections/shaders",
  "collections/ascii",
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
  ...registry.items.map((item) => `docs/${item.name}`),
]) {
  assert.ok(
    (
      await readFile(
        new URL(`../dist/${path}/index.html`, import.meta.url),
        "utf8",
      )
    ).includes('id="root"'),
    `Missing static entry: ${path}`,
  );
}
const payloads = await readdir(new URL("../dist/r/", import.meta.url));
assert.equal(
  payloads.length,
  registry.items.filter((item) => item.meta?.access !== "studio").length,
);
for (const item of registry.items.filter(
  (item) => item.meta?.access === "studio",
))
  assert.ok(
    !payloads.includes(`${item.name}.json`),
    "Studio payload exposed in build",
  );
const assets = new URL("../dist/assets/", import.meta.url);
const bundle = (
  await Promise.all(
    (await readdir(assets))
      .filter((name) => name.endsWith(".js"))
      .map((name) => readFile(new URL(name, assets), "utf8")),
  )
).join("\n");
for (const marker of [
  "export function OrbitalShader",
  "export function ShutterButton",
  "export function AsciiText",
])
  assert.ok(
    !bundle.includes(marker),
    "Studio TypeScript source exposed in documentation bundle",
  );
console.log("Verified static page entries and Studio distribution boundaries.");
