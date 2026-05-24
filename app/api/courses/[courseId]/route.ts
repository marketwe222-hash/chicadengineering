// app/api/courses/[courseId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { _count: { select: { enrollments: true, lessons: true } } },
    });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json(course);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  try {
    const body = await request.json();

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        name: body.name ?? undefined,
        courseCode: body.courseCode ?? undefined,
        category: body.category ?? undefined,
        icon: body.icon ?? undefined,
        description: body.description ?? undefined,
        registrationFee: body.registrationFee ?? undefined,
        trainingFee: body.trainingFee ?? undefined,
        durationMonths: body.durationMonths ?? undefined,
        maxStudents: body.maxStudents ?? undefined,
        instructorName: body.instructorName ?? undefined,
        schedule: body.schedule ?? undefined,
        batch: body.batch ?? undefined,
        status: body.status ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
