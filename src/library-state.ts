export interface LibraryItem {
  slug: string;
  name: string;
  category: string;
  description: string;
  access?: "studio";
}
export interface LibraryFilters {
  query: string;
  category: string;
  access: string;
  savedOnly: boolean;
  saved: string[];
  sort: string;
}

export function filterLibrary<T extends LibraryItem>(
  items: T[],
  filters: LibraryFilters,
): T[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const result = items.filter(
    (item) =>
      (!filters.savedOnly || filters.saved.includes(item.slug)) &&
      (filters.category === "All components" ||
        item.category === filters.category) &&
      (filters.access === "all" ||
        (filters.access === "studio"
          ? item.access === "studio"
          : item.access !== "studio")) &&
      `${item.name} ${item.description} ${item.category}`
        .toLocaleLowerCase()
        .includes(query),
  );
  return filters.sort === "name"
    ? result.sort((a, b) => a.name.localeCompare(b.name))
    : result;
}
export function restoreBookmarks(
  raw: string | null,
  available: string[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (slug): slug is string =>
                typeof slug === "string" && available.includes(slug),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
