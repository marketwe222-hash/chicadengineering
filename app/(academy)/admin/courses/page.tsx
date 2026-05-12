"use client";

import { Card } from "@/components/ui";
type AdminView =
  | "dashboard"
  | "students"
  | "students_new"
  | "students_detail"
  | "courses"
  | "courses_new"
  | "reports";

export default function CoursesView({
  onNavigate,
}: {
  onNavigate: (v: AdminView) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("dashboard")}
            className="w-9 h-9 glass-sm rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">
              Courses
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Manage academy courses
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("courses_new")}
          className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl"
        >
          + Add Course
        </button>
      </div>
      <Card className="flex flex-col items-center py-16 gap-3 text-center">
        <span className="text-5xl">📚</span>
        <p className="font-bold text-[var(--text-primary)]">
          Course management coming soon
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Full UI is being built.
        </p>
      </Card>
    </div>
  );
}
