import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CourseStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const search = searchParams.get("search") ?? "";
    const statusRaw = searchParams.get("status");
    const pageSize = 20;

    // Only pass status to Prisma if it's a valid enum value
    const status =
      statusRaw &&
      Object.values(CourseStatus).includes(statusRaw as CourseStatus)
        ? (statusRaw as CourseStatus)
        : undefined;

    const where = {
      ...(status && { status }),
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/courses]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
