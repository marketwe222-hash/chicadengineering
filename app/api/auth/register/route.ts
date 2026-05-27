import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { publicRegisterSchema } from "@/lib/validators";
import { generateStudentId } from "@/lib/generateStudentId";
import { sendRegistrationEmails } from "@/lib/emailjs";

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
      courseId, // ← now consumed
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

    // Verify the course exists and is active
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return NextResponse.json(
        { message: "Selected course not found" },
        { status: 404 },
      );
    }
    if (course.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "This course is no longer accepting registrations" },
        { status: 400 },
      );
    }

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

    // Create user + student + enrollment in one transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
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
              // Create the enrollment record here
              enrollments: {
                create: {
                  courseId,
                  status: "ACTIVE",
                },
              },
            },
          },
        },
        include: {
          student: {
            include: {
              enrollments: { include: { course: true } },
            },
          },
        },
      });

      return newUser;
    });

    const adminEmails = (
      await prisma.admin.findMany({
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      })
    )
      .map((admin) => admin.user.email)
      .filter((email): email is string => Boolean(email));

    try {
      await sendRegistrationEmails({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        studentId,
        password: defaultPassword,
        courseName: course.name,
        adminEmails,
      });
    } catch (emailError) {
      console.error("[REGISTER][EMAIL] Email sending failed:", emailError);
    }

    return NextResponse.json(
      {
        message: "Registered successfully",
        userId: user.id,
        studentId,
        defaultPassword,
        course: {
          id: course.id,
          name: course.name,
          registrationFee: course.registrationFee,
        },
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
