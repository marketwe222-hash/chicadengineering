"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { api } from "@/lib/api";
type AdminView =
  | "dashboard"
  | "students"
  | "students_new"
  | "students_detail"
  | "courses"
  | "courses_new"
  | "reports";
// or define it where you keep shared types

export default function NewStudentPage({
  onNavigate,
}: {
  onNavigate: (view: AdminView, studentId?: string) => void;
}) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "MALE",
    phone: "",
    address: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await api.post("/api/students", form);

    if (res.error) {
      toastError("Failed to create student", res.error);
    } else {
      success("Student created!", "The student has been registered.");
      onNavigate("students");
    }
    setLoading(false);
  };

  const field = (
    id: keyof typeof form,
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className="glass-input px-4 py-3 text-sm"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("students")}
          className="w-9 h-9 glass-sm rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Add New Student
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Register a new student to the academy
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="glass-strong rounded-3xl p-8 flex flex-col gap-5"
      >
        <h2 className="font-bold text-[var(--text-primary)]">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("firstName", "First Name *", "text", "Kwame")}
          {field("lastName", "Last Name *", "text", "Asante")}
          {field("middleName", "Middle Name", "text", "Optional")}
          {field("dateOfBirth", "Date of Birth *", "date")}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
            Gender *
          </label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="glass-input px-4 py-3 text-sm"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("phone", "Phone Number", "tel", "+233 24 000 0000")}
          {field("address", "Address", "text", "12 Example Street, Accra")}
        </div>

        <div className="h-px bg-[var(--divider)]" />

        <h2 className="font-bold text-[var(--text-primary)]">
          Login Credentials
        </h2>

        {field("password", "Password *", "password", "Min. 8 characters")}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate("students")}
            className="flex-1 btn-secondary py-3 text-sm font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create Student →"}
          </button>
        </div>
      </form>
    </div>
  );
}
