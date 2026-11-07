import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { catalog, traitInfo } from "../src/catalog.ts";

const registry = JSON.parse(await readFile(new URL("../registry.json", import.meta.url), "utf8"));
const sourceOf = async (item) =>
  (await Promise.all(item.files.map((f) => readFile(new URL(`../${f.path}`, import.meta.url), "utf8")))).join("\n");
// Each claimed trait must be backed by this evidence in the installed files.
const evidence = {
  "reduced-motion": (s) => s.includes("prefers-reduced-motion"),
  keyboard: (s) => /<button|<input|onKeyDown/.test(s),
  "offscreen-pause": (s) => s.includes("IntersectionObserver") && s.includes("visibilitychange"),
  "pause-control": (s) => /aria-pressed=\{paused\}/.test(s),
  "webgl-fallback": (s) => s.includes("webglcontextlost") && s.includes("data-fallback"),
  "zero-deps": (s) =>
    [...s.matchAll(/(?:from|import)\s+"([^"]+)"/g)].every(([, spec]) => spec.startsWith(".") || spec === "react"),
};
// Animations that run once and end, so they need no offscreen pause.
const finite = new Set(["ascii-decode", "scramble-button", "hold-button", "number-ticker", "text-reveal"]);

test("catalog and registry describe the same components", () => {
  assert.deepEqual(catalog.map((c) => c.slug), registry.items.map((i) => i.name));
  assert.ok(catalog.length >= 25);
});

test("every claimed trait is backed by source", async () => {
  assert.deepEqual(Object.keys(evidence).sort(), Object.keys(traitInfo).sort());
  for (const c of catalog) {
    const source = await sourceOf(registry.items.find((i) => i.name === c.slug));
    for (const trait of c.traits) assert.ok(evidence[trait](source), `${c.slug} claims ${trait} without evidence`);
    assert.ok(c.traits.includes("reduced-motion"), `${c.slug} must handle reduced motion`);
    if (source.includes("requestAnimationFrame") && !finite.has(c.slug))
      assert.ok(c.traits.includes("offscreen-pause"), `${c.slug} runs a render loop without an offscreen pause`);
  }
});
