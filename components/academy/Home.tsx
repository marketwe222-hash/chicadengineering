"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "./HeroSection";
import { Header, Footer } from "@/components/academy";

/* ─── Glass surface helper (consistent with Software & Programmes pages) ── */
const glassStyle = (bg = "rgba(14,111,168,0.12)"): React.CSSProperties => ({
  background: bg,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(125,211,252,0.18)",
  boxShadow:
    "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
});

/* ─── DATA ────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "500+", label: "Graduates" },
  { value: "8", label: "Software Tools" },
  { value: "95%", label: "Job Placement" },
  { value: "15+", label: "Partner Firms" },
];

const PROGRAMMES_PREVIEW = [
  {
    icon: "⚡",
    name: "3-Month Intensive",
    price: "750,000 CFA",
    tag: "Most Popular",
    desc: "8 tools, hands-on projects, and job placement support — for those who want results fast.",
    gradientFrom: "#0ea5e9",
    gradientTo: "#6366f1",
    href: "/academy/programmes",
  },
  {
    icon: "🏆",
    name: "6-Month Comprehensive",
    price: "1,200,000 CFA",
    tag: "Complete Mastery",
    desc: "Every tool, site visits, professional certification, and a guaranteed internship.",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    href: "/academy/programmes",
  },
  {
    icon: "🎯",
    name: "Single Software Courses",
    price: "65K – 130K CFA",
    tag: "Flexible",
    desc: "Pick exactly the tool you need — AutoCAD, Revit, SAP2000, Lumion and more.",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    href: "/academy/software",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📝",
    title: "Register & Choose a Path",
    desc: "Select a full programme or a single software course that matches your goals and schedule.",
    gradientFrom: "#0ea5e9",
    gradientTo: "#6366f1",
  },
  {
    step: "02",
    icon: "💻",
    title: "Learn Hands-On",
    desc: "Daily sessions in our computer lab using licensed software with expert instructors and real project briefs.",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
  },
  {
    step: "03",
    icon: "🏗️",
    title: "Build Your Portfolio",
    desc: "Complete real-world construction projects and site visits that become the centrepiece of your CV.",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
  },
  {
    step: "04",
    icon: "🚀",
    title: "Launch Your Career",
    desc: "Graduate with a certified portfolio, industry connections, and our job placement team behind you.",
    gradientFrom: "#ec4899",
    gradientTo: "#be185d",
  },
];

const SOFTWARE_PREVIEW = [
  { icon: "📐", name: "AutoCAD", cat: "2D Drafting", color: "#ff6b35" },
  { icon: "🏗️", name: "Revit Architecture", cat: "BIM", color: "#3b82f6" },
  { icon: "⚡", name: "SAP2000", cat: "Structural Analysis", color: "#059669" },
  { icon: "🏢", name: "ETABS", cat: "Building Analysis", color: "#7c3aed" },
  { icon: "🪨", name: "SAFE", cat: "Foundation Design", color: "#dc2626" },
  { icon: "🎨", name: "Lumion", cat: "Visualisation", color: "#ec4899" },
  { icon: "🏛️", name: "ArchiCAD", cat: "Architectural BIM", color: "#f59e0b" },
  { icon: "📦", name: "SketchUp Pro", cat: "3D Modelling", color: "#10b981" },
];

const TESTIMONIALS = [
  {
    quote:
      "In just 10 weeks I went from knowing nothing about Revit to producing full BIM models and structural drawings. The site visit made everything click.",
    name: "Cyrille M.",
    role: "Architecture Graduate, Yaoundé",
    avatar: "CM",
    accent: "#0ea5e9",
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
    accent: "#f59e0b",
  },
];

const INSTRUCTORS = [
  {
    initials: "JA",
    name: "Jean-Paul Abanda",
    title: "Lead CAD Instructor",
    bio: "12 years structural engineering practice. Autodesk Certified Professional in Revit and AutoCAD.",
    color: "#0ea5e9",
  },
  {
    initials: "MN",
    name: "Marie-Claire Nguema",
    title: "Architectural BIM Specialist",
    bio: "Former principal architect at Studio Bâtir. Expert in ArchiCAD, BIM coordination and Lumion visualisation.",
    color: "#ec4899",
  },
  {
    initials: "BF",
    name: "Blaise Fouda",
    title: "Structural Analysis Expert",
    bio: "PhD Civil Engineering, University of Yaoundé I. Specialist in SAP2000, ETABS and seismic design.",
    color: "#10b981",
  },
];

const FAQS = [
  {
    q: "Who can join CHICAD Academy?",
    a: "Any student or professional with an interest in civil engineering, architecture, or construction. No prior CAD experience is required for our foundation courses.",
  },
  {
    q: "How long are the programmes?",
    a: "Our intensive programmes run 3 or 6 months. Individual software courses range from 3 to 8 weeks depending on the tool.",
  },
  {
    q: "Do I receive a certificate?",
    a: "Yes. All programme graduates receive a CHICAD Certificate of Completion. The 6-month programme also prepares you for official Autodesk certification exams.",
  },
  {
    q: "Can I enrol in more than one course at a time?",
    a: "No — to maximise focus and practical results, students enrol in one programme or one software course at a time.",
  },
  {
    q: "Is job placement guaranteed?",
    a: "Job placement support is included in all programmes. The 6-month programme includes a guaranteed internship placement through our network of 15+ partner firms.",
  },
  {
    q: "Where are classes held?",
    a: "All training takes place at our computer lab in Yaoundé, Cameroon. We provide licensed software on all workstations.",
  },
];

/* ─── Section label helper ─────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </h2>
  );
}

/* ─── FAQ Item ─────────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        ...glassStyle(open ? "rgba(14,111,168,0.18)" : "rgba(14,111,168,0.08)"),
        borderRadius: "0.85rem",
        overflow: "hidden",
        transition: "all 0.25s ease",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span
          style={{
            width: "1.6rem",
            height: "1.6rem",
            borderRadius: "50%",
            background: open
              ? "rgba(14,111,168,0.35)"
              : "rgba(125,211,252,0.12)",
            border: "1px solid rgba(125,211,252,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--sky, #7dd3fc)",
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: 1,
            transition: "all 0.25s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p
          style={{
            margin: 0,
            padding: "0 1.5rem 1.25rem",
            fontSize: "0.83rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Home Component ──────────────────────────────────────────────────── */
export default function Home({
  onSignIn,
  onBackToHome,
}: {
  onSignIn: () => void;
  onBackToHome: () => void;
}) {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        {/* ════════════════════════════════════════════
            GLOBAL BACKGROUND — fixed behind everything
            (same as Software & Programmes pages)
        ════════════════════════════════════════════ */}
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

        <Header onSignIn={onSignIn} />

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        {/* HeroSection already has its own full-bleed photo; it sits above the
            fixed background naturally because its slides are position:absolute
            inside a position:relative section. */}
        <HeroSection onSignIn={onSignIn} />

        {/* ── 2. STATS STRIP ──────────────────────────────────────────────── */}
        <section
          style={{
            padding: "0 clamp(1.5rem, 5vw, 3rem)",
            background: "rgba(14,111,168,0.18)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: "1px solid rgba(125,211,252,0.12)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          <div
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
            }}
            className="stats-grid"
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid rgba(125,211,252,0.12)"
                      : "none",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.25rem",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    background:
                      "linear-gradient(135deg, #7dd3fc 0%, #6366f1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. ABOUT / WHY CHICAD ───────────────────────────────────────── */}
        <section
          style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}
          id="about"
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4rem",
                alignItems: "center",
              }}
              className="about-grid"
            >
              {/* Left: text */}
              <div>
                <SectionLabel>About CHICAD Academy</SectionLabel>
                <SectionHeading>
                  Registered CAD Training Centre in{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #7dd3fc 0%, #6366f1 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Yaoundé
                  </span>
                </SectionHeading>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 1.25rem",
                  }}
                >
                  CHICAD Academy is a registered CAD training centre dedicated
                  to building and shaping the minds of civil engineering and
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
                  Beyond software, we teach leadership, client acquisition, and
                  professional networking — so graduates thrive from their very
                  first day in the industry.
                </p>
                <div
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  <button
                    onClick={onSignIn}
                    className="btn-primary"
                    style={{
                      padding: "0.8rem 1.8rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      borderRadius: "0.6rem",
                    }}
                  >
                    Access Portal →
                  </button>
                  <button
                    onClick={() => router.push("/academy/programmes")}
                    className="btn-secondary"
                    style={{
                      padding: "0.8rem 1.8rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      borderRadius: "0.6rem",
                    }}
                  >
                    View Programmes
                  </button>
                </div>
              </div>

              {/* Right: pillars grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.85rem",
                }}
              >
                {[
                  {
                    icon: "🎯",
                    title: "Hands-On Focus",
                    desc: "Every module includes real projects and case studies from Cameroon.",
                  },
                  {
                    icon: "📜",
                    title: "Certified Training",
                    desc: "Industry-recognised qualifications upon completion.",
                  },
                  {
                    icon: "💼",
                    title: "Job Placement",
                    desc: "Direct access to 15+ partner construction firms.",
                  },
                  {
                    icon: "🔄",
                    title: "Lifetime Support",
                    desc: "Community access and ongoing learning resources.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      ...glassStyle("rgba(14,111,168,0.12)"),
                      borderRadius: "1rem",
                      padding: "1.25rem",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(14,111,168,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(14,111,168,0.12)";
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.4rem",
                        display: "block",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {item.icon}
                    </span>
                    <p
                      style={{
                        margin: "0 0 0.35rem",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
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
          </div>
        </section>

        {/* ── DIVIDER STRIP ───────────────────────────────────────────────── */}
        <div
          style={{
            padding: "2.5rem clamp(1.5rem, 5vw, 3rem)",
            background: "rgba(14,111,168,0.18)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(125,211,252,0.15)",
            borderBottom: "1px solid rgba(125,211,252,0.10)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.25rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.5,
              maxWidth: "640px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            "From basic 2D drafting to complex structural analysis — we guide
            you through every step of becoming a proficient CAD professional."
          </p>
        </div>

        {/* ── 4. PROGRAMMES PREVIEW ───────────────────────────────────────── */}
        <section style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel>Choose Your Path</SectionLabel>
              <SectionHeading>Training Programmes</SectionHeading>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: "0 auto",
                  maxWidth: "520px",
                  lineHeight: 1.7,
                }}
              >
                Flexible learning options designed for different career goals
                and time commitments.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              {PROGRAMMES_PREVIEW.map((p, i) => (
                <div
                  key={i}
                  style={{
                    ...glassStyle("rgba(14,111,168,0.10)"),
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(p.href)}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(14,111,168,0.20)";
                    el.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(14,111,168,0.10)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {/* Gradient top bar */}
                  <div
                    style={{
                      height: "3px",
                      background: `linear-gradient(90deg, ${p.gradientFrom} 0%, ${p.gradientTo} 100%)`,
                    }}
                  />
                  <div style={{ padding: "1.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          borderRadius: "0.75rem",
                          background: `linear-gradient(135deg, ${p.gradientFrom} 0%, ${p.gradientTo} 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem",
                          boxShadow: `0 4px 16px ${p.gradientFrom}44`,
                        }}
                      >
                        {p.icon}
                      </div>
                      <span
                        style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: "999px",
                          background: `${p.gradientFrom}18`,
                          border: `1px solid ${p.gradientFrom}40`,
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          color: p.gradientFrom,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "1.05rem",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.name}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 1.25rem",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                      }}
                    >
                      {p.desc}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "1rem",
                        borderTop: "1px solid rgba(125,211,252,0.10)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 900,
                          color: p.gradientFrom,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {p.price}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                        }}
                      >
                        Learn more →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => router.push("/academy/programmes")}
                className="btn-secondary"
                style={{
                  padding: "0.85rem 2.2rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "0.7rem",
                }}
              >
                Compare All Programmes →
              </button>
            </div>
          </div>
        </section>

        {/* ── 5. HOW IT WORKS ─────────────────────────────────────────────── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <SectionLabel>The Process</SectionLabel>
              <SectionHeading>How It Works</SectionHeading>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: "0 auto",
                  maxWidth: "480px",
                  lineHeight: 1.7,
                }}
              >
                From registration to career launch — a clear four-step journey.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: "1.25rem",
                position: "relative",
              }}
            >
              {HOW_IT_WORKS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    ...glassStyle("rgba(14,111,168,0.10)"),
                    borderRadius: "1.25rem",
                    padding: "2rem 1.5rem",
                    position: "relative",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.20)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.10)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {/* Step number watermark */}
                  <div
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "1.25rem",
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      color: `${step.gradientFrom}18`,
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "0.85rem",
                      background: `linear-gradient(135deg, ${step.gradientFrom} 0%, ${step.gradientTo} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      marginBottom: "1.25rem",
                      boxShadow: `0 4px 16px ${step.gradientFrom}44`,
                    }}
                  >
                    {step.icon}
                  </div>

                  <h3
                    style={{
                      margin: "0 0 0.6rem",
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Connector arrow (not on last) */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "-0.85rem",
                        transform: "translateY(-50%)",
                        fontSize: "0.9rem",
                        color: "rgba(125,211,252,0.35)",
                        zIndex: 2,
                      }}
                      className="step-arrow"
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. SOFTWARE TOOLS PREVIEW ───────────────────────────────────── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              <div>
                <SectionLabel>8 Professional Tools</SectionLabel>
                <SectionHeading>Software You'll Master</SectionHeading>
              </div>
              <button
                onClick={() => router.push("/academy/software")}
                className="btn-secondary"
                style={{
                  padding: "0.7rem 1.5rem",
                  fontSize: "0.83rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "0.6rem",
                  flexShrink: 0,
                }}
              >
                View All Tools →
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "0.85rem",
              }}
            >
              {SOFTWARE_PREVIEW.map((sw, i) => (
                <div
                  key={i}
                  style={{
                    ...glassStyle("rgba(14,111,168,0.10)"),
                    borderRadius: "1rem",
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push("/academy/software")}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(14,111,168,0.22)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "rgba(14,111,168,0.10)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "0.6rem",
                      background: `${sw.color}22`,
                      border: `1px solid ${sw.color}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {sw.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0 0 0.1rem",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        lineHeight: 1.2,
                      }}
                    >
                      {sw.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: sw.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {sw.cat}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. TESTIMONIALS ─────────────────────────────────────────────── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel>Success Stories</SectionLabel>
              <SectionHeading>What Our Graduates Say</SectionHeading>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: "0 auto",
                  maxWidth: "520px",
                  lineHeight: 1.7,
                }}
              >
                Real feedback from engineers and architects who transformed
                their careers through CHICAD Academy.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  style={{
                    ...glassStyle("rgba(14,111,168,0.10)"),
                    borderRadius: "1.25rem",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    borderLeft: `3px solid ${t.accent}`,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.20)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.10)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {/* Quote mark */}
                  <div
                    style={{
                      fontSize: "3rem",
                      lineHeight: 0.8,
                      color: `${t.accent}44`,
                      fontWeight: 900,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    "
                  </div>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.75,
                      margin: 0,
                      fontStyle: "italic",
                      marginTop: "-1rem",
                    }}
                  >
                    {t.quote}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginTop: "auto",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(125,211,252,0.10)",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: `${t.accent}22`,
                        border: `2px solid ${t.accent}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: t.accent,
                        fontWeight: 800,
                        fontSize: "0.72rem",
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 800,
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

        {/* ── 8. MEET THE INSTRUCTORS ─────────────────────────────────────── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel>The Team</SectionLabel>
              <SectionHeading>Meet Your Instructors</SectionHeading>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: "0 auto",
                  maxWidth: "480px",
                  lineHeight: 1.7,
                }}
              >
                Certified professionals with decades of real-world engineering
                and architecture practice.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {INSTRUCTORS.map((inst, i) => (
                <div
                  key={i}
                  style={{
                    ...glassStyle("rgba(14,111,168,0.10)"),
                    borderRadius: "1.25rem",
                    padding: "2rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.20)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(14,111,168,0.10)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "50%",
                      background: `${inst.color}22`,
                      border: `2px solid ${inst.color}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: 900,
                      color: inst.color,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {inst.initials}
                  </div>
                  <p
                    style={{
                      margin: "0 0 0.2rem",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {inst.name}
                  </p>
                  <p
                    style={{
                      margin: "0 0 0.85rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: inst.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {inst.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {inst.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SectionLabel>Common Questions</SectionLabel>
              <SectionHeading>Frequently Asked Questions</SectionHeading>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. FINAL CTA ───────────────────────────────────────────────── */}
        <section
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.15)",
            background: "rgba(14,111,168,0.18)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <div
            style={{
              maxWidth: "640px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <SectionLabel>Ready to Begin?</SectionLabel>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                margin: "0 0 1rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
              }}
            >
              Build a Career That{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #7dd3fc 0%, #6366f1 50%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Lasts
              </span>
            </h2>
            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                margin: "0 0 2.5rem",
              }}
            >
              Join hundreds of engineers and architects who transformed their
              careers with CHICAD Academy. Enrolment is open — seats are
              limited.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.85rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={onSignIn}
                className="btn-primary"
                style={{
                  padding: "1rem 2.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  borderRadius: "0.7rem",
                }}
              >
                Access Your Portal →
              </button>
              <button
                onClick={() => router.push("/academy/programmes")}
                className="btn-secondary"
                style={{
                  padding: "1rem 2.2rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "0.7rem",
                }}
              >
                Browse Programmes
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 5rem; }

        @media (max-width: 640px) {
          .stats-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid  { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .step-arrow  { display: none !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
