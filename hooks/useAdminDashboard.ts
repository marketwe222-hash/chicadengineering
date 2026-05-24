// hooks/useAdminDashboard.ts
"use client";
import { useState, useEffect, useCallback } from "react";

export interface AdminStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
  batch: number | null;
  background: string | null;
  school: string | null;
  fieldOfStudy: string | null;
  howHeard: string | null;
  referrer: string | null;
  enrolledAt: string;
  enrollments: {
    id: string;
    status: string;
    progress: number;
    course: {
      id: string;
      name: string;
      category: string;
      icon: string | null;
      color?: string;
    };
  }[];
  payments: {
    id: string;
    amount: string;
    type: string;
    status: string;
    dueDate: string;
    paidAt: string | null;
  }[];
  certificates: { id: string; course: { name: string } }[];
}

export interface AdminCourse {
  id: string;
  courseCode: string;
  name: string;
  category: string;
  icon: string | null;
  description: string | null;
  registrationFee: number;
  trainingFee: number;
  durationMonths: number;
  maxStudents: number;
  status: string;
  batch: number | null;
  instructorName: string | null;
  schedule: string | null;
  _count: { enrollments: number; lessons: number };
}

export interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  pendingPayments: number;
  coursesRunning: number;
  certificatesIssued: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  students: AdminStudent[];
  courses: AdminCourse[];
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    coursesRunning: 0,
    certificatesIssued: 0,
  });
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, studentsRes, coursesRes] = await Promise.all([
        fetch("/api/admin/stats", { credentials: "include" }),
        fetch("/api/admin/students", { credentials: "include" }),
        fetch("/api/admin/courses", { credentials: "include" }),
      ]);

      if (!statsRes.ok || !studentsRes.ok || !coursesRes.ok) {
        throw new Error("Failed to load admin data");
      }

      const [statsData, studentsData, coursesData] = await Promise.all([
        statsRes.json(),
        studentsRes.json(),
        coursesRes.json(),
      ]);

      setStats(statsData);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (e: any) {
      console.error("[useAdminDashboard]", e);
      setError(e.message ?? "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    stats,
    students,
    courses,
    loading,
    error,
    refresh, // ← renamed from refetch for consistency
  };
}
