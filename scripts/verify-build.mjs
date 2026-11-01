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
      .filter((name) => /\.(js|css)$/.test(name))
      .map((name) => readFile(new URL(name, assets), "utf8")),
  )
).join("\n");
// Minifiers rename identifiers but keep string literals, GLSL, and CSS selectors.
// Any distinctive literal from Studio source appearing in the bundle is a leak.
const studioFiles = registry.items
  .filter((item) => item.meta?.access === "studio")
  .flatMap((item) => item.files.map((f) => f.path))
  .filter((path) => path.startsWith("studio/"));
// Lines shared with free source (common GLSL headers, for example) prove nothing.
const freeSource = (
  await Promise.all(
    (await readdir(new URL("../src/registry/", import.meta.url))).map((name) =>
      readFile(new URL(`../src/registry/${name}`, import.meta.url), "utf8"),
    ),
  )
).join("\n");
let markers = 0;
for (const path of new Set(studioFiles)) {
  const text = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const literals = [
    ...text.matchAll(/`([^`]{40,})`/g),
    ...text.matchAll(/"([^"\n]{24,})"/g),
    ...text.matchAll(/^(\.forme-[\w-]+)/gm),
  ].map((m) => m[1]);
  for (const literal of literals) {
    markers++;
    for (const line of literal.split("\n").filter((l) => l.trim().length > 30 && !freeSource.includes(l.trim())))
      assert.ok(!bundle.includes(line.trim()), `Studio source leaked from ${path}: ${line.trim().slice(0, 60)}`);
    if (literal.startsWith(".forme-"))
      assert.ok(!bundle.includes(literal + "{") && !bundle.includes(literal + " "), `Studio CSS leaked from ${path}: ${literal}`);
  }
}
assert.ok(markers > 20, "Too few Studio markers to verify the boundary");
console.log(`Verified static entries and ${markers} Studio markers absent from the bundle.`);
