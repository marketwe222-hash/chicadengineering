"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";
import { useDebounce } from "@/hooks/useDebounce";
import { useGallery, type GalleryItem } from "@/hooks/useGallery";

/* ─── Categories ─────────────────────────────────────────────── */
// The 5 official gallery categories. Add more here as needed.
export const GALLERY_CATEGORIES = [
  "Academy",
  "Student Projects",
  "Workshops & Training",
  "Graduations & Ceremonies",
  "Site Visits & Field Trips",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/* ─── Helpers ────────────────────────────────────────────────── */
function normalize(s: string) {
  return s.trim().toLowerCase();
}

// Shared glass style — defined once, reused via spread
const glassStyle = (bg = "rgba(14,111,168,0.12)"): React.CSSProperties => ({
  background: bg,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(125,211,252,0.18)",
  boxShadow:
    "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
});

/* ─── Category accent colours ───────────────────────────────── */
// Each category gets a unique pill colour + icon for the filter bar and card badge.
const CATEGORY_ACCENTS: Record<
  string,
  { bg: string; border: string; text: string; icon: string }
> = {
  All: {
    bg: "rgba(14,111,168,0.38)",
    border: "rgba(125,211,252,0.55)",
    text: "#7dd3fc",
    icon: "✦",
  },
  Academy: {
    bg: "rgba(14,111,168,0.38)",
    border: "rgba(125,211,252,0.55)",
    text: "#7dd3fc",
    icon: "🏫",
  },
  "Student Projects": {
    bg: "rgba(99,102,241,0.38)",
    border: "rgba(165,180,252,0.55)",
    text: "#a5b4fc",
    icon: "📐",
  },
  "Workshops & Training": {
    bg: "rgba(234,179,8,0.30)",
    border: "rgba(253,224,71,0.50)",
    text: "#fde047",
    icon: "🛠️",
  },
  "Graduations & Ceremonies": {
    bg: "rgba(234,88,12,0.32)",
    border: "rgba(253,186,116,0.55)",
    text: "#fdba74",
    icon: "🎓",
  },
  "Site Visits & Field Trips": {
    bg: "rgba(22,163,74,0.30)",
    border: "rgba(134,239,172,0.50)",
    text: "#86efac",
    icon: "🏗️",
  },
};

/* ─── Gallery Card ───────────────────────────────────────────── */
const GalleryCard = ({
  item,
  priority,
  onClick,
}: {
  item: GalleryItem;
  priority: boolean;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const accent =
    CATEGORY_ACCENTS[item.category ?? ""] ?? CATEGORY_ACCENTS["Academy"];

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Open image: ${item.title}`}
      style={{
        borderRadius: "1.25rem",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        willChange: "transform",
        border: "1px solid rgba(125,211,252,0.18)",
        boxShadow: hovered
          ? "0 16px 56px rgba(5,20,40,0.70)"
          : "0 4px 24px rgba(5,20,40,0.55)",
        background: "rgba(7,24,40,0.55)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "65%",
          overflow: "hidden",
        }}
      >
        {item.src ? (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            style={{
              objectFit: "cover",
              transition: "transform 0.45s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(7,24,40,0.65)",
              color: "rgba(255,255,255,0.85)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <span>No image available</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,20,40,0.65) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Category badge */}
        {item.category && (
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              padding: "0.3rem 0.65rem",
              borderRadius: "999px",
              background: "rgba(7,24,40,0.78)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: `1px solid ${accent.border}`,
              fontSize: "0.62rem",
              fontWeight: 800,
              color: accent.text,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <span style={{ fontSize: "0.7rem" }}>{accent.icon}</span>
            {item.category}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "1rem 1.1rem 1.15rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "0.9rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {item.title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.25s ease",
            flexShrink: 0,
          }}
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </div>
    </article>
  );
};

/* ─── Lightbox ───────────────────────────────────────────────── */
const Lightbox = ({
  item,
  total,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  total: number;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const accent =
    CATEGORY_ACCENTS[item.category ?? ""] ?? CATEGORY_ACCENTS["Academy"];

  const navBtnStyle: React.CSSProperties = {
    width: "2.75rem",
    height: "2.75rem",
    borderRadius: "50%",
    border: "1px solid rgba(125,211,252,0.28)",
    background: "rgba(7,24,40,0.72)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.2s ease, border-color 0.2s ease",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image lightbox: ${item.title}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(5,14,28,0.88)",
        backdropFilter: "blur(14px) saturate(150%)",
        WebkitBackdropFilter: "blur(14px) saturate(150%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(960px, 96vw)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          ...glassStyle("rgba(7,24,40,0.80)"),
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(125,211,252,0.12)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "1rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.title}
            </p>
            {item.category && (
              <p
                style={{
                  margin: "0.15rem 0 0",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: accent.text,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <span>{accent.icon}</span>
                {item.category}
              </p>
            )}
          </div>

          {/* Nav + close */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                marginRight: "0.25rem",
              }}
            >
              {currentIndex + 1} / {total}
            </span>
            <button
              onClick={onPrev}
              aria-label="Previous image"
              style={navBtnStyle}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={onNext}
              aria-label="Next image"
              style={navBtnStyle}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              onClick={onClose}
              aria-label="Close lightbox"
              style={{
                ...navBtnStyle,
                marginLeft: "0.25rem",
                borderColor: "rgba(239,68,68,0.35)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "min(68vh, 600px)",
            background: "rgba(5,14,28,0.50)",
          }}
        >
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Hint */}
      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.72rem",
          color: "rgba(125,211,252,0.45)",
          fontWeight: 600,
          letterSpacing: "0.06em",
          userSelect: "none",
        }}
      >
        ← → to navigate · ESC to close · click outside to dismiss
      </p>
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────── */
export default function GalleryPage() {
  const router = useRouter();
  const [rawQuery, setRawQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const query = useDebounce(rawQuery, 180);

  const { gallery, pagination, isLoading, error } = useGallery({
    page,
    pageSize: 12,
    search: query,
    category: activeCategory === "All" ? undefined : activeCategory,
  });

  const categories = useMemo(
    () => ["All", ...Array.from(GALLERY_CATEGORIES)],
    [],
  );

  useEffect(() => {
    setPage(1);
  }, [query, activeCategory]);

  const selectedIndex = useMemo(
    () => gallery.findIndex((item) => item.id === selectedId),
    [gallery, selectedId],
  );

  const selectedItem = selectedIndex >= 0 ? gallery[selectedIndex] : null;

  const openItem = useCallback((id: string) => setSelectedId(id), []);
  const closeLightbox = useCallback(() => setSelectedId(null), []);

  const goNext = useCallback(() => {
    if (selectedIndex < gallery.length - 1)
      setSelectedId(gallery[selectedIndex + 1].id);
  }, [selectedIndex, gallery]);

  const goPrev = useCallback(() => {
    if (selectedIndex > 0) setSelectedId(gallery[selectedIndex - 1].id);
  }, [selectedIndex, gallery]);

  // "/" shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        {/* ── Background (matches ProgrammesPage exactly) ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url(/images/hero-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.38,
            zIndex: -2,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(14,111,168,0.20) 0%, transparent 60%), linear-gradient(145deg, rgba(7,24,40,0.75) 0%, rgba(10,34,54,0.70) 40%, rgba(6,14,24,0.80) 100%)",
            zIndex: -1,
          }}
        />

        <Header onSignIn={() => router.push("/academy/login")} />

        {/* ── HERO ── */}
        <section
          style={{
            padding: "7rem clamp(1.5rem, 5vw, 3rem) 4rem",
            borderBottom: "1px solid rgba(125,211,252,0.10)",
          }}
        >
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#7dd3fc",
                textTransform: "uppercase",
                margin: "0 0 0.85rem",
              }}
            >
              Gallery
            </p>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 900,
                margin: "0 0 1.5rem",
                color: "var(--text-primary)",
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                maxWidth: "700px",
              }}
            >
              Showcasing{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #7dd3fc 0%, #6366f1 50%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Our Work
              </span>
            </h1>

            {/* Search + stats row */}
            <div
              className="hero-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                A curated collection of projects, events, and highlights from
                the Academy.{" "}
                <span style={{ color: "#7dd3fc", fontWeight: 700 }}>
                  {pagination.total} items
                </span>{" "}
                across{" "}
                <span style={{ color: "#7dd3fc", fontWeight: 700 }}>
                  {categories.length - 1} categories
                </span>
                .
              </p>

              {/* Search */}
              <div style={{ position: "relative", minWidth: "260px" }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(125,211,252,0.55)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchRef}
                  value={rawQuery}
                  onChange={(e) => setRawQuery(e.target.value)}
                  placeholder="Search… ( / )"
                  aria-label="Search gallery"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.95rem 0.75rem 2.5rem",
                    borderRadius: "0.8rem",
                    border: "1px solid rgba(125,211,252,0.22)",
                    background: "rgba(14,111,168,0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    outline: "none",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.55)";
                    e.currentTarget.style.background = "rgba(14,111,168,0.20)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.22)";
                    e.currentTarget.style.background = "rgba(14,111,168,0.12)";
                  }}
                />
                {rawQuery && (
                  <button
                    onClick={() => setRawQuery("")}
                    aria-label="Clear search"
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(125,211,252,0.55)",
                      display: "flex",
                      padding: "0.1rem",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section style={{ padding: "4rem clamp(1.5rem, 5vw, 3rem) 6rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Category filters */}
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
                marginBottom: "2.5rem",
              }}
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((cat) => {
                const active = cat === activeCategory;
                const accent = CATEGORY_ACCENTS[cat] ?? CATEGORY_ACCENTS["All"];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={active}
                    style={{
                      padding: "0.5rem 1.1rem",
                      borderRadius: "999px",
                      border: active
                        ? `1px solid ${accent.border}`
                        : "1px solid rgba(125,211,252,0.18)",
                      background: active ? accent.bg : "rgba(14,111,168,0.10)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      color: active ? "#fff" : "rgba(255,255,255,0.72)",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.02em",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      if (!active)
                        e.currentTarget.style.borderColor = accent.border;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      if (!active)
                        e.currentTarget.style.borderColor =
                          "rgba(125,211,252,0.18)";
                    }}
                  >
                    <span aria-hidden="true">{accent.icon}</span>
                    {cat}
                  </button>
                );
              })}

              {/* Results count */}
              {(query || activeCategory !== "All") && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    alignSelf: "center",
                  }}
                >
                  {pagination.total} result{pagination.total !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {error && (
              <div
                style={{
                  ...glassStyle("rgba(220,38,38,0.10)"),
                  borderRadius: "1.25rem",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  Unable to load gallery
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {isLoading && gallery.length === 0 && (
              <div
                style={{
                  ...glassStyle("rgba(14,111,168,0.10)"),
                  borderRadius: "1.25rem",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  Loading gallery…
                </p>
              </div>
            )}

            {pagination.total === 0 && !isLoading && !error && (
              <div
                style={{
                  ...glassStyle("rgba(14,111,168,0.10)"),
                  borderRadius: "1.25rem",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  No images found
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Try a different search term or category.
                </p>
                <button
                  onClick={() => {
                    setRawQuery("");
                    setActiveCategory("All");
                  }}
                  style={{
                    marginTop: "1.25rem",
                    padding: "0.65rem 1.4rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(125,211,252,0.28)",
                    background: "rgba(14,111,168,0.18)",
                    color: "#7dd3fc",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {pagination.total > 0 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.25rem",
                  }}
                >
                  {gallery.map((item, i) => (
                    <GalleryCard
                      key={item.id}
                      item={item}
                      priority={i < 6}
                      onClick={() => openItem(item.id)}
                    />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      marginTop: "2rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontWeight: 700,
                      }}
                    >
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                        disabled={!pagination.hasPrev}
                        style={{
                          padding: "0.75rem 1.25rem",
                          borderRadius: "0.75rem",
                          border: "1px solid rgba(125,211,252,0.20)",
                          background: "rgba(14,111,168,0.14)",
                          color: "#fff",
                          fontWeight: 700,
                          cursor: pagination.hasPrev
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setPage((current) =>
                            Math.min(pagination.totalPages, current + 1),
                          )
                        }
                        disabled={!pagination.hasNext}
                        style={{
                          padding: "0.75rem 1.25rem",
                          borderRadius: "0.75rem",
                          border: "1px solid rgba(125,211,252,0.20)",
                          background: "rgba(14,111,168,0.14)",
                          color: "#fff",
                          fontWeight: 700,
                          cursor: pagination.hasNext
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>

      {/* ── Lightbox (portal-like, rendered outside layout) ── */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          total={gallery.length}
          currentIndex={selectedIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 5rem; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }

        /* Search input placeholder */
        input::placeholder { color: rgba(125,211,252,0.40); }
      `}</style>
    </>
  );
}
