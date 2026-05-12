import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createStudentSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth";
import { generateStudentId } from "@/lib/utils";

// ── GET /api/students ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10");
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? undefined;

    const where = {
      ...(status && { status: status as never }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { studentId: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { enrolledAt: "desc" },
        include: {
          emergencyContact: true,
          _count: { select: { enrollments: true, grades: true } },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      data: students,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("[GET_STUDENTS]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── POST /api/students ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = createStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      phone,
      address,
      password,
      emergencyContact,
    } = parsed.data;

    // ── Generate unique student ID ─────────────────────────
    const year = new Date().getFullYear();
    const count = await prisma.student.count();
    const studentId = generateStudentId(year, count + 1);

    // ── Hash password ──────────────────────────────────────
    const passwordHash = await hashPassword(password);

    // ── Create user + student in transaction ───────────────
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          passwordHash,
          role: "STUDENT",
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          studentId,
          firstName,
          lastName,
          middleName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          phone,
          address,
          ...(emergencyContact && {
            emergencyContact: { create: emergencyContact },
          }),
        },
        include: { emergencyContact: true },
      });

      return { user, student };
    });

    return NextResponse.json(
      { message: "Student created successfully", data: result.student },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    console.error("[CREATE_STUDENT]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
