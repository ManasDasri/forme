import { test } from "node:test";
import assert from "node:assert/strict";
import { filterLibrary, restoreBookmarks } from "../src/library-state.ts";
const items = [
  {
    slug: "a",
    name: "Image compare",
    category: "Imagery",
    description: "Compare images",
  },
  {
    slug: "b",
    name: "Case study",
    category: "Layouts",
    description: "Project story",
    access: "studio",
  },
  {
    slug: "c",
    name: "Magnetic button",
    category: "Buttons",
    description: "Pointer attraction",
  },
];
const defaults = {
  query: "",
  category: "All components",
  access: "all",
  savedOnly: false,
  saved: [],
  sort: "curated",
};
test("library combines search, category, tier and saved filters", () => {
  assert.deepEqual(
    filterLibrary(items, {
      ...defaults,
      query: " IMAGE ",
      category: "Imagery",
      access: "free",
    }).map((x) => x.slug),
    ["a"],
  );
  assert.deepEqual(
    filterLibrary(items, {
      ...defaults,
      savedOnly: true,
      saved: ["b"],
      access: "studio",
    }).map((x) => x.slug),
    ["b"],
  );
  assert.equal(
    filterLibrary(items, { ...defaults, access: "free", category: "Layouts" })
      .length,
    0,
  );
  assert.deepEqual(
    filterLibrary(items, { ...defaults, sort: "name" }).map((x) => x.slug),
    ["b", "a", "c"],
  );
  assert.deepEqual(
    items.map((x) => x.slug),
    ["a", "b", "c"],
  );
});
test("bookmarks discard corrupt, duplicate and unknown values", () => {
  assert.deepEqual(restoreBookmarks("bad json", ["a"]), []);
  assert.deepEqual(restoreBookmarks("{}", ["a"]), []);
  assert.deepEqual(restoreBookmarks('["a","a","missing",4]', ["a"]), ["a"]);
});
