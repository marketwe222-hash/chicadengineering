"use client";

import { useEffect, useState } from "react";
import { CourseLogo } from "@/components/ui/CourseLogo";

// ── Types ──────────────────────────────────────────────────────────────────

interface CourseMedia {
  id: string;
  type: "VIDEO" | "PDF" | "DOCUMENT" | "IMAGE";
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  isPublished: boolean;
  order: number;
}

interface CourseInfo {
  id: string;
  name: string;
  icon: string;
  logoImage?: string | null;
  color: string;
  category: string;
}

interface Props {
  course: CourseInfo;
  onBack: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const TYPE_META: Record<
  CourseMedia["type"],
  { icon: string; label: string; accent: string }
> = {
  VIDEO: { icon: "🎬", label: "Video", accent: "#818cf8" },
  PDF: { icon: "📄", label: "PDF", accent: "#f87171" },
  DOCUMENT: { icon: "📝", label: "Document", accent: "#34d399" },
  IMAGE: { icon: "🖼️", label: "Image", accent: "#fbbf24" },
};

const ALL_TYPES: CourseMedia["type"][] = ["VIDEO", "PDF", "DOCUMENT", "IMAGE"];

// ── Component ──────────────────────────────────────────────────────────────

export default function CourseResourcesView({ course, onBack }: Props) {
  const [media, setMedia] = useState<CourseMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<CourseMedia["type"] | "ALL">("ALL");
  const [selectedVideo, setSelectedVideo] = useState<CourseMedia | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/courses/${course.id}/media`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load resources");
        return r.json();
      })
      .then((d: CourseMedia[]) => {
        // Only show published media to students
        setMedia(Array.isArray(d) ? d.filter((m) => m.isPublished) : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [course.id]);

  const typesPresent = ALL_TYPES.filter((t) => media.some((m) => m.type === t));

  const visible =
    filter === "ALL" ? media : media.filter((m) => m.type === filter);

  const counts = Object.fromEntries(
    ALL_TYPES.map((t) => [t, media.filter((m) => m.type === t).length]),
  ) as Record<CourseMedia["type"], number>;

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* ── Header ── */}
      <div className="glass" style={{ overflow: "hidden" }}>
        {/* Banner */}
        <div
          style={{
            height: 88,
            background: `linear-gradient(135deg, color-mix(in srgb, ${course.color} 22%, transparent), var(--overlay-heavy))`,
            display: "flex",
            alignItems: "center",
            padding: "0 1.4rem",
            gap: "1rem",
            borderBottom: "1px solid var(--glass-border-subtle)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CourseLogo
              logoImage={course.logoImage}
              icon={course.icon}
              size={48}
              style={{
                background: `color-mix(in srgb, ${course.color} 18%, transparent)`,
                border: `1px solid color-mix(in srgb, ${course.color} 35%, transparent)`,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                color: course.color,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.2rem",
              }}
            >
              {course.category} · Course Resources
            </p>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {course.name}
            </h2>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "0.42rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--glass-border)",
              background: "var(--glass-bg-subtle)",
              color: "var(--text-secondary)",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            ← Back
          </button>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid var(--glass-border-subtle)",
          }}
        >
          {[
            ["Total Files", media.length, course.color],
            ["Videos", counts.VIDEO, "#818cf8"],
            ["PDFs", counts.PDF, "#f87171"],
            ["Docs", counts.DOCUMENT, "#34d399"],
            ["Images", counts.IMAGE, "#fbbf24"],
          ].map(([label, val, col], i, arr) => (
            <div
              key={String(label)}
              style={{
                flex: 1,
                padding: "0.7rem 0.5rem",
                textAlign: "center",
                borderRight:
                  i < arr.length - 1
                    ? "1px solid var(--glass-border-subtle)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: String(col),
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "0.52rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                  marginTop: 3,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div
          className="glass"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "3px solid var(--glass-border)",
              borderTopColor: course.color,
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 0.75rem",
            }}
          />
          <p style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)" }}>
            Loading resources…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && error && (
        <div
          className="glass"
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--error-text)",
            fontSize: "0.82rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── Filter pills ── */}
      {!loading && !error && media.length > 0 && (
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {(["ALL", ...typesPresent] as const).map((t) => {
            const active = filter === t;
            const meta = t !== "ALL" ? TYPE_META[t] : null;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: "0.38rem 0.9rem",
                  borderRadius: "2rem",
                  border: active
                    ? `1px solid color-mix(in srgb, ${meta?.accent ?? course.color} 50%, transparent)`
                    : "1px solid var(--glass-border-subtle)",
                  background: active
                    ? `color-mix(in srgb, ${meta?.accent ?? course.color} 14%, transparent)`
                    : "var(--glass-bg-subtle)",
                  color: active
                    ? (meta?.accent ?? course.color)
                    : "var(--text-secondary)",
                  fontSize: "0.72rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                {meta ? `${meta.icon} ${meta.label}` : "🗂 All"}
                <span
                  style={{
                    fontSize: "0.62rem",
                    opacity: 0.7,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t === "ALL" ? media.length : counts[t]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && media.length === 0 && (
        <div
          className="glass"
          style={{
            padding: "3.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "0.65rem" }}>📭</div>
          <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            No resources published yet
          </p>
          <p
            style={{
              fontSize: "0.72rem",
              marginTop: "0.3rem",
              color: "var(--text-muted)",
            }}
          >
            Check back later — your instructor will add materials here.
          </p>
        </div>
      )}

      {/* ── Media grid ── */}
      {!loading && !error && visible.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {visible.map((m, i) => {
            const meta = TYPE_META[m.type];
            const isVideo = m.type === "VIDEO";
            const commonStyle = {
              display: "flex",
              gap: "0.9rem",
              alignItems: "flex-start",
              padding: "1rem 1.1rem",
              borderRadius: 14,
              transition:
                "transform var(--transition-base), box-shadow var(--transition-base)",
              animationDelay: `${i * 40}ms`,
              width: "100%",
              textAlign: "left" as const,
              background: "transparent",
              border: "none",
            };

            const sharedProps = {
              className: "glass",
              style: {
                ...commonStyle,
                textDecoration: "none",
                cursor: isVideo ? "pointer" : "auto",
              },
              onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
              },
              onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              },
            };

            const content = (
              <>
                {/* Icon badge */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: `color-mix(in srgb, ${meta.accent} 14%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${meta.accent} 30%, transparent)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    flexShrink: 0,
                  }}
                >
                  {meta.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      color: meta.accent,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {meta.label}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.2rem",
                      minWidth: 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        margin: 0,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {m.title}
                    </p>
                    {isVideo && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: "var(--surface)",
                          background: meta.accent,
                          borderRadius: 999,
                          padding: "0.2rem 0.5rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Play
                      </span>
                    )}
                  </div>
                  {m.description && (
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.3rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {m.fileSize && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {fmtSize(m.fileSize)}
                      </span>
                    )}
                    {m.fileName && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          color: "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 120,
                        }}
                      >
                        {m.fileName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Open arrow */}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: meta.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: 2,
                    opacity: 0.8,
                  }}
                >
                  {isVideo ? "▶" : "↗"}
                </div>
              </>
            );

            return isVideo ? (
              <button
                key={m.id}
                {...sharedProps}
                type="button"
                onClick={() => setSelectedVideo(m)}
              >
                {content}
              </button>
            ) : (
              <a
                key={m.id}
                {...sharedProps}
                href={m.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            );
          })}
        </div>
      )}

      {selectedVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--overlay-heavy)", // ← was "--var(--overlay-heavy)"
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 1000,
            padding: "0.5rem 1.5rem 1.5rem",
            pointerEvents: "auto",
          }}
          onClick={() => setSelectedVideo(null)} // ← click outside to close ✓
        >
          <div
            style={{
              position: "relative",
              zIndex: 10000,
              width: "100%",
              maxWidth: 960,
              background: "var(--glass-bg-strong)", // ← was var(--surface)
              backdropFilter: "var(--glass-blur)",
              WebkitBackdropFilter: "var(--glass-blur)",
              border: "1px solid var(--glass-border)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "var(--glass-shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.95rem 1rem",
                background: "var(--overlay-heavy)", // ← was var(--surface2)
                borderBottom: "1px solid var(--glass-border)", // ← was var(--border)
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {selectedVideo.title}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  Video preview
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text-muted)", // ← was var(--text3)
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <video
              src={selectedVideo.fileUrl}
              controls
              autoPlay
              style={{
                width: "100%",
                maxHeight: "calc(100vh - 140px)",
                background: "#000", // ← was "--var(--surface)"
                display: "block",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
