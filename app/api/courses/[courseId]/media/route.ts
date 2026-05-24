// app/api/courses/[courseId]/media/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params;
  try {
    const media = await prisma.courseMedia.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(media);
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
    if (!body.fileUrl?.trim()) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 },
      );
    }
    if (!body.type) {
      return NextResponse.json(
        { error: "Media type is required" },
        { status: 400 },
      );
    }

    const last = await prisma.courseMedia.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const media = await prisma.courseMedia.create({
      data: {
        courseId,
        type: body.type, // VIDEO | PDF | DOCUMENT | IMAGE
        title: body.title.trim(),
        description: body.description?.trim() || null,
        fileUrl: body.fileUrl.trim(),
        fileName: body.fileName?.trim() || null,
        fileSize: body.fileSize ? Number(body.fileSize) : null,
        duration: body.duration ? Number(body.duration) : null,
        isPublished: body.isPublished ?? false,
        order: (last?.order ?? -1) + 1,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
