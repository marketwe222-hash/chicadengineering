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
const DEPARTMENTS = [
  {
    name: "Civil Engineering",
    code: "CE",
    description: "Design and construction of infrastructure",
  },
  {
    name: "Electrical Engineering",
    code: "EE",
    description: "Electrical systems and power engineering",
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
    description: "Mechanical systems design and analysis",
  },
  {
    name: "Computer Engineering",
    code: "CPE",
    description: "Hardware and software integration",
  },
  {
    name: "Architecture",
    code: "ARCH",
    description: "Building design and spatial planning",
  },
];

const COURSES_DATA = [
  // Civil Engineering
  {
    courseCode: "CE-101",
    name: "Introduction to Civil Engineering",
    description: "Fundamentals of civil engineering practice",
    credits: 3,
    maxStudents: 40,
    deptCode: "CE",
    instructorName: "Dr. Marcus Webb",
    schedule: "Mon/Wed 8:00-9:30",
    room: "Block A - Room 101",
  },
  {
    courseCode: "CE-201",
    name: "Structural Analysis",
    description: "Analysis of structural systems under load",
    credits: 4,
    maxStudents: 35,
    deptCode: "CE",
    instructorName: "Prof. Linda Osei",
    schedule: "Tue/Thu 10:00-11:30",
    room: "Block A - Room 205",
  },
  {
    courseCode: "CE-301",
    name: "Geotechnical Engineering",
    description: "Soil mechanics and foundation design",
    credits: 3,
    maxStudents: 30,
    deptCode: "CE",
    instructorName: "Dr. James Amoako",
    schedule: "Mon/Fri 14:00-15:30",
    room: "Block A - Lab 3",
  },
  // Electrical Engineering
  {
    courseCode: "EE-101",
    name: "Circuit Theory",
    description: "DC and AC circuit analysis",
    credits: 3,
    maxStudents: 40,
    deptCode: "EE",
    instructorName: "Dr. Sarah Mensah",
    schedule: "Mon/Wed 10:00-11:30",
    room: "Block B - Room 101",
  },
  {
    courseCode: "EE-201",
    name: "Electronics I",
    description: "Semiconductor devices and basic electronics",
    credits: 4,
    maxStudents: 35,
    deptCode: "EE",
    instructorName: "Prof. Kofi Asante",
    schedule: "Tue/Thu 8:00-9:30",
    room: "Block B - Lab 2",
  },
  {
    courseCode: "EE-301",
    name: "Power Systems",
    description: "Generation, transmission and distribution of power",
    credits: 3,
    maxStudents: 30,
    deptCode: "EE",
    instructorName: "Dr. Emmanuel Tetteh",
    schedule: "Wed/Fri 12:00-13:30",
    room: "Block B - Room 305",
  },
  // Mechanical Engineering
  {
    courseCode: "ME-101",
    name: "Engineering Mechanics",
    description: "Statics and dynamics of rigid bodies",
    credits: 3,
    maxStudents: 40,
    deptCode: "ME",
    instructorName: "Dr. Rachel Owusu",
    schedule: "Mon/Wed 12:00-13:30",
    room: "Block C - Room 101",
  },
  {
    courseCode: "ME-201",
    name: "Thermodynamics",
    description: "Energy, heat, and work principles",
    credits: 4,
    maxStudents: 35,
    deptCode: "ME",
    instructorName: "Prof. Daniel Boateng",
    schedule: "Tue/Thu 14:00-15:30",
    room: "Block C - Room 205",
  },
  // Computer Engineering
  {
    courseCode: "CPE-101",
    name: "Programming Fundamentals",
    description: "Introduction to programming with Python",
    credits: 3,
    maxStudents: 45,
    deptCode: "CPE",
    instructorName: "Dr. Abena Darko",
    schedule: "Mon/Wed/Fri 9:00-10:00",
    room: "Block D - Lab 1",
  },
  {
    courseCode: "CPE-201",
    name: "Data Structures & Algorithms",
    description: "Fundamental data structures and algorithm design",
    credits: 4,
    maxStudents: 40,
    deptCode: "CPE",
    instructorName: "Prof. Nana Acheampong",
    schedule: "Tue/Thu 10:00-11:30",
    room: "Block D - Lab 2",
  },
  // Architecture
  {
    courseCode: "ARCH-101",
    name: "Architectural Drawing",
    description: "Technical drawing and drafting fundamentals",
    credits: 3,
    maxStudents: 30,
    deptCode: "ARCH",
    instructorName: "Dr. Ama Serwah",
    schedule: "Mon/Wed/Fri 14:00-15:00",
    room: "Block E - Studio 1",
  },
  {
    courseCode: "ARCH-201",
    name: "Building Technology",
    description: "Construction methods and materials",
    credits: 3,
    maxStudents: 30,
    deptCode: "ARCH",
    instructorName: "Prof. Yaw Darko",
    schedule: "Tue/Thu 12:00-13:30",
    room: "Block E - Studio 2",
  },
];

const STUDENTS_DATA = [
  // Civil Engineering students
  {
    firstName: "Kwame",
    lastName: "Asante",
    gender: "MALE" as const,
    dob: "2002-03-15",
    phone: "+233244001001",
    address: "12 Ring Road, Accra",
    deptCode: "CE",
    password: "student123",
    email: "kwame.asante@chicadacademy.edu.gh",
  },
  {
    firstName: "Ama",
    lastName: "Boateng",
    gender: "FEMALE" as const,
    dob: "2003-07-22",
    phone: "+233244001002",
    address: "45 Liberation Road, Accra",
    deptCode: "CE",
    password: "student123",
    email: "ama.boateng@chicadacademy.edu.gh",
  },
  {
    firstName: "Kofi",
    lastName: "Mensah",
    gender: "MALE" as const,
    dob: "2001-11-08",
    phone: "+233244001003",
    address: "78 Spintex Road, Accra",
    deptCode: "CE",
    password: "student123",
    email: "kofi.mensah@chicadacademy.edu.gh",
  },
  // Electrical Engineering students
  {
    firstName: "Abena",
    lastName: "Owusu",
    gender: "FEMALE" as const,
    dob: "2002-05-30",
    phone: "+233244001004",
    address: "23 Airport Hills, Accra",
    deptCode: "EE",
    password: "student123",
    email: "abena.owusu@chicadacademy.edu.gh",
  },
  {
    firstName: "Yaw",
    lastName: "Darko",
    gender: "MALE" as const,
    dob: "2003-01-14",
    phone: "+233244001005",
    address: "56 East Legon, Accra",
    deptCode: "EE",
    password: "student123",
    email: "yaw.darko@chicadacademy.edu.gh",
  },
  {
    firstName: "Akosua",
    lastName: "Tetteh",
    gender: "FEMALE" as const,
    dob: "2002-09-18",
    phone: "+233244001006",
    address: "90 Haatso, Accra",
    deptCode: "EE",
    password: "student123",
    email: "akosua.tetteh@chicadacademy.edu.gh",
  },
  // Mechanical Engineering students
  {
    firstName: "Nana",
    lastName: "Adu",
    gender: "MALE" as const,
    dob: "2001-06-25",
    phone: "+233244001007",
    address: "34 Tema, Greater Accra",
    deptCode: "ME",
    password: "student123",
    email: "nana.adu@chicadacademy.edu.gh",
  },
  {
    firstName: "Efua",
    lastName: "Appiah",
    gender: "FEMALE" as const,
    dob: "2003-12-03",
    phone: "+233244001008",
    address: "67 Kumasi, Ashanti",
    deptCode: "ME",
    password: "student123",
    email: "efua.appiah@chicadacademy.edu.gh",
  },
  // Computer Engineering students
  {
    firstName: "Kwesi",
    lastName: "Amoako",
    gender: "MALE" as const,
    dob: "2002-08-10",
    phone: "+233244001009",
    address: "11 Adenta, Accra",
    deptCode: "CPE",
    password: "student123",
    email: "kwesi.amoako@chicadacademy.edu.gh",
  },
  {
    firstName: "Adwoa",
    lastName: "Sarpong",
    gender: "FEMALE" as const,
    dob: "2003-04-17",
    phone: "+233244001010",
    address: "88 Madina, Accra",
    deptCode: "CPE",
    password: "student123",
    email: "adwoa.sarpong@chicadacademy.edu.gh",
  },
  // Architecture students
  {
    firstName: "Kojo",
    lastName: "Wiredu",
    gender: "MALE" as const,
    dob: "2001-02-28",
    phone: "+233244001011",
    address: "22 Labone, Accra",
    deptCode: "ARCH",
    password: "student123",
    email: "kojo.wiredu@chicadacademy.edu.gh",
  },
  {
    firstName: "Akua",
    lastName: "Asare",
    gender: "FEMALE" as const,
    dob: "2002-10-05",
    phone: "+233244001012",
    address: "44 Cantonments, Accra",
    deptCode: "ARCH",
    password: "student123",
    email: "akua.asare@chicadacademy.edu.gh",
  },
];

const ADMINS_DATA = [
  {
    firstName: "Osei",
    lastName: "Bonsu",
    email: "admin@chicadacademy.edu.gh",
    password: "admin123",
    department: "Academic Affairs",
    phone: "+233244000001",
    role: "ADMIN" as const,
  },
  {
    firstName: "Esi",
    lastName: "Asante",
    email: "superadmin@chicadacademy.edu.gh",
    password: "superadmin123",
    department: "System Administration",
    phone: "+233244000002",
    role: "SUPER_ADMIN" as const,
  },
  {
    firstName: "Kwame",
    lastName: "Nyarko",
    email: "registrar@chicadacademy.edu.gh",
    password: "admin123",
    department: "Registrar Office",
    phone: "+233244000003",
    role: "ADMIN" as const,
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
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.academicTerm.deleteMany();
  await prisma.department.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.student.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleaned\n");

  // ── 2. Departments ─────────────────────────────────────────
  console.log("🏛️  Seeding departments...");
  const departments = await Promise.all(
    DEPARTMENTS.map((d) => prisma.department.create({ data: d })),
  );
  console.log(`✅ ${departments.length} departments created\n`);

  // ── 3. Academic Terms ──────────────────────────────────────
  console.log("📅 Seeding academic terms...");
  const currentYear = new Date().getFullYear();

  const terms = await Promise.all([
    prisma.academicTerm.create({
      data: {
        name: `First Semester ${currentYear - 1}/${currentYear}`,
        type: "SEMESTER",
        startDate: new Date(`${currentYear - 1}-09-01`),
        endDate: new Date(`${currentYear}-01-31`),
        isActive: false,
      },
    }),
    prisma.academicTerm.create({
      data: {
        name: `Second Semester ${currentYear - 1}/${currentYear}`,
        type: "SEMESTER",
        startDate: new Date(`${currentYear}-02-01`),
        endDate: new Date(`${currentYear}-06-30`),
        isActive: true,
      },
    }),
    prisma.academicTerm.create({
      data: {
        name: `First Semester ${currentYear}/${currentYear + 1}`,
        type: "SEMESTER",
        startDate: new Date(`${currentYear}-09-01`),
        endDate: new Date(`${currentYear + 1}-01-31`),
        isActive: false,
      },
    }),
  ]);

  const activeTerm = terms.find((t) => t.isActive)!;
  console.log(`✅ ${terms.length} academic terms created\n`);

  // ── 4. Courses ─────────────────────────────────────────────
  console.log("📚 Seeding courses...");
  const deptMap = Object.fromEntries(departments.map((d) => [d.code, d]));

  const courses = await Promise.all(
    COURSES_DATA.map((c) => {
      const { deptCode, ...rest } = c;
      return prisma.course.create({
        data: {
          ...rest,
          status: "ACTIVE",
          departmentId: deptMap[deptCode].id,
          academicTermId: activeTerm.id,
        },
      });
    }),
  );
  console.log(`✅ ${courses.length} courses created\n`);

  // ── 5. Admins ──────────────────────────────────────────────
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

  // ── 6. Students ────────────────────────────────────────────
  console.log("🎓 Seeding students...");
  const coursesByDept = Object.fromEntries(
    departments.map((d) => [
      d.code,
      courses.filter((c) => c.departmentId === d.id),
    ]),
  );

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
        dateOfBirth: new Date(s.dob),
        gender: s.gender,
        phone: s.phone,
        address: s.address,
        status: "ACTIVE",
        emergencyContact: {
          create: {
            name: `${s.firstName} Parent`,
            relationship: "Parent",
            phone: s.phone.replace("001", "002"),
            email: `parent.${s.lastName.toLowerCase()}@gmail.com`,
          },
        },
      },
    });

    createdStudents.push({
      student,
      user,
      deptCode: s.deptCode,
    });
  }

  console.log(`✅ ${createdStudents.length} students created\n`);

  // ── 7. Enrollments ─────────────────────────────────────────
  console.log("📋 Seeding enrollments...");
  let enrollmentCount = 0;

  for (const { student, deptCode } of createdStudents) {
    // Enroll in all courses from their department
    const deptCourses = coursesByDept[deptCode] ?? [];

    // Also add one cross-department elective
    const otherDepts = Object.keys(coursesByDept).filter((k) => k !== deptCode);
    const electiveDept = randomFrom(otherDepts);
    const elective = randomFrom(coursesByDept[electiveDept] ?? []);

    const coursesToEnroll = [...deptCourses];
    if (elective) coursesToEnroll.push(elective);

    for (const course of coursesToEnroll) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          academicTermId: activeTerm.id,
          status: "ACTIVE",
          enrolledAt: daysAgo(randomBetween(30, 60)),
        },
      });
      enrollmentCount++;
    }
  }

  console.log(`✅ ${enrollmentCount} enrollments created\n`);

  // ── 8. Grades ──────────────────────────────────────────────
  console.log("📊 Seeding grades...");
  let gradeCount = 0;

  for (const { student, deptCode } of createdStudents) {
    const deptCourses = coursesByDept[deptCode] ?? [];

    for (const course of deptCourses) {
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
          gradedAt: daysAgo(randomBetween(1, 20)),
        },
      });
      gradeCount++;
    }
  }

  console.log(`✅ ${gradeCount} grades created\n`);

  // ── 9. Attendance ──────────────────────────────────────────
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

  for (const { student, deptCode } of createdStudents) {
    const deptCourses = coursesByDept[deptCode] ?? [];

    for (const course of deptCourses) {
      // Generate 20 attendance records per course (last 40 days)
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
  }

  console.log(`✅ ${attendanceCount} attendance records created\n`);

  // ── 10. Payments ───────────────────────────────────────────
  console.log("💰 Seeding payments...");
  let paymentCount = 0;

  for (const { student } of createdStudents) {
    // Tuition fee — paid
    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: 2500.0,
        type: "TUITION",
        status: "PAID",
        dueDate: daysAgo(60),
        paidAt: daysAgo(55),
        referenceNo: `PAY-${student.studentId}-TUI-${currentYear}`,
        notes: "Tuition fee for active semester",
      },
    });
    paymentCount++;

    // Registration fee — paid
    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: 150.0,
        type: "REGISTRATION",
        status: "PAID",
        dueDate: daysAgo(65),
        paidAt: daysAgo(63),
        referenceNo: `PAY-${student.studentId}-REG-${currentYear}`,
      },
    });
    paymentCount++;

    // Exam fee — pending
    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: 200.0,
        type: "EXAM_FEE",
        status: randomFrom(["PENDING", "PAID"] as const),
        dueDate: daysAgo(-30), // future
        referenceNo: `PAY-${student.studentId}-EXM-${currentYear}`,
        notes: "End of semester examination fee",
      },
    });
    paymentCount++;
  }

  console.log(`✅ ${paymentCount} payments created\n`);

  // ── 11. Notifications ──────────────────────────────────────
  console.log("🔔 Seeding notifications...");
  let notifCount = 0;

  for (const { student } of createdStudents) {
    const notifs = [
      {
        userId: student.userId,
        type: "GRADE_POSTED" as const,
        title: "New Grade Posted",
        message: "Your grade for CE-101 has been posted.",
        isRead: false,
      },
      {
        userId: student.userId,
        type: "PAYMENT_DUE" as const,
        title: "Payment Reminder",
        message: "Your exam fee is due in 30 days.",
        isRead: true,
      },
      {
        userId: student.userId,
        type: "ANNOUNCEMENT" as const,
        title: "Welcome to Chicad Academy",
        message: "Welcome to the student portal. Please complete your profile.",
        isRead: true,
      },
    ];

    for (const n of notifs) {
      await prisma.notification.create({ data: n });
      notifCount++;
    }
  }

  // Admin notifications
  for (const { user } of admins) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "System Initialized",
        message: "The academy portal has been set up successfully.",
        isRead: false,
      },
    });
    notifCount++;
  }

  console.log(`✅ ${notifCount} notifications created\n`);

  // ── 12. Audit Logs ─────────────────────────────────────────
  console.log("📝 Seeding audit logs...");
  const superAdmin = admins.find((a) => a.user.role === "SUPER_ADMIN")!;

  const auditEvents = [
    { action: "SYSTEM_INITIALIZED", entity: "System" },
    { action: "DEPARTMENTS_CREATED", entity: "Department" },
    { action: "TERMS_CREATED", entity: "AcademicTerm" },
    { action: "COURSES_CREATED", entity: "Course" },
    { action: "STUDENTS_ENROLLED", entity: "Enrollment" },
  ];

  for (const event of auditEvents) {
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

  console.log(`✅ ${auditEvents.length} audit logs created\n`);

  // ── Summary ────────────────────────────────────────────────
  console.log("═".repeat(50));
  console.log("✅ SEED COMPLETE");
  console.log("═".repeat(50));
  console.log(`
📊 Summary:
  🏛️  Departments    : ${departments.length}
  📅  Academic Terms : ${terms.length}
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
  console.log("    Email    : superadmin@chicadacademy.edu.gh");
  console.log("    Password : superadmin123\n");
  console.log("  ADMIN:");
  console.log("    Email    : admin@chicadacademy.edu.gh");
  console.log("    Password : admin123\n");
  console.log("  STUDENTS (use Student ID to login):");

  for (let i = 0; i < createdStudents.length; i++) {
    const { student } = createdStudents[i];
    console.log(
      `    ${student.studentId}  →  ${STUDENTS_DATA[i].firstName} ${STUDENTS_DATA[i].lastName}  |  password: student123`,
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
