// components/admin/courses/CoursesView.tsx

"use client";
import { Tag } from "@/components/admin/shared";
import { categoryColor, fmtMoney } from "@/components/admin/shared";
import { CourseLogo } from "@/components/ui/CourseLogo";
import type { AdminCourse } from "@/hooks/useAdminDashboard";
import type { View } from "@/components/admin/dashboard";

interface Props {
  setView: (v: View) => void;
  courses: AdminCourse[];
  onRefresh: () => void;
  onEditCourse: (course: AdminCourse) => void; // <-- new
  onViewCourse: (course: AdminCourse) => void; // <-- new
}

export function CoursesView({
  setView,
  courses,
  onRefresh,
  onEditCourse,
  onViewCourse,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setView("addcourse")}
          style={{
            padding: "0.5rem 1.1rem",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg,#dc2626,#b91c1c)",
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

      {courses.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "3rem",
            textAlign: "center",
            color: "var(--text3)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📚</div>
          <div style={{ fontSize: "0.85rem" }}>
            No courses yet. Create one to get started.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "0.9rem",
          }}
        >
          {courses.map((c, i) => {
            const color = categoryColor(c.category);
            return (
              <div
                key={c.id}
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
                    background: `linear-gradient(135deg,${color}22,rgba(6,16,30,0.95))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: "1px solid var(--border2)",
                  }}
                >
                  <CourseLogo
                    logoImage={c.logoImage}
                    icon={c.icon}
                    size={40}
                    style={{ background: "transparent" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "0.55rem",
                      right: "0.6rem",
                    }}
                  >
                    <Tag label={c.category} color={color} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "0.55rem",
                      left: "0.6rem",
                    }}
                  >
                    <Tag
                      label={c.status}
                      color={c.status === "ACTIVE" ? "#22c55e" : "#f59e0b"}
                    />
                  </div>
                </div>
                <div style={{ padding: "0.9rem 1.1rem" }}>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: "-0.02em",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {c.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: "var(--text3)",
                      marginBottom: "0.65rem",
                    }}
                  >
                    {c.courseCode}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "0.45rem",
                      marginBottom: "0.65rem",
                    }}
                  >
                    {(
                      [
                        ["Students", c._count.enrollments, color],
                        ["Lessons", c._count.lessons, "#a78bfa"],
                        ["Months", c.durationMonths, "#fbbf24"],
                      ] as const
                    ).map(([lbl, val, col]) => (
                      <div
                        key={String(lbl)}
                        style={{
                          background: "var(--surface2)",
                          border: "1px solid var(--border2)",
                          borderRadius: 8,
                          padding: "0.45rem 0.35rem",
                          textAlign: "center",
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
                            textTransform: "uppercase",
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
                    style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                  >
                    <Tag
                      label={`Reg: ${c.registrationFee.toLocaleString()} FRS`}
                      color="var(--text3)"
                    />
                    <Tag
                      label={`Fee: ${fmtMoney(c.trainingFee)} FRS`}
                      color="var(--text3)"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.75rem",
                    }}
                  >
                    <button
                      onClick={() => onViewCourse(c)}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0",
                        borderRadius: 7,
                        border: "1px solid var(--border)",
                        background: "var(--surface2)",
                        color: "var(--text2)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      👁 View
                    </button>
                    <button
                      onClick={() => onEditCourse(c)}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0",
                        borderRadius: 7,
                        border: "1px solid var(--border)",
                        background: "var(--surface2)",
                        color: "var(--text2)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
