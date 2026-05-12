import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { updateStudentSchema } from "@/lib/validators";

interface Params {
  params: Promise<{ studentId: string }>;
}

// ── GET /api/students/:studentId ──────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireAuth();
    const { studentId } = await params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        emergencyContact: true,
        enrollments: {
          include: {
            course: {
              select: { courseCode: true, name: true, credits: true },
            },
            academicTerm: { select: { name: true } },
          },
          orderBy: { enrolledAt: "desc" },
        },
        grades: {
          include: {
            course: { select: { courseCode: true, name: true } },
          },
          orderBy: { gradedAt: "desc" },
        },
        attendances: {
          include: {
            course: { select: { courseCode: true, name: true } },
          },
          orderBy: { date: "desc" },
          take: 30,
        },
        documents: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: student });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET_STUDENT]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── PATCH /api/students/:studentId ────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { studentId } = await params;

    const body = await req.json();
    const parsed = updateStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { emergencyContact, dateOfBirth, ...studentData } = parsed.data;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...studentData,
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(emergencyContact && {
          emergencyContact: {
            upsert: {
              create: emergencyContact,
              update: emergencyContact,
            },
          },
        }),
      },
      include: { emergencyContact: true },
    });

    return NextResponse.json({
      message: "Student updated successfully",
      data: student,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("[UPDATE_STUDENT]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── DELETE /api/students/:studentId ───────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { studentId } = await params;

    // Soft delete — set status to WITHDRAWN
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { status: "WITHDRAWN" },
    });

    return NextResponse.json({
      message: "Student withdrawn successfully",
      data: student,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("[DELETE_STUDENT]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
