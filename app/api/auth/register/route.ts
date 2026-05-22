import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { publicRegisterSchema } from "@/lib/validators";
import { generateStudentId } from "@/lib/generateStudentId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = publicRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      background,
      school,
      fieldOfStudy,
      whyEnrolled,
      skillLevel,
      howHeard,
      referrer,
      followsSocial,
      joinChallenge,
    } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 },
      );
    }

    const studentId = await generateStudentId();
    const defaultPassword = "chicad123";
    const passwordHash = await hashPassword(defaultPassword);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT",
        student: {
          create: {
            studentId,
            firstName,
            lastName,
            phone,
            city,
            background: background ?? null,
            school,
            fieldOfStudy,
            whyEnrolled,
            skillLevel: skillLevel ?? null,
            howHeard,
            referrer,
            followsSocial,
            joinChallenge,
            batch: 11,
          },
        },
      },
      include: { student: true },
    });

    return NextResponse.json(
      {
        message: "Registered successfully",
        userId: user.id,
        studentId,
        defaultPassword,
      },
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
