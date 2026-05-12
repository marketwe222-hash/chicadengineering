// app/(academy)/admin/courses/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

// ── Types ──────────────────────────────────────────────────────
interface Department {
  id: string;
  name: string;
  code: string;
}

interface AcademicTerm {
  id: string;
  name: string;
  isActive: boolean;
}

const SCHEDULES = [
  "Mon/Wed 9:00–10:30",
  "Mon/Wed 11:00–12:30",
  "Tue/Thu 9:00–10:30",
  "Tue/Thu 11:00–12:30",
  "Fri 9:00–12:00",
  "Sat 9:00–12:00",
  "Custom",
];

// ── Department icons (matched by code or name) ─────────────────
const DEPT_ICONS: Record<string, string> = {
  revit: "🏛️",
  lumion: "✨",
  autocad: "📐",
  robot: "🤖",
  sap: "🧱",
  abaqus: "⚙️",
  excel: "📊",
  archicad: "🏗️",
};

function getDeptIcon(name: string) {
  const key = Object.keys(DEPT_ICONS).find((k) =>
    name.toLowerCase().includes(k),
  );
  return key ? DEPT_ICONS[key] : "📚";
}

// ── Main Page ──────────────────────────────────────────────────
export default function NewCoursePage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [customSchedule, setCustomSchedule] = useState(false);

  const [form, setForm] = useState({
    name: "",
    courseCode: "",
    description: "",
    credits: "3",
    maxStudents: "30",
    instructorName: "",
    schedule: "",
    room: "",
    departmentId: "",
    academicTermId: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // ── Fetch departments and terms ──────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoadingMeta(true);
      const [deptRes, termRes] = await Promise.all([
        api.get<Department[]>("/api/departments"),
        api.get<AcademicTerm[]>("/api/academic-terms"),
      ]);
      if (deptRes.data) setDepartments(deptRes.data);
      if (termRes.data) setTerms(termRes.data);
      // Auto-select active term
      const activeTerm = termRes.data?.find((t) => t.isActive);
      if (activeTerm) set("academicTermId", activeTerm.id);
      setLoadingMeta(false);
    };
    load();
  }, []);

  // ── Auto-fill course code when department selected ───────────
  const handleDeptSelect = (dept: Department) => {
    set("departmentId", dept.id);
    if (!form.courseCode) set("courseCode", dept.code + "-");
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.departmentId) {
      toastError("Missing department", "Please select a software category.");
      return;
    }
    if (!form.academicTermId) {
      toastError("Missing term", "Please select an academic term.");
      return;
    }
    setLoading(true);
    const res = await api.post("/api/courses", {
      ...form,
      credits: Number(form.credits),
      maxStudents: Number(form.maxStudents),
    });
    setLoading(false);
    if (res.error) toastError("Failed to create course", res.error);
    else {
      success("Course created!", `${form.name} has been added.`);
      router.push("/admin/courses");
    }
  };

  const field = (
    id: keyof typeof form,
    label: string,
    type = "text",
    placeholder = "",
    required = false,
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[id]}
        onChange={(e) => set(id, e.target.value)}
        placeholder={placeholder}
        className="glass-input px-4 py-3 text-sm"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 glass-sm rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            New Course
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Create a course under a software department
          </p>
        </div>
      </div>

      {loadingMeta ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ── Step 1: Department ── */}
          <Card className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">
                1. Software Department <span className="text-red-400">*</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Select the software this course belongs to
              </p>
            </div>

            {departments.length === 0 ? (
              <div className="glass-sm rounded-xl p-6 text-center text-[var(--text-muted)] text-sm">
                No departments found.{" "}
                <a
                  href="/admin/departments/new"
                  className="text-[var(--text-link)] hover:underline"
                >
                  Create one first.
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {departments.map((dept) => {
                  const active = form.departmentId === dept.id;
                  return (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => handleDeptSelect(dept)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-xl border
                        text-center transition-all duration-200
                        ${
                          active
                            ? "bg-[var(--sidebar-item-active)] border-[var(--accent-primary)] shadow-md scale-[1.02]"
                            : "glass-sm border-[var(--glass-border-subtle)] hover:bg-[var(--glass-bg-hover)] hover:scale-[1.01]"
                        }
                      `}
                    >
                      <span className="text-3xl">{getDeptIcon(dept.name)}</span>
                      <span
                        className={`text-xs font-semibold leading-tight ${
                          active
                            ? "text-[var(--accent-primary)]"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {dept.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          active
                            ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                            : "text-[var(--text-muted)] bg-[var(--glass-bg-subtle)]"
                        }`}
                      >
                        {active ? "Selected ✓" : dept.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* ── Step 2: Course Details ── */}
          <Card className="flex flex-col gap-5">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">
                2. Course Details
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Fill in the course information
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field(
                "name",
                "Course Name",
                "text",
                "e.g. Revit Architecture Basics",
                true,
              )}
              {field("courseCode", "Course Code", "text", "e.g. REV-101", true)}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Brief description of what students will learn…"
                rows={3}
                className="glass-input px-4 py-3 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("credits", "Credits", "number", "3")}
              {field("maxStudents", "Max Students", "number", "30")}
            </div>
          </Card>

          {/* ── Step 3: Instructor & Schedule ── */}
          <Card className="flex flex-col gap-5">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">
                3. Instructor & Schedule
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Assign an instructor and set the class schedule
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field(
                "instructorName",
                "Instructor Name",
                "text",
                "e.g. Kwame Asante",
              )}
              {field("room", "Room / Location", "text", "e.g. Lab 3, Block B")}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
                Schedule
              </label>
              <div className="flex flex-wrap gap-2">
                {SCHEDULES.map((s) => {
                  const isCustom = s === "Custom";
                  const active = isCustom
                    ? customSchedule
                    : form.schedule === s && !customSchedule;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => {
                        if (isCustom) {
                          setCustomSchedule(true);
                          set("schedule", "");
                        } else {
                          setCustomSchedule(false);
                          set("schedule", s);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        active
                          ? "btn-primary text-white"
                          : "glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {customSchedule && (
                <input
                  type="text"
                  value={form.schedule}
                  onChange={(e) => set("schedule", e.target.value)}
                  placeholder="e.g. Mon/Fri 2:00–4:00pm"
                  className="glass-input px-4 py-3 text-sm"
                />
              )}
            </div>
          </Card>

          {/* ── Step 4: Academic Term ── */}
          <Card className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">
                4. Academic Term <span className="text-red-400">*</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Select the term this course runs in
              </p>
            </div>

            {terms.length === 0 ? (
              <div className="glass-sm rounded-xl p-6 text-center text-[var(--text-muted)] text-sm">
                No academic terms found. Add one first.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {terms.map((term) => {
                  const active = form.academicTermId === term.id;
                  return (
                    <button
                      type="button"
                      key={term.id}
                      onClick={() => set("academicTermId", term.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        active
                          ? "btn-primary text-white"
                          : "glass-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {term.isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                      {term.name}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* ── Lesson notice ── */}
          <div className="glass-sm rounded-xl p-4 flex items-start gap-3 border border-[var(--glass-border-subtle)]">
            <span className="text-xl mt-0.5">📎</span>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Lessons & modules are added after creation
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Once the course is created, you can upload lesson content,
                videos, and PDFs from the course detail page.
              </p>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-secondary py-3 text-sm font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.departmentId || !form.academicTermId}
              className="flex-1 btn-primary py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="text-white" /> Creating…
                </>
              ) : (
                "Create Course →"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
