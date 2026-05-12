import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookies } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    // ── Parse & validate body ──────────────────────────────
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Invalid input",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { identifier, password } = parsed.data;

    // ── Find user ──────────────────────────────────────────
    // identifier is either studentId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { student: { studentId: identifier } }],
        isActive: true,
      },
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

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials", message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ── Verify password ────────────────────────────────────
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials", message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ── Check student is not suspended/withdrawn ───────────
    if (
      user.student &&
      ["SUSPENDED", "WITHDRAWN"].includes(user.student.status)
    ) {
      return NextResponse.json(
        {
          error: "Account restricted",
          message: "Your account has been restricted. Contact administration.",
        },
        { status: 403 },
      );
    }

    // ── Update last login ──────────────────────────────────
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // ── Sign JWT & set cookies ─────────────────────────────
    const token = await signToken({ userId: user.id, role: user.role });
    await setAuthCookies(token, user.role);

    // ── Return user (no password hash) ────────────────────
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          student: user.student,
          admin: user.admin,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json(
      { error: "Server error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
