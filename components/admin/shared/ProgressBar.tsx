export function ProgressBar({
  value,
  color = "#3b82f6",
  height = 4,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        height,
        background: "rgba(125,211,252,0.08)",
        borderRadius: height,
        overflow: "hidden",
        minWidth: 60,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(value, 100)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: height,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}
