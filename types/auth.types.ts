export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN";

export type EnrollmentStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "GRADUATED"
  | "SUSPENDED"
  | "WITHDRAWN";

export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type StudentBackground = "STUDENT" | "GRADUATE" | "PROFESSIONAL";
export type HowHeard = "SOCIAL_MEDIA" | "FRIEND" | "OTHER";

export interface AuthUser {
  id: string;
  email?: string | null;
  role: UserRole;
  isActive: boolean;

  student?: {
    id: string;
    studentId: string; // e.g. "26CDA0001"
    firstName: string;
    lastName: string;
    phone?: string | null;
    city?: string | null;
    profileImage?: string | null;
    batch?: number | null;
    status: EnrollmentStatus;
    enrolledAt: string; // ISO date string

    // Academic background
    background?: StudentBackground | null;
    school?: string | null;
    fieldOfStudy?: string | null;
    skillLevel?: SkillLevel | null;
    howHeard?: HowHeard | null;
    referrer?: string | null;

    // Motivation
    whyEnrolled?: string | null;

    // Engagement
    followsSocial: boolean;
    joinChallenge: boolean;

    // Relations needed by dashboard
    enrollments: {
      id: string;
      status: EnrollmentStatus;
      progress: number; // 0-100
      enrolledAt: string;
      course: {
        id: string;
        courseCode: string;
        name: string;
        category: string;
        icon?: string | null;
        durationMonths: number;
        lessons: {
          id: string;
          title: string;
          order: number;
          duration?: number | null; // minutes
          status: "DRAFT" | "PUBLISHED";
        }[];
      };
    }[];

    // For certificates view
    certificates: {
      id: string;
      issuedAt: string;
      fileUrl?: string | null;
      course: {
        id: string;
        name: string;
        icon?: string | null;
      };
    }[];

    // For lesson progress
    lessonProgress: {
      lessonId: string;
      completed: boolean;
      completedAt?: string | null;
    }[];

    // For payments/resources view
    payments: {
      id: string;
      amount: number;
      type: string;
      status: string;
      dueDate: string;
      paidAt?: string | null;
    }[];
  } | null;

  admin?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
    department?: string | null;
    phone?: string | null;
  } | null;
}

export interface LoginResponse {
  user: AuthUser;
  message: string;
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
}
