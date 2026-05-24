"use client";

export function SettingsView() {
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
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚙️</div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "0.5rem",
        }}
      >
        Settings
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
        Coming soon: Account settings, batch configuration, and system
        preferences
      </div>
    </div>
  );
}
