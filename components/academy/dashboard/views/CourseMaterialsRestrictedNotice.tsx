export default function CourseMaterialsRestrictedNotice() {
  return (
    <div
      className="glass animate-fade-in"
      style={{
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        color: "var(--text-secondary)",
        fontSize: "0.82rem",
        textAlign: "center",
      }}
    >
      <span aria-hidden="true">🔒</span>
      <span>
        Course materials are unavailable while your account is withdrawn.
      </span>
    </div>
  );
}
