export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email?: string | null;
  role: UserRole;
  isActive: boolean;
  student?: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
    status: string;
  } | null;
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
    department?: string | null;
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
