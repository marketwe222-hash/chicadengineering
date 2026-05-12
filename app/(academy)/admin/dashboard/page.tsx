//app/(academy)/admin/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";
import { useStudents, useAllStudents } from "@/hooks/useStudents";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import type { Student } from "@/types";
import NewStudentPage from "../students/new/page";
import StudentDetailView from "../students/[studentId]/page";
import CoursesView from "../courses/page";
import NewCoursePage from "../courses/new/page";
import ReportsView from "../reports/page";
import AdminStudentsPage from "../students/page";

type AdminView =
  | "dashboard"
  | "students"
  | "students_new"
  | "students_detail"
  | "courses"
  | "courses_new"
  | "reports";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type StatusFilter =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "GRADUATED"
  | "WITHDRAWN";

// ─────────────────────────────────────────────
// SHARED STAT CARD
// ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accent: string;
  loading?: boolean;
}) {
  return (
    <Card className={`bg-gradient-to-br ${accent} border`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {label}
          </p>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-3xl font-black text-[var(--text-primary)]">
              {value}
            </p>
          )}
          {sub && !loading && (
            <p className="text-xs text-[var(--text-muted)]">{sub}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// ── VIEW: OVERVIEW DASHBOARD
// ─────────────────────────────────────────────
function OverviewView({
  onNavigate,
  allStudents,
  statsLoading,
}: {
  onNavigate: (v: AdminView) => void;
  allStudents: Student[];
  statsLoading: boolean;
}) {
  const { user } = useAuth();
  const isSuper = user?.role === "SUPER_ADMIN";
  const firstName = user?.admin?.firstName ?? "Admin";

  const stats = {
    total: allStudents.length,
    active: allStudents.filter((s) => s.status === "ACTIVE").length,
    suspended: allStudents.filter((s) => s.status === "SUSPENDED").length,
    graduated: allStudents.filter((s) => s.status === "GRADUATED").length,
  };

  const recentStudents = [...allStudents]
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
    )
    .slice(0, 6);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickActions = [
    {
      icon: "➕",
      label: "Add New Student",
      sub: "Register a student",
      view: "students_new" as AdminView,
      accent: "bg-sky-500/10",
    },
    {
      icon: "📖",
      label: "Create Course",
      sub: "Add a new course",
      view: "courses_new" as AdminView,
      accent: "bg-orange-500/10",
    },
    {
      icon: "📊",
      label: "View Reports",
      sub: "Academic reports",
      view: "reports" as AdminView,
      accent: "bg-emerald-500/10",
    },
    {
      icon: "🎓",
      label: "Manage Students",
      sub: "View all students",
      view: "students" as AdminView,
      accent: "bg-purple-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="glass rounded-2xl px-6 py-5 bg-gradient-to-r from-orange-500/10 via-transparent to-sky-500/10 border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[var(--text-muted)] font-medium">
            {greeting} 👋
          </p>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">
            Welcome back,{" "}
            <span className="text-gradient-secondary">{firstName}</span>!
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSuper && (
            <Badge variant="orange" dot>
              Super Admin
            </Badge>
          )}
          <Badge variant="sky" dot>
            {user?.admin?.department ?? "Administration"}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats.total}
          sub="All registrations"
          icon="🎓"
          accent="from-sky-500/20 to-sky-400/5 border-sky-500/20"
          loading={statsLoading}
        />
        <StatCard
          label="Active Students"
          value={stats.active}
          sub="Currently enrolled"
          icon="✅"
          accent="from-emerald-500/20 to-emerald-400/5 border-emerald-500/20"
          loading={statsLoading}
        />
        <StatCard
          label="Suspended"
          value={stats.suspended}
          sub="Under review"
          icon="⛔"
          accent="from-red-500/20 to-red-400/5 border-red-500/20"
          loading={statsLoading}
        />
        <StatCard
          label="Graduated"
          value={stats.graduated}
          sub="All time"
          icon="🏆"
          accent="from-orange-500/20 to-orange-400/5 border-orange-500/20"
          loading={statsLoading}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card className="flex flex-col gap-4">
          <h3 className="font-bold text-[var(--text-primary)]">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.view)}
                className="glass-sm rounded-xl p-4 flex items-center gap-3 hover:bg-[var(--glass-bg-hover)] transition-all duration-200 hover:scale-[1.01] group border border-[var(--glass-border-subtle)] text-left"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl ${a.accent}`}
                >
                  {a.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {a.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{a.sub}</p>
                </div>
                <span className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent students */}
        <Card className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">
              Recent Students
            </h3>
            <button
              onClick={() => onNavigate("students")}
              className="text-xs text-[var(--text-link)] hover:text-[var(--text-link-hover)] transition-colors"
            >
              View all →
            </button>
          </div>

          {statsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : recentStudents.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-[var(--text-muted)]">
              <span className="text-4xl">👥</span>
              <p className="text-sm">No students yet</p>
            </div>
          ) : (
            <div>
              {recentStudents.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-3 border-b border-[var(--divider)] last:border-0 gap-4 hover:bg-[var(--glass-bg-hover)] px-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => onNavigate("students_detail")}
                >
                  <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {s.firstName[0]}
                    {s.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {s.studentId} · {formatDate(s.enrolledAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      s.status === "ACTIVE"
                        ? ("success" as const)
                        : s.status === "SUSPENDED"
                          ? ("error" as const)
                          : ("dark" as const)
                    }
                    size="sm"
                    dot
                  >
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Super admin section */}
      {isSuper && (
        <Card className="border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">
                Super Admin Controls
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                System-level management
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "👥", label: "Manage Admins", sub: "Add/remove admins" },
              { icon: "🗄️", label: "Database", sub: "System data" },
              { icon: "📋", label: "Audit Logs", sub: "All activity" },
              { icon: "⚙️", label: "System Settings", sub: "Global config" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass-sm rounded-xl p-3 text-center flex flex-col items-center gap-2 cursor-pointer hover:bg-[var(--glass-bg-hover)] transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// STUDENT TABLE ROW
// ─────────────────────────────────────────────
function StudentTableRow({
  student,
  onView,
  onWithdraw,
}: {
  student: Student;
  onView: () => void;
  onWithdraw: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusVariant =
    student.status === "ACTIVE"
      ? ("success" as const)
      : student.status === "GRADUATED"
        ? ("sky" as const)
        : student.status === "SUSPENDED"
          ? ("error" as const)
          : ("dark" as const);

  return (
    <tr className="border-b border-[var(--divider)] hover:bg-[var(--glass-bg-hover)] transition-colors group">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {student.firstName[0]}
            {student.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {student.studentId}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <span className="text-sm text-[var(--text-secondary)]">
          {student.gender === "MALE"
            ? "♂ Male"
            : student.gender === "FEMALE"
              ? "♀ Female"
              : "Other"}
        </span>
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <span className="text-sm text-[var(--text-muted)]">
          {formatDate(student.enrolledAt)}
        </span>
      </td>
      <td className="px-4 py-4">
        <Badge variant={statusVariant} size="sm" dot>
          {student.status}
        </Badge>
      </td>
      <td className="px-4 py-4">
        <div className="relative flex items-center justify-end">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-lg glass-sm flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-all"
          >
            ⋮
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-9 z-20 glass-strong rounded-xl p-1.5 min-w-[160px] shadow-lg flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onView();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--sidebar-item-hover)] transition-colors w-full text-left"
                >
                  <span>👁️</span> View Profile
                </button>
                <div className="h-px bg-[var(--divider)] my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onWithdraw();
                  }}
                  disabled={student.status === "WITHDRAWN"}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full text-left"
                >
                  <span>🚫</span> Withdraw
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────
function ConfirmModal({
  name,
  onConfirm,
  onCancel,
  loading,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--modal-backdrop)] backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-modal p-8 max-w-sm w-full flex flex-col gap-5 z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">⚠️</span>
          <div>
            <h3 className="font-black text-xl text-[var(--text-primary)]">
              Withdraw Student?
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              This will mark{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {name}
              </span>{" "}
              as withdrawn.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 btn-secondary py-3 text-sm font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
          >
            {loading ? <Spinner size="sm" color="text-white" /> : null}
            {loading ? "Processing…" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ── ROOT PAGE — single state machine
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { success, error: toastError } = useToast();
  const [view, setView] = useState<AdminView>("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const {
    allStudents,
    isLoading: statsLoading,
    error: allStudentsError,
    mutate: mutateAllStudents,
  } = useAllStudents();

  useEffect(() => {
    if (allStudentsError) {
      toastError("Failed to load students", allStudentsError);
    }
  }, [allStudentsError, toastError]);

  const navigate = (v: AdminView) => setView(v);

  return (
    <>
      <AdminSidebar
        currentView={view}
        onViewChange={(newView) => setView(newView as AdminView)}
      />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="p-6 w-full">
          {view === "dashboard" && (
            <OverviewView
              onNavigate={navigate}
              allStudents={allStudents}
              statsLoading={statsLoading}
            />
          )}
          {view === "students" && (
            <AdminStudentsPage
              onNavigate={navigate}
              setSelectedStudent={setSelectedStudent}
              allStudents={allStudents}
              statsLoading={statsLoading}
              refreshAllStudents={mutateAllStudents}
            />
          )}
          {view === "students_new" && <NewStudentPage onNavigate={navigate} />}
          {view === "students_detail" && (
            <StudentDetailView
              student={selectedStudent}
              onNavigate={navigate}
            />
          )}
          {view === "courses" && <CoursesView onNavigate={navigate} />}
          {view === "courses_new" && <NewCoursePage />}
          {view === "reports" && <ReportsView onNavigate={navigate} />}
        </div>
      </main>
    </>
  );
}
