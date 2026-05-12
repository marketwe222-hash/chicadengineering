import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ── Student ───────────────────────────────────────────────────
export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  middleName: z.string().max(50).optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  emergencyContact: z
    .object({
      name: z.string().min(1),
      relationship: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email().optional(),
    })
    .optional(),
});

export const updateStudentSchema = createStudentSchema
  .omit({ password: true })
  .partial();

// ── Course ────────────────────────────────────────────────────
export const createCourseSchema = z.object({
  courseCode: z.string().min(1, "Course code is required").max(20),
  name: z.string().min(1, "Course name is required").max(100),
  description: z.string().optional(),
  credits: z.number().int().min(1).max(6).default(3),
  maxStudents: z.number().int().min(1).max(200).default(30),
  departmentId: z.string().min(1, "Department is required"),
  academicTermId: z.string().min(1, "Academic term is required"),
  instructorName: z.string().optional(),
  schedule: z.string().optional(),
  room: z.string().optional(),
});

// ── Grade ─────────────────────────────────────────────────────
export const gradeSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  score: z.number().min(0).max(100),
  remarks: z.string().optional(),
});

// ── Attendance ────────────────────────────────────────────────
export const attendanceSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
