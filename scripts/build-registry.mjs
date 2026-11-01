import { readFile, mkdir, writeFile } from "node:fs/promises";

const registry = JSON.parse(
  await readFile(new URL("../registry.json", import.meta.url), "utf8"),
);
const directory = new URL("../public/r/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const item of registry.items) {
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
  JSON.stringify(registry, null, 2) + "\n",
);
console.log(`Built ${registry.items.length} registry items.`);
