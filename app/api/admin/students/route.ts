// app/api/admin/students/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const students = await prisma.student.findMany({
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { email: true } },
        enrollments: {
          include: {
            course: {
              select: { id: true, name: true, category: true, icon: true },
            },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            amount: true,
            type: true,
            status: true,
            dueDate: true,
            paidAt: true,
          },
        },
        certificates: {
          include: { course: { select: { name: true } } },
        },
      },
    });

    // Flatten email onto student object for convenience
    const result = students.map(({ user, ...s }) => ({
      ...s,
      email: user?.email ?? null,
      amount: s.payments[0]?.amount ?? null,
    }));

    return NextResponse.json(result);
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")
      return NextResponse.json({ error: e.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
