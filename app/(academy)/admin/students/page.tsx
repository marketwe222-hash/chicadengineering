"use client";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { StudentsView } from "@/components/admin/students/StudentsView";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";

export default function AdminStudentsPage() {
  const { students, courses, loading, refresh } = useAdminDashboard();
  if (loading) return <AdminSpinner />;
  return (
    <StudentsView students={students} courses={courses} onRefresh={refresh} />
  );
}
