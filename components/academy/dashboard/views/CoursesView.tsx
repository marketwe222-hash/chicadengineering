"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";

interface DashboardCourse {
  id: string;
  color: string;
  icon: string;
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
              transition: "transform var(--transition-base), box-shadow var(--transition-base)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
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
              <span style={{ fontSize: "2.5rem" }}>{c.icon}</span>
              <div
                style={{ position: "absolute", top: "0.6rem", left: "0.7rem" }}
              >
                <Tag label={c.category} color={c.color} />
              </div>
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

              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.58rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                }}
              >
                ▶ Continue — {c.currentLessonName}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}