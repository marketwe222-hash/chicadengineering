import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth"; // ← use this, not getSessionFromRequest
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }, // ← Promise type
) {
  const { studentId } = await params; // ← await it

  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const isOwnData = user.student?.id === studentId; // ← use destructured value

  if (!isAdmin && !isOwnData) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      enrollments: {
        where: { status: "ACTIVE" },
        include: {
          course: {
            include: {
              lessons: {
                where: { status: "PUBLISHED" },
                orderBy: { order: "asc" },
                include: {
                  progress: {
                    where: { studentId: studentId },
                  },
                },
              },
            },
          },
        },
      },
      certificates: { include: { course: true } },
      lessonProgress: true,
      payments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!student)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ✅ Build ONCE here, outside the .map()
  const completedIds = new Set(
    student.lessonProgress.filter((p) => p.completed).map((p) => p.lessonId),
  );

  // Build enriched courses
  const courses = student.enrollments
    .filter((e) => e.status === "ACTIVE")
    .map((enrollment) => {
      const lessons = enrollment.course.lessons;

      // ✅ completedIds comes from lessonProgress, NOT from lessons
      const completedCount = lessons.filter((l) =>
        completedIds.has(l.id),
      ).length;
      const currentLesson =
        lessons.find((l) => !completedIds.has(l.id)) ?? lessons.at(-1);
      const progress =
        lessons.length > 0
          ? Math.round((completedCount / lessons.length) * 100)
          : 0;

      return {
        id: enrollment.course.id,
        name: enrollment.course.name,
        category: enrollment.course.category,
        icon: enrollment.course.icon ?? "📐",
        color: categoryColor(enrollment.course.category),
        currentLessonOrder: currentLesson
          ? currentLesson.order + 1
          : completedCount,
        totalLessons: lessons.length,
        currentLessonName: currentLesson?.title ?? "—",
        currentLessonDuration: currentLesson?.duration
          ? `${currentLesson.duration} min`
          : "—",
        progress,
        lessons: lessons.map((l) => ({
          id: l.id,
          course: enrollment.course.name,
          courseColor: categoryColor(enrollment.course.category),
          name: l.title,
          duration: l.duration ? `${l.duration} min` : "—",
          done: completedIds.has(l.id), // ✅ use the Set, not l.completed
          current: currentLesson?.id === l.id,
        })),
      };
    });

  // Overall progress across all courses
  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);
  const completedLessons = courses.reduce(
    (s, c) => s + c.lessons.filter((l) => l.done).length,
    0,
  );
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return NextResponse.json({
    overallProgress,
    coursesEnrolled: courses.length,
    lessonsCompleted: completedLessons,
    totalLessons,
    certificatesEarned: student.certificates.length,
    courses,
    // Flatten all lessons across courses for the Lessons view
    allLessons: courses.flatMap((c) => c.lessons),
  });
}

// Map category → color (mirrors your mock data)
function categoryColor(category: string): string {
  const map: Record<string, string> = {
    CAD: "#ef4444",
    BIM: "#a78bfa",
    FEA: "#f59e0b",
  };
  return map[category.toUpperCase()] ?? "#3b82f6";
}
