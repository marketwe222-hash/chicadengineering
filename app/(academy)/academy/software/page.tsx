"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";

/* ─── Software Data ───────────────────────────────────────── */
const SOFTWARE_TOOLS = [
  {
    name: "AutoCAD",
    category: "2D Drafting & Design",
    icon: "📐",
    description:
      "Industry-standard 2D drafting software for creating precise technical drawings, floor plans, and construction documents.",
    features: [
      "2D drafting and annotation",
      "Parametric drawing tools",
      "Layer management",
      "Block libraries",
      "PDF export capabilities",
    ],
    level: "Beginner to Advanced",
    duration: "4 weeks",
    gradientFrom: "#ff6b35",
    gradientTo: "#f7931e",
  },
  {
    name: "Revit Architecture",
    category: "BIM Software",
    icon: "🏗️",
    description:
      "Building Information Modeling software for creating intelligent 3D models of buildings with parametric components.",
    features: [
      "3D parametric modeling",
      "Building systems integration",
      "Construction documentation",
      "Quantity takeoffs",
      "Collaboration tools",
    ],
    level: "Intermediate to Advanced",
    duration: "6 weeks",
    gradientFrom: "#3b82f6",
    gradientTo: "#1d4ed8",
  },
  {
    name: "SAP2000",
    category: "Structural Analysis",
    icon: "⚡",
    description:
      "Advanced structural analysis and design software for modeling, analyzing, and designing any type of civil engineering project.",
    features: [
      "Static and dynamic analysis",
      "Steel and concrete design",
      "Foundation design",
      "Bridge analysis",
      "Seismic analysis",
    ],
    level: "Advanced",
    duration: "8 weeks",
    gradientFrom: "#059669",
    gradientTo: "#047857",
  },
  {
    name: "ETABS",
    category: "Building Analysis",
    icon: "🏢",
    description:
      "Integrated software package for the analysis and design of building systems, specializing in multi-story building structures.",
    features: [
      "3D building modeling",
      "Automated load generation",
      "Steel and concrete design",
      "Performance-based design",
      "Wind and seismic analysis",
    ],
    level: "Advanced",
    duration: "8 weeks",
    gradientFrom: "#7c3aed",
    gradientTo: "#5b21b6",
  },
  {
    name: "SAFE",
    category: "Foundation Design",
    icon: "🪨",
    description:
      "Specialized software for the analysis and design of concrete floor and foundation systems, including post-tensioning.",
    features: [
      "Slab analysis and design",
      "Foundation design",
      "Post-tensioned concrete",
      "Mat foundation analysis",
      "Soil-structure interaction",
    ],
    level: "Advanced",
    duration: "6 weeks",
    gradientFrom: "#dc2626",
    gradientTo: "#b91c1c",
  },
  {
    name: "Lumion",
    category: "3D Visualization",
    icon: "🎨",
    description:
      "Real-time 3D visualization software for creating stunning renderings, animations, and virtual reality experiences.",
    features: [
      "Real-time rendering",
      "Animation tools",
      "Material libraries",
      "Lighting effects",
      "VR export capabilities",
    ],
    level: "Intermediate",
    duration: "4 weeks",
    gradientFrom: "#ec4899",
    gradientTo: "#be185d",
  },
  {
    name: "ArchiCAD",
    category: "Architectural BIM",
    icon: "🏛️",
    description:
      "Architectural BIM software that supports the entire design workflow from concept to construction documentation.",
    features: [
      "Virtual building modeling",
      "Energy analysis",
      "Construction documentation",
      "Team collaboration",
      "Open BIM workflow",
    ],
    level: "Intermediate to Advanced",
    duration: "6 weeks",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
  },
  {
    name: "SketchUp Pro",
    category: "3D Modeling",
    icon: "📦",
    description:
      "Intuitive 3D modeling software perfect for conceptual design, prototyping, and visualization of architectural projects.",
    features: [
      "3D modeling tools",
      "Component libraries",
      "Terrain modeling",
      "Extension ecosystem",
      "DWG/DXF import/export",
    ],
    level: "Beginner to Intermediate",
    duration: "3 weeks",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
  },
];

const CATEGORIES = [
  { name: "2D Drafting", count: 1, icon: "📐" },
  { name: "BIM Software", count: 2, icon: "🏗️" },
  { name: "Structural Analysis", count: 2, icon: "⚡" },
  { name: "Foundation Design", count: 1, icon: "🪨" },
  { name: "Visualization", count: 1, icon: "🎨" },
  { name: "3D Modeling", count: 1, icon: "📦" },
];

const WHY_ITEMS = [
  {
    icon: "🎯",
    title: "Hands-On Learning",
    desc: "Every software module includes practical projects and real construction case studies.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Instructors",
    desc: "Learn from certified professionals with years of industry experience.",
  },
  {
    icon: "📜",
    title: "Certified Training",
    desc: "Official certifications and industry-recognized qualifications upon completion.",
  },
  {
    icon: "🚀",
    title: "Career Ready",
    desc: "Graduate with a portfolio of projects and the skills employers are looking for.",
  },
  {
    icon: "💼",
    title: "Job Placement",
    desc: "Access to our network of construction companies and recruitment partners.",
  },
  {
    icon: "🔄",
    title: "Lifetime Support",
    desc: "Free software updates, community access, and ongoing learning resources.",
  },
];

/* ─── Icons ───────────────────────────────────────────────── */
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

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LevelIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

/* ─── Glass surface helper ────────────────────────────────── */
const glassStyle = (bg = "rgba(14,111,168,0.12)"): React.CSSProperties => ({
  background: bg,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(125,211,252,0.18)",
  boxShadow:
    "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
});

/* ─── Software Card ───────────────────────────────────────── */
function SoftwareCard({ software }: { software: (typeof SOFTWARE_TOOLS)[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        ...glassStyle("rgba(14,111,168,0.10)"),
        borderRadius: "1.25rem",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(14,111,168,0.18)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 16px 56px rgba(5,20,40,0.70), 0 1px 0 rgba(255,255,255,0.08) inset";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background =
          "rgba(14,111,168,0.10)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* ── Card Header ── */}
      <div
        style={{
          padding: "1.5rem",
          borderBottom: isExpanded
            ? "1px solid rgba(125,211,252,0.12)"
            : "none",
          background: `linear-gradient(135deg, ${software.gradientFrom}12 0%, ${software.gradientTo}08 100%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Icon bubble */}
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "0.75rem",
              background: `linear-gradient(135deg, ${software.gradientFrom} 0%, ${software.gradientTo} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
              boxShadow: `0 4px 16px ${software.gradientFrom}44`,
            }}
          >
            {software.icon}
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 0.2rem",
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {software.name}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                fontWeight: 700,
                color: software.gradientFrom,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {software.category}
            </p>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              border: "1px solid rgba(125,211,252,0.20)",
              background: "rgba(14,111,168,0.15)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${software.gradientFrom}28`;
              e.currentTarget.style.borderColor = `${software.gradientFrom}66`;
              e.currentTarget.style.color = software.gradientFrom;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(14,111,168,0.15)";
              e.currentTarget.style.borderColor = "rgba(125,211,252,0.20)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      {/* ── Expandable Content ── */}
      <div
        style={{
          padding: isExpanded ? "1.5rem" : "0 1.5rem",
          maxHeight: isExpanded ? "600px" : "0",
          overflow: "hidden",
          transition: "all 0.35s ease",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <p
          style={{
            margin: "0 0 1.25rem",
            fontSize: "0.83rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          {software.description}
        </p>

        {/* Features grid */}
        <div style={{ marginBottom: "1.25rem" }}>
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
            Key Features
          </p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.45rem",
            }}
          >
            {software.features.map((feature, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: "1.1rem",
                    height: "1.1rem",
                    borderRadius: "50%",
                    background: `${software.gradientFrom}18`,
                    border: `1px solid ${software.gradientFrom}38`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon color={software.gradientFrom} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            <LevelIcon />
            <span style={{ fontWeight: 600 }}>{software.level}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            <ClockIcon />
            <span style={{ fontWeight: 600 }}>{software.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function SoftwarePage() {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        {/* ── Background scene — identical to About page ── */}
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

        {/* ── HERO ── */}
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
              Our Software Suite
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
              Master{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #7dd3fc 0%, #6366f1 50%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Industry-Leading
              </span>{" "}
              Design Tools
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
              {/* Left: copy */}
              <div>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 1.25rem",
                  }}
                >
                  Our comprehensive curriculum covers{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    8+ professional software tools
                  </strong>{" "}
                  used by engineers and architects worldwide. From 2D drafting
                  to advanced structural analysis, you'll gain hands-on
                  experience with the same tools used in real construction
                  projects.
                </p>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 2rem",
                  }}
                >
                  Each module is designed to build your skills progressively,
                  ensuring you can confidently apply these tools in your
                  professional career.
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
                    Start Learning
                  </button>
                  <a
                    href="#software"
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
                    Explore Tools
                  </a>
                </div>
              </div>

              {/* Right: category pills */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                {CATEGORIES.map((cat, i) => (
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
                    <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
                    <div>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1.3,
                          display: "block",
                        }}
                      >
                        {cat.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {cat.count} tool{cat.count > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LEARNING PATH STRIP — glass tinted, same as mission strip ── */}
        <section
          style={{
            padding: "3rem clamp(1.5rem, 5vw, 3rem)",
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
              Learning Path
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
              "From basic 2D drafting to complex structural analysis — we guide
              you through every step of becoming a proficient CAD professional."
            </p>
          </div>
        </section>

        {/* ── SOFTWARE TOOLS GRID ── */}
        <section
          id="software"
          style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
                Professional Tools
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
                Software You'll Master
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: "0 auto",
                  maxWidth: "540px",
                  lineHeight: 1.7,
                }}
              >
                Click any card to explore its features, learning level, and
                duration. Each tool is taught with real-world project
                applications.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {SOFTWARE_TOOLS.map((software, i) => (
                <SoftwareCard key={i} software={software} />
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
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
                Why Choose Our Training
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
                Industry-Standard Excellence
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1px",
                /* Glass outer frame */
                ...glassStyle("rgba(14,111,168,0.08)"),
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              {WHY_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(7,24,40,0.45)",
                    backdropFilter: "blur(20px) saturate(160%)",
                    WebkitBackdropFilter: "blur(20px) saturate(160%)",
                    padding: "1.75rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    borderRight:
                      i % 3 < 2 ? "1px solid rgba(125,211,252,0.08)" : "none",
                    borderBottom:
                      i < 3 ? "1px solid rgba(125,211,252,0.08)" : "none",
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
                  <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
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
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
