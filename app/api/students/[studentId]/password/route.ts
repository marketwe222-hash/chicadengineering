import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const changePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface Params {
  params: Promise<{ studentId: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { studentId } = await params;

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.user.update({
      where: { id: student.userId },
      data: { passwordHash },
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    console.error("[CHANGE_PASSWORD]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
