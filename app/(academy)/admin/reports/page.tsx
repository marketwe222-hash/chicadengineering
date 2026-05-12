"use client";

import { Card } from "@/components/ui/Card";

type AdminView =
  | "dashboard"
  | "students"
  | "students_new"
  | "students_detail"
  | "courses"
  | "courses_new"
  | "reports";
// or define it where you keep shared types

export default function ReportsView({
  onNavigate,
}: {
  onNavigate: (v: AdminView) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("dashboard")}
          className="w-9 h-9 glass-sm rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Reports
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Academic and administrative reports
          </p>
        </div>
      </div>
      <Card className="flex flex-col items-center py-16 gap-3 text-center">
        <span className="text-5xl">📊</span>
        <p className="font-bold text-[var(--text-primary)]">
          Reports coming soon
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          Analytics dashboard is being built.
        </p>
      </Card>
    </div>
  );
}
