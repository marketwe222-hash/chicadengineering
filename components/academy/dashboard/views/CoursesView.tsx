"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { CourseLogo } from "@/components/ui/CourseLogo";
import CourseResourcesView from "@/components/academy/dashboard/views/CourseResourcesView";
import { useState } from "react";

interface DashboardCourse {
  id: string;
  color: string;
  icon: string;
  logoImage?: string | null;
  category: string;
  name: string;
  currentLessonOrder: number;
  totalLessons: number;
  currentLessonName: string;
  currentLessonDuration: string;
  progress: number;
}

interface CoursesViewProps {
  courses: DashboardCourse[];
}

export default function CoursesView({ courses }: CoursesViewProps) {
  // When set, show the resource browser for that course
  const [resourceCourse, setResourceCourse] = useState<DashboardCourse | null>(
    null,
  );

  // ── Resource view ──────────────────────────────────────────────────────
  if (resourceCourse) {
    return (
      <CourseResourcesView
        course={{
          id: resourceCourse.id,
          name: resourceCourse.name,
          icon: resourceCourse.icon,
          logoImage: resourceCourse.logoImage,
          color: resourceCourse.color,
          category: resourceCourse.category,
        }}
        onBack={() => setResourceCourse(null)}
      />
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (courses.length === 0) {
    return (
      <div
        className="glass animate-fade-in"
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📚</div>
        <p style={{ fontSize: "0.85rem" }}>No active courses enrolled.</p>
      </div>
    );
  }

  // ── Course grid ────────────────────────────────────────────────────────
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
        }}
      >
        {courses.map((c, i) => (
          <div
            key={c.id}
            className="glass"
            style={{
              overflow: "hidden",
              animationDelay: `${i * 60}ms`,
              transition:
                "transform var(--transition-base), box-shadow var(--transition-base)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
            }}
          >
            {/* Course banner */}
            <div
              style={{
                height: 90,
                background: `linear-gradient(135deg, color-mix(in srgb, ${c.color} 18%, transparent), var(--overlay-heavy))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                borderBottom: "1px solid var(--glass-border-subtle)",
              }}
            >
              <CourseLogo
                logoImage={c.logoImage}
                icon={c.icon}
                size={56}
                style={{ fontSize: "2.5rem", background: "transparent" }}
              />
              <div
                style={{ position: "absolute", top: "0.6rem", left: "0.7rem" }}
              >
                <Tag label={c.category} color={c.color} />
              </div>

              {/* Resources shortcut — top-right of banner */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setResourceCourse(c);
                }}
                title="View course resources"
                style={{
                  position: "absolute",
                  top: "0.6rem",
                  right: "0.7rem",
                  padding: "0.28rem 0.65rem",
                  borderRadius: 7,
                  border: `1px solid color-mix(in srgb, ${c.color} 40%, transparent)`,
                  background: `color-mix(in srgb, ${c.color} 12%, var(--glass-bg-subtle))`,
                  color: c.color,
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.28rem",
                  backdropFilter: "blur(6px)",
                  transition: "all var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    `color-mix(in srgb, ${c.color} 22%, var(--glass-bg-subtle))`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    `color-mix(in srgb, ${c.color} 12%, var(--glass-bg-subtle))`;
                }}
              >
                📁 Resources
              </button>
            </div>

            {/* Course body */}
            <div style={{ padding: "1rem 1.1rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {c.name}
              </h3>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.75rem",
                }}
              >
                Lesson {c.currentLessonOrder} of {c.totalLessons} · Currently:{" "}
                <em style={{ color: c.color }}>{c.currentLessonName}</em>
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
                <span
                  style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}
                >
                  {c.progress}% complete
                </span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {c.currentLessonDuration}
                </span>
              </div>

              {/* Action row */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: "0.58rem",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  ▶ Continue — {c.currentLessonName}
                </button>

                {/* Secondary resources button in the card body */}
                <button
                  onClick={() => setResourceCourse(c)}
                  title="View resources"
                  style={{
                    padding: "0.58rem 0.75rem",
                    borderRadius: 9,
                    border: "1px solid var(--glass-border)",
                    background: "var(--glass-bg-subtle)",
                    color: "var(--text-secondary)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all var(--transition-base)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `color-mix(in srgb, ${c.color} 14%, transparent)`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      `color-mix(in srgb, ${c.color} 40%, transparent)`;
                    (e.currentTarget as HTMLButtonElement).style.color =
                      c.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--glass-bg-subtle)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "var(--glass-border)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--text-secondary)";
                  }}
                >
                  📁
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
