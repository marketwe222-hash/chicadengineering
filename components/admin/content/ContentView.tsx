"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { uploadToR2 } from "@/lib/uploadUtils";

type GalleryImage = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl: string;
  altText?: string;
  isPublished: boolean;
  createdAt: string;
  admin: {
    firstName: string | null;
    lastName: string | null;
  };
};

const CATEGORY_OPTIONS = [
  "Academy",
  "Events",
  "Campus",
  "Projects",
  "Announcements",
];

export function ContentView() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academy",
    altText: "",
    file: null as File | null,
    isPublished: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom themed category select to avoid native white dropdown popup
  function CategorySelect({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function onDoc(e: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const [openUp, setOpenUp] = useState(false);

    // Compute whether dropdown should open upward based on available space
    function computeOpenDirection() {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const preferredHeight = 220; // same as maxHeight
      // open up if there's more space above or below is too small
      if (
        spaceBelow < Math.min(160, preferredHeight) &&
        spaceAbove > spaceBelow
      ) {
        setOpenUp(true);
      } else {
        setOpenUp(false);
      }
    }

    useEffect(() => {
      if (!open) return;
      computeOpenDirection();
      function onResize() {
        computeOpenDirection();
      }
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
      };
    }, [open]);

    const buttonStyle = {
      padding: "0.75rem 1rem",
      paddingRight: "2.6rem",
      borderRadius: 12,
      border: "1px solid var(--border)",
      background: "var(--surface)",
      color: "var(--text)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      cursor: disabled ? "not-allowed" : "pointer",
      textAlign: "left",
    };

    const listStyle = {
      position: "absolute",
      left: 0,
      right: 0,
      marginTop: 8,
      borderRadius: 12,
      border: "1px solid var(--border)",
      background: "rgba(2,6,23,0.6)", // semi-transparent to avoid fully obscuring content below
      backdropFilter: "blur(6px)",
      zIndex: 60,
      maxHeight: 220,
      overflow: "auto",
      boxShadow: "0 6px 18px rgba(2,6,23,0.6)",
    };

    return (
      <div ref={rootRef} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          disabled={disabled}
          style={buttonStyle as any}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </span>
          <span style={{ marginLeft: 8, opacity: 0.85 }}>
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open && (
          <ul role="listbox" style={listStyle as any}>
            {CATEGORY_OPTIONS.map((c) => (
              <li
                key={c}
                role="option"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                style={{
                  padding: "0.6rem 0.85rem",
                  cursor: "pointer",
                  color: "var(--text)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.03)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (!form.file) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(form.file);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.file]);

  async function loadGallery() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/gallery", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load gallery items.");
      const data = (await res.json()) as GalleryImage[];
      setImages(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load gallery.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!form.file) {
      setMessage("Please choose an image to upload.");
      return;
    }

    if (!form.title.trim()) {
      setMessage("Please provide a title for the gallery image.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const uploaded = await uploadToR2(form.file, (progress) => {
        setUploadProgress(progress.percent);
      });

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          altText: form.altText,
          imageUrl: uploaded.url,
          isPublished: form.isPublished,
        }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload?.error || "Failed to save gallery image.");
      }

      const created = (await res.json()) as GalleryImage;
      setImages((current) => [created, ...current]);
      setForm({
        title: "",
        description: "",
        category: "Academy",
        altText: "",
        file: null,
        isPublished: true,
      });
      if (fileInputRef.current) fileInputRef.current.value = ""; // ← add this

      setMessage("Image added to gallery.");
    } catch (error) {
      setMessage(
        (error instanceof Error
          ? error.message
          : "Upload or save failed.") as string,
      );
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery image?")) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete image.");
      setImages((current) => current.filter((image) => image.id !== id));
      setMessage("Gallery image removed.");
    } catch (error) {
      setMessage(
        (error instanceof Error ? error.message : "Delete failed.") as string,
      );
    }
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: "1.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span style={{ fontSize: "1.5rem" }}>🖼️</span>
            <div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Content Management
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>
                Manage homepage gallery images directly from the admin
                dashboard. Announcements and testimonials editing are still
                coming soon.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(280px, 1.1fr) minmax(320px, 0.9fr)",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--text)",
            }}
          >
            Add New Gallery Image
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "0.95rem" }}>
              <label
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "var(--text2)",
                }}
              >
                Image file
                <input
                  ref={fileInputRef} // ← add this
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] ?? null;
                    setForm((current) => ({ ...current, file }));
                  }}
                  disabled={submitting}
                  style={{
                    padding: "0.65rem",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                  }}
                />
              </label>
              {imagePreview && (
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    height: 180,
                    position: "relative",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <label
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "var(--text2)",
                }}
              >
                Title
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Use a descriptive title"
                  disabled={submitting}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                  }}
                />
              </label>

              <label
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "var(--text2)",
                }}
              >
                Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Optional description for the image"
                  disabled={submitting}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    resize: "vertical",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gap: "0.95rem",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <label
                  style={{
                    display: "grid",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    color: "var(--text2)",
                  }}
                >
                  Category
                  <CategorySelect
                    value={form.category}
                    onChange={(v) => setForm((c) => ({ ...c, category: v }))}
                    disabled={submitting}
                  />
                </label>

                <label
                  style={{
                    display: "grid",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    color: "var(--text2)",
                  }}
                >
                  Alt text
                  <input
                    value={form.altText}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        altText: event.target.value,
                      }))
                    }
                    placeholder="Optional alt text"
                    disabled={submitting}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                    }}
                  />
                </label>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  fontSize: "0.78rem",
                  color: "var(--text2)",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isPublished: event.target.checked,
                    }))
                  }
                  disabled={submitting}
                />
                Publish immediately
              </label>

              {uploadProgress > 0 && (
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "rgba(125,211,252,0.12)",
                  }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #38bdf8, #6366f1)",
                      transition: "width 0.2s ease",
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.95rem 1rem",
                  borderRadius: 14,
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {submitting ? "Uploading…" : "Upload to Gallery"}
              </button>

              {message && (
                <div style={{ color: "var(--text2)", fontSize: "0.85rem" }}>
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--text)",
            }}
          >
            Gallery Images
          </div>
          {loading ? (
            <div style={{ color: "var(--text2)" }}>Loading gallery…</div>
          ) : images.length === 0 ? (
            <div style={{ color: "var(--text2)" }}>
              No gallery images yet. Use the form to add the first one.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.95rem" }}>
              {images.map((image) => (
                <div
                  key={image.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: "0.9rem",
                    alignItems: "center",
                    padding: "0.95rem",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.06)",
                      position: "relative",
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText || image.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "var(--text)",
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {image.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        color: "var(--text3)",
                        fontSize: "0.75rem",
                      }}
                    >
                      <span>{image.category || "Uncategorized"}</span>
                      <span>{image.isPublished ? "Published" : "Draft"}</span>
                      <span>
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "0.45rem",
                        color: "var(--text3)",
                        fontSize: "0.78rem",
                      }}
                    >
                      Uploaded by {image.admin.firstName ?? "Admin"}{" "}
                      {image.admin.lastName ?? ""}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(image.id)}
                    style={{
                      padding: "0.55rem 0.8rem",
                      borderRadius: 12,
                      border: "1px solid rgba(220,38,38,0.18)",
                      background: "rgba(220,38,38,0.08)",
                      color: "#dc2626",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
