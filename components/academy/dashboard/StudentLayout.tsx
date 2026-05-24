"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import StudentSidebarNav, {
  type View,
} from "@/components/academy/dashboard/StudentSidebarNav";
import OverviewView from "@/components/academy/dashboard/views/OverviewView";
import CoursesView from "@/components/academy/dashboard/views/CoursesView";
import LessonsView from "@/components/academy/dashboard/views/LessonsView";
import CertificatesView from "@/components/academy/dashboard/views/CertificatesView";
import ResourcesView from "@/components/academy/dashboard/views/ResourcesView";
import ProfileView from "@/components/academy/dashboard/views/ProfileView";

const PAGE_META: Record<View, { title: string; sub: string }> = {
  overview: { title: "Overview", sub: "Your learning at a glance" },
  courses: { title: "My Courses", sub: "Your enrolled programs" },
  lessons: { title: "Lessons", sub: "All lessons across your courses" },
  certificates: {
    title: "Certificates",
    sub: "Your earned & in-progress certificates",
  },
  resources: { title: "Resources", sub: "Downloads, guides & materials" },
  profile: { title: "My Profile", sub: "Your student information" },
};

export default function StudentLayout() {
  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, loading, error } = useStudentDashboard();
  const { user } = useAuthContext();
  const student = user?.student;

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid var(--glass-border)",
            borderTopColor: "var(--sky)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Loading dashboard...
        </span>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>⚠️</span>
        <span style={{ fontSize: "0.85rem", color: "var(--error-text)" }}>
          {error ?? "Could not load dashboard"}
        </span>
      </div>
    );
  }

  const meta = PAGE_META[view];

  // dynamic sub for overview and profile
  const sub =
    view === "overview"
      ? data.courses.map((c) => c.name).join(" & ") || meta.sub
      : view === "profile" && student
        ? `${student.firstName} ${student.lastName}`
        : meta.sub;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="glass-backdrop"
          onClick={() => setSidebarOpen(false)}
          style={{ display: "none" }}
          // shown via CSS @media in globals
        />
      )}

      {/* ── Sidebar ── */}
      <StudentSidebarNav
        view={view}
        setView={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <header
          className="glass-nav"
          style={{
            padding: "0.9rem 1.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {/* Mobile hamburger */}
            <button
              className="btn-ghost sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                display: "none", // shown via CSS @media
                width: 30,
                height: 30,
                borderRadius: 7,
                border: "1px solid var(--glass-border)",
                fontSize: "0.85rem",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: 0,
              }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>

            <div>
              <h1
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {meta.title}
              </h1>
              <p
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text-muted)",
                  marginTop: "0.2rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {sub}
              </p>
            </div>
          </div>

          {/* Top-bar actions */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}
          >
            {/* Notification bell */}
            <div style={{ position: "relative" }}>
              <button
                className="btn-ghost"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.88rem",
                  padding: 0,
                }}
                aria-label="Notifications"
              >
                🔔
              </button>
              {/* unread dot */}
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--error-text)",
                  border: "1.5px solid var(--bg-base)",
                }}
              />
            </div>

            <button
              className="btn-primary"
              style={{
                padding: "0.42rem 0.9rem",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              + Enroll in Course
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: "1.4rem 1.6rem",
            overflowY: "auto",
          }}
        >
          {view === "overview" && (
            <OverviewView data={data} setView={setView} />
          )}
          {view === "courses" && <CoursesView courses={data.courses} />}
          {view === "lessons" && <LessonsView lessons={data.allLessons} />}
          {view === "certificates" && <div>Certificates</div>}
          {view === "resources" && <ResourcesView />}
          {view === "profile" && <ProfileView />}
        </main>
      </div>
    </div>
  );
}
