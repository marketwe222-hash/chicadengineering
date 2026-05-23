import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────
// ── Auth ──────────────────────────────────────────────────────
// ── Auth ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Student ID or email is required")
    .trim()
    .transform((val) => {
      // Emails are case-insensitive → lowercase
      // Student IDs must stay uppercase → don't transform
      if (val.includes("@")) return val.toLowerCase();
      return val.toUpperCase(); // "aca-2026-0001" → "ACA-2026-0001"
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
// Used internally / admin-created accounts
export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    studentId: z.string().min(1, "Student ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Used by the public registration page (/academy/register)
export const publicRegisterSchema = z.object({
  // Identity (Step 1)
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  city: z.string().min(1, "City is required"),

  // Background (Step 2)
  background: z.enum(["STUDENT", "GRADUATE", "PROFESSIONAL"]).optional(),
  school: z.string().min(1, "School or workplace is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),

  // Motivation (Step 3)
  whyEnrolled: z.string().min(1, "Please share your motivation"),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  howHeard: z.enum(["SOCIAL_MEDIA", "FRIEND", "OTHER"]),
  referrer: z.string().min(1, "Please enter a name or 'None'"),

  // Commitment (Step 4)
  followsSocial: z.boolean(),
  joinChallenge: z.boolean(),
});

export type PublicRegisterInput = z.infer<typeof publicRegisterSchema>;

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
  category: z.string().min(1, "Category is required"), // e.g. "CAD", "BIM"
  icon: z.string().optional(), // emoji e.g. "📐"
  description: z.string().optional(),
  registrationFee: z.number().int().min(0).default(5000),
  trainingFee: z.number().int().min(0).default(70000),
  durationMonths: z.number().int().min(1).max(24).default(3),
  maxStudents: z.number().int().min(1).max(200).default(30),
  batch: z.number().int().optional(),
  instructorName: z.string().optional(),
  schedule: z.string().optional(),
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

// ── Exports ───────────────────────────────────────────────────
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export const updateCourseSchema = createCourseSchema.partial();
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
