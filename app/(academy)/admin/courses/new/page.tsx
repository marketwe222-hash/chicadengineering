"use client";
import { useRouter } from "next/navigation";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AddCourseForm } from "@/components/admin/courses/AddCourseForm";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";

export default function NewCoursePage() {
  const router = useRouter();
  const { loading, refresh } = useAdminDashboard();

  if (loading) return <AdminSpinner />;

  return (
    <AddCourseForm
      setView={(v) => {
        if (v === "courses") router.push("/admin/courses");
      }}
      onRefresh={refresh}
    />
  );
}
