interface TagProps {
  label: string;
  color?: string;
}

export default function Tag({ label, color = "var(--sky)" }: TagProps) {
  return (
    <span
      style={{
        fontSize: "0.58rem",
        fontWeight: 800,
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
        padding: "0.15rem 0.5rem",
        borderRadius: "1rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-mono)",
      }}
    >
      {label}
    </span>
  );
}
