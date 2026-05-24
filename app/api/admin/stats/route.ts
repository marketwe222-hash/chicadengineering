// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalStudents,
      activeStudents,
      payments,
      pendingPayments,
      activeCourses,
      certificatesIssued,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: "ACTIVE" } }),
      prisma.payment.findMany({
        where: { status: "PAID" },
        select: { amount: true },
      }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.course.count({ where: { status: "ACTIVE" } }),
      prisma.certificate.count(),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return NextResponse.json({
      totalStudents,
      activeStudents,
      totalRevenue,
      pendingPayments,
      coursesRunning: activeCourses,
      certificatesIssued,
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")
      return NextResponse.json({ error: e.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
