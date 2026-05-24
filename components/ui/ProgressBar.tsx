interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
}

export default function ProgressBar({
  value,
  color = "var(--sky)",
  height = 5,
}: ProgressBarProps) {
  return (
    <div
      style={{
        height,
        background: "var(--glass-border-subtle)",
        borderRadius: height,
        overflow: "hidden",
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: height,
          transition: "width 0.6s ease",
          boxShadow: `0 0 6px ${color}66`,
        }}
      />
    </div>
  );
}
