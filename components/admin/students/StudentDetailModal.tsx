"use client";
import { Tag, ProgressBar } from "@/components/admin/shared";
import { categoryColor, fmtDate } from "@/components/admin/shared";
import type { AdminStudent } from "@/hooks/useAdminDashboard";

interface Props {
  student: AdminStudent;
  onClose: () => void;
  onRefresh: () => void;
}

export function StudentDetailModal({ student: s, onClose, onRefresh }: Props) {
  const handleConfirmPayment = async (paymentId: string) => {
    await fetch(`/api/payments/${paymentId}/confirm`, {
      method: "PATCH",
      credentials: "include",
    });
    onRefresh();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "1.75rem",
          maxWidth: 520,
          width: "90%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.18)",
                border: "2px solid rgba(59,130,246,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: 800,
                color: "#3b82f6",
                fontFamily: "var(--mono)",
              }}
            >
              {`${s.firstName[0]}${s.lastName[0]}`.toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.firstName} {s.lastName}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.35rem",
                  marginTop: "0.25rem",
                  flexWrap: "wrap",
                }}
              >
                {s.enrollments.map((e) => (
                  <Tag
                    key={e.id}
                    label={e.course.name}
                    color={categoryColor(e.course.category)}
                  />
                ))}
                {s.payments[0] && (
                  <Tag
                    label={s.payments[0].status}
                    color={
                      s.payments[0].status === "PAID" ? "#22c55e" : "#f59e0b"
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              color: "var(--text3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Detail grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem",
            marginBottom: "1.1rem",
          }}
        >
          {(
            [
              ["Student ID", s.studentId],
              ["Email", s.email ?? "—"],
              ["Phone", s.phone ?? "—"],
              ["City", s.city ?? "—"],
              ["Status", s.status],
              ["Background", s.background ?? "—"],
              ["School", s.school ?? "—"],
              ["Field", s.fieldOfStudy ?? "—"],
              ["Enrolled", fmtDate(s.enrolledAt)],
              ["Referred by", s.referrer ?? "None"],
              ["How heard", s.howHeard ?? "—"],
              ["Certificates", s.certificates.length.toString()],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border2)",
                borderRadius: 8,
                padding: "0.6rem 0.8rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  fontWeight: 700,
                  marginBottom: "0.18rem",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "var(--text)",
                  fontWeight: 500,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bars */}
        {s.enrollments.map((e) => (
          <div key={e.id} style={{ marginBottom: "0.75rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
                {e.course.name} Progress
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--sky)",
                  fontFamily: "var(--mono)",
                }}
              >
                {e.progress}%
              </span>
            </div>
            <ProgressBar
              value={e.progress}
              color={categoryColor(e.course.category)}
              height={6}
            />
          </div>
        ))}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "0.55rem",
            flexWrap: "wrap",
            marginTop: "0.5rem",
          }}
        >
          {s.payments[0]?.status === "PENDING" && (
            <button
              onClick={() => handleConfirmPayment(s.payments[0].id)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "1px solid rgba(34,197,94,0.3)",
                background: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ✓ Confirm Payment
            </button>
          )}
          <button
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              color: "var(--sky)",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📧 Send Email
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid rgba(245,158,11,0.3)",
              background: "rgba(245,158,11,0.1)",
              color: "#fbbf24",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🏅 Issue Certificate
          </button>
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                `Withdraw ${s.firstName} ${s.lastName}? The student record will be kept but marked as withdrawn.`,
              );
              if (!confirmed) return;

              await fetch(`/api/students/${s.id}`, {
                method: "PUT",
                credentials: "include",
              });

              onRefresh();
              onClose();
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid rgba(245,158,11,0.3)",
              background: "rgba(245,158,11,0.1)",
              color: "#fbbf24",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ↩️ Withdraw Student
          </button>
          <button
            onClick={async () => {
              const confirmed = window.confirm(
                `⚠️ PERMANENTLY DELETE ${s.firstName} ${s.lastName}? This action cannot be undone. All student data will be removed from the database.`,
              );
              if (!confirmed) return;

              await fetch(`/api/students/${s.id}`, {
                method: "DELETE",
                credentials: "include",
              });

              onRefresh();
              onClose();
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.5)",
              background: "rgba(239,68,68,0.15)",
              color: "#ff6b6b",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🗑️ Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
