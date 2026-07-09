"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { AdminCourse, useAdminDashboard } from "@/hooks/useAdminDashboard";

import { AdminSidebarNav } from "@/components/admin/dashboard/AdminSidebarNav";
import { OverviewView } from "@/components/admin/dashboard/OverviewView";
import { CoursesView } from "@/components/admin/courses/CoursesView";
import { AddCourseForm } from "@/components/admin/courses/AddCourseForm";
import { StudentsView } from "@/components/admin/students/StudentsView";
import { AddStudentForm } from "@/components/admin/students/AddStudentForm";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";
import type { View } from "@/components/admin/dashboard/AdminSidebarNav";

// Lazy-imported views (keep bundle small)
import dynamic from "next/dynamic";
import { CourseDetailView } from "../courses/[courseId]/page";
const PaymentsView = dynamic(() =>
  import("@/components/admin/payments/PaymentsView").then((m) => ({
    default: m.PaymentsView,
  })),
);
const ReportsView = dynamic(() =>
  import("@/components/admin/reports/ReportsView").then((m) => ({
    default: m.ReportsView,
  })),
);
const ContentView = dynamic(() =>
  import("@/components/admin/content/ContentView").then((m) => ({
    default: m.ContentView,
  })),
);
const SettingsView = dynamic(() =>
  import("@/components/admin/settings/SettingsView").then((m) => ({
    default: m.SettingsView,
  })),
);
type PageView = "list" | "detail";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const [view, setView] = useState<View>("overview");
  const [editCourse, setEditCourse] = useState<AdminCourse | null>(null);
  const [pageView, setPageView] = useState<PageView>("list");
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(
    null,
  );

  const { students, courses, stats, loading, error, refresh } =
    useAdminDashboard();

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/admin/login");
  }, [logout, router]);

  const handleViewChange = (v: View) => {
    setView(v);
    if (v !== "courses") {
      setPageView("list");
      setSelectedCourse(null);
    }
  };

  const pendingCount = stats?.pendingPayments ?? 0;

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <AdminSpinner />
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "#f87171",
          fontSize: "0.85rem",
        }}
      >
        ⚠️ {error}
      </div>
    );

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <AdminSidebarNav
        view={view}
        setView={handleViewChange}
        onLogout={handleLogout}
        user={user}
        pendingCount={pendingCount}
      />

      <main
        className="admin-main"
        style={{
          flex: 1,
          paddingRight: "1.5rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          overflowY: "auto",
        }}
      >
        {/* View router */}
        {view === "overview" && (
          <OverviewView
            setView={setView}
            stats={stats!}
            students={students}
            courses={courses}
          />
        )}
        {view === "students" && (
          <StudentsView
            students={students}
            courses={courses}
            onRefresh={refresh}
          />
        )}
        {view === "courses" && pageView === "list" && (
          <CoursesView
            setView={setView}
            courses={courses}
            onRefresh={refresh}
            onEditCourse={(course) => {
              setEditCourse(course);
              setView("editcourse");
            }}
            onViewCourse={(c) => {
              setSelectedCourse(c);
              setPageView("detail");
            }}
          />
        )}
        {view === "courses" && pageView === "detail" && selectedCourse && (
          <CourseDetailView
            courseId={selectedCourse.id}
            onBack={() => {
              setSelectedCourse(null);
              setPageView("list");
            }}
            onEdit={() => {
              setEditCourse(selectedCourse);
              setView("editcourse");
            }}
            onRefresh={refresh}
          />
        )}
        {view === "editcourse" && editCourse && (
          <AddCourseForm
            setView={(v) => {
              if (v === "courses") {
                setEditCourse(null);
                setView("courses");
              }
            }}
            onRefresh={refresh}
            editCourse={editCourse}
          />
        )}
        {view === "payments" && (
          <PaymentsView
            students={students}
            stats={stats!}
            onRefresh={refresh}
          />
        )}
        {view === "reports" && (
          <ReportsView students={students} courses={courses} />
        )}
        {view === "content" && <ContentView />}
        {view === "addstudent" && (
          <AddStudentForm
            setView={setView}
            courses={courses}
            onRefresh={refresh}
          />
        )}
        {view === "addcourse" && (
          <AddCourseForm setView={setView} onRefresh={refresh} />
        )}
        {view === "settings" && <SettingsView />}
      </main>
    </div>
  );
}
