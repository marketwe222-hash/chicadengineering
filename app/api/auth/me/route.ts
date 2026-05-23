import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Block inactive accounts
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Forbidden", message: "Account is deactivated" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email ?? null,
          role: user.role,
          isActive: user.isActive,

          student: user.student
            ? {
                id: user.student.id,
                studentId: user.student.studentId,
                firstName: user.student.firstName,
                lastName: user.student.lastName,
                phone: user.student.phone ?? null,
                city: user.student.city ?? null,
                profileImage: user.student.profileImage ?? null,
                batch: user.student.batch ?? null,
                status: user.student.status,
                enrolledAt: user.student.enrolledAt.toISOString(),

                // Academic background
                background: user.student.background ?? null,
                school: user.student.school ?? null,
                fieldOfStudy: user.student.fieldOfStudy ?? null,
                skillLevel: user.student.skillLevel ?? null,
                howHeard: user.student.howHeard ?? null,
                referrer: user.student.referrer ?? null,
                whyEnrolled: user.student.whyEnrolled ?? null,

                // Engagement
                followsSocial: user.student.followsSocial,
                joinChallenge: user.student.joinChallenge,

                // Relations
                enrollments: user.student.enrollments.map((e) => ({
                  id: e.id,
                  status: e.status,
                  progress: e.progress,
                  enrolledAt: e.enrolledAt.toISOString(),
                  course: {
                    id: e.course.id,
                    courseCode: e.course.courseCode,
                    name: e.course.name,
                    category: e.course.category,
                    icon: e.course.icon ?? null,
                    durationMonths: e.course.durationMonths,
                    lessons: e.course.lessons.map((l) => ({
                      id: l.id,
                      title: l.title,
                      order: l.order,
                      duration: l.duration ?? null,
                      status: l.status,
                    })),
                  },
                })),

                certificates: user.student.certificates.map((c) => ({
                  id: c.id,
                  issuedAt: c.issuedAt.toISOString(),
                  fileUrl: c.fileUrl ?? null,
                  course: {
                    id: c.course.id,
                    name: c.course.name,
                    icon: c.course.icon ?? null,
                  },
                })),

                lessonProgress: user.student.lessonProgress.map((lp) => ({
                  lessonId: lp.lessonId,
                  completed: lp.completed,
                  completedAt: lp.completedAt?.toISOString() ?? null,
                })),

                payments: user.student.payments.map((p) => ({
                  id: p.id,
                  amount: Number(p.amount), // Decimal → number
                  type: p.type,
                  status: p.status,
                  dueDate: p.dueDate.toISOString(),
                  paidAt: p.paidAt?.toISOString() ?? null,
                })),
              }
            : null,

          admin: user.admin
            ? {
                id: user.admin.id,
                firstName: user.admin.firstName,
                lastName: user.admin.lastName,
                profileImage: user.admin.profileImage ?? null,
                department: user.admin.department ?? null,
                phone: user.admin.phone ?? null,
              }
            : null,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[ME]", err);
    return NextResponse.json(
      { error: "Server error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
