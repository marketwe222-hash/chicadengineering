"use client";
import { SectionLabel, StatCard, Tag } from "@/components/admin/shared";
import { categoryColor, fmtMoney, fmtDate } from "@/components/admin/shared";
import type { AdminStudent, AdminStats } from "@/hooks/useAdminDashboard";

interface Props {
  students: AdminStudent[];
  stats: AdminStats;
  onRefresh: () => void;
}

export function PaymentsView({ students, stats, onRefresh }: Props) {
  const allPayments = students.flatMap((s) =>
    s.payments.map((p) => ({
      ...p,
      student: s,
      enrollment: s.enrollments[0],
    })),
  );

  const handleConfirm = async (paymentId: string) => {
    await fetch(`/api/payments/${paymentId}/confirm`, {
      method: "PATCH",
      credentials: "include",
    });
    onRefresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.7rem",
        }}
      >
        <StatCard
          label="Total Collected"
          value={`${fmtMoney(stats.totalRevenue)} FRS`}
          sub="Confirmed payments"
          color="#22c55e"
        />
        <StatCard
          label="Pending"
          value={stats.pendingPayments}
          sub="Awaiting confirmation"
          color="#f59e0b"
        />
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          sub="Enrolled this batch"
          color="#3b82f6"
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
        className="fade-up"
      >
        <div
          style={{
            padding: "1rem 1.1rem",
            borderBottom: "1px solid var(--border2)",
          }}
        >
          <SectionLabel>All Transactions</SectionLabel>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              color: "var(--text)",
            }}
          >
            Payment Log
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Student",
                  "Course",
                  "Amount (FRS)",
                  "Type",
                  "Status",
                  "Date",
                  "Action",
                ].map((h) => (
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--text3)",
                      fontSize: "0.78rem",
                    }}
                  >
                    No payments recorded.
                  </td>
                </tr>
              ) : (
                allPayments.map((p) => {
                  const color = p.enrollment
                    ? categoryColor(p.enrollment.course.category)
                    : "#3b82f6";
                  const initials =
                    `${p.student.firstName[0]}${p.student.lastName[0]}`.toUpperCase();

                  return (
                    <tr key={p.id} className="row-hover">
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
                              fontFamily: "var(--mono)",
                            }}
                          >
                            {initials}
                          </div>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "var(--text)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.student.firstName} {p.student.lastName}
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
                        {p.enrollment?.course.name ?? "—"}
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 1rem",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--text)",
                          borderBottom: "1px solid var(--border2)",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {Number(p.amount).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 1rem",
                          fontSize: "0.65rem",
                          color: "var(--text3)",
                          borderBottom: "1px solid var(--border2)",
                        }}
                      >
                        {p.type}
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 1rem",
                          borderBottom: "1px solid var(--border2)",
                        }}
                      >
                        <Tag
                          label={p.status}
                          color={
                            p.status === "PAID"
                              ? "#22c55e"
                              : p.status === "OVERDUE"
                                ? "#ef4444"
                                : "#f59e0b"
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtDate(p.dueDate)}
                      </td>
                      <td
                        style={{
                          padding: "0.65rem 1rem",
                          borderBottom: "1px solid var(--border2)",
                        }}
                      >
                        {p.status === "PENDING" ? (
                          <button
                            onClick={() => handleConfirm(p.id)}
                            style={{
                              padding: "0.25rem 0.65rem",
                              borderRadius: 6,
                              border: "1px solid rgba(34,197,94,0.3)",
                              background: "rgba(34,197,94,0.1)",
                              color: "#4ade80",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Confirm
                          </button>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              color: "var(--text3)",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
