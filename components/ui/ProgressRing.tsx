interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  color?: string;
}

export default function ProgressRing({
  value,
  size = 52,
  stroke = 4,
  color = "var(--sky)",
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
      aria-label={`${value}% progress`}
      role="img"
    >
      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--glass-border)"
        strokeWidth={stroke}
      />
      {/* fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{
          transition: "stroke-dasharray 0.6s ease",
          filter: `drop-shadow(0 0 4px ${color}88)`,
        }}
      />
    </svg>
  );
}
