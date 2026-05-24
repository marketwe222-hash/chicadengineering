"use client";
import { useState } from "react";
import { SectionLabel, FormField, inputStyle } from "@/components/admin/shared";
import type { AdminCourse } from "@/hooks/useAdminDashboard";
import type { View } from "@/components/admin/dashboard";

interface Props {
  setView: (v: View) => void;
  courses: AdminCourse[];
  onRefresh: () => void;
}

export function AddStudentForm({ setView, courses, onRefresh }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    background: "STUDENT",
    school: "",
    fieldOfStudy: "",
    courseId: "",
    howHeard: "SOCIAL_MEDIA",
    referrer: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed");
      }
      onRefresh();
      setView("students");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      {/* Tips panel */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "1.25rem",
        }}
        className="fade-up"
      >
        <SectionLabel>Quick Tips</SectionLabel>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginBottom: "1rem",
          }}
        >
          {[
            "Fill all required fields before saving",
            "Student receives login credentials by email",
            "Course access granted after payment confirmation",
          ].map((tip) => (
            <div
              key={tip}
              style={{
                display: "flex",
                gap: "0.5rem",
                fontSize: "0.72rem",
                color: "var(--text2)",
                lineHeight: 1.55,
              }}
            >
              <span
                style={{
                  color: "var(--green)",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              {tip}
            </div>
          ))}
        </div>
        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 10,
            padding: "0.85rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              color: "#f59e0b",
              fontWeight: 700,
              marginBottom: "0.3rem",
            }}
          >
            💳 Payment
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              color: "var(--text2)",
              lineHeight: 1.55,
            }}
          >
            A pending payment record is created automatically. Confirm it once
            the student pays via MoMo.
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
        className="fade-up"
      >
        <div
          style={{
            padding: "1.1rem 1.25rem",
            borderBottom: "1px solid var(--border2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <SectionLabel>Management · Add Student</SectionLabel>
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              New Student
            </div>
          </div>
          <button
            type="button"
            onClick={() => setView("students")}
            style={{
              padding: "0.38rem 0.85rem",
              borderRadius: 7,
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              color: "var(--text2)",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>

        <div style={{ padding: "1.25rem" }}>
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
                fontSize: "0.78rem",
                marginBottom: "1.1rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.85rem",
              marginBottom: "1.25rem",
            }}
          >
            <FormField label="First Name *">
              <input
                style={inputStyle}
                placeholder="e.g. Aïcha"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Last Name *">
              {" "}
              <input
                style={inputStyle}
                placeholder="e.g. Mbarga"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Email *">
              {" "}
              <input
                style={inputStyle}
                type="email"
                placeholder="student@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Phone">
              {" "}
              <input
                style={inputStyle}
                placeholder="+237 6XX XXX XXX"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </FormField>
            <FormField label="City">
              {" "}
              <input
                style={inputStyle}
                placeholder="e.g. Yaoundé"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </FormField>
            <FormField label="Course *">
              <select
                style={inputStyle}
                value={form.courseId}
                onChange={(e) => set("courseId", e.target.value)}
                required
              >
                <option value="">Select a course…</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Background">
              <select
                style={inputStyle}
                value={form.background}
                onChange={(e) => set("background", e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="GRADUATE">Graduate</option>
                <option value="PROFESSIONAL">Professional</option>
              </select>
            </FormField>
            <FormField label="How Heard">
              <select
                style={inputStyle}
                value={form.howHeard}
                onChange={(e) => set("howHeard", e.target.value)}
              >
                <option value="SOCIAL_MEDIA">Social Media</option>
                <option value="FRIEND">Friend</option>
                <option value="OTHER">Other</option>
              </select>
            </FormField>
            <FormField label="School / Workplace">
              <input
                style={inputStyle}
                placeholder="e.g. ENSP Yaoundé"
                value={form.school}
                onChange={(e) => set("school", e.target.value)}
              />
            </FormField>
            <FormField label="Field of Study">
              {" "}
              <input
                style={inputStyle}
                placeholder="e.g. Civil Engineering"
                value={form.fieldOfStudy}
                onChange={(e) => set("fieldOfStudy", e.target.value)}
              />
            </FormField>
            <FormField label="Referred By">
              {" "}
              <input
                style={inputStyle}
                placeholder="Name of referrer"
                value={form.referrer}
                onChange={(e) => set("referrer", e.target.value)}
              />
            </FormField>
          </div>

          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.7rem 2rem",
                borderRadius: 9,
                border: "none",
                background: saving
                  ? "rgba(220,38,38,0.5)"
                  : "linear-gradient(135deg,#dc2626,#b91c1c)",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: saving ? "none" : "0 4px 14px rgba(220,38,38,0.35)",
                transition: "all 0.2s",
              }}
            >
              {saving ? "Creating…" : "Add Student"}
            </button>
            <button
              type="button"
              onClick={() => setView("students")}
              disabled={saving}
              style={{
                padding: "0.7rem 1.25rem",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text2)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
