// app/api/courses/[courseId]/media/[mediaId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string; mediaId: string }> },
) {
  const { courseId, mediaId } = await params;

  try {
    const media = await prisma.courseMedia.findUnique({
      where: { id: mediaId },
      select: { courseId: true },
    });

    if (!media || media.courseId !== courseId) {
      return NextResponse.json(
        { error: "Media item not found" },
        { status: 404 },
      );
    }

    await prisma.courseMedia.delete({ where: { id: mediaId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
