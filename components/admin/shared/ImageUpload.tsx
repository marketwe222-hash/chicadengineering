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
  /** Pass aspect ratio e.g. "16/9" or "1/1" for the preview box. Default: auto */
  aspectRatio?: string;
}

const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export function ImageUpload({
  onUploaded,
  onRemove,
  value,
  label = "Image",
  disabled,
  aspectRatio,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError("");
    if (!ACCEPTED.includes(file.type)) {
      setError("Unsupported format. Please use JPEG, PNG, WebP, GIF or SVG.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File exceeds 50 MB limit.");
      return;
    }
    // Show instant local preview while uploading
    const reader = new FileReader();
    reader.onload = (e) => setLocalPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setProgress({ loaded: 0, total: file.size, percent: 0 });
    try {
      const uploaded = await uploadToR2(file, (p) => setProgress(p));
      setLocalPreview(null);
      onUploaded(uploaded);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
      setLocalPreview(null);
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

  const previewSrc = value?.url ?? localPreview;

  // ── Preview / uploaded state ──
  if (previewSrc) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {label && <div style={labelStyle}>{label}</div>}
        <div
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Image preview */}
          <div
            style={{
              position: "relative",
              aspectRatio: aspectRatio ?? "auto",
              background: "var(--surface)",
              maxHeight: 280,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 280,
                objectFit: "contain",
                display: "block",
              }}
            />
            {/* Uploading overlay */}
            {uploading && progress && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(6,16,30,0.75)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  Uploading {progress.percent}%
                </div>
                <div
                  style={{
                    width: 200,
                    height: 5,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress.percent}%`,
                      background: "linear-gradient(90deg,#34d399,#6ee7b7)",
                      borderRadius: 3,
                      transition: "width 0.2s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {fmtBytes(progress.loaded)} / {fmtBytes(progress.total)}
                </div>
              </div>
            )}
          </div>

          {/* File info bar */}
          {value && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 1rem",
                borderTop: "1px solid var(--border2)",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.78rem",
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
                    marginTop: 1,
                  }}
                >
                  {fmtBytes(value.fileSize)} · {value.fileType}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={disabled || uploading}
                  style={{
                    padding: "0.3rem 0.7rem",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text2)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  🔄 Replace
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(value.id)}
                    disabled={disabled || uploading}
                    style={{
                      padding: "0.3rem 0.7rem",
                      borderRadius: 6,
                      border: "1px solid rgba(239,68,68,0.3)",
                      background: "rgba(239,68,68,0.08)",
                      color: "#f87171",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🗑 Remove
                  </button>
                )}
              </div>
            </div>
          )}
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
          accept={ACCEPTED.join(",")}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
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
        onClick={() => !uploading && !disabled && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#34d399" : "var(--border)"}`,
          borderRadius: 12,
          padding: "2rem 1.5rem",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: dragging ? "rgba(52,211,153,0.06)" : "var(--surface2)",
          transition: "all 0.15s",
          aspectRatio: aspectRatio,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🖼️</div>
        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--text2)",
            marginBottom: "0.25rem",
          }}
        >
          Drop image here or click to browse
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--text3)" }}>
          JPEG, PNG, WebP, GIF, SVG · up to 50 MB
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
        accept={ACCEPTED.join(",")}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
