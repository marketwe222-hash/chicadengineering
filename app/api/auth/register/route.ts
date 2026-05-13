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

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        studentId,
        password: hashedPassword,
        role: "STUDENT", // Default role
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
