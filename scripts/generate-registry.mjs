// Rewrites registry.json from src/catalog.ts. Run after adding or removing a component.
import { writeFileSync } from "node:fs";
import { catalog } from "../src/catalog.ts";

const shared = {
  "scramble-button": ["ascii-decode.tsx", "ascii-decode.css"],
  "eclipse-hero": ["horizon-shader.tsx", "shader-canvas.tsx", "shader-canvas.css"],
};
const items = catalog.map((c) => {
  const own = c.slug.endsWith("-shader")
    ? [`${c.slug}.tsx`, "shader-canvas.tsx", "shader-canvas.css"]
    : [`${c.slug}.tsx`, `${c.slug}.css`, ...(shared[c.slug] || [])];
  const files = own.map((name) => ({
    path: `src/registry/${name}`,
    type: name.endsWith(".css") ? "registry:file" : "registry:component",
    target: `@components/forme/${name}`,
  }));
  return {
    name: c.slug,
    type: "registry:component",
    title: c.name,
    description: c.description,
    files,
    ...(c.slug === "magnetic-button" ? { dependencies: ["motion"] } : {}),
  };
});
writeFileSync(
  new URL("../registry.json", import.meta.url),
  JSON.stringify(
    { $schema: "https://ui.shadcn.com/schema/registry.json", name: "forme", homepage: "https://forme.vercel.app", items },
    null,
    2,
  ) + "\n",
);
console.log(`Wrote ${items.length} registry items.`);
