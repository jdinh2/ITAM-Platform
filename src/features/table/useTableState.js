import { useMemo, useState } from "react";

const normalizeValue = (value) => String(value ?? "").trim().toLowerCase();

const defaultCompare = (a, b) => {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" });
};

export function useTableState({
  rows = [],
  searchFields = [],
  filterDefs = [],
  sorters = {},
  defaultSort = null,
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(filterDefs.map((def) => [def.key, def.defaultValue ?? "all"])),
  );
  const [sort, setSort] = useState(() => defaultSort || { key: null, dir: "asc" });

  const resolvedFilterDefs = useMemo(
    () =>
      filterDefs.map((def) => {
        if (def.options?.length) return def;
        const values = [...new Set(rows.map((row) => def.getValue?.(row)).filter(Boolean))];
        return {
          ...def,
          options: values
            .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" }))
            .map((value) => ({ value, label: String(value) })),
        };
      }),
    [filterDefs, rows],
  );

  const filteredRows = useMemo(() => {
    let nextRows = rows;
    const normalizedSearch = normalizeValue(search);

    if (normalizedSearch) {
      nextRows = nextRows.filter((row) =>
        searchFields.some((field) => normalizeValue(typeof field === "function" ? field(row) : row?.[field]).includes(normalizedSearch)),
      );
    }

    resolvedFilterDefs.forEach((def) => {
      const activeValue = filters[def.key];
      if (!activeValue || activeValue === "all") return;
      nextRows = nextRows.filter((row) =>
        def.predicate
          ? def.predicate(row, activeValue)
          : normalizeValue(def.getValue?.(row)) === normalizeValue(activeValue),
      );
    });

    if (!sort?.key) return nextRows;

    const sorter = sorters[sort.key] || {};
    const compare = sorter.compare || defaultCompare;
    const getValue = sorter.getValue || ((row) => row?.[sort.key]);
    const dir = sort.dir === "desc" ? -1 : 1;
    return [...nextRows].sort((a, b) => compare(getValue(a), getValue(b), a, b) * dir);
  }, [filters, resolvedFilterDefs, rows, search, searchFields, sort, sorters]);

  const setFilterValue = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch("");
    setFilters(Object.fromEntries(filterDefs.map((def) => [def.key, def.defaultValue ?? "all"])));
    if (defaultSort) setSort(defaultSort);
  };

  const toggleSort = (key, defaultDir = "asc") => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: defaultDir },
    );
  };

  const hasActiveFilters = normalizedValuePresent(search) || Object.values(filters).some((value) => value && value !== "all");

  return {
    rows: filteredRows,
    search,
    setSearch,
    filters,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
    sort,
    toggleSort,
    filterDefs: resolvedFilterDefs,
  };
}

function normalizedValuePresent(value) {
  return normalizeValue(value).length > 0;
}
