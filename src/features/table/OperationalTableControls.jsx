export function OperationalTableControls({
  C,
  SN,
  MN,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClearFilters,
  hasActiveFilters = false,
  rightSlot = null,
}) {
  const selectStyle = {
    padding: "6px 8px",
    borderRadius: 5,
    border: `1px solid ${C.border}`,
    fontSize: 11.5,
    color: C.text,
    outline: "none",
    background: C.panel,
    fontFamily: SN,
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ position: "relative", flex: "0 0 240px" }}>
        <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 12 }}>
          {"\u2315"}
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          style={{ ...selectStyle, width: "100%", paddingLeft: 26 }}
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          style={{ ...selectStyle, minWidth: filter.minWidth || 150 }}
        >
          <option value="all">{filter.label}: All</option>
          {filter.options.map((option) => (
            <option key={`${filter.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          style={{
            padding: "5px 10px",
            borderRadius: 5,
            border: `1px solid ${C.redBorder}`,
            background: C.redSoft,
            color: C.red,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: MN,
          }}
        >
          Clear Filters
        </button>
      )}
      {rightSlot && <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>{rightSlot}</div>}
    </div>
  );
}
