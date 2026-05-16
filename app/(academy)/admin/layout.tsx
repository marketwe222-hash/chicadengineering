// app/(academy)/admin/dashboard/page.tsx

"use client";
import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

/* ══════════════════════════════════════════════
   MOCK DATA  — replace with real API calls
══════════════════════════════════════════════ */
const ADMIN = {
  name: "Academy Admin",
  initials: "AD",
  role: "Super Admin",
  email: "admin@chicad.cm",
  batch: 11,
};

const STUDENTS = [
  {
    id: 1,
    name: "Jean-Baptiste Ngono",
    initials: "JN",
    email: "jbngono@email.com",
    phone: "+237 670 123 456",
    city: "Yaoundé",
    status: "Student",
    school: "ENSP",
    field: "Civil Eng",
    course: "AutoCAD",
    payment: "Paid",
    progress: 47,
    enrolled: "May 2, 2026",
    ref: "None",
    heard: "Social Media",
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Aïcha Mbarga",
    initials: "AM",
    email: "aicha.mbarga@gmail.com",
    phone: "+237 691 234 567",
    city: "Yaoundé",
    status: "Student",
    school: "Polytechnique",
    field: "Architecture",
    course: "Revit",
    payment: "Paid",
    progress: 72,
    enrolled: "May 3, 2026",
    ref: "Prof. Ondoa",
    heard: "Friend",
    color: "#a78bfa",
  },
  {
    id: 3,
    name: "Emmanuel Foko",
    initials: "EF",
    email: "efoko@email.com",
    phone: "+237 677 345 678",
    city: "Douala",
    status: "Graduate",
    school: "ENSET",
    field: "Electrical Eng",
    course: "SAP2000",
    payment: "Pending",
    progress: 5,
    enrolled: "May 5, 2026",
    ref: "None",
    heard: "Social Media",
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Sandrine Tchouwa",
    initials: "ST",
    email: "stchouwa@email.com",
    phone: "+237 655 456 789",
    city: "Yaoundé",
    status: "Professional",
    school: "BTP Cameroun",
    field: "Construction",
    course: "ArchiCAD",
    payment: "Paid",
    progress: 25,
    enrolled: "May 4, 2026",
    ref: "Chicad website",
    heard: "Other",
    color: "#22c55e",
  },
  {
    id: 5,
    name: "Patrick Nkoulou",
    initials: "PN",
    email: "pnkoulou@email.com",
    phone: "+237 699 567 890",
    city: "Bafoussam",
    status: "Student",
    school: "IUT Douala",
    field: "Civil Eng",
    course: "AutoCAD",
    payment: "Paid",
    progress: 60,
    enrolled: "May 2, 2026",
    ref: "None",
    heard: "Friend",
    color: "#ef4444",
  },
  {
    id: 6,
    name: "Céleste Abomo",
    initials: "CA",
    email: "cabomo@email.com",
    phone: "+237 675 678 901",
    city: "Yaoundé",
    status: "Student",
    school: "ENSP",
    field: "Architecture",
    course: "Lumion",
    payment: "Paid",
    progress: 88,
    enrolled: "May 1, 2026",
    ref: "Instagram",
    heard: "Social Media",
    color: "#e879f9",
  },
  {
    id: 7,
    name: "Rodrigue Etoundi",
    initials: "RE",
    email: "retoundi@email.com",
    phone: "+237 688 789 012",
    city: "Douala",
    status: "Graduate",
    school: "Université de Douala",
    field: "Structural",
    course: "ABAQUS",
    payment: "Pending",
    progress: 0,
    enrolled: "May 6, 2026",
    ref: "None",
    heard: "Social Media",
    color: "#fb923c",
  },
  {
    id: 8,
    name: "Francine Bella",
    initials: "FB",
    email: "fbella@email.com",
    phone: "+237 696 890 123",
    city: "Yaoundé",
    status: "Professional",
    school: "Cabinet Arch.",
    field: "Architecture",
    course: "Revit",
    payment: "Paid",
    progress: 34,
    enrolled: "May 3, 2026",
    ref: "Colleague",
    heard: "Friend",
    color: "#7dd3fc",
  },
  {
    id: 9,
    name: "Christophe Ateba",
    initials: "CA",
    email: "cateba@email.com",
    phone: "+237 670 901 234",
    city: "Ngaoundéré",
    status: "Student",
    school: "ENAP",
    field: "Civil Eng",
    course: "Ms Excel",
    payment: "Pending",
    progress: 10,
    enrolled: "May 7, 2026",
    ref: "None",
    heard: "Friend",
    color: "#4ade80",
  },
  {
    id: 10,
    name: "Miriam Owona",
    initials: "MO",
    email: "mowona@email.com",
    phone: "+237 692 012 345",
    city: "Yaoundé",
    status: "Student",
    school: "Polytechnique",
    field: "Architecture",
    course: "AutoCAD",
    payment: "Paid",
    progress: 55,
    enrolled: "May 4, 2026",
    ref: "None",
    heard: "Social Media",
    color: "#f472b6",
  },
];

const COURSES_DATA = [
  {
    name: "AutoCAD",
    cat: "CAD",
    icon: "📐",
    color: "#ef4444",
    duration: "3 Months",
    regFee: 5000,
    trainFee: 70000,
    lessons: 15,
  },
  {
    name: "Revit",
    cat: "BIM",
    icon: "🏗️",
    color: "#7dd3fc",
    duration: "3 Months",
    regFee: 5000,
    trainFee: 70000,
    lessons: 18,
  },
  {
    name: "ArchiCAD",
    cat: "BIM",
    icon: "🏛️",
    color: "#a78bfa",
    duration: "3 Months",
    regFee: 5000,
    trainFee: 70000,
    lessons: 12,
  },
  {
    name: "SAP2000",
    cat: "Structural",
    icon: "🔩",
    color: "#fb923c",
    duration: "2 Months",
    regFee: 5000,
    trainFee: 50000,
    lessons: 10,
  },
  {
    name: "Lumion",
    cat: "Visualization",
    icon: "🌅",
    color: "#fbbf24",
    duration: "1 Month",
    regFee: 5000,
    trainFee: 30000,
    lessons: 8,
  },
  {
    name: "ABAQUS",
    cat: "FEA",
    icon: "⚙️",
    color: "#e879f9",
    duration: "2 Months",
    regFee: 5000,
    trainFee: 50000,
    lessons: 10,
  },
  {
    name: "Ms Excel",
    cat: "Productivity",
    icon: "📊",
    color: "#22c55e",
    duration: "1 Month",
    regFee: 5000,
    trainFee: 30000,
    lessons: 8,
  },
];

const ACTIVITY = [
  {
    color: "#22c55e",
    text: "Emmanuel Foko enrolled in SAP2000",
    time: "2 hours ago",
  },
  {
    color: "#f59e0b",
    text: "Payment pending: Rodrigue Etoundi (ABAQUS)",
    time: "3 hours ago",
  },
  {
    color: "#7dd3fc",
    text: "Céleste Abomo completed Lumion Module 7",
    time: "5 hours ago",
  },
  {
    color: "#a78bfa",
    text: "New registration: Francine Bella (Revit)",
    time: "Yesterday",
  },
  {
    color: "#f59e0b",
    text: "Payment pending: Christophe Ateba (Ms Excel)",
    time: "Yesterday",
  },
  {
    color: "#22c55e",
    text: "Certificate issued: Aïcha Mbarga — Revit",
    time: "2 days ago",
  },
  {
    color: "#7dd3fc",
    text: "Patrick Nkoulou joined WhatsApp group",
    time: "2 days ago",
  },
];

const STATS = {
  totalStudents: 47,
  revenue: "1.18M",
  coursesRunning: 7,
  pendingPayments: 3,
};

type View =
  | "overview"
  | "students"
  | "courses"
  | "payments"
  | "reports"
  | "addstudent"
  | "addcourse"
  | "settings";

/* ══════════════════════════════════════════════
   GLOBAL STYLES  (same tokens as student portal)
══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════════ */
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
        textTransform: "uppercase" as const,
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </span>
  );
}

function ProgressBar({
  value,
  color = "#3b82f6",
  height = 4,
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
        minWidth: 60,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: height,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.56rem",
        fontWeight: 700,
        color: "var(--text3)",
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        marginBottom: "0.55rem",
      }}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  delta,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  delta?: { text: string; up: boolean };
}) {
  return (
    <div
      className="card-hover"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "1rem 1.15rem",
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
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "var(--text3)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          marginBottom: "0.45rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 900,
          color,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: "0.25rem",
          fontFamily: "var(--mono)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.62rem", color: "var(--text2)" }}>{sub}</div>
      {delta && (
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            color: delta.up ? "var(--green)" : "var(--red)",
            marginTop: "0.2rem",
          }}
        >
          {delta.up ? "↑" : "↓"} {delta.text}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "var(--text3)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.62rem 0.85rem",
  borderRadius: 8,
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  fontSize: "0.82rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.18s",
};

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
function AdminSidebar({
  view,
  setView,
  onLogout,
}: {
  view: View;
  setView: (v: View) => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const nav: { id: View; label: string; icon: string; badge?: number; badgeColor?: string }[] = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "students", label: "Students", icon: "👥", badge: STATS.totalStudents },
    { id: "courses", label: "Courses", icon: "📚", badge: STATS.coursesRunning },
    { id: "payments", label: "Payments", icon: "💳", badge: STATS.pendingPayments, badgeColor: "#ef4444" },
    { id: "reports", label: "Reports", icon: "📊" },
  ];
  const manage: { id: View; label: string; icon: string }[] = [
    { id: "addstudent", label: "Add Student", icon: "➕" },
    { id: "addcourse", label: "New Course", icon: "🆕" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleNav = (id: View) => { setView(id); setOpen(false); };

  const Item = ({ id, label, icon, badge, badgeColor }: { id: View; label: string; icon: string; badge?: number; badgeColor?: string }) => {
    const active = view === id;
    return (
      <div className="nav-item" onClick={() => handleNav(id)}
        style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.58rem 0.7rem", borderRadius: 8, marginBottom: "0.12rem", background: active ? "rgba(220,38,38,0.15)" : "transparent", border: active ? "1px solid rgba(220,38,38,0.28)" : "1px solid transparent" }}>
        <span style={{ fontSize: "0.88rem", width: 16, textAlign: "center" as const, flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: "0.78rem", fontWeight: active ? 700 : 500, color: active ? "var(--text)" : "var(--text2)", flex: 1 }}>{label}</span>
        {badge !== undefined && (
          <span style={{ fontSize: "0.58rem", fontWeight: 800, background: active ? (badgeColor ?? "#dc2626") : badgeColor ? `${badgeColor}22` : "rgba(125,211,252,0.12)", color: active ? "#fff" : (badgeColor ?? "var(--text3)"), padding: "0.08rem 0.42rem", borderRadius: "1rem", fontFamily: "var(--mono)" }}>{badge}</span>
        )}
      </div>
    );
  };

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <>
        {open && (
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
        )}
        <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: 240, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/academy"><Image src="/images/logowhite.png" alt="CHICAD" width={80} height={40} style={{ height: "auto" }} /></Link>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(220,38,38,0.18)", border: "1.5px solid rgba(220,38,38,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#dc2626" }}>{ADMIN.initials}</div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>{ADMIN.name}</div>
                <div style={{ fontSize: "0.6rem", color: "var(--text3)" }}>{ADMIN.role}</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, overflowY: "auto", padding: "0.65rem 0.7rem" }}>
            <SectionLabel>Dashboard</SectionLabel>
            {nav.map((item) => <Item key={item.id} {...item} />)}
            <div style={{ marginTop: "1rem" }}>
              <SectionLabel>Management</SectionLabel>
              {manage.map((item) => <Item key={item.id} {...item} />)}
            </div>
          </nav>
          <div style={{ padding: "0.7rem", borderTop: "1px solid var(--border2)" }}>
            <div className="nav-item" onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.7rem", borderRadius: 8, cursor: "pointer" }}>
              <span style={{ fontSize: "0.85rem" }}>🚪</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text2)" }}>Logout</span>
            </div>
          </div>
        </div>
        {/* Bottom tab bar */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, height: 56, background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "var(--text2)" }}>
            <span style={{ fontSize: "1.1rem" }}>☰</span>
            <span style={{ fontSize: "0.5rem", fontWeight: 700, textTransform: "uppercase" as const }}>Menu</span>
          </button>
          {nav.slice(0, 4).map((item) => {
            const active = view === item.id;
            return (
              <button key={item.id} onClick={() => setView(item.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: active ? "#dc2626" : "var(--text2)", position: "relative" }}>
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.5rem", fontWeight: 700, textTransform: "uppercase" as const }}>{item.label.split(" ")[0]}</span>
                {active && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, borderRadius: 1, background: "#dc2626" }} />}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  /* ── Desktop sidebar ── */
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
            alt="CHICAD"
            width={100}
            height={50}
          />
        </Link>
      </div>

      {/* Admin badge */}
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
              background: "rgba(220,38,38,0.18)",
              border: "1.5px solid rgba(220,38,38,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#dc2626",
              flexShrink: 0,
              fontFamily: "var(--mono)",
            }}
          >
            {ADMIN.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text)",
                whiteSpace: "nowrap" as const,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {ADMIN.name}
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--text3)",
                fontFamily: "var(--mono)",
              }}
            >
              {ADMIN.role}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "0.5rem",
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
              background: "#dc2626",
              boxShadow: "0 0 5px #dc2626",
              animation: "pulse-dot 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "#dc2626",
              letterSpacing: "0.06em",
            }}
          >
            Admin Access
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: "0.65rem 0.7rem",
          flex: 1,
          overflowY: "auto" as const,
        }}
      >
        <SectionLabel>Dashboard</SectionLabel>
        {nav.map((item) => (
          <Item key={item.id} {...item} />
        ))}

        <div style={{ marginTop: "1rem" }}>
          <SectionLabel>Management</SectionLabel>
          {manage.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.7rem", borderTop: "1px solid var(--border2)" }}>
        <div
          className="nav-item"
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.55rem 0.7rem",
            borderRadius: 8,
            cursor: "pointer",
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
   OVERVIEW VIEW
══════════════════════════════════════════════ */
function Overview({ setView }: { setView: (v: View) => void }) {
  const enrollByCourse = COURSES_DATA.map((c) => ({
    ...c,
    enrolled: STUDENTS.filter((s) => s.course === c.name).length,
  }));
  const maxEnroll = Math.max(...enrollByCourse.map((c) => c.enrolled), 1);
  const recentStudents = [...STUDENTS].slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* Stat cards */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.7rem",
        }}
      >
        <StatCard
          label="Total Students"
          value={STATS.totalStudents}
          sub="Batch 11 active"
          color="#3b82f6"
          delta={{ text: "12 this batch", up: true }}
        />
        <StatCard
          label="Revenue (FRS)"
          value={STATS.revenue}
          sub="Reg + Training fees"
          color="#22c55e"
          delta={{ text: "8% vs Batch 10", up: true }}
        />
        <StatCard
          label="Courses Running"
          value={STATS.coursesRunning}
          sub="Across 3 categories"
          color="#f59e0b"
        />
        <StatCard
          label="Pending Payments"
          value={STATS.pendingPayments}
          sub="Needs confirmation"
          color="#ef4444"
          delta={{ text: "Action required", up: false }}
        />
      </div>

      {/* Charts row */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          animationDelay: "60ms",
        }}
      >
        {/* Enrollment bar chart */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem 1.25rem",
          }}
        >
          <SectionLabel>Analytics · Enrollment by Course</SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 90,
              padding: "0 4px",
            }}
          >
            {enrollByCourse.map((c) => (
              <div
                key={c.name}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: "0.58rem",
                    color: "var(--text3)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {c.enrolled}
                </span>
                <div
                  style={{
                    width: "100%",
                    height: `${Math.round((c.enrolled / maxEnroll) * 70)}px`,
                    background: `${c.color}33`,
                    border: `1px solid ${c.color}55`,
                    borderRadius: "3px 3px 0 0",
                    minHeight: 4,
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {enrollByCourse.map((c) => (
              <div
                key={c.name}
                style={{
                  flex: 1,
                  fontSize: "0.5rem",
                  color: "var(--text3)",
                  textAlign: "center" as const,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue breakdown */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem 1.25rem",
          }}
        >
          <SectionLabel>Finance · Revenue by Course</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
          >
            {enrollByCourse.map((c) => {
              const total =
                STUDENTS.filter((s) => s.course === c.name).length * c.trainFee;
              const pct = Math.round(
                (STUDENTS.filter((s) => s.course === c.name).length /
                  STATS.totalStudents) *
                  100,
              );
              return (
                <div key={c.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {c.icon} {c.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {(total / 1000).toFixed(0)}K FRS
                    </span>
                  </div>
                  <ProgressBar value={pct} color={c.color} height={5} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent enrollments + activity */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "1rem",
          animationDelay: "120ms",
        }}
      >
        {/* Recent students table */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.1rem",
              borderBottom: "1px solid var(--border2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <SectionLabel>Latest</SectionLabel>
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  color: "var(--text)",
                }}
              >
                Recent Enrollments
              </div>
            </div>
            <button
              onClick={() => setView("students")}
              style={{
                fontSize: "0.65rem",
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
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Student", "Course", "Payment", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.09em",
                      padding: "0.6rem 1rem",
                      textAlign: "left" as const,
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s.id} className="row-hover">
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.55rem",
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: `${s.color}22`,
                          border: `1.5px solid ${s.color}55`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          color: s.color,
                          flexShrink: 0,
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {s.initials}
                      </div>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      fontSize: "0.72rem",
                      color: "var(--text2)",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    {s.course}
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    <Tag
                      label={s.payment}
                      color={s.payment === "Paid" ? "#22c55e" : "#f59e0b"}
                    />
                  </td>
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      fontSize: "0.65rem",
                      color: "var(--text3)",
                      fontFamily: "var(--mono)",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    {s.enrolled}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity feed */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem 1.1rem",
          }}
        >
          <SectionLabel>Live · Activity Feed</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.65rem",
                  padding: "0.6rem 0",
                  borderBottom:
                    i < ACTIVITY.length - 1
                      ? "1px solid var(--border2)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: a.color,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text2)",
                      lineHeight: 1.5,
                    }}
                  >
                    {a.text}
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--text3)",
                      fontFamily: "var(--mono)",
                      marginTop: 2,
                    }}
                  >
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STUDENTS VIEW
══════════════════════════════════════════════ */
function StudentsView() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [selected, setSelected] = useState<(typeof STUDENTS)[0] | null>(null);

  const filtered = STUDENTS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q);
    const matchCourse = !courseFilter || s.course === courseFilter;
    const matchPay = !payFilter || s.payment === payFilter;
    return matchSearch && matchCourse && matchPay;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          alignItems: "center",
          flexWrap: "wrap" as const,
        }}
      >
        <input
          style={{ ...inputStyle, width: 220, fontSize: "0.78rem" }}
          placeholder="Search name, email, course…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={{ ...inputStyle, width: "auto", fontSize: "0.76rem" }}
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="">All Courses</option>
          {COURSES_DATA.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          style={{ ...inputStyle, width: "auto", fontSize: "0.76rem" }}
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value)}
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
        <span
          style={{
            fontSize: "0.65rem",
            color: "var(--text3)",
            marginLeft: "auto",
            fontFamily: "var(--mono)",
          }}
        >
          {filtered.length} of {STUDENTS.length} students
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Student",
                  "Course",
                  "City",
                  "Status",
                  "Payment",
                  "Progress",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.09em",
                      padding: "0.65rem 1rem",
                      textAlign: "left" as const,
                      borderBottom: "1px solid var(--border2)",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="row-hover">
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: `${s.color}22`,
                          border: `1.5px solid ${s.color}55`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          color: s.color,
                          flexShrink: 0,
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {s.initials}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "var(--text)",
                          }}
                        >
                          {s.name}
                        </div>
                        <div
                          style={{ fontSize: "0.62rem", color: "var(--text3)" }}
                        >
                          {s.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      fontSize: "0.75rem",
                      color: "var(--text2)",
                      borderBottom: "1px solid var(--border2)",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {s.course}
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      fontSize: "0.72rem",
                      color: "var(--text2)",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    {s.city}
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    <Tag
                      label={s.status}
                      color={
                        s.status === "Professional"
                          ? "#a78bfa"
                          : s.status === "Graduate"
                            ? "#f59e0b"
                            : "#7dd3fc"
                      }
                    />
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    <Tag
                      label={s.payment}
                      color={s.payment === "Paid" ? "#22c55e" : "#f59e0b"}
                    />
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                      minWidth: 90,
                    }}
                  >
                    <ProgressBar
                      value={s.progress}
                      color={s.payment === "Paid" ? "#3b82f6" : "#f59e0b"}
                      height={4}
                    />
                    <span
                      style={{
                        fontSize: "0.58rem",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {s.progress}%
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    <button
                      className="act-btn"
                      onClick={() => setSelected(s)}
                      style={{
                        padding: "0.28rem 0.65rem",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: "var(--surface2)",
                        color: "var(--sky)",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        marginRight: 4,
                        fontFamily: "var(--sans)",
                        transition: "all 0.15s",
                      }}
                    >
                      View
                    </button>
                    <button
                      className="act-btn"
                      style={{
                        padding: "0.28rem 0.65rem",
                        borderRadius: 6,
                        border: "1px solid rgba(239,68,68,0.25)",
                        background: "rgba(239,68,68,0.1)",
                        color: "#f87171",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "var(--sans)",
                        transition: "all 0.15s",
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student detail modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "1.75rem",
              maxWidth: 520,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: `${selected.color}22`,
                    border: `2px solid ${selected.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: selected.color,
                    fontFamily: "var(--mono)",
                  }}
                >
                  {selected.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {selected.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    <Tag label={selected.course} color={selected.color} />
                    <Tag
                      label={selected.payment}
                      color={
                        selected.payment === "Paid" ? "#22c55e" : "#f59e0b"
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "var(--surface2)",
                  color: "var(--text3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
                marginBottom: "1.1rem",
              }}
            >
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["City", selected.city],
                ["Status", selected.status],
                ["School", selected.school],
                ["Field", selected.field],
                ["Enrolled", selected.enrolled],
                ["Referred by", selected.ref],
                ["Heard via", selected.heard],
                ["Batch", `Batch ${ADMIN.batch}`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border2)",
                    borderRadius: 8,
                    padding: "0.6rem 0.8rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: "var(--text3)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.09em",
                      fontWeight: 700,
                      marginBottom: "0.18rem",
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text)",
                      fontWeight: 500,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "1.1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
                  Course Progress
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--sky)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  {selected.progress}%
                </span>
              </div>
              <ProgressBar
                value={selected.progress}
                color={selected.color}
                height={6}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.55rem",
                flexWrap: "wrap" as const,
              }}
            >
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(34,197,94,0.3)",
                  background: "rgba(34,197,94,0.1)",
                  color: "#4ade80",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✓ Confirm Payment
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface2)",
                  color: "var(--sky)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📧 Send Email
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(245,158,11,0.3)",
                  background: "rgba(245,158,11,0.1)",
                  color: "#fbbf24",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🏅 Issue Certificate
              </button>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.1)",
                  color: "#f87171",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   COURSES VIEW
══════════════════════════════════════════════ */
function CoursesView({ setView }: { setView: (v: View) => void }) {
  const withEnroll = COURSES_DATA.map((c) => ({
    ...c,
    enrolled: STUDENTS.filter((s) => s.course === c.name).length,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setView("addcourse")}
          style={{
            padding: "0.5rem 1.1rem",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            color: "#fff",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(220,38,38,0.3)",
          }}
        >
          + New Course
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.9rem",
        }}
      >
        {withEnroll.map((c, i) => (
          <div
            key={c.name}
            className="card-hover fade-up"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div
              style={{
                height: 80,
                background: `linear-gradient(135deg, ${c.color}22, rgba(6,16,30,0.95))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderBottom: "1px solid var(--border2)",
              }}
            >
              <span style={{ fontSize: "2.4rem" }}>{c.icon}</span>
              <div
                style={{
                  position: "absolute",
                  top: "0.55rem",
                  right: "0.6rem",
                }}
              >
                <Tag label={c.cat} color={c.color} />
              </div>
            </div>
            <div style={{ padding: "0.9rem 1.1rem" }}>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.65rem",
                }}
              >
                {c.name}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "0.45rem",
                  marginBottom: "0.65rem",
                }}
              >
                {[
                  ["Students", c.enrolled, c.color],
                  ["Lessons", c.lessons, "#a78bfa"],
                  ["Duration", c.duration.split(" ")[0] + "mo", "#fbbf24"],
                ].map(([lbl, val, col]) => (
                  <div
                    key={String(lbl)}
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border2)",
                      borderRadius: 8,
                      padding: "0.45rem 0.35rem",
                      textAlign: "center" as const,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        color: String(col),
                        fontFamily: "var(--mono)",
                        lineHeight: 1,
                      }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: "0.5rem",
                        color: "var(--text3)",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.07em",
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  flexWrap: "wrap" as const,
                }}
              >
                <Tag
                  label={`Reg: ${c.regFee.toLocaleString()} FRS`}
                  color="var(--text3)"
                />
                <Tag
                  label={`Fee: ${(c.trainFee / 1000).toFixed(0)}K FRS`}
                  color="var(--text3)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAYMENTS VIEW
══════════════════════════════════════════════ */
function PaymentsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.7rem",
        }}
      >
        <StatCard
          label="Total Collected"
          value="1.18M"
          sub="FRS · Batch 11"
          color="#22c55e"
        />
        <StatCard
          label="Pending"
          value={STATS.pendingPayments}
          sub="Awaiting confirmation"
          color="#f59e0b"
        />
        <StatCard
          label="Reg. Fees"
          value="235K"
          sub={`${STATS.totalStudents} × 5,000 FRS`}
          color="#3b82f6"
        />
      </div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
        className="fade-up"
      >
        <div
          style={{
            padding: "1rem 1.1rem",
            borderBottom: "1px solid var(--border2)",
          }}
        >
          <SectionLabel>All Transactions</SectionLabel>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              color: "var(--text)",
            }}
          >
            Payment Log
          </div>
        </div>
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Student",
                  "Course",
                  "Amount (FRS)",
                  "Type",
                  "Status",
                  "Date",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.09em",
                      padding: "0.6rem 1rem",
                      textAlign: "left" as const,
                      borderBottom: "1px solid var(--border2)",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s) => {
                const course = COURSES_DATA.find((c) => c.name === s.course);
                const total = (
                  course ? course.trainFee + course.regFee : 55000
                ).toLocaleString();
                return (
                  <tr key={s.id} className="row-hover">
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        borderBottom: "1px solid var(--border2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.55rem",
                        }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: `${s.color}22`,
                            border: `1.5px solid ${s.color}55`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            color: s.color,
                            fontFamily: "var(--mono)",
                          }}
                        >
                          {s.initials}
                        </div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "var(--text)",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        fontSize: "0.72rem",
                        color: "var(--text2)",
                        borderBottom: "1px solid var(--border2)",
                      }}
                    >
                      {s.course}
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        borderBottom: "1px solid var(--border2)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {total}
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        fontSize: "0.65rem",
                        color: "var(--text3)",
                        borderBottom: "1px solid var(--border2)",
                      }}
                    >
                      Reg + Training
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        borderBottom: "1px solid var(--border2)",
                      }}
                    >
                      <Tag
                        label={s.payment}
                        color={s.payment === "Paid" ? "#22c55e" : "#f59e0b"}
                      />
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        fontSize: "0.65rem",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                        borderBottom: "1px solid var(--border2)",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      {s.enrolled}
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 1rem",
                        borderBottom: "1px solid var(--border2)",
                      }}
                    >
                      {s.payment === "Pending" ? (
                        <button
                          style={{
                            padding: "0.25rem 0.65rem",
                            borderRadius: 6,
                            border: "1px solid rgba(34,197,94,0.3)",
                            background: "rgba(34,197,94,0.1)",
                            color: "#4ade80",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✓ Confirm
                        </button>
                      ) : (
                        <button
                          style={{
                            padding: "0.25rem 0.65rem",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            background: "var(--surface2)",
                            color: "var(--sky)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          📧 Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   REPORTS VIEW
══════════════════════════════════════════════ */
function ReportsView() {
  const statusGroups = ["Student", "Graduate", "Professional"].map((s) => ({
    label: s,
    count: STUDENTS.filter((x) => x.status === s).length,
  }));
  const heardGroups = ["Social Media", "Friend", "Other"].map((h) => ({
    label: h,
    count: STUDENTS.filter((x) => x.heard === h).length,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {/* Course progress rates */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem 1.25rem",
          }}
          className="fade-up"
        >
          <SectionLabel>Completion · Course Progress Rates</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
          >
            {COURSES_DATA.map((c) => {
              const stuList = STUDENTS.filter((s) => s.course === c.name);
              const avg = stuList.length
                ? Math.round(
                    stuList.reduce((a, s) => a + s.progress, 0) /
                      stuList.length,
                  )
                : 0;
              return (
                <div key={c.name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {c.icon} {c.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: c.color,
                        fontFamily: "var(--mono)",
                        fontWeight: 700,
                      }}
                    >
                      {avg}% avg
                    </span>
                  </div>
                  <ProgressBar value={avg} color={c.color} height={5} />
                  <div
                    style={{
                      fontSize: "0.58rem",
                      color: "var(--text3)",
                      marginTop: 3,
                    }}
                  >
                    {stuList.length} students enrolled
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demographics */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem 1.25rem",
          }}
          className="fade-up"
        >
          <SectionLabel>Demographics · Student Background</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--text3)",
                  fontWeight: 700,
                  marginBottom: "0.55rem",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.09em",
                }}
              >
                By Status
              </div>
              {statusGroups.map((g) => (
                <div
                  key={g.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text2)",
                      width: 90,
                    }}
                  >
                    {g.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={Math.round((g.count / STUDENTS.length) * 100)}
                      color="#3b82f6"
                      height={4}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--sky)",
                      fontFamily: "var(--mono)",
                      width: 18,
                      textAlign: "right" as const,
                    }}
                  >
                    {g.count}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--text3)",
                  fontWeight: 700,
                  marginBottom: "0.55rem",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.09em",
                }}
              >
                How they found us
              </div>
              {heardGroups.map((g) => (
                <div
                  key={g.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text2)",
                      width: 90,
                    }}
                  >
                    {g.label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={Math.round((g.count / STUDENTS.length) * 100)}
                      color="#a78bfa"
                      height={4}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--sky)",
                      fontFamily: "var(--mono)",
                      width: 18,
                      textAlign: "right" as const,
                    }}
                  >
                    {g.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export panel */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.1rem 1.25rem",
        }}
        className="fade-up"
      >
        <SectionLabel>Export · Generate Reports</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
          }}
        >
          {[
            ["📋", "Full Student List", "All students & details"],
            ["💰", "Payment Summary", "Revenue breakdown"],
            ["📊", "Attendance Report", "Session attendance"],
            ["🏅", "Certificate Registry", "All certificates issued"],
          ].map(([icon, title, sub]) => (
            <div
              key={String(title)}
              className="card-hover"
              style={{
                padding: "1rem",
                borderRadius: 10,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "center" as const,
              }}
            >
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>
                {icon}
              </div>
              <div
                style={{
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "0.15rem",
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
                {sub}
              </div>
              <div
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.62rem",
                  color: "var(--sky)",
                  fontWeight: 700,
                }}
              >
                ⬇ Export PDF
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD STUDENT VIEW
══════════════════════════════════════════════ */
function AddStudentView({ setView }: { setView: (v: View) => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    status: "Student",
    school: "",
    field: "",
    course: "",
    payment: "Pending",
    ref: "",
    heard: "Social Media",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("students");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      {/* Sidebar tips */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.25rem",
        }}
        className="fade-up"
      >
        <SectionLabel>Quick Tips</SectionLabel>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginBottom: "1rem",
          }}
        >
          {[
            "Fill all required fields before saving",
            "Student receives login credentials by email",
            "Registration fee must be confirmed separately",
            "Course access is granted after payment confirmation",
          ].map((tip) => (
            <div
              key={tip}
              style={{
                display: "flex",
                gap: "0.5rem",
                fontSize: "0.72rem",
                color: "var(--text2)",
                lineHeight: 1.55,
              }}
            >
              <span
                style={{
                  color: "var(--green)",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              {tip}
            </div>
          ))}
        </div>
        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 10,
            padding: "0.85rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              color: "#f59e0b",
              fontWeight: 700,
              marginBottom: "0.3rem",
            }}
          >
            💳 Payment Info
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--text2)",
              lineHeight: 1.55,
            }}
          >
            Registration fee:{" "}
            <strong style={{ color: "#fde68a" }}>5,000 FRS</strong> via MoMo{" "}
            <strong style={{ color: "#fde68a" }}>673 422 430</strong> (Wyamba
            Gemma)
          </div>
        </div>
      </div>

      {/* Form */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.5rem",
        }}
        className="fade-up"
      >
        <SectionLabel>Registration · New Student</SectionLabel>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.9rem",
            }}
          >
            <FormField label="Full Name *">
              <input
                required
                style={inputStyle}
                placeholder="Jean-Baptiste Ngono"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </FormField>
            <FormField label="Phone *">
              <input
                required
                style={inputStyle}
                placeholder="+237 6XX XXX XXX"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Email Address *">
                <input
                  required
                  type="email"
                  style={inputStyle}
                  placeholder="student@email.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="City *">
              <input
                required
                style={inputStyle}
                placeholder="Yaoundé"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </FormField>
            <FormField label="Status">
              <select
                style={inputStyle}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option>Student</option>
                <option>Graduate</option>
                <option>Professional</option>
              </select>
            </FormField>
            <FormField label="School / Workplace">
              <input
                style={inputStyle}
                placeholder="ENSP, Polytechnique…"
                value={form.school}
                onChange={(e) => set("school", e.target.value)}
              />
            </FormField>
            <FormField label="Field of Study">
              <input
                style={inputStyle}
                placeholder="Civil Engineering…"
                value={form.field}
                onChange={(e) => set("field", e.target.value)}
              />
            </FormField>
            <FormField label="Course Enrolled *">
              <select
                required
                style={inputStyle}
                value={form.course}
                onChange={(e) => set("course", e.target.value)}
              >
                <option value="">Select course…</option>
                {COURSES_DATA.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Payment Status">
              <select
                style={inputStyle}
                value={form.payment}
                onChange={(e) => set("payment", e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </FormField>
            <FormField label="Referrer">
              <input
                style={inputStyle}
                placeholder="Name or None"
                value={form.ref}
                onChange={(e) => set("ref", e.target.value)}
              />
            </FormField>
            <FormField label="How Heard">
              <select
                style={inputStyle}
                value={form.heard}
                onChange={(e) => set("heard", e.target.value)}
              >
                <option>Social Media</option>
                <option>Friend</option>
                <option>Other</option>
              </select>
            </FormField>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.65rem",
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border2)",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "0.65rem 1.75rem",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(220,38,38,0.28)",
                transition: "all 0.2s",
              }}
            >
              + Enroll Student
            </button>
            <button
              type="button"
              onClick={() => setView("students")}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text2)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD COURSE VIEW
══════════════════════════════════════════════ */
function AddCourseView({ setView }: { setView: (v: View) => void }) {
  const [form, setForm] = useState({
    name: "",
    cat: "BIM",
    desc: "",
    duration: "3 Months",
    regFee: "5000",
    trainFee: "",
    icon: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("courses");
  };

  return (
    <div style={{ maxWidth: 620 }} className="fade-up">
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.5rem",
        }}
      >
        <SectionLabel>Programs · New Course</SectionLabel>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.9rem",
            }}
          >
            <FormField label="Course Name *">
              <input
                required
                style={inputStyle}
                placeholder="e.g. Revit Architecture"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </FormField>
            <FormField label="Category *">
              <select
                required
                style={inputStyle}
                value={form.cat}
                onChange={(e) => set("cat", e.target.value)}
              >
                <option>BIM</option>
                <option>CAD</option>
                <option>Structural Analysis</option>
                <option>FEA</option>
                <option>Visualization</option>
                <option>Productivity</option>
              </select>
            </FormField>
            <div style={{ gridColumn: "1 / -1" }}>
              <FormField label="Description">
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                  placeholder="Brief description of the course…"
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Duration">
              <select
                style={inputStyle}
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
              >
                <option>1 Month</option>
                <option>2 Months</option>
                <option>3 Months</option>
                <option>6 Months</option>
              </select>
            </FormField>
            <FormField label="Icon / Emoji">
              <input
                style={inputStyle}
                placeholder="🏗️"
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
              />
            </FormField>
            <FormField label="Registration Fee (FRS)">
              <input
                type="number"
                style={inputStyle}
                value={form.regFee}
                onChange={(e) => set("regFee", e.target.value)}
              />
            </FormField>
            <FormField label="Training Fee (FRS)">
              <input
                type="number"
                required
                style={inputStyle}
                placeholder="e.g. 70000"
                value={form.trainFee}
                onChange={(e) => set("trainFee", e.target.value)}
              />
            </FormField>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.65rem",
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border2)",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "0.65rem 1.75rem",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(59,130,246,0.28)",
              }}
            >
              Create Course
            </button>
            <button
              type="button"
              onClick={() => setView("courses")}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text2)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SETTINGS VIEW
══════════════════════════════════════════════ */
function SettingsView() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      className="fade-up"
    >
      {/* Academy info */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.4rem",
        }}
      >
        <SectionLabel>Academy Info</SectionLabel>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
        >
          <FormField label="Academy Name">
            <input style={inputStyle} defaultValue="CHICAD Academy" />
          </FormField>
          <FormField label="Current Batch">
            <input style={inputStyle} defaultValue={`Batch ${ADMIN.batch}`} />
          </FormField>
          <FormField label="MoMo Number">
            <input style={inputStyle} defaultValue="673 422 430" />
          </FormField>
          <FormField label="MoMo Name">
            <input style={inputStyle} defaultValue="Wyamba Gemma" />
          </FormField>
          <FormField label="WhatsApp Group Link">
            <input
              style={inputStyle}
              defaultValue="https://chat.whatsapp.com/FESw1ckjav52EL5r4cSMtV"
            />
          </FormField>
        </div>
        <button
          style={{
            marginTop: "1.1rem",
            padding: "0.62rem 1.5rem",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
            color: "#fff",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(220,38,38,0.28)",
          }}
        >
          Save Settings
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Notifications */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.25rem",
          }}
        >
          <SectionLabel>Notifications</SectionLabel>
          {[
            ["Email new enrollments", true],
            ["Payment alerts", true],
            ["Certificate issued", true],
            ["Weekly summary report", false],
          ].map(([label, on]) => (
            <div
              key={String(label)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.6rem 0",
                borderBottom: "1px solid var(--border2)",
              }}
            >
              <span style={{ fontSize: "0.78rem", color: "var(--text2)" }}>
                {label as string}
              </span>
              <div
                style={{
                  width: 38,
                  height: 20,
                  borderRadius: 10,
                  background: on ? "#3b82f6" : "rgba(125,211,252,0.1)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              />
            </div>
          ))}
        </div>

        {/* Admin account */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.25rem",
          }}
        >
          <SectionLabel>Admin Account</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <FormField label="Admin Email">
              <input
                type="email"
                style={inputStyle}
                defaultValue={ADMIN.email}
              />
            </FormField>
            <FormField label="New Password">
              <input
                type="password"
                style={inputStyle}
                placeholder="••••••••"
              />
            </FormField>
          </div>
          <button
            style={{
              marginTop: "0.85rem",
              padding: "0.55rem 1.25rem",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "#fff",
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Update Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE META
══════════════════════════════════════════════ */
const PAGE_META: Record<View, { title: string; sub: string }> = {
  overview: {
    title: "Overview",
    sub: `Batch ${ADMIN.batch} · Admin Dashboard`,
  },
  students: { title: "Students", sub: "Manage all enrolled students" },
  courses: { title: "Courses", sub: "All running programs" },
  payments: { title: "Payments", sub: "Track fees and confirmations" },
  reports: { title: "Reports", sub: "Analytics and insights" },
  addstudent: { title: "Add Student", sub: "Register a new student" },
  addcourse: { title: "New Course", sub: "Create a new program" },
  settings: { title: "Settings", sub: "Academy configuration" },
};

/* ══════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [view, setView] = useState<View>("overview");
  const meta = PAGE_META[view];
  const { logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/academy");
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) { .dashboard-content { padding-bottom: 72px !important; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.85); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .nav-item { transition: all 0.18s ease; cursor: pointer; }
        .nav-item:hover { background: rgba(125,211,252,0.06) !important; }
        .card-hover { transition: all 0.22s ease; }
        .card-hover:hover { border-color: rgba(125,211,252,0.22) !important; transform: translateY(-2px); }
        .row-hover:hover td { background: rgba(125,211,252,0.03); }
      `}</style>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
      >
        <AdminSidebar view={view} setView={setView} onLogout={handleLogout} />

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
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: 8,
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  width: 200,
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>
                  🔍
                </span>
                <input
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--text)",
                    fontSize: "0.76rem",
                    width: "100%",
                  }}
                  placeholder="Search students…"
                />
              </div>
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
              {/* Add student CTA */}
              <button
                onClick={() => setView("addstudent")}
                style={{
                  padding: "0.42rem 0.9rem",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(220,38,38,0.3)",
                }}
              >
                + Add Student
              </button>
              {/* Export */}
              <button
                style={{
                  padding: "0.42rem 0.9rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface2)",
                  color: "var(--text2)",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ⬇ Export
              </button>
            </div>
          </div>

          {/* Page content */}
          <div className="dashboard-content" style={{ flex: 1, padding: "1.4rem 1.6rem", overflowY: "auto" }}>
            {view === "overview" && <Overview setView={setView} />}
            {view === "students" && <StudentsView />}
            {view === "courses" && <CoursesView setView={setView} />}
            {view === "payments" && <PaymentsView />}
            {view === "reports" && <ReportsView />}
            {view === "addstudent" && <AddStudentView setView={setView} />}
            {view === "addcourse" && <AddCourseView setView={setView} />}
            {view === "settings" && <SettingsView />}
          </div>
        </div>
      </div>
    </>
  );
}
