"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddCourseForm } from "@/components/admin/courses/AddCourseForm";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";
import type { AdminCourse } from "@/hooks/useAdminDashboard";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/courses/${courseId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCourse(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <AdminSpinner />;
  if (error)
    return (
      <div style={{ color: "#f87171", padding: "2rem", fontSize: "0.85rem" }}>
        ⚠️ {error}
      </div>
    );

  return (
    <AddCourseForm
      setView={(v) => {
        if (v === "courses") router.push("/admin/courses");
      }}
      onRefresh={() => {}}
      editCourse={course}
    />
  );
}
