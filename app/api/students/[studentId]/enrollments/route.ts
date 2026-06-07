import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

interface Params {
  params: Promise<{ studentId: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { studentId } = await params;
    const user = await requireAuth();

    const body = await req.json();
    const courseId = body?.courseId;

    if (typeof courseId !== "string" || !courseId.trim()) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 },
      );
    }

    if (user.role !== "ADMIN" && user.student?.id !== studentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 400 },
      );
    }

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { studentId, courseId },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        student: { connect: { id: studentId } },
        course: { connect: { id: courseId } },
        status: "ACTIVE",
        enrolledAt: new Date(),
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json({
      message: "Enrolled successfully",
      data: { enrollment },
    });
  } catch (error) {
    console.error("[ENROLL_STUDENT]", error);
    return NextResponse.json(
      { error: "Unable to enroll student" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { studentId } = await params;
    const user = await requireAuth();

    if (user.role !== "ADMIN" && user.student?.id !== studentId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const enrollmentId = body?.enrollmentId;

    if (typeof enrollmentId !== "string" || !enrollmentId.trim()) {
      return NextResponse.json(
        { error: "enrollmentId is required" },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true },
    });

    if (!enrollment || enrollment.studentId !== studentId) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    await prisma.enrollment.delete({ where: { id: enrollmentId } });

    return NextResponse.json({
      message: "Enrollment removed successfully",
      data: { courseId: enrollment.courseId },
    });
  } catch (error) {
    console.error("[REMOVE_ENROLLMENT]", error);
    return NextResponse.json(
      { error: "Unable to remove enrollment" },
      { status: 500 },
    );
  }
}
