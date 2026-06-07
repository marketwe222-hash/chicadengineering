import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";

export interface DashboardLesson {
  id: string;
  course: string;
  courseColor: string;
  name: string;
  duration: string;
  done: boolean;
  current: boolean;
}

export interface DashboardCourse {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  currentLessonOrder: number;
  totalLessons: number;
  currentLessonName: string;
  currentLessonDuration: string;
  progress: number;
  lessons: DashboardLesson[];
}

export interface DashboardData {
  overallProgress: number;
  coursesEnrolled: number;
  lessonsCompleted: number;
  totalLessons: number;
  certificatesEarned: number;
  courses: DashboardCourse[];
  allLessons: DashboardLesson[];
}

export function useStudentDashboard() {
  const { user } = useAuthContext();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const studentId = user?.student?.id;
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/students/${studentId}/dashboard`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard");
      }

      const payload = await response.json();
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [user?.student?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
