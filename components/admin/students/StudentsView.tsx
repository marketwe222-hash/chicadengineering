"use client";
import { useState, useEffect } from "react";
import { Tag, ProgressBar } from "@/components/admin/shared";
import { categoryColor } from "@/components/admin/shared";
import { StudentFilters } from "./StudentFilters";
import { StudentDetailModal } from "./StudentDetailModal";
import type { AdminStudent, AdminCourse } from "@/hooks/useAdminDashboard";

interface Props {
  students: AdminStudent[];
  courses: AdminCourse[];
  onRefresh: () => void;
}

export function StudentsView({ students, courses, onRefresh }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [selected, setSelected] = useState<AdminStudent | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const name = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchSearch =
      !q || name.includes(q) || (s.email ?? "").toLowerCase().includes(q);
    const matchCourse =
      !courseFilter ||
      s.enrollments.some((e) => e.course.name === courseFilter);
    const matchPay = !payFilter || s.payments[0]?.status === payFilter;
    return matchSearch && matchCourse && matchPay;
  });

  const courseNames = (s: AdminStudent) => {
    const names = s.enrollments.map((e) => e.course.name);
    if (names.length === 0) return "—";
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
  };

  const renderCard = (s: AdminStudent) => {
    const enrollment = s.enrollments[0];
    const payment = s.payments[0];
    const color = enrollment
      ? categoryColor(enrollment.course.category)
      : "#3b82f6";
    const initials =
      `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();

    return (
      <div
        key={s.id}
        style={{
          background: "var(--surface)",
          border: `1px solid ${color}33`,
          borderRadius: 12,
          padding: "0.85rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `${color}22`,
              border: `1.5px solid ${color}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.65rem",
              fontWeight: 800,
              color,
              flexShrink: 0,
              fontFamily: "var(--mono)",
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              {s.firstName} {s.lastName}
            </div>
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--text3)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {s.email ?? s.studentId}
            </div>
          </div>
          <button
            onClick={() => setSelected(s)}
            style={{
              padding: "0.3rem 0.7rem",
              borderRadius: 6,
              border: `1px solid ${color}55`,
              background: `${color}15`,
              color,
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            View
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
            marginTop: "0.6rem",
          }}
        >
          <Tag
            label={courseNames(s)}
            color="var(--text3)"
          />
          <Tag
            label={s.status}
            color={
              s.status === "ACTIVE"
                ? "#22c55e"
                : s.status === "GRADUATED"
                  ? "#f59e0b"
                  : "#a78bfa"
            }
          />
          <Tag
            label={payment?.status ?? "—"}
            color={payment?.status === "PAID" ? "#22c55e" : "#f59e0b"}
          />
          <span
            style={{
              fontSize: "0.6rem",
              color: "var(--text3)",
              padding: "0.2rem 0.5rem",
            }}
          >
            {s.city ?? "—"} · {enrollment?.progress ?? 0}%
          </span>
        </div>
      </div>
    );
  };

  const renderTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[
              "Student",
              "Course(s)",
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
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  padding: "0.65rem 1rem",
                  textAlign: "left",
                  borderBottom: "1px solid var(--border2)",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  padding: "2.5rem",
                  textAlign: "center",
                  color: "var(--text3)",
                  fontSize: "0.78rem",
                }}
              >
                No students found.
              </td>
            </tr>
          ) : (
            filtered.map((s) => {
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
                          background: `${color}22`,
                          border: `1.5px solid ${color}55`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          color,
                          flexShrink: 0,
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: "var(--text)",
                          }}
                        >
                          {s.firstName} {s.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: "0.62rem",
                            color: "var(--text3)",
                          }}
                        >
                          {s.email ?? s.studentId}
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {courseNames(s)}
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      fontSize: "0.72rem",
                      color: "var(--text2)",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    {s.city ?? "—"}
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
                        s.status === "ACTIVE"
                          ? "#22c55e"
                          : s.status === "GRADUATED"
                            ? "#f59e0b"
                            : "#a78bfa"
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
                      label={payment?.status ?? "—"}
                      color={
                        payment?.status === "PAID" ? "#22c55e" : "#f59e0b"
                      }
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
                      value={enrollment?.progress ?? 0}
                      color={color}
                      height={4}
                    />
                    <span
                      style={{
                        fontSize: "0.58rem",
                        color: "var(--text3)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {enrollment?.progress ?? 0}%
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem",
                      borderBottom: "1px solid var(--border2)",
                      whiteSpace: "nowrap",
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
                        transition: "all 0.15s",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <StudentFilters
        search={search}
        setSearch={setSearch}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        payFilter={payFilter}
        setPayFilter={setPayFilter}
        courses={courses}
        total={students.length}
        filtered={filtered.length}
      />

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                borderRadius: 14,
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--text3)",
                fontSize: "0.78rem",
              }}
            >
              No students found.
            </div>
          ) : (
            filtered.map(renderCard)
          )}
        </div>
      ) : (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {renderTable()}
        </div>
      )}

      {selected && (
        <StudentDetailModal
          student={selected}
          onClose={() => setSelected(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}
