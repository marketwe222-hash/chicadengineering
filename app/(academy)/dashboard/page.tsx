"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGrades, useAttendance, useStudent } from "@/hooks/useStudent";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, formatDateTime } from "@/lib/utils";
import { GRADE_LABELS } from "@/lib/constants";

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  accent: "sky" | "orange" | "green" | "purple";
  loading?: boolean;
}) {
  const accents = {
    sky: "from-sky-500/20 to-sky-400/5 border-sky-500/20 text-sky-400",
    orange:
      "from-orange-500/20 to-orange-400/5 border-orange-500/20 text-orange-400",
    green:
      "from-emerald-500/20 to-emerald-400/5 border-emerald-500/20 text-emerald-400",
    purple:
      "from-purple-500/20 to-purple-400/5 border-purple-500/20 text-purple-400",
  };

  return (
    <Card className={`bg-gradient-to-br ${accents[accent]} border`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {label}
          </p>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <p className="text-3xl font-black text-[var(--text-primary)]">
              {value}
            </p>
          )}
          {sub && !loading && (
            <p className="text-xs text-[var(--text-muted)]">{sub}</p>
          )}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  );
}

// ── Recent Grade Row ──────────────────────────────────────────
function GradeRow({
  courseName,
  courseCode,
  score,
  gradeScale,
  date,
}: {
  courseName: string;
  courseCode: string;
  score: number;
  gradeScale: string;
  date: string;
}) {
  const gradeLabel = GRADE_LABELS[gradeScale] ?? gradeScale;
  const isGood = ["A_PLUS", "A", "A_MINUS", "B_PLUS", "B"].includes(gradeScale);
  const isOk = ["B_MINUS", "C_PLUS", "C"].includes(gradeScale);

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--divider)] last:border-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {courseName}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {courseCode} · {formatDate(date)}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm font-bold text-[var(--text-primary)]">
          {score}%
        </span>
        <Badge variant={isGood ? "sky" : isOk ? "orange" : "dark"}>
          {gradeLabel}
        </Badge>
      </div>
    </div>
  );
}

// ── Attendance Row ────────────────────────────────────────────
function AttendanceRow({
  courseName,
  date,
  status,
}: {
  courseName: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
}) {
  const config = {
    PRESENT: { label: "Present", variant: "success" as const, icon: "✓" },
    ABSENT: { label: "Absent", variant: "error" as const, icon: "✕" },
    LATE: { label: "Late", variant: "warning" as const, icon: "⏰" },
    EXCUSED: { label: "Excused", variant: "sky" as const, icon: "📋" },
  };

  const { label, variant, icon } = config[status];

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--divider)] last:border-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {courseName}
        </p>
        <p className="text-xs text-[var(--text-muted)]">{formatDate(date)}</p>
      </div>
      <Badge variant={variant} dot>
        {icon} {label}
      </Badge>
    </div>
  );
}

// ── GPA Ring ──────────────────────────────────────────────────
function GPARing({ gpa }: { gpa: number }) {
  const max = 4.0;
  const pct = (gpa / max) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const color =
    gpa >= 3.5
      ? "#0ea5e9"
      : gpa >= 3.0
        ? "#10b981"
        : gpa >= 2.0
          ? "#f97316"
          : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="128" height="128" viewBox="0 0 128 128">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--divider)"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        {/* Center text */}
        <text
          x="64"
          y="60"
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="22"
          fontWeight="800"
        >
          {gpa.toFixed(2)}
        </text>
        <text
          x="64"
          y="78"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="11"
          fontWeight="600"
        >
          GPA
        </text>
      </svg>
      <p className="text-xs text-[var(--text-muted)]">out of 4.00</p>
    </div>
  );
}

// ── Enrollment Card ───────────────────────────────────────────
function EnrollmentCard({
  courseCode,
  name,
  credits,
  status,
}: {
  courseCode: string;
  name: string;
  credits: number;
  status: string;
}) {
  return (
    <div
      className="
        glass-sm rounded-xl px-4 py-3
        flex items-center justify-between gap-3
        hover:bg-[var(--glass-bg-hover)] transition-colors duration-200
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="
            w-9 h-9 rounded-lg flex-shrink-0
            bg-gradient-to-br from-sky-500/20 to-sky-400/5
            border border-sky-500/20
            flex items-center justify-center
            text-sky-400 font-bold text-xs
          "
        >
          {courseCode.split("-")[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {courseCode} · {credits} credit{credits !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <Badge variant={status === "ACTIVE" ? "sky" : "dark"} size="sm">
        {status}
      </Badge>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();

  const studentId = user?.student?.id;
  const studentDbId = user?.student?.id;

  const { student, isLoading: studentLoading } = useStudent(studentDbId);
  const { grades, gpa, isLoading: gradesLoading } = useGrades(studentId);
  const {
    attendance,
    rate,
    isLoading: attendanceLoading,
  } = useAttendance(studentId);

  const firstName = user?.student?.firstName ?? "Student";
  const enrollments = student?.enrollments ?? [];
  const recentGrades = grades.slice(0, 5);
  const recentAttendance = attendance.slice(0, 5);

  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;

  // ── Hour greeting ────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Welcome Banner ── */}
      <div
        className="
          glass rounded-2xl px-6 py-5
          bg-gradient-to-r from-sky-500/10 via-transparent to-orange-500/10
          border border-[var(--glass-border)]
          flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        "
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[var(--text-muted)] font-medium">
            {greeting} 👋
          </p>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">
            Welcome back,{" "}
            <span className="text-gradient-primary">{firstName}</span>!
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {formatDateTime(new Date())} ·{" "}
            <span className="font-semibold text-[var(--text-secondary)]">
              {user?.student?.studentId}
            </span>
          </p>
        </div>

        {/* Status badge */}
        <Badge
          variant={user?.student?.status === "ACTIVE" ? "success" : "warning"}
          dot
        >
          {user?.student?.status ?? "ACTIVE"}
        </Badge>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled Courses"
          value={activeEnrollments.length}
          sub="Active this term"
          icon="📚"
          accent="sky"
          loading={studentLoading}
        />
        <StatCard
          label="GPA"
          value={gpa.toFixed(2)}
          sub="Current semester"
          icon="📊"
          accent="green"
          loading={gradesLoading}
        />
        <StatCard
          label="Attendance Rate"
          value={`${rate}%`}
          sub={`${presentCount} sessions attended`}
          icon="📅"
          accent="orange"
          loading={attendanceLoading}
        />
        <StatCard
          label="Total Credits"
          value={activeEnrollments.reduce(
            (sum, e) => sum + (e.course?.credits ?? 0),
            0,
          )}
          sub="This semester"
          icon="🎯"
          accent="purple"
          loading={studentLoading}
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Ring card */}
        <Card className="flex flex-col items-center justify-center gap-4 py-6">
          <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide">
            Academic Standing
          </p>
          {gradesLoading ? <Spinner size="lg" /> : <GPARing gpa={gpa} />}
          <Badge
            variant={
              gpa >= 3.5
                ? "sky"
                : gpa >= 2.5
                  ? "success"
                  : gpa >= 1.5
                    ? "warning"
                    : "error"
            }
          >
            {gpa >= 3.5
              ? "🏆 Dean's List"
              : gpa >= 2.5
                ? "✅ Good Standing"
                : gpa >= 1.5
                  ? "⚠ Academic Warning"
                  : "❌ Academic Probation"}
          </Badge>
        </Card>

        {/* Enrolled courses */}
        <Card className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">
              Enrolled Courses
            </h3>
            <Badge variant="sky" size="sm">
              {activeEnrollments.length} Active
            </Badge>
          </div>

          {studentLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : activeEnrollments.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-[var(--text-muted)]">
              <span className="text-4xl">📭</span>
              <p className="text-sm">No active enrollments</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {activeEnrollments.map((e) => (
                <EnrollmentCard
                  key={e.id}
                  courseCode={e.course?.courseCode ?? "—"}
                  name={e.course?.name ?? "Unknown Course"}
                  credits={e.course?.credits ?? 0}
                  status={e.status}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">
              Recent Grades
            </h3>
            <Badge variant="sky" size="sm">
              {grades.length} total
            </Badge>
          </div>

          {gradesLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : recentGrades.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-[var(--text-muted)]">
              <span className="text-4xl">📋</span>
              <p className="text-sm">No grades posted yet</p>
            </div>
          ) : (
            <div>
              {recentGrades.map((g) => (
                <GradeRow
                  key={g.id}
                  courseName={g.course?.name ?? "Unknown"}
                  courseCode={g.course?.courseCode ?? "—"}
                  score={g.score}
                  gradeScale={g.gradeScale}
                  date={g.gradedAt}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Recent Attendance */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-primary)]">
              Recent Attendance
            </h3>
            <Badge
              variant={rate >= 90 ? "sky" : rate >= 75 ? "orange" : "error"}
              size="sm"
            >
              {rate}% rate
            </Badge>
          </div>

          {attendanceLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2 text-[var(--text-muted)]">
              <span className="text-4xl">📅</span>
              <p className="text-sm">No attendance records yet</p>
            </div>
          ) : (
            <div>
              {recentAttendance.map((a) => (
                <AttendanceRow
                  key={a.id}
                  courseName={a.course?.name ?? "Unknown"}
                  date={a.date}
                  status={a.status}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
