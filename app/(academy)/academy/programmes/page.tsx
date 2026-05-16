"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";

/* ─── Software Courses — matches register page exactly ──── */
const SOFTWARE_COURSES = [
  {
    id: "lumion",
    name: "Lumion",
    software: "Lumion",
    registrationFee: 5000,
    trainingFee: 30000,
    duration: "1 Month",
    category: "Visualization",
    description: "3D rendering & real-time visualization for architecture. Master photorealistic rendering and immersive virtual walkthroughs.",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
    icon: "🌅",
    badge: null,
  },
  {
    id: "excel",
    name: "Ms Excel",
    software: "Ms Excel",
    registrationFee: 5000,
    trainingFee: 30000,
    duration: "1 Month",
    category: "Productivity",
    description: "Advanced spreadsheets, data analysis & project management. From pivot tables to VBA macros used daily in engineering firms.",
    gradientFrom: "#22c55e",
    gradientTo: "#16a34a",
    icon: "📊",
    badge: null,
  },
  {
    id: "sap2000",
    name: "SAP2000",
    software: "SAP2000",
    registrationFee: 5000,
    trainingFee: 50000,
    duration: "2 Months",
    category: "Structural Analysis",
    description: "Structural analysis & design for buildings & bridges. Perform linear and nonlinear analysis of complex structures.",
    gradientFrom: "#fb923c",
    gradientTo: "#ea580c",
    icon: "🔩",
    badge: null,
  },
  {
    id: "abaqus",
    name: "ABAQUS",
    software: "ABAQUS",
    registrationFee: 5000,
    trainingFee: 50000,
    duration: "2 Months",
    category: "FEA",
    description: "Finite element analysis for complex structural simulations including nonlinear mechanics, dynamic analysis and fatigue prediction.",
    gradientFrom: "#e879f9",
    gradientTo: "#a21caf",
    icon: "⚙️",
    badge: null,
  },
  {
    id: "revit",
    name: "Revit",
    software: "Revit",
    registrationFee: 5000,
    trainingFee: 70000,
    duration: "3 Months",
    category: "BIM",
    description: "Building Information Modeling for architects & engineers. Model complete buildings, generate construction documents and coordinate MEP systems.",
    gradientFrom: "#7dd3fc",
    gradientTo: "#0ea5e9",
    icon: "🏗️",
    badge: "Popular",
  },
  {
    id: "autocad",
    name: "AutoCAD",
    software: "AutoCAD",
    registrationFee: 5000,
    trainingFee: 70000,
    duration: "3 Months",
    category: "CAD",
    description: "Industry-standard 2D/3D drafting & design software. Master precision drafting, 3D modeling, annotation, and sheet sets.",
    gradientFrom: "#ef4444",
    gradientTo: "#b91c1c",
    icon: "📐",
    badge: null,
  },
  {
    id: "archicad",
    name: "ArchiCAD",
    software: "ArchiCAD",
    registrationFee: 5000,
    trainingFee: 70000,
    duration: "3 Months",
    category: "BIM",
    description: "BIM software focused on architectural design & documentation. Architect-first workflow with parametric objects and teamwork collaboration.",
    gradientFrom: "#a78bfa",
    gradientTo: "#7c3aed",
    icon: "🏛️",
    badge: null,
  },
];

/* ─── Glass helper (matches software page) ─────────────────── */
/* ─── Programme Data ─────────────────────────────────────────── */
const PROGRAMMES = [
  {
    id: "3-month",
    name: "3-Month Intensive",
    duration: "3 Months",
    price: "Contact us",
    originalPrice: "",
    badge: "Most Popular",
    description:
      "Perfect for students and professionals looking to quickly gain essential CAD skills for immediate career application.",
    highlights: [
      "7 Professional Software Tools",
      "Hands-on Project Work",
      "Industry Case Studies",
      "Completion Certificate",
      "Portfolio Development",
      "Job Placement Support",
    ],
    curriculum: [
      {
        month: "Month 1",
        title: "Foundation Skills",
        tools: ["AutoCAD", "Ms Excel"],
        focus: "2D drafting, technical drawing standards, data management",
      },
      {
        month: "Month 2",
        title: "BIM & Visualization",
        tools: ["Revit", "ArchiCAD", "Lumion"],
        focus: "BIM modeling, architectural design, 3D visualization",
      },
      {
        month: "Month 3",
        title: "Structural Analysis",
        tools: ["SAP2000", "ABAQUS"],
        focus: "Structural analysis, FEA simulations, final project",
      },
    ],
    features: [
      "Daily 4-hour sessions",
      "Small class sizes (max 15 students)",
      "Practical assignments",
      "Industry guest speakers",
      "Certificate of completion",
      "Job placement support",
    ],
    gradientFrom: "#0ea5e9",
    gradientTo: "#6366f1",
    icon: "⚡",
  },
  {
    id: "6-month",
    name: "6-Month Comprehensive",
    duration: "6 Months",
    price: "Contact us",
    originalPrice: "",
    badge: "Complete Mastery",
    description:
      "The ultimate training experience for complete mastery of civil engineering design tools and professional certification.",
    highlights: [
      "All 7 Software Tools + Advanced Modules",
      "Real Construction Site Visits",
      "Professional Certification Prep",
      "Advanced Structural Analysis",
      "Leadership & Business Skills",
      "Guaranteed Job Placement",
    ],
    curriculum: [
      {
        month: "Months 1–2",
        title: "Core Foundation",
        tools: ["AutoCAD", "Ms Excel", "Revit"],
        focus: "Complete 2D/3D design workflow, parametric modeling",
      },
      {
        month: "Months 3–4",
        title: "Specialized Design",
        tools: ["ArchiCAD", "Lumion"],
        focus: "Architectural BIM, visualization, presentation",
      },
      {
        month: "Months 5–6",
        title: "Advanced Analysis",
        tools: ["SAP2000", "ABAQUS"],
        focus: "Complex structural analysis, multi-disciplinary projects",
      },
    ],
    features: [
      "Daily 6-hour intensive sessions",
      "Small class sizes (max 12 students)",
      "Real construction site visits",
      "Professional certification exams",
      "Business development training",
      "Guaranteed job placement",
      "Industry networking events",
      "Personal mentorship program",
    ],
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
    icon: "🏆",
  },
];

const glassStyle = (bg = "rgba(14,111,168,0.12)"): React.CSSProperties => ({
  background: bg,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(125,211,252,0.18)",
  boxShadow:
    "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
});

/* ─── Icons ─────────────────────────────────────────────────── */
function CheckIcon({ color = "#7dd3fc" }: { color?: string }) {
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
/* ─── Software Course Card ───────────────────────────────────── */
function SoftwareCourseCard({
  course,
  selected,
  onSelect,
}: {
  course: (typeof SOFTWARE_COURSES)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const totalFee = course.registrationFee + course.trainingFee;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "1.25rem",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered || selected ? "translateY(-4px)" : "translateY(0)",
        border: selected
          ? `2px solid ${course.gradientFrom}`
          : "1px solid rgba(125,211,252,0.18)",
        boxShadow: selected
          ? `0 0 0 3px ${course.gradientFrom}28, 0 16px 56px rgba(5,20,40,0.70)`
          : hovered
            ? "0 16px 56px rgba(5,20,40,0.70)"
            : "0 4px 24px rgba(5,20,40,0.55)",
        background: "rgba(7,24,40,0.55)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        position: "relative",
      }}
    >
      {/* Coloured top stripe */}
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${course.gradientFrom}, ${course.gradientTo})` }} />

      {/* Card body */}
      <div style={{ padding: "1.4rem 1.25rem" }}>
        {/* Icon + badge row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", boxShadow: `0 4px 16px ${course.gradientFrom}55` }}>
            {course.icon}
          </div>
          {course.badge && (
            <div style={{ padding: "0.25rem 0.7rem", borderRadius: "999px", background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`, fontSize: "0.62rem", fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              {course.badge}
            </div>
          )}
          {selected && (
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${course.gradientFrom}88` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          )}
        </div>

        <p style={{ margin: "0 0 0.2rem", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: course.gradientFrom }}>{course.category}</p>
        <h3 style={{ margin: "0 0 0.55rem", fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.25 }}>{course.name}</h3>
        <p style={{ margin: "0 0 1rem", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{course.description}</p>

        {/* Meta row */}
        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.85rem", borderTop: "1px solid rgba(125,211,252,0.10)", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
            <ClockIcon />
            <span style={{ fontWeight: 600 }}>{course.duration}</span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600 }}>Reg: {course.registrationFee.toLocaleString()} FRS</div>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "1.1rem", fontWeight: 900, color: course.gradientFrom, letterSpacing: "-0.02em" }}>{course.trainingFee.toLocaleString()} FRS</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginLeft: "0.35rem" }}>training</span>
          </div>
          <div style={{ padding: "0.45rem 1rem", borderRadius: "0.6rem", background: selected ? `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)` : "rgba(14,111,168,0.18)", border: selected ? "none" : "1px solid rgba(125,211,252,0.22)", color: selected ? "#fff" : "var(--text-primary)", fontSize: "0.73rem", fontWeight: 700, transition: "all 0.2s ease" }}>
            {selected ? "✓ Selected" : "Select"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Programme Card ─────────────────────────────────────────── */
function ProgrammeCard({ programme }: { programme: (typeof PROGRAMMES)[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        ...glassStyle("rgba(14,111,168,0.10)"),
        borderRadius: "1.5rem",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Coloured top bar */}
      <div
        style={{
          height: "4px",
          background: `linear-gradient(90deg, ${programme.gradientFrom} 0%, ${programme.gradientTo} 100%)`,
        }}
      />

      <div style={{ padding: "2rem" }}>
        {/* Badge */}
        {programme.badge && (
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.9rem",
              borderRadius: "999px",
              background: `linear-gradient(135deg, ${programme.gradientFrom} 0%, ${programme.gradientTo} 100%)`,
              fontSize: "0.65rem",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            {programme.badge}
          </div>
        )}

        {/* Title + icon row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              width: "3.25rem",
              height: "3.25rem",
              borderRadius: "1rem",
              background: `linear-gradient(135deg, ${programme.gradientFrom} 0%, ${programme.gradientTo} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
              boxShadow: `0 4px 20px ${programme.gradientFrom}44`,
            }}
          >
            {programme.icon}
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 0.2rem",
                fontSize: "1.2rem",
                fontWeight: 900,
                color: "var(--text-primary)",
                letterSpacing: "-0.025em",
              }}
            >
              {programme.name}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: programme.gradientFrom,
              }}
            >
              <ClockIcon />
              {programme.duration}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: programme.gradientFrom,
              }}
            >
              {programme.price}
            </span>
            <span
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                textDecoration: "line-through",
                fontWeight: 600,
              }}
            >
              {programme.originalPrice || ""}
            </span>
          </div>
          <p
            style={{
              margin: "0.2rem 0 0",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: programme.gradientFrom,
            }}
          >
            Early bird discount applied
          </p>
        </div>

        <p
          style={{
            margin: "0 0 1.5rem",
            fontSize: "0.87rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
          }}
        >
          {programme.description}
        </p>

        {/* Highlights grid */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p
            style={{
              margin: "0 0 0.6rem",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            What's Included
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
            }}
          >
            {programme.highlights.map((h: string, j: number) => (
              <div
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
                    background: `${programme.gradientFrom}18`,
                    border: `1px solid ${programme.gradientFrom}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon color={programme.gradientFrom} />
                </span>
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: "100%",
            padding: "0.85rem",
            borderRadius: "0.75rem",
            border: "1px solid rgba(125,211,252,0.18)",
            background: "rgba(14,111,168,0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "var(--text-primary)",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${programme.gradientFrom}20`;
            e.currentTarget.style.borderColor = `${programme.gradientFrom}44`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(14,111,168,0.15)";
            e.currentTarget.style.borderColor = "rgba(125,211,252,0.18)";
          }}
        >
          {isExpanded ? "Show Less" : "View Full Curriculum"}
          <span style={{ opacity: 0.65 }}>{isExpanded ? "−" : "+"}</span>
        </button>

        {/* Expanded curriculum */}
        <div
          style={{
            maxHeight: isExpanded ? "700px" : "0",
            overflow: "hidden",
            transition: "max-height 0.4s ease",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div style={{ paddingTop: "1.5rem" }}>
            <p
              style={{
                margin: "0 0 1rem",
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Curriculum Overview
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {programme.curriculum.map((month, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1rem",
                    borderRadius: "0.85rem",
                    background: "rgba(7,24,40,0.45)",
                    border: "1px solid rgba(125,211,252,0.10)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${programme.gradientFrom} 0%, ${programme.gradientTo} 100%)`,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          color: "var(--text-primary)",
                        }}
                      >
                        {month.month}: {month.title}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: programme.gradientFrom,
                        }}
                      >
                        {month.tools.join(", ")}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.73rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    {month.focus}
                  </p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{ marginTop: "1.25rem" }}>
              <p
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                Programme Features
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                {programme.features.map((f, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.73rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <CheckIcon color={programme.gradientFrom} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(125,211,252,0.10)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.85rem",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                ⚠️ Students may only enroll in one programme at a time
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "0.85rem",
                  border: "none",
                  background: `linear-gradient(135deg, ${programme.gradientFrom} 0%, ${programme.gradientTo} 100%)`,
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: `0 4px 20px ${programme.gradientFrom}44`,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.01)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Enroll Now — {programme.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ProgrammesPage() {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const selectedCourse = SOFTWARE_COURSES.find(
    (c) => c.id === selectedCourseId,
  );

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        {/* ── Background scene (identical to Software page) ── */}
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
              Training & Programmes
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
              Choose Your{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #7dd3fc 0%, #6366f1 50%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Learning Path
              </span>
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
              <div>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 1.25rem",
                  }}
                >
                  Whether you want complete mastery or a focused course on one
                  tool, we have a path for you. All programmes include hands-on
                  project work and job placement support.
                </p>
                <p
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.8,
                    margin: "0 0 2rem",
                  }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>
                    Important:
                  </strong>{" "}
                  Students may only enroll in one programme or one software
                  course at a time to ensure focused, practical results.
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
                    Get Started Today
                  </button>
                  <a
                    href="#courses"
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
                    Browse Courses
                  </a>
                </div>
              </div>

              {/* Right: pricing summary cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                {[
                  {
                    icon: "⚡",
                    label: "3-Month Programme",
                    price: "Contact us",
                    from: "#0ea5e9",
                    to: "#6366f1",
                  },
                  {
                    icon: "🏆",
                    label: "6-Month Programme",
                    price: "Contact us",
                    from: "#f59e0b",
                    to: "#ef4444",
                  },
                  {
                    icon: "📐",
                    label: "1-Month Courses",
                    price: "30,000 FRS",
                    from: "#22c55e",
                    to: "#16a34a",
                  },
                  {
                    icon: "🔩",
                    label: "2–3 Month Courses",
                    price: "50,000–70,000 FRS",
                    from: "#fb923c",
                    to: "#ea580c",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      ...glassStyle("rgba(14,111,168,0.12)"),
                      borderRadius: "0.85rem",
                      padding: "1rem 1.1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "0.6rem",
                        background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        marginBottom: "0.6rem",
                      }}
                    >
                      {item.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        display: "block",
                        lineHeight: 1.3,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: item.from,
                        fontWeight: 700,
                      }}
                    >
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LEARNING PATH STRIP (identical style to software page) ── */}
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
              Our Approach
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
              "We tailor every course to your pace — whether you join an
              intensive programme or pick a single software, you graduate
              career-ready."
            </p>
          </div>
        </section>

        {/* ── PROGRAMMES ── */}
        <section
          id="programmes"
          style={{ padding: "5rem clamp(1.5rem, 5vw, 3rem)" }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
                Bundled Programmes
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
                Intensive CAD Training Programmes
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
                Both programmes cover all 8 tools with hands-on projects and
                career support. Click any card to view the full curriculum.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {PROGRAMMES.map((p, i) => (
                <ProgrammeCard key={i} programme={p} />
              ))}
            </div>
          </div>
        </section>

        {/* ── INDIVIDUAL SOFTWARE COURSES ── */}
        <section
          id="courses"
          style={{
            padding: "5rem clamp(1.5rem, 5vw, 3rem)",
            borderTop: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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
                Individual Courses
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
                One Software at a Time
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  margin: "0 auto",
                  maxWidth: "560px",
                  lineHeight: 1.7,
                }}
              >
                Each course is individually priced based on depth and
                complexity. Select one to see your payment summary below.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.25rem",
                marginBottom: "2.5rem",
              }}
            >
              {SOFTWARE_COURSES.map((course) => (
                <SoftwareCourseCard
                  key={course.id}
                  course={course}
                  selected={selectedCourseId === course.id}
                  onSelect={() =>
                    setSelectedCourseId(
                      selectedCourseId === course.id ? null : course.id,
                    )
                  }
                />
              ))}
            </div>

            {/* Payment panel */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 340px",
                gap: "1.25rem",
                alignItems: "stretch",
              }}
              className="payment-grid"
            >
              <div
                style={{
                  ...glassStyle("rgba(14,111,168,0.10)"),
                  borderRadius: "1.25rem",
                  padding: "1.75rem 2rem",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 1rem",
                    fontSize: "1.05rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Course Selection Summary
                </h3>
                {selectedCourse ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: `linear-gradient(135deg, ${selectedCourse.gradientFrom} 0%, ${selectedCourse.gradientTo} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                      {selectedCourse.icon}
                    </div>
                    <div>
                      <p style={{ margin: "0 0 0.2rem", fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>{selectedCourse.name}</p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {selectedCourse.trainingFee.toLocaleString()} FRS training · {selectedCourse.registrationFee.toLocaleString()} FRS reg · {selectedCourse.duration}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    Select a course above to see its details here and unlock the
                    payment button.
                  </p>
                )}
              </div>

              <div
                style={{
                  ...glassStyle("rgba(14,111,168,0.10)"),
                  borderRadius: "1.25rem",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 0.85rem",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--sky, #7dd3fc)",
                    }}
                  >
                    Payment Panel
                  </p>
                  {selectedCourse ? (
                    <>
                      <p style={{ margin: "0 0 0.35rem", fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>{selectedCourse.name}</p>
                      <p style={{ margin: "0 0 0.85rem", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {selectedCourse.software} · {selectedCourse.category} · {selectedCourse.duration}
                      </p>
                      <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 900, color: selectedCourse.gradientFrom, letterSpacing: "-0.03em" }}>
                        {selectedCourse.trainingFee.toLocaleString()} FRS
                      </p>
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.68rem", color: "var(--text-secondary)" }}>+ {selectedCourse.registrationFee.toLocaleString()} FRS registration fee</p>
                    </>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                      }}
                    >
                      Choose a course above to reveal the payment button and
                      reserve your seat.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => { if (selectedCourseId) router.push("/academy/login"); }}
                  disabled={!selectedCourseId}
                  style={{
                    marginTop: "1.25rem",
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "0.85rem",
                    border: "none",
                    background: selectedCourse
                      ? `linear-gradient(135deg, ${selectedCourse.gradientFrom} 0%, ${selectedCourse.gradientTo} 100%)`
                      : "rgba(125,211,252,0.12)",
                    color: selectedCourse ? "#fff" : "var(--text-muted)",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    cursor: selectedCourse ? "pointer" : "not-allowed",
                    boxShadow: selectedCourse
                      ? `0 4px 20px ${selectedCourse.gradientFrom}44`
                      : "none",
                    transition: "all 0.2s ease",
                    opacity: selectedCourse ? 1 : 0.55,
                  }}
                >
                  {selectedCourse ? `Enroll — ${selectedCourse.trainingFee.toLocaleString()} FRS` : "Select a course first"}
                </button>
              </div>
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
                Why Choose CHICAD
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
                Your Success is Our Mission
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1px",
                ...glassStyle("rgba(14,111,168,0.08)"),
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              {[
                {
                  icon: "🎓",
                  title: "Expert Faculty",
                  desc: "Learn from certified professionals with decades of civil engineering and architecture experience.",
                },
                {
                  icon: "🏗️",
                  title: "Real-World Projects",
                  desc: "Work on actual construction case studies from Cameroonian infrastructure developments.",
                },
                {
                  icon: "💼",
                  title: "Career Support",
                  desc: "Job placement assistance with connections to leading construction firms across Cameroon.",
                },
                {
                  icon: "🌟",
                  title: "Industry Recognition",
                  desc: "Certifications recognised by engineering councils and construction companies nationwide.",
                },
                {
                  icon: "🤝",
                  title: "Small Class Sizes",
                  desc: "Maximum 15 students per class ensures personalised attention and practical experience.",
                },
                {
                  icon: "🚀",
                  title: "Modern Facilities",
                  desc: "State-of-the-art computer labs with licensed software and high-speed internet.",
                },
              ].map((item, i) => (
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
          .payment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
