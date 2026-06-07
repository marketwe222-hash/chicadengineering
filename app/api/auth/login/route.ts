import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
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
    console.log(`[LOGIN] Attempt for identifier: ${identifier}`);

    // ── Find user ──────────────────────────────────────────
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { student: { studentId: identifier } }],
        isActive: true,
      },
      include: {
        student: {
          include: {
            enrollments: {
              include: {
                course: {
                  include: {
                    lessons: {
                      where: { status: "PUBLISHED" },
                      orderBy: { order: "asc" },
                      select: {
                        id: true,
                        title: true,
                        order: true,
                        duration: true,
                        status: true,
                      },
                    },
                  },
                },
              },
            },
            certificates: {
              include: {
                course: {
                  select: { id: true, name: true, icon: true, logoImage: true },
                },
              },
            },
            lessonProgress: {
              select: {
                lessonId: true,
                completed: true,
                completedAt: true,
              },
            },
            payments: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
            emergencyContact: true,
          },
        },
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            department: true,
            phone: true,
          },
        },
      },
    });

    // ── User not found ─────────────────────────────────────
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

    // ── Block suspended or withdrawn students ──────────────
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

    console.log("[LOGIN] user found:", !!user);
    console.log(
      "[LOGIN] user data:",
      user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
            studentId: user.student?.studentId,
          }
        : null,
    );

    // ── Update last login timestamp ────────────────────────
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // ── Sign JWT ───────────────────────────────────────────
    const token = await signToken({ userId: user.id, role: user.role });

    // ── Build response ─────────────────────────────────────
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email ?? null,
          role: user.role,
          isActive: user.isActive,

          student: user.student
            ? {
                id: user.student.id,
                studentId: user.student.studentId,
                firstName: user.student.firstName,
                lastName: user.student.lastName,
                phone: user.student.phone ?? null,
                city: user.student.city ?? null,
                profileImage: user.student.profileImage ?? null,
                batch: user.student.batch ?? null,
                status: user.student.status,
                enrolledAt: user.student.enrolledAt.toISOString(),

                // Academic background
                background: user.student.background ?? null,
                school: user.student.school ?? null,
                fieldOfStudy: user.student.fieldOfStudy ?? null,
                skillLevel: user.student.skillLevel ?? null,
                howHeard: user.student.howHeard ?? null,
                referrer: user.student.referrer ?? null,
                whyEnrolled: user.student.whyEnrolled ?? null,

                // Engagement
                followsSocial: user.student.followsSocial,
                joinChallenge: user.student.joinChallenge,

                // Relations
                enrollments: user.student.enrollments.map((e) => ({
                  id: e.id,
                  status: e.status,
                  progress: e.progress,
                  enrolledAt: e.enrolledAt.toISOString(),
                  course: {
                    id: e.course.id,
                    courseCode: e.course.courseCode,
                    name: e.course.name,
                    category: e.course.category,
                    icon: e.course.icon ?? null,
                    logoImage: e.course.logoImage ?? null,
                    durationMonths: e.course.durationMonths,
                    lessons: e.course.lessons.map((l) => ({
                      id: l.id,
                      title: l.title,
                      order: l.order,
                      duration: l.duration ?? null,
                      status: l.status,
                    })),
                  },
                })),

                certificates: user.student.certificates.map((c) => ({
                  id: c.id,
                  issuedAt: c.issuedAt.toISOString(),
                  fileUrl: c.fileUrl ?? null,
                  course: {
                    id: c.course.id,
                    name: c.course.name,
                    icon: c.course.icon ?? null,
                    logoImage: c.course.logoImage ?? null,
                  },
                })),

                lessonProgress: user.student.lessonProgress.map((lp) => ({
                  lessonId: lp.lessonId,
                  completed: lp.completed,
                  completedAt: lp.completedAt?.toISOString() ?? null,
                })),

                payments: user.student.payments.map((p) => ({
                  id: p.id,
                  amount: Number(p.amount),
                  type: p.type,
                  status: p.status,
                  dueDate: p.dueDate.toISOString(),
                  paidAt: p.paidAt?.toISOString() ?? null,
                })),

                emergencyContact: user.student.emergencyContact
                  ? {
                      name: user.student.emergencyContact.name,
                      relationship: user.student.emergencyContact.relationship,
                      phone: user.student.emergencyContact.phone,
                      email: user.student.emergencyContact.email ?? null,
                    }
                  : null,
              }
            : null,

          admin: user.admin
            ? {
                id: user.admin.id,
                firstName: user.admin.firstName,
                lastName: user.admin.lastName,
                profileImage: user.admin.profileImage ?? null,
                department: user.admin.department ?? null,
                phone: user.admin.phone ?? null,
              }
            : null,
        },
      },
      { status: 200 },
    );

    // ── Set cookies directly on the response ───────────────
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    response.cookies.set("auth-token", token, {
      ...cookieOptions,
      httpOnly: true, // JS cannot read this — secure
    });

    response.cookies.set("user-role", user.role, {
      ...cookieOptions,
      httpOnly: false, // middleware needs to read this client-side
    });

    return response;
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json(
      { error: "Server error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
