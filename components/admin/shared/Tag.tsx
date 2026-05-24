export function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.58rem",
        fontWeight: 800,
        color,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        padding: "0.15rem 0.5rem",
        borderRadius: "1rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
