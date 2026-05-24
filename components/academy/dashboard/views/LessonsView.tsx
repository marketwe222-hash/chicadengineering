"use client";

import { useState } from "react";
import Tag from "@/components/ui/Tag";

interface DashboardLesson {
  id: string | number;
  course: string;
  courseColor: string;
  done: boolean;
  current?: boolean;
  name: string;
  duration: string;
}

interface LessonsViewProps {
  lessons: DashboardLesson[];
}

export default function LessonsView({ lessons }: LessonsViewProps) {
  const [filter, setFilter] = useState("All");

  const courseNames = [...new Set(lessons.map((l) => l.course))];
  const filters = ["All", ...courseNames];
  const visible =
    filter === "All" ? lessons : lessons.filter((l) => l.course === filter);

  if (lessons.length === 0) {
    return (
      <div
        className="glass animate-fade-in"
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>▶️</div>
        <p style={{ fontSize: "0.85rem" }}>No lessons available yet.</p>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {/* Filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: "2rem",
                border: active
                  ? "1px solid var(--glass-border)"
                  : "1px solid var(--glass-border-subtle)",
                background: active
                  ? "var(--sidebar-item-active)"
                  : "var(--glass-bg-subtle)",
                color: active ? "var(--sky)" : "var(--text-secondary)",
                fontSize: "0.72rem",
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "all var(--transition-base)",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Lesson rows */}
      <div className="glass" style={{ overflow: "hidden" }}>
        {visible.map((l, i) => (
          <div
            key={l.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              padding: "0.8rem 1.1rem",
              borderBottom:
                i < visible.length - 1
                  ? "1px solid var(--glass-border-subtle)"
                  : "none",
              transition: "background var(--transition-base)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "var(--sidebar-item-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "transparent")
            }
          >
            {/* Status circle */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: l.done
                  ? `color-mix(in srgb, ${l.courseColor} 14%, transparent)`
                  : "var(--glass-bg-subtle)",
                border: `1.5px solid ${
                  l.done ? l.courseColor : "var(--glass-border-subtle)"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.7rem",
              }}
            >
              {l.done ? (
                <span style={{ color: l.courseColor }}>✓</span>
              ) : l.current ? (
                <span style={{ color: "var(--sky)" }}>▶</span>
              ) : (
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>

            {/* Lesson info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color: l.courseColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "0.1rem",
                }}
              >
                {l.course}
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: l.current ? 700 : 500,
                  color: l.done ? "var(--text-secondary)" : "var(--text-primary)",
                }}
              >
                {l.name}
              </p>
            </div>

            {/* Duration + status tag */}
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
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {l.duration}
              </span>
              {l.done && <Tag label="Done" color={l.courseColor} />}
              {l.current && <Tag label="Current" color="var(--sky)" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}