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

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024; // 100MB threshold

/**
 * Uploads a file to R2 via the presigned URL API (for files < 100MB).
 * Returns an UploadedFile you can pass back to the parent.
 */
export async function uploadToR2(
  file: File,
  onProgress?: (p: UploadProgress) => void,
): Promise<UploadedFile> {
  // Use chunked upload for large files
  if (file.size > LARGE_FILE_THRESHOLD) {
    return uploadChunked(file, onProgress);
  }

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

/**
 * Uploads large files (>100MB) in chunks to minimize network failure risk.
 * Automatically retries failed chunks.
 */
async function uploadChunked(
  file: File,
  onProgress?: (p: UploadProgress) => void,
): Promise<UploadedFile> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedBytes = 0;

  // Step 1: Initialize multipart upload
  const initRes = await fetch("/api/upload/chunked", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "init",
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!initRes.ok) {
    throw new Error("Failed to initialize chunked upload");
  }

  const { sessionId, key, publicUrl } = await initRes.json();

  try {
    // Step 2: Upload each chunk sequentially with retry logic
    for (let chunkNum = 1; chunkNum <= totalChunks; chunkNum++) {
      const start = (chunkNum - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Retry logic for failed chunks
      let retries = 3;
      let lastError: Error | null = null;

      while (retries > 0) {
        try {
          // Convert chunk to base64 for JSON transmission
          const arrayBuffer = await chunk.arrayBuffer();
          const base64 = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer)),
          );

          const uploadRes = await fetch("/api/upload/chunked", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "upload",
              uploadSessionId: sessionId,
              chunkNumber: chunkNum,
              chunkData: base64,
            }),
          });

          if (!uploadRes.ok) {
            throw new Error(
              `Chunk ${chunkNum} upload failed: ${uploadRes.status}`,
            );
          }

          await uploadRes.json();
          uploadedBytes += chunk.size;

          // Report progress
          if (onProgress) {
            onProgress({
              loaded: uploadedBytes,
              total: file.size,
              percent: Math.round((uploadedBytes / file.size) * 100),
            });
          }

          break; // Success, move to next chunk
        } catch (err) {
          lastError = err as Error;
          retries--;

          if (retries > 0) {
            // Wait before retrying (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (4 - retries)),
            );
          }
        }
      }

      if (retries === 0 && lastError) {
        // Failed after all retries
        await abortChunkedUpload(sessionId);
        throw new Error(
          `Failed to upload chunk ${chunkNum} after 3 retries: ${lastError.message}`,
        );
      }
    }

    // Step 3: Complete multipart upload
    const completeRes = await fetch("/api/upload/chunked", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Id": sessionId,
      },
      body: JSON.stringify({
        action: "complete",
        uploadSessionId: sessionId,
      }),
    });

    if (!completeRes.ok) {
      throw new Error("Failed to complete upload");
    }

    return {
      id: key,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    };
  } catch (err) {
    // Abort upload on failure
    await abortChunkedUpload(sessionId).catch(() => {});
    throw err;
  }
}

/**
 * Aborts an ongoing chunked upload
 */
async function abortChunkedUpload(sessionId: string): Promise<void> {
  try {
    await fetch("/api/upload/chunked", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "abort",
        uploadSessionId: sessionId,
      }),
    });
  } catch (err) {
    console.error("Failed to abort upload:", err);
  }
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
