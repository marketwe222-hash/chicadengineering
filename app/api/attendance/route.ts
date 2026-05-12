import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { attendanceSchema } from "@/lib/validators";

// ── GET /api/attendance ───────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    const where = {
      ...(studentId && { studentId }),
      ...(courseId && { courseId }),
      ...(user.role === "STUDENT" &&
        user.student && { studentId: user.student.id }),
    };

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        course: { select: { courseCode: true, name: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ data: attendance });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET_ATTENDANCE]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── POST /api/attendance ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = attendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { studentId, courseId, date, status, notes } = parsed.data;

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_courseId_date: {
          studentId,
          courseId,
          date: new Date(date),
        },
      },
      create: {
        studentId,
        courseId,
        date: new Date(date),
        status: status as never,
        notes,
      },
      update: { status: status as never, notes },
    });

    return NextResponse.json(
      { message: "Attendance recorded", data: attendance },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("[POST_ATTENDANCE]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
