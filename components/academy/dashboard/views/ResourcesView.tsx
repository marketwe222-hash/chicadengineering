"use client";

import Tag from "@/components/ui/Tag";

interface Resource {
  name: string;
  type: "PDF" | "ZIP";
  size: string;
  course: string;
  color: string;
}

const RESOURCES: Resource[] = [
  {
    name: "AutoCAD Cheat Sheet.pdf",
    type: "PDF",
    size: "1.2 MB",
    course: "AutoCAD",
    color: "var(--error-text)",
  },
  {
    name: "3D Modeling Reference.pdf",
    type: "PDF",
    size: "3.4 MB",
    course: "AutoCAD",
    color: "var(--error-text)",
  },
  {
    name: "ArchiCAD Object Library",
    type: "ZIP",
    size: "12 MB",
    course: "ArchiCAD",
    color: "var(--accent-primary)",
  },
  {
    name: "BIM Standards Guide.pdf",
    type: "PDF",
    size: "2.1 MB",
    course: "ArchiCAD",
    color: "var(--accent-primary)",
  },
  {
    name: "CHICAD Challenge Brief.pdf",
    type: "PDF",
    size: "0.8 MB",
    course: "General",
    color: "var(--warning-text)",
  },
];

export default function ResourcesView() {
  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Downloads · Guides &amp; Materials
        </p>
        <Tag label={`${RESOURCES.length} files`} color="var(--sky)" />
      </div>

      <div className="glass" style={{ overflow: "hidden" }}>
        {RESOURCES.map((r, i) => (
          <div
            key={r.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
              padding: "0.85rem 1.1rem",
              borderBottom:
                i < RESOURCES.length - 1
                  ? "1px solid var(--glass-border-subtle)"
                  : "none",
              transition: "background var(--transition-base)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "var(--sidebar-item-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "transparent")
            }
          >
            {/* File type icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `color-mix(in srgb, ${r.color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${r.color} 28%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              {r.type === "PDF" ? "📄" : "🗜️"}
            </div>

            {/* File info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "0.15rem",
                }}
              >
                {r.name}
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span
                  style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}
                >
                  {r.course}
                </span>
                <span
                  style={{ fontSize: "0.5rem", color: "var(--text-muted)" }}
                >
                  •
                </span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {r.size}
                </span>
                <Tag label={r.type} color={r.color} />
              </div>
            </div>

            {/* Download button */}
            <button
              className="btn-secondary"
              style={{
                padding: "0.35rem 0.75rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ⬇ Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
