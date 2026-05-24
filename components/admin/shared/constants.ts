export const COURSE_CATEGORIES = [
  "CAD",
  "BIM",
  "FEA",
  "STRUCTURAL",
  "VISUALIZATION",
  "PRODUCTIVITY",
  "STRUCTURAL_ANALYSIS",
] as const;

export const COURSE_ICONS = [
  "📐",
  "🏗️",
  "📊",
  "🔧",
  "🖥️",
  "📋",
  "🏛️",
  "⚙️",
  "📦",
] as const;

export const inputStyle: React.CSSProperties = {
  padding: "0.62rem 0.85rem",
  borderRadius: 8,
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "0.82rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.18s",
};
