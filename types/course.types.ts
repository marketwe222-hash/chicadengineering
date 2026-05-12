export type CourseStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface Course {
  id: string;
  courseCode: string;
  name: string;
  description?: string | null;
  credits: number;
  maxStudents: number;
  status: CourseStatus;
  departmentId: string;
  academicTermId: string;
  instructorName?: string | null;
  schedule?: string | null;
  room?: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  academicTerm?: {
    id: string;
    name: string;
  };
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
