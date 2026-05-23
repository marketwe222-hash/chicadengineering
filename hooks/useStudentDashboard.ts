import { useState, useEffect } from "react";
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

  useEffect(() => {
    const studentId = user?.student?.id;
    if (!studentId) return;

    setLoading(true);
    fetch(`/api/students/${studentId}/dashboard`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load dashboard");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.student?.id]);

  return { data, loading, error };
}
