import { prisma } from "@/lib/prisma";

export async function generateStudentId() {
  const year = new Date().getFullYear().toString().slice(-2);

  const last = await prisma.student.findFirst({
    orderBy: { createdAt: "desc" },
    select: { studentId: true },
  });

  let sequence = 1;

  if (last?.studentId) {
    // Extract the numeric part from e.g. "26CDA0042"
    const numeric = parseInt(last.studentId.slice(-4), 10);
    if (!isNaN(numeric)) sequence = numeric + 1;
  }

  return `${year}CDA${String(sequence).padStart(4, "0")}`;
}
