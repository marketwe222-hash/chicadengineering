export type CourseStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Course {
  id: string;
  courseCode: string;
  name: string;
  category: string; // e.g. "CAD", "BIM", "FEA"
  icon?: string | null; // emoji e.g. "📐"
  logoImage?: string | null;
  description?: string | null;
  registrationFee: number; // FRS — default 5000
  trainingFee: number; // FRS — default 70000
  durationMonths: number; // default 3
  maxStudents: number;
  status: CourseStatus;
  batch?: number | null;
  instructorName?: string | null;
  schedule?: string | null;
  createdAt?: string;
  updatedAt?: string;

  _count?: {
    enrollments: number;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
}

export interface AcademicTerm {
  id: string;
  name: string;
  type: "SEMESTER" | "TRIMESTER" | "QUARTER";
  startDate: string;
  endDate: string;
  isActive: boolean;
}
