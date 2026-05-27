"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { AdminSpinner } from "@/components/admin/shared/AdminSpinner";
import { Tag, categoryColor } from "@/components/admin/shared";
import { VideoUpload } from "@/components/admin/shared/VideoUpload";
import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import { DocumentUpload } from "@/components/admin/shared/DocumentUpload";
import type { UploadedFile } from "@/lib/uploadUtils";
import type { AdminCourse } from "@/hooks/useAdminDashboard";

// ── Types ──────────────────────────────────────────────────────────────────

interface LessonResource {
  id: string;
  type: string;
  title: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  duration: number | null;
  status: "DRAFT" | "PUBLISHED";
  resources: LessonResource[];
}

interface CourseMedia {
  id: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  isPublished: boolean;
  order: number;
}

interface CourseDetail extends AdminCourse {
  lessons: Lesson[];
  media: CourseMedia[];
}

interface Props {
  courseId: string;
  onBack: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mediaIcon(type: string) {
  switch (type) {
    case "VIDEO":
      return "🎬";
    case "PDF":
      return "📄";
    case "DOCUMENT":
      return "📝";
    case "IMAGE":
      return "🖼️";
    default:
      return "📁";
  }
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text)",
  fontSize: "0.78rem",
  outline: "none",
  boxSizing: "border-box",
};

const MEDIA_TYPES = [
  { type: "VIDEO", label: "🎬 Video" },
  { type: "PDF", label: "📄 PDF" },
  { type: "DOCUMENT", label: "📝 Document" },
  { type: "IMAGE", label: "🖼️ Image" },
] as const;

// ── Upload picker: renders the right uploader for the selected media type ──

function MediaUploadPicker({
  type,
  value,
  onUploaded,
  onRemove,
}: {
  type: string;
  value: UploadedFile | null;
  onUploaded: (f: UploadedFile) => void;
  onRemove: () => void;
}) {
  if (type === "VIDEO") {
    return (
      <VideoUpload
        label="Video File"
        value={value}
        onUploaded={onUploaded}
        onRemove={onRemove}
      />
    );
  }
  if (type === "IMAGE") {
    return (
      <ImageUpload
        label="Image File"
        value={value}
        onUploaded={onUploaded}
        onRemove={onRemove}
      />
    );
  }
  // PDF and DOCUMENT both go to DocumentUpload
  return (
    <DocumentUpload
      label={type === "PDF" ? "PDF File" : "Document File"}
      value={value}
      onUploaded={onUploaded}
      onRemove={onRemove}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function CourseDetailView({
  courseId,
  onBack,
  onEdit,
  onRefresh,
}: Props) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"lessons" | "media">("lessons");
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  // Lesson form
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    duration: "",
    status: "DRAFT",
  });
  const [savingLesson, setSavingLesson] = useState(false);
  const [lessonError, setLessonError] = useState("");

  // Media form
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    title: "",
    type: "PDF" as string,
    description: "",
    isPublished: false,
  });
  // The uploaded file object — replaces the old fileUrl/fileName text inputs
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const [publishingMediaId, setPublishingMediaId] = useState<string | null>(
    null,
  );

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/courses/${courseId}`, { credentials: "include" }).then((r) =>
        r.json(),
      ),
      fetch(`/api/courses/${courseId}/lessons`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`/api/courses/${courseId}/media`, { credentials: "include" }).then(
        (r) => r.json(),
      ),
    ])
      .then(([courseData, lessonsData, mediaData]) => {
        if (courseData.error) throw new Error(courseData.error);
        setCourse({
          ...courseData,
          lessons: Array.isArray(lessonsData) ? lessonsData : [],
          media: Array.isArray(mediaData) ? mediaData : [],
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [courseId]);

  const resetMediaForm = () => {
    setMediaForm({
      title: "",
      type: "PDF",
      description: "",
      isPublished: false,
    });
    setUploadedFile(null);
    setMediaError("");
    setShowMediaForm(false);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLesson(true);
    setLessonError("");
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: lessonForm.title,
          description: lessonForm.description || null,
          duration: lessonForm.duration ? Number(lessonForm.duration) : null,
          status: lessonForm.status,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to add lesson");
      }
      setLessonForm({
        title: "",
        description: "",
        duration: "",
        status: "DRAFT",
      });
      setShowLessonForm(false);
      load();
    } catch (err: any) {
      setLessonError(err.message);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setMediaError("");

    if (!uploadedFile) {
      setMediaError("Please upload a file first.");
      return;
    }
    if (!mediaForm.title.trim()) {
      setMediaError("Please enter a title.");
      return;
    }

    setSavingMedia(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/media`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mediaForm.title,
          type: mediaForm.type,
          fileUrl: uploadedFile.url,
          fileName: uploadedFile.fileName,
          fileSize: uploadedFile.fileSize,
          description: mediaForm.description || null,
          isPublished: mediaForm.isPublished,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to add media");
      }
      resetMediaForm();
      load();
    } catch (err: any) {
      setMediaError(err.message);
    } finally {
      setSavingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm("Delete this media item?")) return;
    setDeletingMediaId(mediaId);
    setMediaError("");

    try {
      const res = await fetch(`/api/courses/${courseId}/media/${mediaId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete media");
      }
      setCourse((prev) =>
        prev
          ? { ...prev, media: prev.media.filter((item) => item.id !== mediaId) }
          : prev,
      );
    } catch (err: any) {
      setMediaError(err.message || "Failed to delete media");
    } finally {
      setDeletingMediaId(null);
    }
  };

  const handlePublishMedia = async (mediaId: string) => {
    if (
      !window.confirm(
        "Publish this video now? It will become visible to students.",
      )
    )
      return;
    setPublishingMediaId(mediaId);
    setMediaError("");

    try {
      const res = await fetch(`/api/courses/${courseId}/media/${mediaId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to publish media");
      }

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              media: prev.media.map((item) =>
                item.id === mediaId ? { ...item, isPublished: true } : item,
              ),
            }
          : prev,
      );
    } catch (err: any) {
      setMediaError(err.message || "Failed to publish media");
    } finally {
      setPublishingMediaId(null);
    }
  };

  if (loading) return <AdminSpinner />;
  if (error || !course)
    return (
      <div style={{ color: "#f87171", padding: "2rem", fontSize: "0.85rem" }}>
        ⚠️ {error || "Course not found"}
      </div>
    );

  const color = categoryColor(course.category);
  const expandedLesson =
    course.lessons.find((l) => l.id === expandedLessonId) ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* ── Header ── */}
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
            height: 100,
            background: `linear-gradient(135deg,${color}33,rgba(6,16,30,0.97))`,
            display: "flex",
            alignItems: "center",
            padding: "0 1.5rem",
            gap: "1rem",
          }}
        >
          <span style={{ fontSize: "3rem" }}>{course.icon ?? "📐"}</span>
          <div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 900,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              {course.name}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--text3)",
                fontFamily: "var(--mono)",
                marginTop: 2,
              }}
            >
              {course.courseCode}
            </div>
            {course.description && (
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text2)",
                  marginTop: 4,
                  maxWidth: 400,
                }}
              >
                {course.description}
              </div>
            )}
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Tag label={course.category} color={color} />
            <Tag
              label={course.status}
              color={course.status === "ACTIVE" ? "#22c55e" : "#f59e0b"}
            />

            {/* Quick media-type buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                alignItems: "center",
                borderLeft: "1px solid var(--border2)",
                paddingLeft: "0.65rem",
                marginLeft: "0.15rem",
              }}
            >
              {MEDIA_TYPES.map(({ type, label }) => (
                <button
                  key={type}
                  title={`Add ${type}`}
                  onClick={() => {
                    setTab("media");
                    setMediaForm((f) => ({
                      ...f,
                      type,
                      title: "",
                      description: "",
                      isPublished: false,
                    }));
                    setUploadedFile(null);
                    setShowMediaForm(true);
                    setShowLessonForm(false);
                  }}
                  style={{
                    padding: "0.32rem 0.65rem",
                    borderRadius: 7,
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    color: "var(--text2)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={onEdit}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 7,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text2)",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={onBack}
              style={{
                padding: "0.4rem 1rem",
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
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            borderTop: "1px solid var(--border2)",
          }}
        >
          {(
            [
              ["Students", course._count.enrollments, color],
              ["Lessons", course._count.lessons, "#a78bfa"],
              ["Months", course.durationMonths, "#fbbf24"],
              [
                "Reg Fee",
                `${course.registrationFee.toLocaleString()} F`,
                "#34d399",
              ],
              [
                "Training",
                `${course.trainingFee.toLocaleString()} F`,
                "#f87171",
              ],
            ] as const
          ).map(([lbl, val, col], i, arr) => (
            <div
              key={String(lbl)}
              style={{
                padding: "0.85rem",
                textAlign: "center",
                borderRight:
                  i < arr.length - 1 ? "1px solid var(--border2)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: String(col),
                  fontFamily: "var(--mono)",
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {(["lessons", "media"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setExpandedLessonId(null);
            }}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 8,
              border: `1px solid ${tab === t ? `${color}55` : "var(--border)"}`,
              background: tab === t ? `${color}18` : "var(--surface)",
              color: tab === t ? color : "var(--text3)",
              fontSize: "0.75rem",
              fontWeight: tab === t ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {t === "lessons"
              ? `📚 Lessons (${course.lessons.length})`
              : `📁 Media (${course.media.length})`}
          </button>
        ))}
      </div>

      {/* ── Lesson Content Viewer ── */}
      {tab === "lessons" && expandedLesson && (
        <div
          style={{
            background: "var(--surface)",
            border: `1px solid ${color}44`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.9rem 1.25rem",
              borderBottom: "1px solid var(--border2)",
              background: `${color}0d`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  marginBottom: 3,
                }}
              >
                Viewing Lesson
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "var(--text)",
                }}
              >
                {expandedLesson.title}
              </div>
            </div>
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: 5,
                fontSize: "0.62rem",
                fontWeight: 700,
                background:
                  expandedLesson.status === "PUBLISHED"
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(156,163,175,0.1)",
                color:
                  expandedLesson.status === "PUBLISHED" ? "#4ade80" : "#9ca3af",
                border: `1px solid ${expandedLesson.status === "PUBLISHED" ? "rgba(34,197,94,0.3)" : "rgba(156,163,175,0.2)"}`,
              }}
            >
              {expandedLesson.status}
            </span>
            {expandedLesson.duration && (
              <span style={{ fontSize: "0.68rem", color: "var(--text3)" }}>
                🕐 {expandedLesson.duration} min
              </span>
            )}
            <button
              onClick={() => setExpandedLessonId(null)}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: 7,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text2)",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>
          </div>
          {expandedLesson.description && (
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  marginBottom: "0.4rem",
                }}
              >
                Description
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text2)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {expandedLesson.description}
              </p>
            </div>
          )}
          <div style={{ padding: "1rem 1.25rem" }}>
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Resources &amp; Files ({expandedLesson.resources.length})
            </div>
            {expandedLesson.resources.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "1.5rem",
                  color: "var(--text3)",
                  fontSize: "0.8rem",
                  background: "var(--surface2)",
                  borderRadius: 10,
                  border: "1px dashed var(--border2)",
                }}
              >
                No resources attached to this lesson yet.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {expandedLesson.resources.map((r) => (
                  <a
                    key={r.id}
                    href={r.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      padding: "0.7rem 1rem",
                      borderRadius: 10,
                      background: "var(--surface2)",
                      border: "1px solid var(--border2)",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${color}18`,
                        border: `1px solid ${color}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                      }}
                    >
                      {mediaIcon(r.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "var(--text)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {r.title || r.fileName}
                      </div>
                      <div
                        style={{
                          fontSize: "0.62rem",
                          color: "var(--text3)",
                          marginTop: 2,
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {r.type}
                        {r.fileSize ? ` · ${fmtSize(r.fileSize)}` : ""}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      ↗ Open
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Lessons tab ── */}
      {tab === "lessons" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {!showLessonForm && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowLessonForm(true)}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(220,38,38,0.3)",
                }}
              >
                + Add Lesson
              </button>
            </div>
          )}

          {showLessonForm && (
            <form
              onSubmit={handleAddLesson}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#dc2626",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid var(--border2)",
                }}
              >
                New Lesson
              </div>
              {lessonError && (
                <div
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: 7,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#f87171",
                    fontSize: "0.75rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  ⚠️ {lessonError}
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Title *
                  </div>
                  <input
                    style={inp}
                    placeholder="e.g. Introduction to AutoCAD"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Duration (minutes)
                  </div>
                  <input
                    style={inp}
                    type="number"
                    min="1"
                    placeholder="e.g. 60"
                    value={lessonForm.duration}
                    onChange={(e) =>
                      setLessonForm((f) => ({ ...f, duration: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.35rem",
                  }}
                >
                  Description
                </div>
                <textarea
                  style={{ ...inp, minHeight: 70, resize: "vertical" }}
                  placeholder="What will this lesson cover?"
                  value={lessonForm.description}
                  onChange={(e) =>
                    setLessonForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.35rem",
                  }}
                >
                  Status
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setLessonForm((f) => ({ ...f, status: s }))
                      }
                      style={{
                        padding: "0.38rem 0.9rem",
                        borderRadius: 7,
                        border: `1px solid ${lessonForm.status === s ? (s === "PUBLISHED" ? "rgba(34,197,94,0.4)" : "rgba(156,163,175,0.4)") : "var(--border)"}`,
                        background:
                          lessonForm.status === s
                            ? s === "PUBLISHED"
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(156,163,175,0.1)"
                            : "transparent",
                        color:
                          lessonForm.status === s
                            ? s === "PUBLISHED"
                              ? "#4ade80"
                              : "#9ca3af"
                            : "var(--text3)",
                        fontSize: "0.72rem",
                        fontWeight: lessonForm.status === s ? 700 : 500,
                        cursor: "pointer",
                      }}
                    >
                      {s === "PUBLISHED" ? "✓ Published" : "✎ Draft"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  type="submit"
                  disabled={savingLesson}
                  style={{
                    padding: "0.55rem 1.5rem",
                    borderRadius: 8,
                    border: "none",
                    background: savingLesson
                      ? "rgba(220,38,38,0.5)"
                      : "linear-gradient(135deg,#dc2626,#b91c1c)",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: savingLesson ? "not-allowed" : "pointer",
                  }}
                >
                  {savingLesson ? "Saving…" : "Add Lesson"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLessonForm(false);
                    setLessonError("");
                  }}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    color: "var(--text2)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {course.lessons.length === 0 && !showLessonForm ? (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--text3)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
              <div style={{ fontSize: "0.82rem" }}>
                No lessons yet. Add the first one.
              </div>
            </div>
          ) : (
            course.lessons.map((lesson, i) => {
              const isExpanded = expandedLessonId === lesson.id;
              return (
                <div
                  key={lesson.id}
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${isExpanded ? `${color}55` : "var(--border)"}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "border-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.85rem 1.1rem",
                      gap: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: `${color}22`,
                        border: `1px solid ${color}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 900,
                        color,
                        fontFamily: "var(--mono)",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--text)",
                        }}
                      >
                        {lesson.title}
                      </div>
                      {lesson.description && (
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--text3)",
                            marginTop: 2,
                          }}
                        >
                          {lesson.description}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {lesson.duration && (
                        <span
                          style={{ fontSize: "0.65rem", color: "var(--text3)" }}
                        >
                          🕐 {lesson.duration}min
                        </span>
                      )}
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: 5,
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          background:
                            lesson.status === "PUBLISHED"
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(156,163,175,0.1)",
                          color:
                            lesson.status === "PUBLISHED"
                              ? "#4ade80"
                              : "#9ca3af",
                          border: `1px solid ${lesson.status === "PUBLISHED" ? "rgba(34,197,94,0.3)" : "rgba(156,163,175,0.2)"}`,
                        }}
                      >
                        {lesson.status}
                      </span>
                      <span
                        style={{ fontSize: "0.65rem", color: "var(--text3)" }}
                      >
                        {lesson.resources.length} file
                        {lesson.resources.length !== 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={() =>
                          setExpandedLessonId(isExpanded ? null : lesson.id)
                        }
                        style={{
                          padding: "0.3rem 0.75rem",
                          borderRadius: 7,
                          border: `1px solid ${isExpanded ? `${color}55` : "var(--border)"}`,
                          background: isExpanded
                            ? `${color}18`
                            : "var(--surface2)",
                          color: isExpanded ? color : "var(--text2)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isExpanded ? "▲ Hide" : "▼ View Content"}
                      </button>
                    </div>
                  </div>
                  {lesson.resources.length > 0 && (
                    <div
                      style={{
                        borderTop: "1px solid var(--border2)",
                        padding: "0.6rem 1.1rem",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                      }}
                    >
                      {lesson.resources.map((r) => (
                        <a
                          key={r.id}
                          href={r.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            padding: "0.3rem 0.65rem",
                            borderRadius: 6,
                            background: "var(--surface2)",
                            border: "1px solid var(--border2)",
                            fontSize: "0.65rem",
                            color: "var(--text2)",
                            textDecoration: "none",
                          }}
                        >
                          {mediaIcon(r.type)} {r.title || r.fileName}
                          {r.fileSize && (
                            <span style={{ color: "var(--text3)" }}>
                              ({fmtSize(r.fileSize)})
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Media tab ── */}
      {tab === "media" && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {!showMediaForm && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {MEDIA_TYPES.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      setMediaForm((f) => ({
                        ...f,
                        type,
                        title: "",
                        description: "",
                        isPublished: false,
                      }));
                      setUploadedFile(null);
                      setShowMediaForm(true);
                    }}
                    style={{
                      padding: "0.45rem 0.85rem",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text)",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowMediaForm(true)}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(220,38,38,0.3)",
                }}
              >
                + Add Media
              </button>
            </div>
          )}

          {showMediaForm && (
            <form
              onSubmit={handleAddMedia}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#dc2626",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid var(--border2)",
                }}
              >
                Add Media / File
              </div>

              {mediaError && (
                <div
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: 7,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#f87171",
                    fontSize: "0.75rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  ⚠️ {mediaError}
                </div>
              )}

              {/* ── Type selector ── */}
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.4rem",
                  }}
                >
                  Type *
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {MEDIA_TYPES.map(({ type, label }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setMediaForm((f) => ({ ...f, type }));
                        setUploadedFile(null); // reset file when type changes
                      }}
                      style={{
                        padding: "0.35rem 0.8rem",
                        borderRadius: 7,
                        border: `1px solid ${mediaForm.type === type ? `${color}55` : "var(--border)"}`,
                        background:
                          mediaForm.type === type
                            ? `${color}18`
                            : "transparent",
                        color: mediaForm.type === type ? color : "var(--text3)",
                        fontSize: "0.72rem",
                        fontWeight: mediaForm.type === type ? 700 : 500,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Title ── */}
              <div style={{ marginBottom: "0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.35rem",
                  }}
                >
                  Title *
                </div>
                <input
                  style={inp}
                  placeholder={
                    mediaForm.type === "VIDEO"
                      ? "e.g. Week 1 Lecture"
                      : mediaForm.type === "IMAGE"
                        ? "e.g. Course Banner"
                        : "e.g. Week 1 Slides"
                  }
                  value={mediaForm.title}
                  onChange={(e) =>
                    setMediaForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>

              {/* ── File uploader — switches based on type ── */}
              <div style={{ marginBottom: "0.75rem" }}>
                <MediaUploadPicker
                  type={mediaForm.type}
                  value={uploadedFile}
                  onUploaded={(f) => {
                    setUploadedFile(f);
                    // Auto-fill title from filename if title is empty
                    if (!mediaForm.title) {
                      const name = f.fileName
                        .replace(/\.[^.]+$/, "")
                        .replace(/[-_]/g, " ");
                      setMediaForm((fm) => ({ ...fm, title: name }));
                    }
                  }}
                  onRemove={() => setUploadedFile(null)}
                />
              </div>

              {/* ── Description ── */}
              <div style={{ marginBottom: "0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text3)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.35rem",
                  }}
                >
                  Description
                </div>
                <input
                  style={inp}
                  placeholder="Optional description"
                  value={mediaForm.description}
                  onChange={(e) =>
                    setMediaForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              {/* ── Publish toggle ── */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    color: "var(--text2)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={mediaForm.isPublished}
                    onChange={(e) =>
                      setMediaForm((f) => ({
                        ...f,
                        isPublished: e.target.checked,
                      }))
                    }
                  />
                  Publish immediately (visible to students)
                </label>
              </div>

              {/* ── Actions ── */}
              <div
                style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
              >
                <button
                  type="submit"
                  disabled={savingMedia || !uploadedFile}
                  style={{
                    padding: "0.55rem 1.5rem",
                    borderRadius: 8,
                    border: "none",
                    background:
                      savingMedia || !uploadedFile
                        ? "rgba(220,38,38,0.35)"
                        : "linear-gradient(135deg,#dc2626,#b91c1c)",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor:
                      savingMedia || !uploadedFile ? "not-allowed" : "pointer",
                  }}
                >
                  {savingMedia ? "Saving…" : "Save Media"}
                </button>
                <button
                  type="button"
                  onClick={resetMediaForm}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    color: "var(--text2)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                {!uploadedFile && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text3)",
                      fontStyle: "italic",
                    }}
                  >
                    Upload a file above to enable saving
                  </span>
                )}
              </div>
            </form>
          )}

          {course.media.length === 0 && !showMediaForm ? (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--text3)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📁</div>
              <div style={{ fontSize: "0.82rem" }}>
                No media yet. Use the buttons above to add videos, PDFs, or
                documents.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: "0.75rem",
              }}
            >
              {course.media.map((m) => (
                <div
                  key={m.id}
                  onClick={() => window.open(m.fileUrl, "_blank", "noreferrer")}
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    alignItems: "flex-start",
                    padding: "0.9rem 1.1rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9,
                      background: "var(--surface2)",
                      border: "1px solid var(--border2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                  >
                    {mediaIcon(m.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.title}
                    </div>
                    {m.description && (
                      <div
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--text3)",
                          marginTop: 2,
                        }}
                      >
                        {m.description}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.4rem",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--text3)",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {m.type}
                      </span>
                      {m.fileSize && (
                        <span
                          style={{ fontSize: "0.6rem", color: "var(--text3)" }}
                        >
                          {fmtSize(m.fileSize)}
                        </span>
                      )}
                      <span
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: 4,
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          background: m.isPublished
                            ? "rgba(34,197,94,0.12)"
                            : "rgba(156,163,175,0.1)",
                          color: m.isPublished ? "#4ade80" : "#9ca3af",
                        }}
                      >
                        {m.isPublished ? "Published" : "Draft"}
                      </span>
                      {m.type === "VIDEO" && !m.isPublished && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handlePublishMedia(m.id);
                          }}
                          disabled={publishingMediaId === m.id}
                          style={{
                            border: "1px solid rgba(34,197,94,0.4)",
                            borderRadius: 7,
                            background: "rgba(34,197,94,0.12)",
                            color: "#4ade80",
                            padding: "0.3rem 0.65rem",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            cursor:
                              publishingMediaId === m.id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {publishingMediaId === m.id
                            ? "Publishing…"
                            : "Publish now"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteMedia(m.id);
                        }}
                        disabled={deletingMediaId === m.id}
                        style={{
                          marginLeft:
                            m.type === "VIDEO" && !m.isPublished ? 4 : "auto",
                          border: "1px solid var(--border)",
                          borderRadius: 7,
                          background: "var(--surface2)",
                          color: "var(--text2)",
                          padding: "0.3rem 0.65rem",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          cursor:
                            deletingMediaId === m.id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {deletingMediaId === m.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page wrapper ───────────────────────────────────────────────────────────

type PageProps = { params: Promise<{ courseId: string }> };

export default function CoursePage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <AdminSpinner />;

  return (
    <CourseDetailView
      courseId={resolvedParams.courseId}
      onBack={() => router.back()}
      onEdit={() =>
        router.push(`/academy/admin/courses/${resolvedParams.courseId}/edit`)
      }
      onRefresh={() => window.location.reload()}
    />
  );
}
