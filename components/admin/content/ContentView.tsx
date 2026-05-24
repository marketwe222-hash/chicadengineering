"use client";

export function ContentView() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🖊️</div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "0.5rem",
        }}
      >
        Content Management
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
        Coming soon: Edit homepage content, announcements, and testimonials
      </div>
    </div>
  );
}
