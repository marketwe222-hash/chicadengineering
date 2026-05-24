"use client";
import { useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AddStudentForm } from "@/components/admin/students/AddStudentForm";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";

export default function NewStudentPage() {
  const router = useRouter();
  const { courses, loading, refresh } = useAdminDashboard();
  if (loading) return <AdminSpinner />;
  return (
    <AddStudentForm
      setView={(v) => {
        if (v === "students") router.push("/admin/students");
      }}
      courses={courses}
      onRefresh={refresh}
    />
  );
}
