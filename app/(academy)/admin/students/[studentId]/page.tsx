"use client";

import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Student } from "@/types";
import { Card, Badge } from "@/components/ui";

type AdminView =
  | "dashboard"
  | "students"
  | "students_new"
  | "students_detail"
  | "courses"
  | "courses_new"
  | "reports";
// or define it where you keep shared types

export default function StudentDetailView({
  student,
  onNavigate,
}: {
  student: Student | null;
  onNavigate: (v: AdminView) => void;
}) {
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl">🔍</span>
        <p className="text-[var(--text-muted)]">No student selected</p>
        <button
          onClick={() => onNavigate("students")}
          className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const statusVariant =
    student.status === "ACTIVE"
      ? ("success" as const)
      : student.status === "GRADUATED"
        ? ("sky" as const)
        : student.status === "SUSPENDED"
          ? ("error" as const)
          : ("dark" as const);

  const infoRows = [
    { label: "Student ID", value: student.studentId },
    { label: "Gender", value: student.gender },
    { label: "Date of Birth", value: formatDate(student.dateOfBirth) },
    { label: "Phone", value: student.phone ?? "—" },
    { label: "Address", value: student.address ?? "—" },
    { label: "Enrolled", value: formatDate(student.enrolledAt) },
    { label: "Status", value: student.status },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("students")}
          className="w-9 h-9 glass-sm rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Student Profile
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {student.studentId}
          </p>
        </div>
      </div>

      {/* Profile card */}
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
        <div className="w-20 h-20 rounded-2xl flex-shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black">
          {student.firstName[0]}
          {student.lastName[0]}
        </div>
        <div className="flex flex-col gap-2 text-center sm:text-left flex-1">
          <h2 className="text-xl font-black text-[var(--text-primary)]">
            {student.firstName} {student.middleName} {student.lastName}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {student.studentId}
          </p>
          <Badge variant={statusVariant} dot>
            {student.status}
          </Badge>
        </div>
      </Card>

      {/* Info grid */}
      <Card className="flex flex-col gap-0">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">
          Student Information
        </h3>
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${i !== infoRows.length - 1 ? "border-b border-[var(--divider)]" : ""}`}
          >
            <span className="text-sm text-[var(--text-muted)] font-medium">
              {row.label}
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {row.value}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
