"use client";
import { useParams, useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { StudentDetailModal } from "@/components/admin/students/StudentDetailModal";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const router = useRouter();
  const { students, loading, refresh } = useAdminDashboard();

  if (loading) return <AdminSpinner />;

  const student = students.find((s) => s.id === studentId);
  if (!student)
    return (
      <div
        style={{ padding: "2rem", color: "var(--text3)", fontSize: "0.85rem" }}
      >
        Student not found.{" "}
        <button
          onClick={() => router.back()}
          style={{
            color: "var(--sky)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Go back
        </button>
      </div>
    );

  return (
    <StudentDetailModal
      student={student}
      onClose={() => router.push("/admin/students")}
      onRefresh={refresh}
    />
  );
}
