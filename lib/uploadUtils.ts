// lib/uploadUtils.ts
// Shared upload helper used by all three upload components

export interface UploadedFile {
  id: string; // R2 object key — use this to delete or replace
  url: string; // Public URL to store in DB / display
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * Uploads a file to R2 via the presigned URL API.
 * Returns an UploadedFile you can pass back to the parent.
 */
export async function uploadToR2(
  file: File,
  onProgress?: (p: UploadProgress) => void,
): Promise<UploadedFile> {
  // 1. Get presigned URL from your server
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  const { uploadUrl, publicUrl, key } = await res.json();

  // 2. Upload directly to R2 with XHR so we get progress events
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percent: Math.round((e.loaded / e.total) * 100),
          });
        }
      };
    }
    xhr.onload = () =>
      xhr.status === 200
        ? resolve()
        : reject(new Error(`Upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });

  return {
    id: key,
    url: publicUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
