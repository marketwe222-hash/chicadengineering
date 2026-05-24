"use client";

import { useAuthContext } from "@/context/AuthContext";
import Tag from "@/components/ui/Tag";

export default function ProfileView() {
  const { user } = useAuthContext();
  const student = user?.student;

  const initials = student
    ? `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
    : "??";

  const fullName = student ? `${student.firstName} ${student.lastName}` : "—";

  const courseNames =
    (student?.enrollments ?? [])
      .filter((e) => e.status === "ACTIVE")
      .map((e) => e.course.name)
      .join(", ") || "—";

  const rows: { label: string; value: string }[] = [
    {
      label: "Student ID",
      value: student?.studentId ?? "—",
    },
    {
      label: "City",
      value: student?.city ?? "—",
    },
    {
      label: "Enrolled Since",
      value: student?.enrolledAt
        ? new Date(student.enrolledAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "—",
    },
    {
      label: "Programs",
      value: courseNames,
    },
    {
      label: "Batch",
      value: student?.batch ? `Batch ${student.batch}` : "—",
    },
    {
      label: "Status",
      value: student?.status ?? "—",
    },
    {
      label: "Skill Level",
      value: student?.skillLevel ?? "—",
    },
    {
      label: "Background",
      value: student?.background ?? "—",
    },
  ];

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: 540,
      }}
    >
      {/* ── Avatar card ── */}
      <div
        className="glass"
        style={{
          padding: "1.5rem",
          display: "flex",
          gap: "1.2rem",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* top accent */}
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

        {/* Avatar */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--glass-bg-strong)",
            border: "2px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "var(--sky)",
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.4rem",
            }}
          >
            {fullName}
          </h2>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {student?.batch && (
              <Tag label={`Batch ${student.batch}`} color="var(--sky)" />
            )}
            {student?.status && (
              <Tag label={student.status} color="var(--success-text)" />
            )}
            {student?.skillLevel && (
              <Tag label={student.skillLevel} color="var(--warning-text)" />
            )}
          </div>
        </div>
      </div>

      {/* ── Detail rows ── */}
      <div className="glass" style={{ overflow: "hidden" }}>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.8rem 1.1rem",
              borderBottom:
                i < rows.length - 1
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
            <span
              style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily:
                  row.label === "Student ID" ? "var(--font-mono)" : undefined,
                textAlign: "right",
                maxWidth: "60%",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
