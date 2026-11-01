import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import "./build-registry.mjs";
import { catalog, freeCount } from "../src/catalog.ts";

test("registry items include current portable source and styles", async () => {
  const registry = JSON.parse(
    await readFile(new URL("../registry.json", import.meta.url), "utf8"),
  );
  assert.equal(new Set(registry.items.map((item) => item.name)).size, catalog.length);
  const published = JSON.parse(
    await readFile(new URL("../public/registry.json", import.meta.url), "utf8"),
  );
  assert.equal(published.items.length, freeCount);
  const payloads = await readdir(new URL("../public/r/", import.meta.url));
  for (const item of registry.items) {
    if (item.meta?.access === "studio") {
      assert.ok(
        !payloads.includes(`${item.name}.json`),
        "Studio source must not be distributed",
      );
      assert.ok(
        !published.items.some((publicItem) => publicItem.name === item.name),
      );
      continue;
    }
    const built = JSON.parse(
      await readFile(
        new URL(`../public/r/${item.name}.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.equal(built.name, item.name);
    assert.ok(built.files.length >= 2);
    for (const file of built.files) {
      assert.equal(
        file.content,
        await readFile(new URL(`../${file.path}`, import.meta.url), "utf8"),
      );
      assert.ok(file.target.startsWith("@components/forme/"));
      assert.ok(!file.content.includes("/Users/"));
    }
    assert.ok(built.files.some((file) => file.target.endsWith(".css")));
    if (built.files.some((file) => file.content.includes("motion/react")))
      assert.ok(built.dependencies.includes("motion"));
  }
});
