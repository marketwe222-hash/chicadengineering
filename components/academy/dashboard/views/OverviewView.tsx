"use client";

import ProgressRing from "@/components/ui/ProgressRing";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { CourseLogo } from "@/components/ui/CourseLogo";
import type { View } from "@/components/academy/dashboard/StudentSidebarNav";

interface OverviewCourse {
  name: string;
  color: string;
  currentLessonOrder: number;
  totalLessons: number;
  icon: string;
  logoImage?: string | null;
  currentLessonName: string;
  progress: number;
  currentLessonDuration: string;
}

interface OverviewLesson {
  id: string;
  done: boolean;
  courseColor: string;
  current: boolean;
  course: string;
  name: string;
  duration: string;
}

interface DashboardData {
  courses: OverviewCourse[];
  coursesEnrolled: number;
  lessonsCompleted: number;
  totalLessons: number;
  certificatesEarned: number;
  overallProgress: number;
  allLessons: OverviewLesson[];
}

interface OverviewViewProps {
  data: DashboardData;
  setView: (v: View) => void;
}

export default function OverviewView({ data, setView }: OverviewViewProps) {
  const activeCourse = data.courses[0];

  const stats = [
    {
      label: "Courses Enrolled",
      value: data.coursesEnrolled,
      sub: data.courses.map((c) => c.name).join(", ") || "—",
      icon: "📚",
      color: "var(--sky)",
    },
    {
      label: "Lessons Completed",
      value: data.lessonsCompleted,
      sub: `of ${data.totalLessons} total`,
      icon: "✅",
      color: "var(--success-text)",
    },
    {
      label: "Certificates Earned",
      value: data.certificatesEarned,
      sub:
        data.certificatesEarned > 0
          ? "View in Certificates"
          : "Complete a course to earn",
      icon: "🎓",
      color: "var(--warning-text)",
    },
    {
      label: "Study Hours",
      value: "—",
      sub: "Coming soon",
      icon: "⏱",
      color: "var(--accent-primary)",
    },
  ];

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
    >
      {/* ── Welcome banner ── */}
      <div
        className="glass"
        style={{
          padding: "1.25rem 1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, var(--sky), transparent)",
          }}
        />
        <div>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "0.2rem",
            }}
          >
            Welcome back 👋
          </p>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "0.35rem",
            }}
          >
            {activeCourse
              ? `Let's continue where you left off in ${activeCourse.name}!`
              : "Welcome to your dashboard!"}
          </h2>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {data.totalLessons > 0 ? (
              <>
                You&apos;ve completed{" "}
                <strong style={{ color: "var(--sky)" }}>
                  {data.lessonsCompleted}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "var(--sky)" }}>
                  {data.totalLessons}
                </strong>{" "}
                lessons. Keep going!
              </>
            ) : (
              "No lessons available yet. Check back soon!"
            )}
          </p>
        </div>

        {/* Progress ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ProgressRing value={data.overallProgress} size={68} stroke={5} />
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
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {data.overallProgress}%
            </span>
            <span
              style={{
                fontSize: "0.48rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Overall
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.7rem",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass"
            style={{
              padding: "1rem 1.1rem",
              position: "relative",
              overflow: "hidden",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${s.color}, transparent)`,
              }}
            />
            <p
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              {s.label}
            </p>
            <div
              style={{
                fontSize: "1.65rem",
                fontWeight: 900,
                color: s.color,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginBottom: "0.3rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              {s.value}
            </div>
            <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom two-column ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Continue Learning */}
        <div>
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "0.65rem",
            }}
          >
            Resume · Continue Learning
          </p>

          {activeCourse ? (
            <div className="glass" style={{ overflow: "hidden" }}>
              {/* Course banner */}
              <div
                style={{
                  height: 110,
                  background: `linear-gradient(135deg, ${activeCourse.color}22, var(--overlay-heavy))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderBottom: "1px solid var(--glass-border-subtle)",
                }}
              >
                <CourseLogo
                  logoImage={activeCourse.logoImage}
                  icon={activeCourse.icon}
                  size={60}
                  style={{
                    background: "transparent",
                    filter: `drop-shadow(0 0 12px ${activeCourse.color}66)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.6rem",
                    left: "0.7rem",
                  }}
                >
                  <Tag
                    label={`${activeCourse.name} · Lesson ${activeCourse.currentLessonOrder} of ${activeCourse.totalLessons}`}
                    color={activeCourse.color}
                  />
                </div>
              </div>

              <div style={{ padding: "0.9rem 1rem" }}>
                <p
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {activeCourse.currentLessonName}
                </p>
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
                  <span
                    style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}
                  >
                    {activeCourse.progress}% complete
                  </span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {activeCourse.currentLessonDuration}
                  </span>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => setView("lessons")}
                  style={{
                    width: "100%",
                    padding: "0.62rem",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  ▶ Resume Lesson
                </button>
              </div>
            </div>
          ) : (
            <div
              className="glass"
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
              }}
            >
              No active courses yet.
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Announcements */}
          <div>
            <p
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "0.65rem",
              }}
            >
              Academy · Announcements
            </p>
            <div
              className="glass"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                minHeight: 100,
              }}
            >
              <span style={{ fontSize: "1.4rem" }}>📢</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                }}
              >
                Announcements coming soon
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                Academy updates and notices will appear here.
              </span>
            </div>
          </div>

          {/* Up next */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.65rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Up Next · Remaining Lessons
              </p>
              <button
                onClick={() => setView("lessons")}
                style={{
                  fontSize: "0.62rem",
                  color: "var(--sky)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "color var(--transition-base)",
                }}
              >
                View all →
              </button>
            </div>

            <div className="glass" style={{ overflow: "hidden" }}>
              {data.allLessons.filter((l) => !l.done).slice(0, 4).length > 0 ? (
                data.allLessons
                  .filter((l) => !l.done)
                  .slice(0, 4)
                  .map((l, i, arr) => (
                    <div
                      key={l.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        padding: "0.7rem 1rem",
                        borderBottom:
                          i < arr.length - 1
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
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: `color-mix(in srgb, ${l.courseColor} 12%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${l.courseColor} 28%, transparent)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontSize: "0.7rem" }}>
                          {l.current ? "▶" : "○"}
                        </span>
                      </div>
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
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {l.name}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                          flexShrink: 0,
                        }}
                      >
                        ⏱ {l.duration}
                      </span>
                    </div>
                  ))
              ) : (
                <div
                  style={{
                    padding: "1.5rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                  }}
                >
                  🎉 All lessons completed!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
