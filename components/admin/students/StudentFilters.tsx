"use client";
import { inputStyle } from "@/components/admin/shared";
import type { AdminCourse } from "@/hooks/useAdminDashboard";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  courseFilter: string;
  setCourseFilter: (v: string) => void;
  payFilter: string;
  setPayFilter: (v: string) => void;
  courses: AdminCourse[];
  total: number;
  filtered: number;
}

export function StudentFilters({
  search,
  setSearch,
  courseFilter,
  setCourseFilter,
  payFilter,
  setPayFilter,
  courses,
  total,
  filtered,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.65rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <input
        style={{ ...inputStyle, width: 220, fontSize: "0.78rem" }}
        placeholder="Search name, email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        style={{ ...inputStyle, width: "auto", fontSize: "0.76rem" }}
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
      >
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        style={{ ...inputStyle, width: "auto", fontSize: "0.76rem" }}
        value={payFilter}
        onChange={(e) => setPayFilter(e.target.value)}
      >
        <option value="">All Payments</option>
        <option value="PAID">Paid</option>
        <option value="PENDING">Pending</option>
        <option value="OVERDUE">Overdue</option>
      </select>
      <span
        style={{
          fontSize: "0.65rem",
          color: "var(--text3)",
          marginLeft: "auto",
          fontFamily: "var(--mono)",
        }}
      >
        {filtered} of {total} students
      </span>
    </div>
  );
}
