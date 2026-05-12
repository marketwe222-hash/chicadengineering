"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { useDebounce } from "@/hooks/useDebounce";
import type { Student } from "@/types";

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
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  accent,
  loading,
}: {
  label: string;
  value: number;
  icon: string;
  accent: string;
  loading: boolean;
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
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// STUDENT ROW
// ─────────────────────────────────────────────
function StudentRow({
  student,
  onWithdraw,
}: {
  student: Student;
  onWithdraw: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const fullName = `${student.firstName} ${student.lastName}`;

  const initials = (student.firstName[0] ?? "") + (student.lastName[0] ?? "");

  const statusVariant =
    student.status === "ACTIVE"
      ? ("success" as const)
      : student.status === "GRADUATED"
        ? ("sky" as const)
        : student.status === "SUSPENDED"
          ? ("error" as const)
          : student.status === "WITHDRAWN"
            ? ("dark" as const)
            : ("warning" as const);

  return (
    <tr className="border-b border-[var(--divider)] hover:bg-[var(--glass-bg-hover)] transition-colors duration-150 group">
      {/* Student */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {fullName}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {student.studentId}
            </p>
          </div>
        </div>
      </td>

      {/* Gender */}
      <td className="px-4 py-4 hidden md:table-cell">
        <span className="text-sm text-[var(--text-secondary)]">
          {student.gender === "MALE"
            ? "♂ Male"
            : student.gender === "FEMALE"
              ? "♀ Female"
              : "Other"}
        </span>
      </td>

      {/* Enrolled */}
      <td className="px-4 py-4 hidden lg:table-cell">
        <span className="text-sm text-[var(--text-muted)]">
          {formatDate(student.enrolledAt)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <Badge variant={statusVariant} size="sm" dot>
          {student.status}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="relative flex items-center justify-end">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="
              w-8 h-8 rounded-lg glass-sm
              flex items-center justify-center
              text-[var(--text-muted)] hover:text-[var(--text-primary)]
              transition-colors opacity-0 group-hover:opacity-100
            "
          >
            ⋮
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* Menu */}
              <div className="absolute right-0 top-9 z-20 glass-strong rounded-xl p-1.5 min-w-[160px] shadow-lg flex flex-col gap-0.5">
                <Link
                  href={`/admin/students/${student.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--sidebar-item-hover)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>👁️</span> View Profile
                </Link>
                <Link
                  href={`/admin/students/${student.id}?edit=true`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--sidebar-item-hover)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>✏️</span> Edit Student
                </Link>
                <div className="h-px bg-[var(--divider)] my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onWithdraw(student.id);
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
// EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-6xl">{search ? "🔍" : "👥"}</span>
      <div>
        <p className="font-bold text-[var(--text-primary)]">
          {search ? "No students found" : "No students yet"}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {search
            ? `No results for "${search}". Try a different search.`
            : "Add your first student to get started."}
        </p>
      </div>
      {!search && (
        <Link
          href="/admin/students/new"
          className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl"
        >
          + Add First Student
        </Link>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--divider)]">
      <p className="text-xs text-[var(--text-muted)]">
        Showing{" "}
        <span className="font-semibold text-[var(--text-primary)]">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[var(--text-primary)]">
          {total}
        </span>{" "}
        students
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg glass-sm flex items-center justify-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5) {
            if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPage(pageNum)}
              className={`
                w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200
                ${
                  page === pageNum
                    ? "btn-primary text-white"
                    : "glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg glass-sm flex items-center justify-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>
    </div>
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--modal-backdrop)] backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
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
              as withdrawn. This action can be reversed by editing the student.
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
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
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
// MAIN PAGE
// ─────────────────────────────────────────────
export default function AdminStudentsPage({
  onNavigate,
  setSelectedStudent,
  allStudents,
  statsLoading,
  refreshAllStudents, // add this back
}: {
  onNavigate: (view: AdminView) => void;
  setSelectedStudent: (student: Student | null) => void;
  allStudents: Student[];
  statsLoading: boolean;
  refreshAllStudents?: () => Promise<unknown>; // add this back
}) {
  const { success, error: toastError } = useToast();

  // ── State ──────────────────────────────────
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  // Withdraw confirm
  const [withdrawTarget, setWithdrawTarget] = useState<Student | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const loadStudents = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", "10");
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const res = await api.get<{
      data: Student[];
      pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }>(`/api/students?${params}`);

    if (res.error) {
      toastError("Failed to load students", res.error);
    } else if (res.data) {
      setStudents(res.data.data);
      setPagination(res.data.pagination);
    }

    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    loadStudents();
  }, [page, debouncedSearch, statusFilter]);

  // ── Stats ───────────────────────────────────
  const stats = {
    total: allStudents.length,
    active: allStudents.filter((s) => s.status === "ACTIVE").length,
    suspended: allStudents.filter((s) => s.status === "SUSPENDED").length,
    graduated: allStudents.filter((s) => s.status === "GRADUATED").length,
  };

  // ── Withdraw ────────────────────────────────
  const handleWithdraw = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    const res = await api.delete(`/api/students/${withdrawTarget.id}`);
    setWithdrawing(false);
    setWithdrawTarget(null);

    if (res.error) {
      toastError("Failed to withdraw student", res.error);
    } else {
      success(
        "Student withdrawn",
        `${withdrawTarget.firstName} ${withdrawTarget.lastName} has been withdrawn.`,
      );
      loadStudents();
      refreshAllStudents?.();
    }
  };

  const STATUS_FILTERS: StatusFilter[] = [
    "ALL",
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "GRADUATED",
    "WITHDRAWN",
  ];

  return (
    <>
      <div className="flex flex-col gap-6 w-full min-w-0">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">
              Students
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Manage all enrolled students
            </p>
          </div>
          <Link
            href="/admin/students/new"
            className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 self-start sm:self-auto"
          >
            <span>+</span> Add Student
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Students"
            value={stats.total}
            icon="🎓"
            accent="from-sky-500/20 to-sky-400/5 border-sky-500/20"
            loading={statsLoading}
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon="✅"
            accent="from-emerald-500/20 to-emerald-400/5 border-emerald-500/20"
            loading={statsLoading}
          />
          <StatCard
            label="Suspended"
            value={stats.suspended}
            icon="⛔"
            accent="from-red-500/20 to-red-400/5 border-red-500/20"
            loading={statsLoading}
          />
          <StatCard
            label="Graduated"
            value={stats.graduated}
            icon="🏆"
            accent="from-orange-500/20 to-orange-400/5 border-orange-500/20"
            loading={statsLoading}
          />
        </div>

        {/* ── Table card ── */}
        <div className="glass rounded-2xl overflow-hidden flex flex-col">
          {/* ── Toolbar ── */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[var(--divider)]">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or ID…"
                className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`
                    px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                    ${
                      statusFilter === f
                        ? "btn-primary text-white"
                        : "glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Table ── */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : students.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--divider)]">
                    {["Student", "Gender", "Enrolled", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className={`
                          px-4 py-3 text-left text-xs font-bold uppercase tracking-widest
                          text-[var(--text-muted)]
                          ${h === "Gender" ? "hidden md:table-cell" : ""}
                          ${h === "Enrolled" ? "hidden lg:table-cell" : ""}
                        `}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onWithdraw={(id) => {
                        const s = students.find((x) => x.id === id);
                        if (s) setWithdrawTarget(s);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && students.length > 0 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onPage={setPage}
            />
          )}
        </div>
      </div>

      {/* ── Withdraw confirm modal ── */}
      {withdrawTarget && (
        <ConfirmModal
          name={`${withdrawTarget.firstName} ${withdrawTarget.lastName}`}
          onConfirm={handleWithdraw}
          onCancel={() => setWithdrawTarget(null)}
          loading={withdrawing}
        />
      )}
    </>
  );
}
