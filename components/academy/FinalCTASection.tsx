import router from "next/router";

export function FinalCTASection({
  onSignIn,
  onBackToHome,
}: {
  onSignIn: () => void;
  onBackToHome: () => void;
}) {
  return (
    <section
      style={{
        padding: "6rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-base)",
        borderTop: "1px solid var(--divider)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            width: "4.5rem",
            height: "4.5rem",
            borderRadius: "1.2rem",
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 900,
            fontSize: "1.4rem",
            boxShadow: "var(--btn-primary-shadow-hover)",
          }}
        >
          CE
        </div>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 900,
            margin: 0,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          Ready to design your future?
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            margin: 0,
            maxWidth: "460px",
          }}
        >
          Sign in to access your CHICAD Academy portal — your courses, grades,
          attendance records, and everything from your programme in one place.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => router.push("/academy/login")}
            className="btn-primary animate-pulse-glow"
            style={{
              padding: "0.95rem 2.8rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: "0.75rem",
            }}
          >
            Access Your Portal →
          </button>
          <button
            onClick={onBackToHome}
            className="btn-secondary"
            style={{
              padding: "0.95rem 2rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "0.75rem",
            }}
          >
            ← Back to Home
          </button>
        </div>
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          📍 Head Office: Yaoundé, Cameroon · 🔒 Secure encrypted portal
        </p>
      </div>
    </section>
  );
}
