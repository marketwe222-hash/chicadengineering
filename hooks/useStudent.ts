"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { StudentWithDetails, Grade, Attendance } from "@/types";

// ── Fetch current student's full details ──────────────────────
export function useStudent(studentId: string | undefined) {
  const [student, setStudent] = useState<StudentWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);

    const res = await api.get<{ data: StudentWithDetails }>(
      `/api/students/${studentId}`,
    );

    if (res.error) {
      setError(res.error);
    } else {
      setStudent(res.data?.data ?? null);
    }

    setIsLoading(false);
  }, [studentId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { student, isLoading, error, refetch: fetch };
}

// ── Fetch student grades ──────────────────────────────────────
export function useGrades(studentId?: string) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const url = studentId
        ? `/api/grades?studentId=${studentId}`
        : "/api/grades";
      const res = await api.get<{ data: Grade[] }>(url);
      if (res.error) setError(res.error);
      else setGrades(res.data?.data ?? []);
      setIsLoading(false);
    };
    load();
  }, [studentId]);

  // ── Compute GPA ────────────────────────────────────────────
  const gpa = computeGPA(grades);

  return { grades, gpa, isLoading, error };
}

// ── Fetch student attendance ──────────────────────────────────
export function useAttendance(studentId?: string) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const url = studentId
        ? `/api/attendance?studentId=${studentId}`
        : "/api/attendance";
      const res = await api.get<{ data: Attendance[] }>(url);
      if (res.error) setError(res.error);
      else setAttendance(res.data?.data ?? []);
      setIsLoading(false);
    };
    load();
  }, [studentId]);

  // ── Compute attendance rate ─────────────────────────────────
  const rate = computeAttendanceRate(attendance);

  return { attendance, rate, isLoading, error };
}

// ── Helpers ───────────────────────────────────────────────────
const GRADE_POINTS: Record<string, number> = {
  A_PLUS: 4.0,
  A: 4.0,
  A_MINUS: 3.7,
  B_PLUS: 3.3,
  B: 3.0,
  B_MINUS: 2.7,
  C_PLUS: 2.3,
  C: 2.0,
  C_MINUS: 1.7,
  D: 1.0,
  F: 0.0,
};

function computeGPA(grades: Grade[]): number {
  if (!grades.length) return 0;
  const total = grades.reduce(
    (sum, g) => sum + (GRADE_POINTS[g.gradeScale] ?? 0),
    0,
  );
  return parseFloat((total / grades.length).toFixed(2));
}

function computeAttendanceRate(records: Attendance[]): number {
  if (!records.length) return 0;
  const present = records.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE",
  ).length;
  return parseFloat(((present / records.length) * 100).toFixed(1));
}
