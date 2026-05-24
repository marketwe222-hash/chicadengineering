// app/api/admin/courses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
      },
    });

    return NextResponse.json(courses);
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")
      return NextResponse.json({ error: e.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const course = await prisma.course.create({
      data: {
        courseCode: body.courseCode,
        name: body.name,
        category: body.category,
        icon: body.icon ?? null,
        description: body.description ?? null,
        registrationFee: Number(body.registrationFee ?? 5000),
        trainingFee: Number(body.trainingFee),
        durationMonths: Number(body.durationMonths ?? 3),
        maxStudents: Number(body.maxStudents ?? 30),
        batch: body.batch ? Number(body.batch) : null,
        instructorName: body.instructorName ?? null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")
      return NextResponse.json({ error: e.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
