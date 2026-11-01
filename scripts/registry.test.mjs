import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import "./build-registry.mjs";

test("registry items include current portable source and styles", async () => {
  const registry = JSON.parse(
    await readFile(new URL("../registry.json", import.meta.url), "utf8"),
  );
  assert.equal(new Set(registry.items.map((item) => item.name)).size, 6);
  for (const item of registry.items) {
    const built = JSON.parse(
      await readFile(
        new URL(`../public/r/${item.name}.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.equal(built.name, item.name);
    assert.equal(built.files.length, 2);
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
