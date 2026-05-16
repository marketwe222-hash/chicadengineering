"use client";

import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";

/* ─── Team Data ───────────────────────────────────────────── */
const TEAM = [
  {
    name: "Engr. Chi",
    title: "CEO and Director",
    initials: "FC",
    image: "/images/chi.jpeg",
    gradientFrom: "#0ea5e9",
    gradientTo: "#6366f1",
    bio: "A passionate civil engineer and educator dedicated to bridging the gap between academic theory and real-world design practice. Founded CHICAD Academy to equip the next generation of Cameroonian engineers with world-class CAD skills.",
    qualifications: [
      "B.Eng. Civil Engineering",
      "Autodesk Certified Professional",
      "Robot Structural & Revit",
    ],
    social: {
      linkedin: "#",
      email: "founder@chicad.com",
    },
  },
  {
    name: "Engr. Makoubo Krystie",
    title: "Assistant Manager & Instructor",
    initials: "AM",
    image: "/images/sec.jpeg",
    gradientFrom: "#f97316",
    gradientTo: "#eab308",
    bio: "An architectural design specialist with hands-on experience in Revit Architecture, Lumion, and ArchiCAD. Brings industry project experience into every training session, helping students build portfolios that stand out.",
    qualifications: [
      "B.Eng. Architecture",
      "Revit Architecture Certified",
      "Lumion & ArchiCAD Expert",
    ],
    social: {
      linkedin: "#",
      email: "assistant@chicad.com",
    },
  },
];

/* ─── Stat Pills ──────────────────────────────────────────── */
const PILLS = [
  { icon: "📍", label: "Yaoundé, Cameroon" },
  { icon: "🏗️", label: "Registered CAD Centre" },
  { icon: "🎓", label: "2–3 Month Programme" },
  { icon: "🖥️", label: "8+ Software Tools" },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Precision",
    desc: "Technical accuracy in every design, every time.",
  },
  {
    icon: "🤝",
    title: "Community",
    desc: "Building a network of engineers who lift each other.",
  },
  {
    icon: "🚀",
    title: "Innovation",
    desc: "Staying current with the latest industry tools.",
  },
  {
    icon: "🌍",
    title: "Impact",
    desc: "Training talent that shapes Cameroon's built environment.",
  },
];

/* ─── Icons ───────────────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Glass surface helper — inline style shorthand ── */
const glassStyle = (
  extraBg = "rgba(14,111,168,0.12)",
): React.CSSProperties => ({
  background: extraBg,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(125,211,252,0.18)",
  boxShadow:
    "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
});

/* ─── Team Card ───────────────────────────────────────────── */
function TeamCard({ person }: { person: (typeof TEAM)[0] }) {
  return (
    <div
      style={{
        ...glassStyle("rgba(14,111,168,0.10)"),
        borderRadius: "1.25rem",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(14,111,168,0.18)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 16px 56px rgba(5,20,40,0.70), 0 1px 0 rgba(255,255,255,0.08) inset";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(14,111,168,0.10)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset";
      }}
    >
      {/* ── Top: Photo ── */}
      <div style={{ position: "relative", height: "260px", flexShrink: 0 }}>
        {/* Photo fills the container */}
        <img
          src={person.image}
          alt={person.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        {/* Gradient overlay on photo — creates depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${person.gradientFrom}cc 0%, ${person.gradientFrom}22 40%, transparent 70%)`,
          }}
        />
        {/* Glass name tag at bottom of photo */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#fff",
              background: `linear-gradient(135deg, ${person.gradientFrom} 0%, ${person.gradientTo} 100%)`,
              borderRadius: "99px",
              padding: "0.3rem 0.8rem",
              letterSpacing: "0.02em",
              boxShadow: `0 2px 12px ${person.gradientFrom}66`,
            }}
          >
            {person.title}
          </span>
        </div>
      </div>

      {/* ── Bottom: Details ── */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          flex: 1,
        }}
      >
        {/* Name + accent bar */}
        <div>
          <h3
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.2rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.025em",
            }}
          >
            {person.name}
          </h3>
          <div
            style={{
              height: "3px",
              width: "2.5rem",
              borderRadius: "99px",
              background: `linear-gradient(90deg, ${person.gradientFrom}, ${person.gradientTo})`,
              boxShadow: `0 0 8px ${person.gradientFrom}88`,
            }}
          />
        </div>

        {/* Bio */}
        <p
          style={{
            margin: 0,
            fontSize: "0.83rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
          }}
        >
          {person.bio}
        </p>

        {/* Qualifications */}
        <div>
          <p
            style={{
              fontSize: "0.67rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "0 0 0.6rem",
            }}
          >
            Qualifications
          </p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            {person.qualifications.map((q, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  fontSize: "0.81rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    borderRadius: "50%",
                    background: `${person.gradientFrom}20`,
                    border: `1px solid ${person.gradientFrom}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon color={person.gradientFrom} />
                </span>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Social links */}
        <div
          style={{
            display: "flex",
            gap: "0.55rem",
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(125,211,252,0.12)",
          }}
        >
          {[
            {
              href: person.social.linkedin,
              icon: <LinkedInIcon />,
              label: "LinkedIn",
              hoverColor: "#0a66c2",
            },
            {
              href: `mailto:${person.social.email}`,
              icon: <MailIcon />,
              label: "Email",
              hoverColor: person.gradientFrom,
            },
          ].map(({ href, icon, label, hoverColor }) => (
            <a
              key={label}
              href={href}
              target={label === "LinkedIn" ? "_blank" : undefined}
              rel={label === "LinkedIn" ? "noopener noreferrer" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(125,211,252,0.18)",
                background: "rgba(14,111,168,0.10)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = hoverColor;
                e.currentTarget.style.borderColor = hoverColor + "88";
                e.currentTarget.style.background = hoverColor + "18";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "rgba(125,211,252,0.18)";
                e.currentTarget.style.background = "rgba(14,111,168,0.10)";
              }}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function AboutPage() {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        {/* ── Background scene ── */}
        {/* Layer 1: actual image, slightly visible */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url(/images/hero-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.38,
            zIndex: -2,
          }}
        />
        {/* Layer 2: colored orbs/glow for depth — glass needs rich bg to blur against */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: `
              radial-gradient(ellipse 60% 50% at 20% 30%, rgba(14,111,168,0.20) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 80% 70%, rgba(99,102,241,0.14) 0%, transparent 55%),
              radial-gradient(ellipse 40% 35% at 60% 15%, rgba(14,111,168,0.12) 0%, transparent 50%),
              linear-gradient(145deg, rgba(7,24,40,0.75) 0%, rgba(10,34,54,0.70) 40%, rgba(6,14,24,0.80) 100%)
            `,
            zIndex: -1,
          }}
        />

        <Header onSignIn={() => router.push("/academy/login")} />

        {/* ── HERO SECTION ── */}
        <section
          style={{
            padding: "7rem clamp(1.5rem, 5vw, 3rem) 4rem",
            borderBottom: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "var(--sky, #7dd3fc)",
                textTransform: "uppercase",
                margin: "0 0 0.85rem",
              }}
            >
              Who We Are
            </p>

            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 900,
                margin: "0 0 1.5rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                maxWidth: "700px",
              }}
            >
              The Creative Hub for{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #7dd3fc 0%, #6366f1 50%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Civil & Architectural
              </span>{" "}
              Design
            </h1>

            <div
              className="hero-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3rem",
                alignItems: "start",
              }}
            >
              {/* Left: copy + buttons */}
              <div>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 1.25rem",
                  }}
                >
                  CHICAD Academy is a{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    registered CAD centre
                  </strong>{" "}
                  that builds and shapes the minds of civil engineering and
                  architectural students using industry-leading design tools.
                </p>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 2rem",
                  }}
                >
                  Our intensive{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    3,6 month programmes
                  </strong>{" "}
                  blends theory with real construction site visits — plus
                  leadership skills, client acquisition strategies and
                  professional networking. Based in{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    Yaoundé, Cameroon
                  </strong>
                  .
                </p>
                <div
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => router.push("/academy")}
                    className="btn-primary"
                    style={{
                      padding: "0.8rem 1.8rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      borderRadius: "0.6rem",
                    }}
                  >
                    Join the Programme
                  </button>
                  <a
                    href="#team"
                    className="btn-secondary"
                    style={{
                      padding: "0.8rem 1.8rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      borderRadius: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Meet the Team
                  </a>
                </div>
              </div>

              {/* Right: stat pills — frosted glass cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                {PILLS.map((pill, i) => (
                  <div
                    key={i}
                    style={{
                      ...glassStyle("rgba(14,111,168,0.12)"),
                      borderRadius: "0.85rem",
                      padding: "1rem 1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{pill.icon}</span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1.3,
                      }}
                    >
                      {pill.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION STRIP ── */}
        <section
          style={{
            padding: "3rem clamp(1.5rem, 5vw, 3rem)",
            /* Glass-on-gradient strip */
            background: "rgba(14,111,168,0.18)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(125,211,252,0.15)",
            borderBottom: "1px solid rgba(125,211,252,0.10)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          <div
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(125,211,252,0.7)",
                margin: 0,
              }}
            >
              Our Mission
            </p>
            <p
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.45,
                maxWidth: "680px",
                letterSpacing: "-0.02em",
              }}
            >
              "To equip every student with the tools, skills and confidence to
              design, build and lead in Africa's growing construction industry."
            </p>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section id="team" style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ marginBottom: "3rem" }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "var(--sky, #7dd3fc)",
                  textTransform: "uppercase",
                  margin: "0 0 0.6rem",
                }}
              >
                Our Team
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  fontWeight: 900,
                  margin: "0 0 0.75rem",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                The People Behind CHICAD
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                  maxWidth: "480px",
                  lineHeight: 1.7,
                }}
              >
                Experienced engineers and educators who combine professional
                practice with a passion for teaching.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                alignItems: "stretch",
              }}
            >
              {TEAM.map((person, i) => (
                <TeamCard key={i} person={person} />
              ))}
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "var(--sky, #7dd3fc)",
                  textTransform: "uppercase",
                  margin: "0 0 0.6rem",
                }}
              >
                Our Values
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 900,
                  margin: 0,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                What We Stand For
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1px",
                /* The outer "frame" is glass */
                ...glassStyle("rgba(14,111,168,0.08)"),
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              {VALUES.map((val, i) => (
                <div
                  key={i}
                  style={{
                    /* Each cell is slightly darker glass */
                    background: "rgba(7,24,40,0.45)",
                    backdropFilter: "blur(20px) saturate(160%)",
                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                    padding: "1.75rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    borderRight:
                      i < VALUES.length - 1
                        ? "1px solid rgba(125,211,252,0.08)"
                        : "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(7,24,40,0.45)";
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{val.icon}</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {val.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 5rem; }

        @media (max-width: 640px) {
          .team-card-grid { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
