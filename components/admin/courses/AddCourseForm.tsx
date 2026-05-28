"use client";
import { useEffect, useRef, useState } from "react";
import { uploadToR2 } from "@/lib/uploadUtils";
import {
  SectionLabel,
  FormField,
  Tag,
  inputStyle,
  COURSE_CATEGORIES,
  COURSE_ICONS,
  categoryColor,
} from "@/components/admin/shared";
import type { View } from "@/components/admin/dashboard/AdminSidebarNav";
import type { AdminCourse } from "@/hooks/useAdminDashboard";

interface Props {
  setView: (v: View) => void;
  onRefresh: () => void;
  editCourse?: AdminCourse | null;
}

export function AddCourseForm({ setView, onRefresh, editCourse }: Props) {
  const isEdit = !!editCourse;

  const [form, setForm] = useState({
    name: editCourse?.name ?? "",
    courseCode: editCourse?.courseCode ?? "",
    category: editCourse?.category ?? "CAD",
    icon: editCourse?.icon ?? "📐",
    description: editCourse?.description ?? "",
    registrationFee: String(editCourse?.registrationFee ?? 5000),
    trainingFee: String(editCourse?.trainingFee ?? 70000),
    durationMonths: String(editCourse?.durationMonths ?? 3),
    maxStudents: String(editCourse?.maxStudents ?? 30),
    instructorName: editCourse?.instructorName ?? "",
    schedule: editCourse?.schedule ?? "",
    batch: editCourse?.batch != null ? String(editCourse.batch) : "",
    status: editCourse?.status ?? "ACTIVE",
    logoImage: editCourse?.logoImage ?? "",
    images: editCourse?.images ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editCourse) return;

    setForm({
      name: editCourse.name ?? "",
      courseCode: editCourse.courseCode ?? "",
      category: editCourse.category ?? "CAD",
      icon: editCourse.icon ?? "📐",
      description: editCourse.description ?? "",
      registrationFee: String(editCourse.registrationFee ?? 5000),
      trainingFee: String(editCourse.trainingFee ?? 70000),
      durationMonths: String(editCourse.durationMonths ?? 3),
      maxStudents: String(editCourse.maxStudents ?? 30),
      instructorName: editCourse.instructorName ?? "",
      schedule: editCourse.schedule ?? "",
      batch: editCourse.batch != null ? String(editCourse.batch) : "",
      status: editCourse.status ?? "ACTIVE",
      logoImage: editCourse.logoImage ?? "",
      images: editCourse.images ?? "",
    });
  }, [editCourse]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress("Uploading logo...");
    try {
      const uploaded = await uploadToR2(file);
      setForm((f) => ({ ...f, logoImage: uploaded.url }));
      setUploadProgress("");
    } catch (err: any) {
      setError(`Logo upload failed: ${err.message}`);
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(`Uploading 0/${files.length} images...`);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1}/${files.length} images...`);
        const uploaded = await uploadToR2(files[i]);
        uploadedUrls.push(uploaded.url);
      }
      const currentImages = form.images
        ? form.images.split(",").filter((u: string) => u.trim())
        : [];
      const allImages = [...currentImages, ...uploadedUrls];
      setForm((f) => ({ ...f, images: allImages.join(",") }));
      setUploadProgress("");
    } catch (err: any) {
      setError(`Images upload failed: ${err.message}`);
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  };

  const previewColor = categoryColor(form.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit
        ? `/api/courses/${editCourse!.id}`
        : "/api/admin/courses";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          courseCode: form.courseCode.trim().toUpperCase(),
          category: form.category,
          icon: form.icon,
          description: form.description.trim() || null,
          registrationFee: Number(form.registrationFee),
          trainingFee: Number(form.trainingFee),
          durationMonths: Number(form.durationMonths),
          maxStudents: Number(form.maxStudents),
          instructorName: form.instructorName.trim() || null,
          schedule: form.schedule.trim() || null,
          batch: form.batch ? Number(form.batch) : null,
          status: form.status,
          logoImage: form.logoImage.trim() || null,
          images: form.images.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(
          d.error ??
            (isEdit ? "Failed to update course" : "Failed to create course"),
        );
      }
      onRefresh();
      setView("courses");
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
        gridTemplateColumns: "1fr 300px",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="fade-up"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Header */}
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
            <SectionLabel>
              {isEdit ? "Management · Edit Course" : "Management · New Course"}
            </SectionLabel>
            <div
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              {isEdit ? "Edit Course" : "Create Course"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setView("courses")}
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
          {/* Error */}
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

          {/* Basic Info */}
          <SectionBlock color="#dc2626" label="Basic Information">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.85rem",
              }}
            >
              <FormField label="Course Name *">
                <input
                  style={inputStyle}
                  placeholder="e.g. AutoCAD"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Course Code *">
                <input
                  style={inputStyle}
                  placeholder="e.g. AUTOCAD-B11"
                  value={form.courseCode}
                  onChange={(e) =>
                    set("courseCode", e.target.value.toUpperCase())
                  }
                  required
                />
              </FormField>
              <FormField label="Category *">
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                >
                  {COURSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Icon">
                <select
                  style={inputStyle}
                  value={form.icon}
                  onChange={(e) => set("icon", e.target.value)}
                >
                  {COURSE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div style={{ marginTop: "0.85rem" }}>
              <FormField label="Description">
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  placeholder="What will students learn?"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </FormField>
            </div>
          </SectionBlock>

          {/* Images */}
          <SectionBlock color="#a855f7" label="Course Images">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              <FormField label="Logo Image (Optional)">
                <div
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "flex-start",
                  }}
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    style={{
                      ...inputStyle,
                      flex: 1,
                      cursor: uploading ? "not-allowed" : "pointer",
                    }}
                  />
                  {form.logoImage && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.45rem",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 8,
                          background: "var(--surface2)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={form.logoImage}
                          alt="Logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={uploading}
                        style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: 7,
                          border: "1px solid var(--border)",
                          background: "var(--surface2)",
                          color: "var(--text2)",
                          fontSize: "0.72rem",
                          cursor: uploading ? "not-allowed" : "pointer",
                        }}
                      >
                        Replace
                      </button>
                    </div>
                  )}
                </div>
              </FormField>

              <FormField label="Course Images (Optional)">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesUpload}
                  disabled={uploading}
                  style={{
                    ...inputStyle,
                    cursor: uploading ? "not-allowed" : "pointer",
                  }}
                />
              </FormField>

              {uploadProgress && (
                <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
                  ⏳ {uploadProgress}
                </div>
              )}

              {form.images && (
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text2)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Uploaded Images (
                    {
                      form.images.split(",").filter((u: string) => u.trim())
                        .length
                    }
                    )
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(60px, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    {form.images
                      .split(",")
                      .filter((u: string) => u.trim())
                      .map((url: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            width: "100%",
                            aspectRatio: "1",
                            borderRadius: 8,
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={url}
                            alt={`Course ${idx}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const urls = form.images
                                .split(",")
                                .filter((u: string) => u.trim())
                                .filter((_: string, i: number) => i !== idx);
                              setForm((f) => ({
                                ...f,
                                images: urls.join(","),
                              }));
                            }}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              padding: "0.18rem 0.35rem",
                              background: "rgba(239,68,68,0.95)",
                              color: "white",
                              border: "none",
                              borderRadius: 999,
                              fontSize: "10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.2rem",
                            }}
                          >
                            × Delete
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </SectionBlock>

          {/* Fees */}
          <SectionBlock color="#22c55e" label="Fees & Duration">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "0.85rem",
              }}
            >
              <FormField label="Registration Fee (FRS) *">
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={form.registrationFee}
                  onChange={(e) => set("registrationFee", e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Training Fee (FRS) *">
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  placeholder="70000"
                  value={form.trainingFee}
                  onChange={(e) => set("trainingFee", e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Duration (Months) *">
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  max="24"
                  placeholder="3"
                  value={form.durationMonths}
                  onChange={(e) => set("durationMonths", e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Max Students">
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  placeholder="30"
                  value={form.maxStudents}
                  onChange={(e) => set("maxStudents", e.target.value)}
                />
              </FormField>
            </div>
          </SectionBlock>

          {/* Schedule */}
          <SectionBlock color="#3b82f6" label="Schedule & Instructor">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.85rem",
              }}
            >
              <FormField label="Instructor Name">
                <input
                  style={inputStyle}
                  placeholder="e.g. Mr. Kamga"
                  value={form.instructorName}
                  onChange={(e) => set("instructorName", e.target.value)}
                />
              </FormField>
              <FormField label="Schedule">
                <input
                  style={inputStyle}
                  placeholder="e.g. Mon & Wed, 9am–12pm"
                  value={form.schedule}
                  onChange={(e) => set("schedule", e.target.value)}
                />
              </FormField>
              <FormField label="Batch Number">
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  placeholder="e.g. 11"
                  value={form.batch}
                  onChange={(e) => set("batch", e.target.value)}
                />
              </FormField>
            </div>
          </SectionBlock>

          {/* Status */}
          <SectionBlock color="#f59e0b" label="Status">
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  style={{
                    padding: "0.45rem 1.1rem",
                    borderRadius: 8,
                    border: `1px solid ${form.status === s ? (s === "ACTIVE" ? "rgba(34,197,94,0.4)" : "rgba(245,158,11,0.4)") : "var(--border)"}`,
                    background:
                      form.status === s
                        ? s === "ACTIVE"
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(245,158,11,0.12)"
                        : "transparent",
                    color:
                      form.status === s
                        ? s === "ACTIVE"
                          ? "#4ade80"
                          : "#fbbf24"
                        : "var(--text3)",
                    fontSize: "0.75rem",
                    fontWeight: form.status === s ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {s === "ACTIVE" ? "✓ Active" : "⏸ Inactive"}
                </button>
              ))}
            </div>
          </SectionBlock>

          {/* Submit */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              marginTop: "1.5rem",
            }}
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
              {saving
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save Changes"
                  : "Create Course"}
            </button>
            <button
              type="button"
              onClick={() => setView("courses")}
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

      {/* ── Live Preview ── */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
        className="fade-up"
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 90,
              background: `linear-gradient(135deg,${previewColor}22,rgba(6,16,30,0.95))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderBottom: "1px solid var(--border2)",
            }}
          >
            <span style={{ fontSize: "2.6rem" }}>{form.icon || "📐"}</span>
            <div
              style={{ position: "absolute", top: "0.55rem", right: "0.6rem" }}
            >
              <Tag label={form.category} color={previewColor} />
            </div>
            <div
              style={{ position: "absolute", top: "0.55rem", left: "0.6rem" }}
            >
              <Tag
                label={form.status}
                color={form.status === "ACTIVE" ? "#22c55e" : "#f59e0b"}
              />
            </div>
          </div>
          <div style={{ padding: "0.9rem 1.1rem" }}>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.02em",
                marginBottom: "0.12rem",
              }}
            >
              {form.name || "Course Name"}
            </h3>
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--text3)",
                marginBottom: "0.6rem",
                fontFamily: "var(--mono)",
              }}
            >
              {form.courseCode || "COURSE-CODE"}
            </div>
            {form.description && (
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text2)",
                  lineHeight: 1.55,
                  marginBottom: "0.7rem",
                }}
              >
                {form.description}
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.4rem",
                marginBottom: "0.65rem",
              }}
            >
              {(
                [
                  [
                    isEdit ? String(editCourse?._count?.enrollments ?? 0) : "0",
                    "Students",
                    previewColor,
                  ],
                  [form.durationMonths || "3", "Months", "#fbbf24"],
                  [form.maxStudents || "30", "Max", "#a78bfa"],
                ] as const
              ).map(([val, lbl, col]) => (
                <div
                  key={String(lbl)}
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border2)",
                    borderRadius: 8,
                    padding: "0.45rem 0.35rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.92rem",
                      fontWeight: 900,
                      color: String(col),
                      fontFamily: "var(--mono)",
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    {lbl}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              <Tag
                label={`Reg: ${Number(form.registrationFee || 0).toLocaleString()} FRS`}
                color="var(--text3)"
              />
              <Tag
                label={`Fee: ${Number(form.trainingFee || 0).toLocaleString()} FRS`}
                color="var(--text3)"
              />
            </div>
            {form.instructorName && (
              <div
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.68rem",
                  color: "var(--text3)",
                }}
              >
                👤 {form.instructorName}
              </div>
            )}
            {form.schedule && (
              <div style={{ fontSize: "0.65rem", color: "var(--text3)" }}>
                🕐 {form.schedule}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.1rem",
          }}
        >
          <SectionLabel>Tips</SectionLabel>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
          >
            {[
              "Course code must be unique (e.g. AUTOCAD-B11)",
              "Students enroll after course is Active",
              "Add lessons after creating the course",
              "Fees are in CFA Francs (FRS)",
            ].map((tip) => (
              <div
                key={tip}
                style={{
                  display: "flex",
                  gap: "0.45rem",
                  fontSize: "0.7rem",
                  color: "var(--text2)",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}
                >
                  ✓
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Local helper ──
function SectionBlock({
  color,
  label,
  children,
}: {
  color: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          fontSize: "0.6rem",
          fontWeight: 800,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "0.75rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--border2)",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
