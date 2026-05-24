"use client";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";
import dynamic from "next/dynamic";

const ReportsView = dynamic(
  () =>
    import("@/components/admin/reports/ReportsView").then((m) => ({
      default: m.ReportsView,
    })),
  { loading: () => <AdminSpinner /> },
);

export default function AdminReportsPage() {
  const { students, courses, loading } = useAdminDashboard();
  if (loading) return <AdminSpinner />;
  return <ReportsView students={students} courses={courses} />;
}
