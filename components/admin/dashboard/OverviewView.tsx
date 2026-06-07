"use client";
import {
  SectionLabel,
  StatCard,
  ProgressBar,
  Tag,
} from "@/components/admin/shared";
import { categoryColor, fmtMoney, fmtDate } from "@/components/admin/shared";
import { CourseLogo } from "@/components/ui/CourseLogo";
import type {
  AdminStudent,
  AdminCourse,
  AdminStats,
} from "@/hooks/useAdminDashboard";
import type { View } from "./AdminSidebarNav";

interface Props {
  setView: (v: View) => void;
  stats: AdminStats;
  students: AdminStudent[];
  courses: AdminCourse[];
}

export function OverviewView({ setView, stats, students, courses }: Props) {
  const recentStudents = students.slice(0, 5);

  const enrollByCourse = courses.map((c) => ({
    ...c,
    enrolled: c._count.enrollments,
    color: categoryColor(c.category),
  }));
  const maxEnroll = Math.max(...enrollByCourse.map((c) => c.enrolled), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      {/* Stat cards */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "0.7rem",
        }}
      >
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          sub={`${stats.activeStudents} active`}
          color="#3b82f6"
          delta={{ text: "This batch", up: true }}
        />
        <StatCard
          label="Revenue (FRS)"
          value={fmtMoney(stats.totalRevenue)}
          sub="Confirmed payments"
          color="#22c55e"
        />
        <StatCard
          label="Courses Running"
          value={stats.coursesRunning}
          sub="Active programs"
          color="#f59e0b"
        />
        <StatCard
          label="Pending Payments"
          value={stats.pendingPayments}
          sub="Needs confirmation"
          color="#ef4444"
          delta={
            stats.pendingPayments > 0
              ? { text: "Action required", up: false }
              : undefined
          }
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
          {enrollByCourse.length === 0 ? (
            <div
              style={{
                color: "var(--text3)",
                fontSize: "0.75rem",
                padding: "1rem 0",
              }}
            >
              No courses yet.
            </div>
          ) : (
            <>
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
                    key={c.id}
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
                    key={c.id}
                    style={{
                      flex: 1,
                      fontSize: "0.5rem",
                      color: "var(--text3)",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            </>
          )}
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
            {enrollByCourse.slice(0, 5).map((c) => {
              const revenue = c.enrolled * c.trainingFee;
              const pct =
                stats.totalStudents > 0
                  ? Math.round((c.enrolled / stats.totalStudents) * 100)
                  : 0;
              return (
                <div key={c.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      <CourseLogo
                        logoImage={c.logoImage}
                        icon={c.icon}
                        size={22}
                        style={{ background: "transparent" }}
                      />
                      {c.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {fmtMoney(revenue)} FRS
                    </span>
                  </div>
                  <ProgressBar value={pct} color={c.color} height={5} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent students + quick actions */}
      <div
        className="fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "1rem",
          animationDelay: "120ms",
        }}
      >
        {/* Recent students */}
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
              }}
            >
              View all →
            </button>
          </div>
          {recentStudents.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text3)",
                fontSize: "0.78rem",
              }}
            >
              No students yet.
            </div>
          ) : (
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
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        padding: "0.6rem 1rem",
                        textAlign: "left",
                        borderBottom: "1px solid var(--border2)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => {
                  const enrollment = s.enrollments[0];
                  const payment = s.payments[0];
                  const color = enrollment
                    ? categoryColor(enrollment.course.category)
                    : "#3b82f6";
                  const initials =
                    `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
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
                              background: `${color}22`,
                              border: `1.5px solid ${color}55`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.6rem",
                              fontWeight: 800,
                              color,
                              flexShrink: 0,
                              fontFamily: "var(--mono)",
                            }}
                          >
                            {initials}
                          </div>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: "var(--text)",
                            }}
                          >
                            {s.firstName} {s.lastName}
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
                        {enrollment?.course.name ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 1rem",
                          borderBottom: "1px solid var(--border2)",
                        }}
                      >
                        <Tag
                          label={payment?.status ?? "—"}
                          color={
                            payment?.status === "PAID" ? "#22c55e" : "#f59e0b"
                          }
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
                        {fmtDate(s.enrolledAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick actions */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem",
          }}
        >
          <SectionLabel>Quick Actions</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            {(
              [
                {
                  label: "Add Student",
                  icon: "➕",
                  view: "addstudent" as View,
                  color: "#dc2626",
                },
                {
                  label: "New Course",
                  icon: "🆕",
                  view: "addcourse" as View,
                  color: "#3b82f6",
                },
                {
                  label: "View Payments",
                  icon: "💳",
                  view: "payments" as View,
                  color: "#f59e0b",
                },
                {
                  label: "Reports",
                  icon: "📊",
                  view: "reports" as View,
                  color: "#22c55e",
                },
                {
                  label: "Edit Content",
                  icon: "🖊️",
                  view: "content" as View,
                  color: "#a78bfa",
                },
              ] as const
            ).map((a) => (
              <button
                key={a.label}
                onClick={() => setView(a.view)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: 9,
                  border: `1px solid ${a.color}22`,
                  background: `${a.color}0d`,
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{a.icon}</span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {a.label}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    color: a.color,
                  }}
                >
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
