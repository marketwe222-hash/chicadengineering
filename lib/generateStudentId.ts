import { prisma } from "@/lib/prisma";

export async function generateStudentId() {
  const year = new Date().getFullYear();

  // Count existing students
  const count = await prisma.student.count();

  // Example: CHICAD-2026-0001
  const sequence = String(count + 1).padStart(4, "0");

  return `ACA-${year}-${sequence}`;
}
