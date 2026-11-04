import { readFile, mkdir, writeFile, readdir, unlink } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const registry = JSON.parse(
  await readFile(new URL("../registry.json", import.meta.url), "utf8"),
);
const directory = new URL("../public/r/", import.meta.url);
await mkdir(directory, { recursive: true });
const publicItems = registry.items;
// Remove stale generated payloads when a component is renamed or deleted.
const allowed = new Set(publicItems.map((item) => `${item.name}.json`));
for (const file of await readdir(directory)) {
  if (file.endsWith(".json") && !allowed.has(file))
    await unlink(new URL(file, directory));
}
for (const item of publicItems) {
  const files = await Promise.all(
    item.files.map(async (file) => ({
      ...file,
      content: await readFile(
        new URL(`../${file.path}`, import.meta.url),
        "utf8",
      ),
    })),
  );
  await writeFile(
    new URL(`${item.name}.json`, directory),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        ...item,
        files,
      },
      null,
      2,
    ) + "\n",
  );
}
await writeFile(
  new URL("../public/registry.json", import.meta.url),
  JSON.stringify({ ...registry, items: publicItems }, null, 2) + "\n",
);
// Measured install size per component: every file the CLI would copy, gzipped.
const sizes = {};
for (const item of registry.items) {
  const text = await Promise.all(
    item.files.map((file) =>
      readFile(new URL(`../${file.path}`, import.meta.url), "utf8"),
    ),
  );
  sizes[item.name] = gzipSync(text.join("\n")).length;
}
await writeFile(
  new URL("../src/sizes.json", import.meta.url),
  JSON.stringify(sizes, null, 2) + "\n",
);
console.log(
  `Built ${publicItems.length} public registry items.`,
);
