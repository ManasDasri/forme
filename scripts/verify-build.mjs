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
  "collections/hud",
  "collections/surfaces",
  "collections/inputs",
  "collections/loaders",
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
assert.equal(payloads.length, registry.items.length);
console.log(`Verified static entries and ${payloads.length} registry payloads.`);
