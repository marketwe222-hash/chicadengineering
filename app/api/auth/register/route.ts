import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, studentId, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { studentId }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or student ID already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    // Create User + Student in one transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash, // ← schema field is passwordHash, not password
        studentId, // ← foreign key shortcut on User
        role: "STUDENT",
        student: {
          create: {
            studentId, // ← required unique field on Student
            firstName,
            lastName,
            dateOfBirth: new Date("2000-01-01"), // placeholder
            gender: "OTHER", // placeholder
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
