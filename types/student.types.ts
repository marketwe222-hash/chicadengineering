export type EnrollmentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "GRADUATED"
  | "SUSPENDED"
  | "WITHDRAWN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  dateOfBirth: string;
  gender: Gender;
  phone?: string | null;
  address?: string | null;
  profileImage?: string | null;
  status: EnrollmentStatus;
  enrolledAt: string;
  graduatedAt?: string | null;
  emergencyContact?: EmergencyContact | null;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string | null;
}

export interface StudentWithDetails extends Student {
  enrollments: Enrollment[];
  grades: Grade[];
  attendances: Attendance[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  academicTermId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  course?: {
    courseCode: string;
    name: string;
    credits: number;
  };
}

export interface Grade {
  id: string;
  courseId: string;
  score: number;
  gradeScale: string;
  remarks?: string | null;
  gradedAt: string;
  course?: {
    courseCode: string;
    name: string;
  };
}

export interface Attendance {
  id: string;
  courseId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string | null;
  course?: {
    courseCode: string;
    name: string;
  };
}

/* ─────────────────────────────────────────────
   DASHBOARD TYPES
   Moved here from useStudentDashboard.ts so they
   are available across components without importing
   from a hook file.
───────────────────────────────────────────── */

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
  logoImage?: string | null;
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
