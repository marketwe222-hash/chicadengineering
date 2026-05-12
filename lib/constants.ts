export const APP_NAME = "Chicad Engineering";
export const APP_SHORT = "CE";
export const APP_DESCRIPTION =
  "Premier academy and construction company portal";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  COURSES: "/courses",
  GRADES: "/grades",
  ATTENDANCE: "/attendance",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STUDENTS: "/admin/students",
    COURSES: "/admin/courses",
    REPORTS: "/admin/reports",
    NEW_STUDENT: "/admin/students/new",
    NEW_COURSE: "/admin/courses/new",
  },
  CONSTRUCTION: "/construction",
} as const;

export const ROLES = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth-token",
  USER_ROLE: "user-role",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const GRADE_LABELS: Record<string, string> = {
  A_PLUS: "A+",
  A: "A",
  A_MINUS: "A-",
  B_PLUS: "B+",
  B: "B",
  B_MINUS: "B-",
  C_PLUS: "C+",
  C: "C",
  C_MINUS: "C-",
  D: "D",
  F: "F",
};
