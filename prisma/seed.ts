// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

// ── Helpers ───────────────────────────────────────────────────
async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

function generateStudentId(year: number, seq: number) {
  return `ACA-${year}-${String(seq).padStart(4, "0")}`;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreToGrade(score: number): string {
  if (score >= 97) return "A_PLUS";
  if (score >= 93) return "A";
  if (score >= 90) return "A_MINUS";
  if (score >= 87) return "B_PLUS";
  if (score >= 83) return "B";
  if (score >= 80) return "B_MINUS";
  if (score >= 77) return "C_PLUS";
  if (score >= 73) return "C";
  if (score >= 70) return "C_MINUS";
  if (score >= 60) return "D";
  return "F";
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

// ── Seed Data ─────────────────────────────────────────────────
const COURSES_DATA = [
  {
    courseCode: "AUTOCAD-B11",
    name: "AutoCAD",
    category: "CAD",
    icon: "📐",
    description: "Industry-standard 2D/3D drafting & design software",
    registrationFee: 5000,
    trainingFee: 70000,
    durationMonths: 3,
    maxStudents: 30,
    instructorName: "Ing. Jean-Paul Mbarga",
    schedule: "Mon/Wed/Fri 08:00–10:00",
    batch: 11,
  },
  {
    courseCode: "REVIT-B11",
    name: "Revit",
    category: "BIM",
    icon: "🏗️",
    description: "Building Information Modeling for architects & engineers",
    registrationFee: 5000,
    trainingFee: 70000,
    durationMonths: 3,
    maxStudents: 30,
    instructorName: "Ing. Claire Ngo Bassa",
    schedule: "Tue/Thu 09:00–12:00",
    batch: 11,
  },
  {
    courseCode: "ARCHICAD-B11",
    name: "ArchiCAD",
    category: "BIM",
    icon: "🏛️",
    description: "BIM software focused on architectural design & documentation",
    registrationFee: 5000,
    trainingFee: 70000,
    durationMonths: 3,
    maxStudents: 25,
    instructorName: "Arch. Samuel Fogue",
    schedule: "Mon/Wed 14:00–17:00",
    batch: 11,
  },
  {
    courseCode: "SAP2000-B11",
    name: "SAP2000",
    category: "Structural Analysis",
    icon: "🔩",
    description: "Structural analysis & design for buildings & bridges",
    registrationFee: 5000,
    trainingFee: 50000,
    durationMonths: 2,
    maxStudents: 20,
    instructorName: "Dr. Paul Ateba",
    schedule: "Sat 08:00–14:00",
    batch: 11,
  },
  {
    courseCode: "LUMION-B11",
    name: "Lumion",
    category: "Visualization",
    icon: "🌅",
    description: "3D rendering & real-time visualization for architecture",
    registrationFee: 5000,
    trainingFee: 30000,
    durationMonths: 1,
    maxStudents: 25,
    instructorName: "Ing. Boris Essomba",
    schedule: "Fri 14:00–18:00",
    batch: 11,
  },
  {
    courseCode: "EXCEL-B11",
    name: "Ms Excel",
    category: "Productivity",
    icon: "📊",
    description: "Advanced spreadsheets, data analysis & project management",
    registrationFee: 5000,
    trainingFee: 30000,
    durationMonths: 1,
    maxStudents: 35,
    instructorName: "M. Hervé Tchouangang",
    schedule: "Tue/Thu 14:00–16:00",
    batch: 11,
  },
  {
    courseCode: "ABAQUS-B11",
    name: "ABAQUS",
    category: "FEA",
    icon: "⚙️",
    description: "Finite element analysis for complex structural simulations",
    registrationFee: 5000,
    trainingFee: 50000,
    durationMonths: 2,
    maxStudents: 15,
    instructorName: "Dr. Rodrigue Nkemeni",
    schedule: "Sat 14:00–18:00",
    batch: 11,
  },
];

const STUDENTS_DATA = [
  {
    firstName: "Jean-Baptiste",
    lastName: "Ngono",
    email: "jb.ngono@chicadacademy.cm",
    phone: "+237 677 001 001",
    city: "Yaoundé",
    background: "STUDENT" as const,
    school: "ENSP Yaoundé",
    fieldOfStudy: "Civil Engineering",
    whyEnrolled: "Want to improve my design skills for my final year project",
    skillLevel: "BEGINNER" as const,
    howHeard: "SOCIAL_MEDIA" as const,
    referrer: "None",
    followsSocial: true,
    joinChallenge: true,
    courseCode: "AUTOCAD-B11",
    password: "chicad123",
  },
  {
    firstName: "Marie",
    lastName: "Fouda",
    email: "marie.fouda@chicadacademy.cm",
    phone: "+237 655 002 002",
    city: "Douala",
    background: "GRADUATE" as const,
    school: "Université de Douala",
    fieldOfStudy: "Architecture",
    whyEnrolled: "BIM is required at my new firm",
    skillLevel: "INTERMEDIATE" as const,
    howHeard: "FRIEND" as const,
    referrer: "Paul Ateba",
    followsSocial: true,
    joinChallenge: false,
    courseCode: "REVIT-B11",
    password: "chicad123",
  },
  {
    firstName: "Rodrigue",
    lastName: "Elong",
    email: "rodrigue.elong@chicadacademy.cm",
    phone: "+237 699 003 003",
    city: "Yaoundé",
    background: "PROFESSIONAL" as const,
    school: "SOTRACO",
    fieldOfStudy: "Structural Engineering",
    whyEnrolled: "Need FEA skills for bridge projects",
    skillLevel: "ADVANCED" as const,
    howHeard: "OTHER" as const,
    referrer: "None",
    followsSocial: false,
    joinChallenge: false,
    courseCode: "ABAQUS-B11",
    password: "chicad123",
  },
  {
    firstName: "Carine",
    lastName: "Mbarga",
    email: "carine.mbarga@chicadacademy.cm",
    phone: "+237 670 004 004",
    city: "Bafoussam",
    background: "STUDENT" as const,
    school: "IUT Fotso Victor",
    fieldOfStudy: "Architecture",
    whyEnrolled: "I want to create stunning architectural visuals",
    skillLevel: "BEGINNER" as const,
    howHeard: "SOCIAL_MEDIA" as const,
    referrer: "None",
    followsSocial: true,
    joinChallenge: true,
    courseCode: "LUMION-B11",
    password: "chicad123",
  },
  {
    firstName: "Hervé",
    lastName: "Nkemdirim",
    email: "herve.nkemdirim@chicadacademy.cm",
    phone: "+237 691 005 005",
    city: "Ngaoundéré",
    background: "GRADUATE" as const,
    school: "ENSAI Ngaoundéré",
    fieldOfStudy: "Civil Engineering",
    whyEnrolled: "Structural analysis for infrastructure projects",
    skillLevel: "INTERMEDIATE" as const,
    howHeard: "FRIEND" as const,
    referrer: "Jean-Baptiste Ngono",
    followsSocial: true,
    joinChallenge: true,
    courseCode: "SAP2000-B11",
    password: "chicad123",
  },
  {
    firstName: "Sandrine",
    lastName: "Tchoua",
    email: "sandrine.tchoua@chicadacademy.cm",
    phone: "+237 677 006 006",
    city: "Douala",
    background: "PROFESSIONAL" as const,
    school: "CAMRAIL",
    fieldOfStudy: "Project Management",
    whyEnrolled: "Excel for project tracking and reporting",
    skillLevel: "BEGINNER" as const,
    howHeard: "SOCIAL_MEDIA" as const,
    referrer: "None",
    followsSocial: false,
    joinChallenge: false,
    courseCode: "EXCEL-B11",
    password: "chicad123",
  },
  {
    firstName: "Alain",
    lastName: "Donfack",
    email: "alain.donfack@chicadacademy.cm",
    phone: "+237 655 007 007",
    city: "Yaoundé",
    background: "STUDENT" as const,
    school: "École Polytechnique Yaoundé",
    fieldOfStudy: "Architecture",
    whyEnrolled: "Want to master ArchiCAD for my thesis project",
    skillLevel: "BEGINNER" as const,
    howHeard: "FRIEND" as const,
    referrer: "Carine Mbarga",
    followsSocial: true,
    joinChallenge: true,
    courseCode: "ARCHICAD-B11",
    password: "chicad123",
  },
];

const ADMINS_DATA = [
  {
    firstName: "Gemma",
    lastName: "Wyamba",
    email: "admin@chicadacademy.cm",
    password: "admin123",
    department: "Academic Affairs",
    phone: "+237 673 422 430",
    role: "ADMIN" as const,
  },
  {
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@chicadacademy.cm",
    password: "superadmin123",
    department: "System Administration",
    phone: "+237 699 000 001",
    role: "SUPER_ADMIN" as const,
  },
];

// ── Main Seed Function ────────────────────────────────────────
async function main() {
  console.log("🌱 Starting database seed...\n");

  // ── 1. Clean existing data ─────────────────────────────────
  console.log("🧹 Cleaning existing data...");
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.lessonResource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseMedia.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleaned\n");

  // ── 2. Courses ─────────────────────────────────────────────
  console.log("📚 Seeding courses...");
  const courses = await Promise.all(
    COURSES_DATA.map((c) =>
      prisma.course.create({
        data: {
          courseCode: c.courseCode,
          name: c.name,
          category: c.category,
          icon: c.icon,
          description: c.description,
          registrationFee: c.registrationFee,
          trainingFee: c.trainingFee,
          durationMonths: c.durationMonths,
          maxStudents: c.maxStudents,
          instructorName: c.instructorName,
          schedule: c.schedule,
          batch: c.batch,
          status: "ACTIVE",
        },
      }),
    ),
  );
  const courseMap = Object.fromEntries(courses.map((c) => [c.courseCode, c]));
  console.log(`✅ ${courses.length} courses created\n`);

  // ── 3. Admins ──────────────────────────────────────────────
  console.log("🛡️  Seeding admins...");
  const admins = await Promise.all(
    ADMINS_DATA.map(async (a) => {
      const passwordHash = await hash(a.password);
      const user = await prisma.user.create({
        data: {
          email: a.email,
          passwordHash,
          role: a.role,
          isActive: true,
        },
      });
      const admin = await prisma.admin.create({
        data: {
          userId: user.id,
          firstName: a.firstName,
          lastName: a.lastName,
          department: a.department,
          phone: a.phone,
        },
      });
      return { user, admin };
    }),
  );
  console.log(`✅ ${admins.length} admins created\n`);

  // ── 4. Students ────────────────────────────────────────────
  console.log("🎓 Seeding students...");
  const currentYear = new Date().getFullYear();
  const createdStudents = [];

  for (let i = 0; i < STUDENTS_DATA.length; i++) {
    const s = STUDENTS_DATA[i];
    const studentId = generateStudentId(currentYear, i + 1);
    const passwordHash = await hash(s.password);

    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        role: "STUDENT",
        isActive: true,
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        phone: s.phone,
        city: s.city,
        background: s.background,
        school: s.school,
        fieldOfStudy: s.fieldOfStudy,
        whyEnrolled: s.whyEnrolled,
        skillLevel: s.skillLevel,
        howHeard: s.howHeard,
        referrer: s.referrer,
        followsSocial: s.followsSocial,
        joinChallenge: s.joinChallenge,
        batch: 11,
        status: "ACTIVE",
        enrolledAt: daysAgo(randomBetween(20, 45)),
      },
    });

    createdStudents.push({ student, user, courseCode: s.courseCode });
  }
  console.log(`✅ ${createdStudents.length} students created\n`);

  // ── 5. Enrollments ─────────────────────────────────────────
  console.log("📋 Seeding enrollments...");
  let enrollmentCount = 0;

  for (const { student, courseCode } of createdStudents) {
    const primaryCourse = courseMap[courseCode];
    if (primaryCourse) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: primaryCourse.id,
          status: "ACTIVE",
          enrolledAt: daysAgo(randomBetween(20, 45)),
        },
      });
      enrollmentCount++;
    }
  }
  console.log(`✅ ${enrollmentCount} enrollments created\n`);

  // ── 6. Grades ──────────────────────────────────────────────
  console.log("📊 Seeding grades...");
  let gradeCount = 0;

  for (const { student, courseCode } of createdStudents) {
    const course = courseMap[courseCode];
    if (!course) continue;

    const score = randomBetween(55, 99);
    const gradeScale = scoreToGrade(score);

    await prisma.grade.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        score,
        gradeScale: gradeScale as never,
        remarks:
          score >= 90
            ? "Excellent performance"
            : score >= 80
              ? "Good work"
              : score >= 70
                ? "Satisfactory"
                : score >= 60
                  ? "Needs improvement"
                  : "At risk",
        gradedAt: daysAgo(randomBetween(1, 15)),
      },
    });
    gradeCount++;
  }
  console.log(`✅ ${gradeCount} grades created\n`);

  // ── 7. Attendance ──────────────────────────────────────────
  console.log("📅 Seeding attendance records...");
  let attendanceCount = 0;
  const attendanceStatuses = [
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "PRESENT",
    "LATE",
    "ABSENT",
    "EXCUSED",
  ] as const;

  for (const { student, courseCode } of createdStudents) {
    const course = courseMap[courseCode];
    if (!course) continue;

    for (let day = 40; day >= 1; day -= 2) {
      const status = randomFrom(attendanceStatuses);
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          date: daysAgo(day),
          status: status as never,
          notes:
            status === "ABSENT"
              ? "No reason provided"
              : status === "EXCUSED"
                ? "Medical certificate submitted"
                : status === "LATE"
                  ? "Arrived 15 minutes late"
                  : null,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`✅ ${attendanceCount} attendance records created\n`);

  // ── 8. Payments ────────────────────────────────────────────
  console.log("💰 Seeding payments...");
  let paymentCount = 0;

  for (const { student, courseCode } of createdStudents) {
    const course = courseMap[courseCode];

    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: course?.registrationFee ?? 5000,
        type: "REGISTRATION",
        status: "PAID",
        dueDate: daysAgo(40),
        paidAt: daysAgo(38),
        referenceNo: `PAY-${student.studentId}-REG-${currentYear}`,
        momoNumber: "673422430",
        notes: "Registration fee — Batch 11",
      },
    });
    paymentCount++;

    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: course?.trainingFee ?? 50000,
        type: "TUITION",
        status: randomFrom(["PENDING", "PAID"] as const),
        dueDate: daysAgo(-30),
        referenceNo: `PAY-${student.studentId}-TUI-${currentYear}`,
        momoNumber: "673422430",
        notes: "Training fee — Batch 11",
      },
    });
    paymentCount++;
  }
  console.log(`✅ ${paymentCount} payments created\n`);

  // ── 9. Notifications ───────────────────────────────────────
  console.log("🔔 Seeding notifications...");
  let notifCount = 0;

  for (const { user, student } of createdStudents) {
    for (const n of [
      {
        userId: user.id,
        type: "ANNOUNCEMENT" as const,
        title: "Welcome to CHICAD Academy — Batch 11!",
        message: `Hi ${student.firstName}, welcome! Please complete your payment to confirm your spot.`,
        isRead: false,
      },
      {
        userId: user.id,
        type: "PAYMENT_DUE" as const,
        title: "Training Fee Due",
        message: "Your training fee is due. Pay via MoMo 673 422 430.",
        isRead: false,
      },
      {
        userId: user.id,
        type: "GRADE_POSTED" as const,
        title: "Assessment Grade Posted",
        message: "Your first assessment grade has been recorded.",
        isRead: true,
      },
    ]) {
      await prisma.notification.create({ data: n });
      notifCount++;
    }
  }

  for (const { user } of admins) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "System Initialized",
        message: "CHICAD Academy portal seeded successfully.",
        isRead: false,
      },
    });
    notifCount++;
  }
  console.log(`✅ ${notifCount} notifications created\n`);

  // ── 10. Audit Logs ─────────────────────────────────────────
  console.log("📝 Seeding audit logs...");
  const superAdmin = admins.find((a) => a.user.role === "SUPER_ADMIN")!;

  for (const event of [
    { action: "SYSTEM_INITIALIZED", entity: "System" },
    { action: "COURSES_CREATED", entity: "Course" },
    { action: "STUDENTS_ENROLLED", entity: "Enrollment" },
  ]) {
    await prisma.auditLog.create({
      data: {
        userId: superAdmin.user.id,
        action: event.action,
        entity: event.entity,
        newValues: { seeded: true, timestamp: new Date().toISOString() },
        ipAddress: "127.0.0.1",
      },
    });
  }
  console.log("✅ 3 audit logs created\n");

  // ── Summary ────────────────────────────────────────────────
  console.log("═".repeat(50));
  console.log("✅ SEED COMPLETE — CHICAD Academy Batch 11");
  console.log("═".repeat(50));
  console.log(`
📊 Summary:
  📚  Courses        : ${courses.length}
  🛡️  Admins         : ${admins.length}
  🎓  Students       : ${createdStudents.length}
  📋  Enrollments    : ${enrollmentCount}
  📊  Grades         : ${gradeCount}
  📅  Attendance     : ${attendanceCount}
  💰  Payments       : ${paymentCount}
  🔔  Notifications  : ${notifCount}
`);
  console.log("─".repeat(50));
  console.log("🔐 Login Credentials:\n");
  console.log("  SUPER ADMIN:");
  console.log("    Email    : superadmin@chicadacademy.cm");
  console.log("    Password : superadmin123\n");
  console.log("  ADMIN:");
  console.log("    Email    : admin@chicadacademy.cm");
  console.log("    Password : admin123\n");
  console.log("  STUDENTS (studentId or email + password: chicad123):");
  for (const { student } of createdStudents) {
    console.log(
      `    ${student.studentId}  →  ${student.firstName} ${student.lastName}  (${student.userId})`,
    );
  }
  console.log("─".repeat(50));
}

// ── Run ───────────────────────────────────────────────────────
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
