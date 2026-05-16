//app/(academy)/academy/dashboard/page.tsx

"use client";
import { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
/* ══════════════════════════════════════════════
   MOCK DATA  — replace with real API calls
══════════════════════════════════════════════ */
const STUDENT = {
  name: "Jean-Baptiste N.",
  initials: "JN",
  batch: 11,
  software: "AutoCAD",
  secondSoftware: "ArchiCAD",
  status: "Active",
  overallProgress: 60,
  coursesEnrolled: 2,
  lessonsCompleted: 18,
  totalLessons: 30,
  certificatesEarned: 1,
  certStatus: "1 in progress",
  studyHours: 42,
  studyLabel: "This batch",
  city: "Yaoundé",
  joinedBatch: "Jan 2025",
  avatar: "#3b82f6",
};

const COURSES = [
  {
    id: 1,
    name: "AutoCAD",
    color: "#ef4444",
    icon: "📐",
    category: "CAD",
    currentLesson: 7,
    totalLessons: 18,
    lessonName: "3D Modeling Fundamentals",
    progress: 60,
    duration: "45 min",
    lastActivity: "2 days ago",
  },
  {
    id: 2,
    name: "ArchiCAD",
    color: "#a78bfa",
    icon: "🏛️",
    category: "BIM",
    currentLesson: 4,
    totalLessons: 18,
    lessonName: "Parametric Objects",
    progress: 38,
    duration: "60 min",
    lastActivity: "4 days ago",
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    tag: "NEW",
    time: "2 DAYS AGO",
    title: "ArchiCAD Session 4 uploaded",
    body: "New video content is available in your ArchiCAD course.",
    color: "#3b82f6",
    icon: "📢",
  },
  {
    id: 2,
    tag: "CHALLENGE",
    time: "5 DAYS AGO",
    title: "CHICAD Challenge submissions open",
    body: "Submit your final project before end of batch.",
    color: "#f59e0b",
    icon: "🏆",
  },
  {
    id: 3,
    tag: "PAYMENT",
    time: "1 WEEK AGO",
    title: "Registration confirmed — Batch 11",
    body: "Your enrollment is confirmed. Welcome aboard!",
    color: "#22c55e",
    icon: "✅",
  },
];

const UPCOMING = [
  {
    day: "MON",
    course: "AUTOCAD",
    topic: "Dimension & Annotation",
    duration: "45 min",
    color: "#ef4444",
  },
  {
    day: "WED",
    course: "ARCHICAD",
    topic: "Parametric Objects",
    duration: "60 min",
    color: "#a78bfa",
  },
  {
    day: "FRI",
    course: "AUTOCAD",
    topic: "Layout & Sheet Sets",
    duration: "50 min",
    color: "#ef4444",
  },
];

const LESSONS = [
  {
    id: 1,
    course: "AutoCAD",
    name: "Introduction to Interface",
    duration: "32 min",
    done: true,
    color: "#ef4444",
  },
  {
    id: 2,
    course: "AutoCAD",
    name: "Basic Drawing Tools",
    duration: "41 min",
    done: true,
    color: "#ef4444",
  },
  {
    id: 3,
    course: "AutoCAD",
    name: "Layers & Properties",
    duration: "38 min",
    done: true,
    color: "#ef4444",
  },
  {
    id: 4,
    course: "AutoCAD",
    name: "Annotation & Text",
    duration: "29 min",
    done: true,
    color: "#ef4444",
  },
  {
    id: 5,
    course: "AutoCAD",
    name: "Blocks & References",
    duration: "44 min",
    done: true,
    color: "#ef4444",
  },
  {
    id: 6,
    course: "AutoCAD",
    name: "Dimensioning Basics",
    duration: "35 min",
    done: true,
    color: "#ef4444",
  },
  {
    id: 7,
    course: "AutoCAD",
    name: "3D Modeling Fundamentals",
    duration: "45 min",
    done: false,
    color: "#ef4444",
    current: true,
  },
  {
    id: 8,
    course: "AutoCAD",
    name: "3D Solid Modeling",
    duration: "50 min",
    done: false,
    color: "#ef4444",
  },
  {
    id: 9,
    course: "ArchiCAD",
    name: "Getting Started with ArchiCAD",
    duration: "28 min",
    done: true,
    color: "#a78bfa",
  },
  {
    id: 10,
    course: "ArchiCAD",
    name: "Walls, Slabs & Roofs",
    duration: "52 min",
    done: true,
    color: "#a78bfa",
  },
  {
    id: 11,
    course: "ArchiCAD",
    name: "Doors, Windows & Objects",
    duration: "39 min",
    done: true,
    color: "#a78bfa",
  },
  {
    id: 12,
    course: "ArchiCAD",
    name: "Parametric Objects",
    duration: "60 min",
    done: false,
    color: "#a78bfa",
    current: true,
  },
];

type View =
  | "overview"
  | "courses"
  | "lessons"
  | "certificates"
  | "resources"
  | "profile";

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #06101e;
    --surface: #0b1829;
    --surface2: #0f2035;
    --surface3: #132540;
    --border: rgba(99,155,210,0.12);
    --border2: rgba(99,155,210,0.07);
    --text: #deeeff;
    --text2: rgba(170,205,240,0.65);
    --text3: rgba(120,180,230,0.42);
    --blue: #3b82f6;
    --sky: #7dd3fc;
    --green: #22c55e;
    --amber: #f59e0b;
    --red: #ef4444;
    --violet: #a78bfa;
    --sans: 'Plus Jakarta Sans', sans-serif;
    --mono: 'DM Mono', monospace;
  }
  html, body { background: var(--bg); color: var(--text); font-family: var(--sans); height: 100%; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(125,211,252,0.15); border-radius: 2px; }
  input, select { font-family: var(--sans); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(59,130,246,0.4); } 50% { box-shadow: 0 0 18px rgba(59,130,246,0.7); } }
  @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }
  @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
  .fade-up { animation: fadeUp 0.35s ease both; }
  .nav-item { transition: all 0.18s ease; cursor: pointer; }
  .nav-item:hover { background: rgba(125,211,252,0.06) !important; }
  .lesson-row:hover { background: rgba(125,211,252,0.04) !important; }
  .resume-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .card-hover:hover { border-color: rgba(125,211,252,0.22) !important; transform: translateY(-2px); }
  .card-hover { transition: all 0.22s ease; }
`;

/* ══════════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════════ */
function ProgressRing({
  value,
  size = 52,
  stroke = 4,
  color = "#3b82f6",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(125,211,252,0.1)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{
          transition: "stroke-dasharray 0.6s ease",
          filter: `drop-shadow(0 0 4px ${color}88)`,
        }}
      />
    </svg>
  );
}

function ProgressBar({
  value,
  color = "#3b82f6",
  height = 5,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <div
      style={{
        height,
        background: "rgba(125,211,252,0.08)",
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: height,
          transition: "width 0.6s ease",
          boxShadow: `0 0 6px ${color}66`,
        }}
      />
    </div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.58rem",
        fontWeight: 800,
        color,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        padding: "0.15rem 0.5rem",
        borderRadius: "1rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
function Sidebar({
  view,
  setView,
}: {
  view: View;
  setView: (v: View) => void;
}) {
  const nav: { id: View; label: string; icon: string; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: "⊞" },
    {
      id: "courses",
      label: "My Courses",
      icon: "📚",
      badge: STUDENT.coursesEnrolled,
    },
    { id: "lessons", label: "Lessons", icon: "▶️" },
    { id: "certificates", label: "Certificates", icon: "🎓" },
    { id: "resources", label: "Resources", icon: "📁" },
  ];

  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.1rem 1.1rem 0.9rem",
          borderBottom: "1px solid var(--border2)",
        }}
      >
        <Link href="/academy">
          <Image
            src="/images/logowhite.png"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>
      </div>

      {/* Student profile */}
      <div
        style={{
          padding: "0.85rem 1rem",
          borderBottom: "1px solid var(--border2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(59,130,246,0.18)",
              border: "1.5px solid rgba(59,130,246,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#3b82f6",
              flexShrink: 0,
              fontFamily: "var(--mono)",
            }}
          >
            JN
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {STUDENT.name}
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--text3)",
                fontFamily: "var(--mono)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {STUDENT.software} · BATCH {STUDENT.batch}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "0.55rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 5px #22c55e",
              animation: "pulse-dot 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "var(--green)",
              letterSpacing: "0.06em",
            }}
          >
            ✓ Active
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "0.65rem 0.7rem", flex: 1, overflowY: "auto" }}>
        <div
          style={{
            fontSize: "0.56rem",
            fontWeight: 700,
            color: "var(--text3)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 0.45rem",
            marginBottom: "0.35rem",
          }}
        >
          Menu
        </div>
        {nav.map((item) => {
          const active = view === item.id;
          return (
            <div
              key={item.id}
              className="nav-item"
              onClick={() => setView(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.58rem 0.7rem",
                borderRadius: 8,
                marginBottom: "0.12rem",
                background: active ? "rgba(59,130,246,0.15)" : "transparent",
                border: active
                  ? "1px solid rgba(59,130,246,0.28)"
                  : "1px solid transparent",
              }}
            >
              <span
                style={{
                  fontSize: "0.88rem",
                  width: 16,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--text)" : "var(--text2)",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    background: active
                      ? "var(--blue)"
                      : "rgba(125,211,252,0.12)",
                    color: active ? "#fff" : "var(--text3)",
                    padding: "0.08rem 0.42rem",
                    borderRadius: "1rem",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}

        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.56rem",
            fontWeight: 700,
            color: "var(--text3)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 0.45rem",
            marginBottom: "0.35rem",
          }}
        >
          Account
        </div>
        <div
          className="nav-item"
          onClick={() => setView("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.58rem 0.7rem",
            borderRadius: 8,
            marginBottom: "0.12rem",
            background:
              view === "profile" ? "rgba(59,130,246,0.15)" : "transparent",
            border:
              view === "profile"
                ? "1px solid rgba(59,130,246,0.28)"
                : "1px solid transparent",
          }}
        >
          <span style={{ fontSize: "0.88rem", width: 16, textAlign: "center" }}>
            👤
          </span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: view === "profile" ? 700 : 500,
              color: view === "profile" ? "var(--text)" : "var(--text2)",
            }}
          >
            My Profile
          </span>
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.7rem", borderTop: "1px solid var(--border2)" }}>
        <div
          className="nav-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.55rem 0.7rem",
            borderRadius: 8,
          }}
        >
          <span style={{ fontSize: "0.85rem" }}>🚪</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════
   OVERVIEW VIEW  (matches the screenshot)
══════════════════════════════════════════════ */
function Overview({ setView }: { setView: (v: View) => void }) {
  const activeCourse = COURSES[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* Welcome banner */}
      <div
        className="fade-up"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,111,168,0.22) 0%, rgba(59,130,246,0.12) 60%, rgba(99,102,241,0.10) 100%)",
          border: "1px solid rgba(125,211,252,0.16)",
          borderRadius: 14,
          padding: "1.25rem 1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #3b82f6, #7dd3fc, transparent)",
          }}
        />
        <div>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text3)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "0.2rem",
            }}
          >
            Welcome back 👋
          </div>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "var(--text)",
              letterSpacing: "-0.03em",
              marginBottom: "0.35rem",
            }}
          >
            Jean-Baptiste
          </h2>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text2)",
              lineHeight: 1.6,
            }}
          >
            You have <strong style={{ color: "var(--sky)" }}>3 lessons</strong>{" "}
            remaining this week. Keep going!
          </p>
        </div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing
            value={STUDENT.overallProgress}
            size={68}
            stroke={5}
            color="#3b82f6"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 900,
                color: "var(--text)",
                fontFamily: "var(--mono)",
              }}
            >
              {STUDENT.overallProgress}%
            </span>
            <span
              style={{
                fontSize: "0.48rem",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Overall
            </span>
          </div>
        </div>
      </div>

      {/* Stats row — 4 cards */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.7rem",
          animationDelay: "60ms",
        }}
      >
        {[
          {
            label: "Courses Enrolled",
            value: STUDENT.coursesEnrolled,
            sub: [STUDENT.software, STUDENT.secondSoftware].join(", "),
            icon: "📚",
            color: "#3b82f6",
          },
          {
            label: "Lessons Completed",
            value: STUDENT.lessonsCompleted,
            sub: `of ${STUDENT.totalLessons} total`,
            icon: "✅",
            color: "#22c55e",
          },
          {
            label: "Certificates Earned",
            value: STUDENT.certificatesEarned,
            sub: STUDENT.certStatus,
            icon: "🎓",
            color: "#f59e0b",
          },
          {
            label: "Study Hours",
            value: `${STUDENT.studyHours}h`,
            sub: STUDENT.studyLabel,
            icon: "⏱",
            color: "#a78bfa",
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="card-hover"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "1rem 1.1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${s.color}, transparent)`,
              }}
            />
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: "1.65rem",
                fontWeight: 900,
                color: s.color,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: "0.3rem",
                fontFamily: "var(--mono)",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text2)" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom two-column layout */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          animationDelay: "120ms",
        }}
      >
        {/* Continue Learning */}
        <div>
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "0.65rem",
            }}
          >
            Resume · Continue Learning
          </div>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {/* Course thumbnail */}
            <div
              style={{
                height: 110,
                background: `linear-gradient(135deg, ${activeCourse.color}22, rgba(7,24,40,0.9))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderBottom: "1px solid var(--border2)",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  filter: "drop-shadow(0 0 12px rgba(239,68,68,0.4))",
                }}
              >
                {activeCourse.icon}
              </div>
              <div
                style={{ position: "absolute", top: "0.6rem", left: "0.7rem" }}
              >
                <Tag
                  label={`${activeCourse.name} · Lesson ${activeCourse.currentLesson} of ${activeCourse.totalLessons}`}
                  color={activeCourse.color}
                />
              </div>
            </div>
            <div style={{ padding: "0.9rem 1rem" }}>
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {activeCourse.lessonName}
              </div>
              <ProgressBar
                value={activeCourse.progress}
                color={activeCourse.color}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.3rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
                  {activeCourse.progress}% complete
                </span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--text3)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {activeCourse.duration}
                </span>
              </div>
              <button
                className="resume-btn"
                onClick={() => setView("lessons")}
                style={{
                  width: "100%",
                  padding: "0.62rem",
                  borderRadius: 8,
                  border: "none",
                  background: `linear-gradient(135deg, ${activeCourse.color}, ${activeCourse.color}cc)`,
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s",
                  boxShadow: `0 4px 14px ${activeCourse.color}44`,
                }}
              >
                ▶ Resume Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Announcements + Upcoming */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Announcements */}
          <div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "0.65rem",
              }}
            >
              Academy · Announcements
            </div>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {ANNOUNCEMENTS.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    padding: "0.75rem 1rem",
                    borderBottom:
                      i < ANNOUNCEMENTS.length - 1
                        ? "1px solid var(--border2)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", marginTop: "0.05rem" }}>
                      {a.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          marginBottom: "0.2rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <Tag label={a.tag} color={a.color} />
                        <span
                          style={{
                            fontSize: "0.58rem",
                            color: "var(--text3)",
                            fontFamily: "var(--mono)",
                          }}
                        >
                          · {a.time}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          color: "var(--text)",
                          marginBottom: "0.15rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {a.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text2)",
                          lineHeight: 1.5,
                        }}
                      >
                        {a.body}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* This week: upcoming lessons */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.65rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                This Week · Upcoming Lessons
              </div>
              <button
                onClick={() => setView("lessons")}
                style={{
                  fontSize: "0.62rem",
                  color: "var(--sky)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                }}
              >
                View all →
              </button>
            </div>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {UPCOMING.map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.7rem 1rem",
                    borderBottom:
                      i < UPCOMING.length - 1
                        ? "1px solid var(--border2)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: `${u.color}18`,
                      border: `1px solid ${u.color}33`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.45rem",
                        fontWeight: 800,
                        color: u.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {u.day}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        color: u.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: "0.1rem",
                      }}
                    >
                      {u.course}
                    </div>
                    <div
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {u.topic}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.62rem",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      ⏱ {u.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   COURSES VIEW
══════════════════════════════════════════════ */
function CoursesView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {COURSES.map((c, i) => (
          <div
            key={c.id}
            className="card-hover fade-up"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div
              style={{
                height: 90,
                background: `linear-gradient(135deg, ${c.color}25, rgba(7,24,40,0.95))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderBottom: "1px solid var(--border2)",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>{c.icon}</span>
              <div
                style={{ position: "absolute", top: "0.6rem", left: "0.7rem" }}
              >
                <Tag label={c.category} color={c.color} />
              </div>
            </div>
            <div style={{ padding: "1rem 1.1rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: "0.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {c.name}
              </h3>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text2)",
                  marginBottom: "0.75rem",
                }}
              >
                Lesson {c.currentLesson} of {c.totalLessons} · Currently:{" "}
                <em style={{ color: c.color }}>{c.lessonName}</em>
              </p>
              <ProgressBar value={c.progress} color={c.color} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.3rem",
                  marginBottom: "0.85rem",
                }}
              >
                <span style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
                  {c.progress}% complete
                </span>
                <span style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
                  Last: {c.lastActivity}
                </span>
              </div>
              <button
                className="resume-btn"
                style={{
                  width: "100%",
                  padding: "0.58rem",
                  borderRadius: 8,
                  border: "none",
                  background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)`,
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ▶ Continue — {c.lessonName}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LESSONS VIEW
══════════════════════════════════════════════ */
function LessonsView() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "AutoCAD", "ArchiCAD"];
  const visible =
    filter === "All" ? LESSONS : LESSONS.filter((l) => l.course === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "2rem",
              border:
                filter === f
                  ? "1px solid rgba(59,130,246,0.45)"
                  : "1px solid var(--border)",
              background:
                filter === f ? "rgba(59,130,246,0.15)" : "var(--surface)",
              color: filter === f ? "var(--sky)" : "var(--text2)",
              fontSize: "0.72rem",
              fontWeight: filter === f ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {visible.map((l, i) => (
          <div
            key={l.id}
            className="lesson-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.8rem 1.1rem",
              borderBottom:
                i < visible.length - 1 ? "1px solid var(--border2)" : "none",
              transition: "background 0.15s",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: l.done ? `${l.color}22` : "rgba(125,211,252,0.06)",
                border: `1.5px solid ${l.done ? l.color : "rgba(125,211,252,0.14)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.7rem",
              }}
            >
              {l.done ? (
                <span style={{ color: l.color }}>✓</span>
              ) : l.current ? (
                <span style={{ color: "var(--sky)" }}>▶</span>
              ) : (
                <span
                  style={{
                    color: "var(--text3)",
                    fontFamily: "var(--mono)",
                    fontSize: "0.6rem",
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color: l.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "0.1rem",
                }}
              >
                {l.course}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: l.current ? 700 : 500,
                  color: l.done ? "var(--text2)" : "var(--text)",
                  textDecoration: l.done ? "none" : "none",
                }}
              >
                {l.name}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text3)",
                  fontFamily: "var(--mono)",
                }}
              >
                {l.duration}
              </span>
              {l.done && <Tag label="Done" color={l.color} />}
              {l.current && <Tag label="Current" color="var(--sky)" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CERTIFICATES VIEW
══════════════════════════════════════════════ */
function CertificatesView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Earned */}
      <div
        className="fade-up"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(7,24,40,0.95))",
          border: "1px solid rgba(245,158,11,0.28)",
          borderRadius: 14,
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🏅</div>
        <div style={{ flex: 1 }}>
          <Tag label="Earned" color="#22c55e" />
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--text)",
              marginTop: "0.4rem",
              marginBottom: "0.2rem",
            }}
          >
            AutoCAD — Batch 11 Certificate
          </h3>
          <p style={{ fontSize: "0.72rem", color: "var(--text2)" }}>
            Issued: March 2025 · CHICAD Academy
          </p>
        </div>
        <button
          style={{
            padding: "0.55rem 1rem",
            borderRadius: 8,
            border: "1px solid rgba(245,158,11,0.35)",
            background: "rgba(245,158,11,0.1)",
            color: "#f59e0b",
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ⬇ Download
        </button>
      </div>
      {/* In progress */}
      {COURSES.filter((c) => c.progress < 100).map((c) => (
        <div
          key={c.id}
          className="fade-up card-hover"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.25rem 1.4rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <Tag label="In Progress" color={c.color} />
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginTop: "0.35rem",
                  marginBottom: "0.45rem",
                }}
              >
                {c.name} Certificate
              </h3>
              <ProgressBar value={c.progress} color={c.color} />
              <span
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text3)",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                {c.progress}% — complete all lessons to unlock
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   RESOURCES VIEW
══════════════════════════════════════════════ */
function ResourcesView() {
  const resources = [
    {
      name: "AutoCAD Cheat Sheet.pdf",
      type: "PDF",
      size: "1.2 MB",
      course: "AutoCAD",
      color: "#ef4444",
    },
    {
      name: "3D Modeling Reference.pdf",
      type: "PDF",
      size: "3.4 MB",
      course: "AutoCAD",
      color: "#ef4444",
    },
    {
      name: "ArchiCAD Object Library",
      type: "ZIP",
      size: "12 MB",
      course: "ArchiCAD",
      color: "#a78bfa",
    },
    {
      name: "BIM Standards Guide.pdf",
      type: "PDF",
      size: "2.1 MB",
      course: "ArchiCAD",
      color: "#a78bfa",
    },
    {
      name: "CHICAD Challenge Brief.pdf",
      type: "PDF",
      size: "0.8 MB",
      course: "General",
      color: "#f59e0b",
    },
  ];
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
      }}
      className="fade-up"
    >
      {resources.map((r, i) => (
        <div
          key={r.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.9rem",
            padding: "0.85rem 1.1rem",
            borderBottom:
              i < resources.length - 1 ? "1px solid var(--border2)" : "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${r.color}18`,
              border: `1px solid ${r.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            {r.type === "PDF" ? "📄" : "🗜️"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {r.name}
            </div>
            <div style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
              {r.course} · {r.size}
            </div>
          </div>
          <button
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: 6,
              border: `1px solid ${r.color}33`,
              background: `${r.color}12`,
              color: r.color,
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ⬇ Download
          </button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PROFILE VIEW
══════════════════════════════════════════════ */
function ProfileView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: 520,
      }}
      className="fade-up"
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.5rem",
          display: "flex",
          gap: "1.2rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.18)",
            border: "2px solid rgba(59,130,246,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#3b82f6",
            fontFamily: "var(--mono)",
            flexShrink: 0,
          }}
        >
          JN
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 900,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              marginBottom: "0.2rem",
            }}
          >
            {STUDENT.name}
          </h2>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <Tag label={`Batch ${STUDENT.batch}`} color="#3b82f6" />
            <Tag label={STUDENT.status} color="#22c55e" />
            <Tag label={STUDENT.software} color="#ef4444" />
          </div>
        </div>
      </div>
      {[
        { label: "City", value: STUDENT.city },
        { label: "Enrolled Since", value: STUDENT.joinedBatch },
        {
          label: "Programs",
          value: `${STUDENT.software}, ${STUDENT.secondSoftware}`,
        },
        { label: "Batch", value: `Batch ${STUDENT.batch}` },
        { label: "Overall Progress", value: `${STUDENT.overallProgress}%` },
        { label: "Total Study Hours", value: `${STUDENT.studyHours}h` },
      ].map((row) => (
        <div
          key={row.label}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "0.85rem 1.1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "var(--text2)" }}>
            {row.label}
          </span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--text)",
              fontFamily:
                row.label.includes("Hours") || row.label.includes("Progress")
                  ? "var(--mono)"
                  : "var(--sans)",
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE TITLES & SUBTITLES
══════════════════════════════════════════════ */
const PAGE_META: Record<View, { title: string; sub: string }> = {
  overview: {
    title: "Overview",
    sub: `Batch ${STUDENT.batch} · ${STUDENT.software} & ${STUDENT.secondSoftware}`,
  },
  courses: { title: "My Courses", sub: "Your enrolled programs" },
  lessons: { title: "Lessons", sub: "All lessons across your courses" },
  certificates: {
    title: "Certificates",
    sub: "Your earned & in-progress certificates",
  },
  resources: { title: "Resources", sub: "Downloads, guides & materials" },
  profile: { title: "My Profile", sub: "Your student information" },
};

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export default function StudentPortal() {
  const [view, setView] = useState<View>("overview");
  const meta = PAGE_META[view];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
      >
        <Sidebar view={view} setView={setView} />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: "0.9rem 1.6rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 10,
              backdropFilter: "blur(10px)",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {meta.title}
              </h1>
              <p
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text3)",
                  marginTop: "0.2rem",
                  fontFamily: "var(--mono)",
                }}
              >
                {meta.sub}
              </p>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}
            >
              {/* Notification bell */}
              <div style={{ position: "relative" }}>
                <button
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                  }}
                >
                  🔔
                </button>
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "1.5px solid var(--surface)",
                  }}
                />
              </div>
              {/* Enroll button */}
              <button
                style={{
                  padding: "0.42rem 0.9rem",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(59,130,246,0.35)",
                }}
              >
                + Enroll in Course
              </button>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, padding: "1.4rem 1.6rem", overflowY: "auto" }}>
            {view === "overview" && <Overview setView={setView} />}
            {view === "courses" && <CoursesView />}
            {view === "lessons" && <LessonsView />}
            {view === "certificates" && <CertificatesView />}
            {view === "resources" && <ResourcesView />}
            {view === "profile" && <ProfileView />}
          </div>
        </div>
      </div>
    </>
  );
}
