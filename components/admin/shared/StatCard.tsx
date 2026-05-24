export function StatCard({
  label,
  value,
  sub,
  color,
  delta,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  delta?: { text: string; up: boolean };
}) {
  return (
    <div
      className="card-hover"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "1rem 1.15rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "0.45rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 900,
          color,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: "0.25rem",
          fontFamily: "var(--mono)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.62rem", color: "var(--text2)" }}>{sub}</div>
      {delta && (
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            color: delta.up ? "var(--green)" : "var(--red)",
            marginTop: "0.2rem",
          }}
        >
          {delta.up ? "↑" : "↓"} {delta.text}
        </div>
      )}
    </div>
  );
}
