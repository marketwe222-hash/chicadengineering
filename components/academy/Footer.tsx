import Link from "next/link";

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
      <span style={{ margin: "0 0.5rem", opacity: 0.3 }}>·</span>
      <Link
        href="/academy/admin/login"
        style={{
          fontSize: "0.65rem",
          color: "rgba(220,38,38,0.45)",
          textDecoration: "none",
          fontWeight: 600,
          letterSpacing: "0.04em",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "rgba(220,38,38,0.75)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(220,38,38,0.45)")
        }
      >
        Admin Login
      </Link>
    </footer>
  );
}
