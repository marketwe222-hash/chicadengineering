export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--divider)",
        padding: "1.75rem 2rem",
        textAlign: "center",
        fontSize: "0.77rem",
        color: "var(--text-muted)",
        background: "var(--bg-base)",
      }}
    >
      © {new Date().getFullYear()} CHICAD Engineering · Creative Hub for
      Innovation in Civil & Architectural Design · Yaoundé, Cameroon
    </footer>
  );
}
