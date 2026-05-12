// ─── Data ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "In just 10 weeks I went from knowing nothing about Revit to producing full BIM models and structural drawings. The site visit made everything click.",
    name: "Cyrille M.",
    role: "Architecture Graduate, Yaoundé",
    avatar: "CM",
    accent: "var(--sky)",
  },
  {
    quote:
      "The SAP2000 and Robot Structural Analysis training is incredibly thorough. I now use both daily at my firm. CHICAD prepared me better than university did.",
    name: "Nathalie B.",
    role: "Structural Engineer, 2024 Cohort",
    avatar: "NB",
    accent: "#10b981",
  },
  {
    quote:
      "The marketing module was unexpected but invaluable. Within a month of graduating I had secured my first two private clients for residential plans.",
    name: "Patrick E.",
    role: "Freelance Architect, 2023 Cohort",
    avatar: "PE",
    accent: "var(--orange)",
  },
];

export function TestimonialsSection() {
  return (
    <section
      style={{
        padding: "5.5rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-gradient)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--sky)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            SUCCESS STORIES
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            What Our Graduates Say
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Real feedback from real engineers and architects who transformed
            their careers through CHICAD Academy.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                borderLeft: `4px solid ${t.accent}`,
              }}
            >
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "auto",
                }}
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: t.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      margin: 0,
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.73rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
