"use client";
import { useRef, useState } from "react";
import {
  uploadToR2,
  fmtBytes,
  UploadedFile,
  UploadProgress,
} from "@/lib/uploadUtils";

interface Props {
  onUploaded: (file: UploadedFile) => void;
  onRemove?: (id: string) => void;
  value?: UploadedFile | null;
  label?: string;
  disabled?: boolean;
}

const ACCEPTED_TYPES: Record<string, { icon: string; label: string }> = {
  "application/pdf": { icon: "📄", label: "PDF" },
  "application/msword": { icon: "📝", label: "Word" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    icon: "📝",
    label: "Word",
  },
  "application/vnd.ms-excel": { icon: "📊", label: "Excel" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    icon: "📊",
    label: "Excel",
  },
  "application/vnd.ms-powerpoint": { icon: "📑", label: "PowerPoint" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    icon: "📑",
    label: "PowerPoint",
  },
  "text/plain": { icon: "📃", label: "Text" },
  "text/csv": { icon: "📊", label: "CSV" },
};

const ACCEPTED_EXTS = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";
const MAX_SIZE = 500 * 1024 * 1024; // 500 MB

function docMeta(fileType: string) {
  return ACCEPTED_TYPES[fileType] ?? { icon: "📁", label: "File" };
}

function docColor(fileType: string) {
  if (fileType.includes("pdf"))
    return {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.25)",
      text: "#f87171",
    };
  if (fileType.includes("word") || fileType.includes("msword"))
    return {
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.25)",
      text: "#60a5fa",
    };
  if (
    fileType.includes("excel") ||
    fileType.includes("spreadsheet") ||
    fileType.includes("csv")
  )
    return {
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.25)",
      text: "#4ade80",
    };
  if (fileType.includes("powerpoint") || fileType.includes("presentation"))
    return {
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      text: "#fbbf24",
    };
  return {
    bg: "var(--surface2)",
    border: "var(--border)",
    text: "var(--text2)",
  };
}

export function DocumentUpload({
  onUploaded,
  onRemove,
  value,
  label = "Document",
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setError("");
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setError(
        "Unsupported format. Please use PDF, Word, Excel, PowerPoint, CSV or TXT.",
      );
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File exceeds 500 MB limit.");
      return;
    }
    setUploading(true);
    setProgress({ loaded: 0, total: file.size, percent: 0 });
    try {
      const uploaded = await uploadToR2(file, (p) => setProgress(p));
      onUploaded(uploaded);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.65rem",
    color: "var(--text3)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  // ── Uploaded state ──
  if (value) {
    const meta = docMeta(value.fileType);
    const col = docColor(value.fileType);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {label && <div style={labelStyle}>{label}</div>}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.85rem 1rem",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}
        >
          {/* Doc type badge */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: col.bg,
              border: `1px solid ${col.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              gap: 1,
            }}
          >
            <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>
              {meta.icon}
            </span>
            <span
              style={{
                fontSize: "0.45rem",
                fontWeight: 800,
                color: col.text,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {meta.label}
            </span>
          </div>

          {/* File info */}
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
              {value.fileName}
            </div>
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--text3)",
                marginTop: 2,
              }}
            >
              {fmtBytes(value.fileSize)} · {meta.label}
            </div>
            {/* View link */}
            <a
              href={value.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.65rem",
                color: col.text,
                fontWeight: 600,
                marginTop: "0.25rem",
                textDecoration: "none",
              }}
            >
              ↗ Open file
            </a>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text2)",
                fontSize: "0.68rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              🔄 Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(value.id)}
                disabled={disabled}
                style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: 6,
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.08)",
                  color: "#f87171",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🗑 Remove
              </button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTS}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    );
  }

  // ── Uploading state ──
  if (uploading && progress) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {label && <div style={labelStyle}>{label}</div>}
        <div
          style={{
            padding: "1.25rem 1rem",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>📤</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 2,
                }}
              >
                Uploading… {progress.percent}%
              </div>
              <div style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
                {fmtBytes(progress.loaded)} of {fmtBytes(progress.total)}
              </div>
            </div>
          </div>
          <div
            style={{
              height: 6,
              background: "var(--border)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress.percent}%`,
                background: "linear-gradient(90deg,#f59e0b,#fbbf24)",
                borderRadius: 3,
                transition: "width 0.2s",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Empty / drop zone ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {label && <div style={labelStyle}>{label}</div>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#fbbf24" : "var(--border)"}`,
          borderRadius: 12,
          padding: "1.75rem 1.5rem",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: dragging ? "rgba(251,191,36,0.06)" : "var(--surface2)",
          transition: "all 0.15s",
        }}
      >
        {/* Doc type icons row */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            marginBottom: "0.75rem",
          }}
        >
          {["📄", "📝", "📊", "📑"].map((icon) => (
            <div
              key={icon}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}
            >
              {icon}
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--text2)",
            marginBottom: "0.25rem",
          }}
        >
          Drop document here or click to browse
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--text3)" }}>
          PDF, Word, Excel, PowerPoint, CSV, TXT · up to 500 MB
        </div>
      </div>

      {error && (
        <div
          style={{
            fontSize: "0.72rem",
            color: "#f87171",
            padding: "0.4rem 0.75rem",
            background: "rgba(239,68,68,0.08)",
            borderRadius: 7,
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTS}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
