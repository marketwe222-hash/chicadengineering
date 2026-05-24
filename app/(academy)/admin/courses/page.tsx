// app/%28academy%29/admin/courses/page.tsx

"use client";
import { useRouter } from "next/navigation";
import { useAdminDashboard, AdminCourse } from "@/hooks/useAdminDashboard";
import { CoursesView } from "@/components/admin/courses/CoursesView";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";

export default function AdminCoursesPage() {
  const router = useRouter();
  const { courses, loading, refresh } = useAdminDashboard();

  if (loading) return <AdminSpinner />;

  return (
    <CoursesView
      setView={(v) => {
        if (v === "addcourse") router.push(`/admin/courses/new`);
      }}
      courses={courses}
      onRefresh={refresh}
      onEditCourse={(course: AdminCourse) => {
        router.push(`/admin/courses/${course.id}/edit`);
      }}
      onViewCourse={(c) => {
        router.push(`/courses/${c.courseCode}`);
      }}
    />
  );
}
