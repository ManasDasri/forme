import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { catalog } from "../src/catalog.ts";

test("every component has an install smoke fixture", async () => {
  const fixtures = await readFile(new URL("./smoke/fixtures.tsx", import.meta.url), "utf8");
  const keys = [...fixtures.matchAll(/^  "?([a-z0-9-]+)"?: \(\) =>/gm)].map((m) => m[1]);
  const missing = catalog.map((c) => c.slug).filter((slug) => !keys.includes(slug));
  const stale = keys.filter((key) => !catalog.some((c) => c.slug === key));
  assert.deepEqual(missing, [], `Add a fixture in scripts/smoke/fixtures.tsx for: ${missing.join(", ")}`);
  assert.deepEqual(stale, [], `Remove fixtures for deleted components: ${stale.join(", ")}`);
});
