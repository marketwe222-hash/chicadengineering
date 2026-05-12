import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { gradeSchema } from "@/lib/validators";

function scoreToGrade(score: number): string {
  if (score >= 97) return "A_PLUS";
  if (score >= 93) return "A";
  if (score >= 90) return "A_MINUS";
  if (score >= 87) return "B_PLUS";
  if (score >= 83) return "B";
  if (score >= 80) return "B_MINUS";
  if (score >= 77) return "C_PLUS";
  if (score >= 73) return "C";
  if (score >= 70) return "C_MINUS";
  if (score >= 60) return "D";
  return "F";
}

// ── GET /api/grades ───────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    const where = {
      ...(studentId && { studentId }),
      ...(courseId && { courseId }),
      // Students can only see their own grades
      ...(user.role === "STUDENT" &&
        user.student && { studentId: user.student.id }),
    };

    const grades = await prisma.grade.findMany({
      where,
      include: {
        course: { select: { courseCode: true, name: true, credits: true } },
        student: {
          select: { studentId: true, firstName: true, lastName: true },
        },
      },
      orderBy: { gradedAt: "desc" },
    });

    return NextResponse.json({ data: grades });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET_GRADES]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── POST /api/grades ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = gradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { studentId, courseId, score, remarks } = parsed.data;
    const gradeScale = scoreToGrade(score);

    const grade = await prisma.grade.upsert({
      where: { studentId_courseId: { studentId, courseId } },
      create: {
        studentId,
        courseId,
        score,
        gradeScale: gradeScale as never,
        remarks,
      },
      update: {
        score,
        gradeScale: gradeScale as never,
        remarks,
        gradedAt: new Date(),
      },
      include: {
        course: { select: { courseCode: true, name: true } },
      },
    });

    return NextResponse.json(
      { message: "Grade saved successfully", data: grade },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("[POST_GRADE]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
