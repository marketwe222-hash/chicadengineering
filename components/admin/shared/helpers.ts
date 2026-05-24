export function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    CAD: "#ef4444",
    BIM: "#a78bfa",
    FEA: "#e879f9",
    STRUCTURAL: "#fb923c",
    VISUALIZATION: "#fbbf24",
    PRODUCTIVITY: "#22c55e",
    STRUCTURAL_ANALYSIS: "#fb923c",
  };
  return map[cat.toUpperCase().replace(/ /g, "_")] ?? "#3b82f6";
}

export function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
