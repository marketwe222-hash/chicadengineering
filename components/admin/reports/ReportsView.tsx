"use client";
import { SectionLabel, ProgressBar, Tag } from "@/components/admin/shared";
import { categoryColor, fmtMoney } from "@/components/admin/shared";
import { CourseLogo } from "@/components/ui/CourseLogo";
import type { AdminStudent, AdminCourse } from "@/hooks/useAdminDashboard";

interface Props {
  students: AdminStudent[];
  courses: AdminCourse[];
}

export function ReportsView({ students, courses }: Props) {
  // ── Demographics ──
  const backgroundGroups = ["STUDENT", "GRADUATE", "PROFESSIONAL"].map((b) => ({
    label: b.charAt(0) + b.slice(1).toLowerCase(),
    count: students.filter((s) => s.background === b).length,
  }));

  const heardGroups = ["SOCIAL_MEDIA", "FRIEND", "OTHER"].map((h) => ({
    label:
      h === "SOCIAL_MEDIA"
        ? "Social Media"
        : h.charAt(0) + h.slice(1).toLowerCase(),
    count: students.filter((s) => s.howHeard === h).length,
  }));

  const cityGroups = [...new Set(students.map((s) => s.city).filter(Boolean))]
    .slice(0, 5)
    .map((c) => ({
      label: c!,
      count: students.filter((s) => s.city === c).length,
    }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Charts row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {/* ── Course Progress Rates ── */}
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
          {courses.length === 0 ? (
            <div style={{ color: "var(--text3)", fontSize: "0.75rem" }}>
              No data yet.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {courses.map((c) => {
                const stuList = students.filter((s) =>
                  s.enrollments.some((e) => e.course.name === c.name),
                );
                const avg = stuList.length
                  ? Math.round(
                      stuList.reduce(
                        (a, s) =>
                          a +
                          (s.enrollments.find((e) => e.course.name === c.name)
                            ?.progress ?? 0),
                        0,
                      ) / stuList.length,
                    )
                  : 0;
                const color = categoryColor(c.category);

                return (
                  <div key={c.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        <CourseLogo
                          logoImage={c.logoImage}
                          icon={c.icon}
                          size={24}
                          style={{ background: "transparent" }}
                        />
                        {c.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color,
                          fontFamily: "var(--mono)",
                          fontWeight: 700,
                        }}
                      >
                        {avg}% avg
                      </span>
                    </div>
                    <ProgressBar value={avg} color={color} height={5} />
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
          )}
        </div>

        {/* ── Demographics ── */}
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
            {[
              {
                title: "By Background",
                data: backgroundGroups,
                color: "#3b82f6",
              },
              {
                title: "How they found us",
                data: heardGroups,
                color: "#a78bfa",
              },
              { title: "By City", data: cityGroups, color: "#22c55e" },
            ].map(({ title, data, color }) => (
              <div key={title}>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text3)",
                    fontWeight: 700,
                    marginBottom: "0.55rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                  }}
                >
                  {title}
                </div>
                {data.map((g) => (
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
                        value={
                          students.length
                            ? Math.round((g.count / students.length) * 100)
                            : 0
                        }
                        color={color}
                        height={4}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--sky)",
                        fontFamily: "var(--mono)",
                        width: 18,
                        textAlign: "right",
                      }}
                    >
                      {g.count}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Export Panel ── */}
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
                textAlign: "center",
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
