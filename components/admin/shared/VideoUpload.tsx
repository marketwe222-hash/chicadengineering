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

const ACCEPTED = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/mkv",
];
const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB

export function VideoUpload({
  onUploaded,
  onRemove,
  value,
  label = "Video",
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setError("");
    if (!ACCEPTED.includes(file.type)) {
      setError("Unsupported format. Please use MP4, WebM, MOV, AVI or MKV.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File exceeds 5 GB limit.");
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

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
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
    return (
      <div style={containerStyle}>
        {label && <div style={labelStyle}>{label}</div>}
        <div
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Video preview */}
          <video
            src={value.url}
            controls
            style={{
              width: "100%",
              maxHeight: 240,
              background: "#000",
              display: "block",
            }}
          />
          {/* File info bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.65rem 1rem",
              borderTop: "1px solid var(--border2)",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🎬</span>
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
                  }}
                >
                  🗑 Remove
                </button>
              )}
            </div>
          </div>
        </div>
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

  // ── Upload state ──
  return (
    <div style={containerStyle}>
      {label && <div style={labelStyle}>{label}</div>}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#a78bfa" : uploading ? "rgba(167,139,250,0.4)" : "var(--border)"}`,
          borderRadius: 12,
          padding: "2rem 1.5rem",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          background: dragging ? "rgba(167,139,250,0.06)" : "var(--surface2)",
          transition: "all 0.15s",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎬</div>
        {uploading && progress ? (
          <>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--text2)",
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              Uploading… {progress.percent}%
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: 6,
                background: "var(--border)",
                borderRadius: 3,
                overflow: "hidden",
                maxWidth: 280,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress.percent}%`,
                  background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                  borderRadius: 3,
                  transition: "width 0.2s",
                }}
              />
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--text3)",
                marginTop: "0.5rem",
              }}
            >
              {fmtBytes(progress.loaded)} / {fmtBytes(progress.total)}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text2)",
                marginBottom: "0.25rem",
              }}
            >
              Drop video here or click to browse
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text3)" }}>
              MP4, WebM, MOV, AVI, MKV · up to 5 GB
            </div>
          </>
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
