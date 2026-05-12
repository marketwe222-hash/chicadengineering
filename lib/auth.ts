import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAMES } from "./constants";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-this-secret-in-production",
);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// ── Hash password ─────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── Compare password ──────────────────────────────────────────
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Sign JWT ──────────────────────────────────────────────────
export async function signToken(payload: {
  userId: string;
  role: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// ── Verify JWT ────────────────────────────────────────────────
export async function verifyToken(
  token: string,
): Promise<{ userId: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

// ── Set auth cookies ──────────────────────────────────────────
export async function setAuthCookies(
  token: string,
  role: string,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.AUTH_TOKEN, token, COOKIE_OPTIONS);
  cookieStore.set(COOKIE_NAMES.USER_ROLE, role, {
    ...COOKIE_OPTIONS,
    httpOnly: false, // readable by middleware
  });
}

// ── Clear auth cookies ────────────────────────────────────────
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.AUTH_TOKEN);
  cookieStore.delete(COOKIE_NAMES.USER_ROLE);
}

// ── Get current user from cookie ──────────────────────────────
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, isActive: true },
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            status: true,
          },
        },
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            department: true,
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
}

// ── Require auth (throws if not authed) ───────────────────────
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

// ── Require admin role ────────────────────────────────────────
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
