// app/api/courses/[courseId]/lessons/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      include: { resources: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(lessons);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Get current max order
    const last = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        duration: body.duration ? Number(body.duration) : null,
        status: body.status ?? "DRAFT",
        order: (last?.order ?? -1) + 1,
      },
      include: { resources: true },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
