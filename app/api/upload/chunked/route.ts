import { NextRequest, NextResponse } from "next/server";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

// Store active multipart uploads in memory (in production, use a database/cache)
const activeUploads: Record<
  string,
  {
    uploadId: string;
    key: string;
    parts: Array<{ ETag: string; PartNumber: number }>;
  }
> = {};

/**
 * Chunked upload API for large files
 * Supports three actions: init, upload, complete
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    // ── INIT: Start multipart upload
    if (action === "init") {
      const { fileName, fileType } = body;
      const key = `uploads/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

      const initCmd = new CreateMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: fileType,
      });

      const uploadData = await r2.send(initCmd);

      const sessionId = Math.random().toString(36).substr(2, 9);
      activeUploads[sessionId] = {
        uploadId: uploadData.UploadId!,
        key,
        parts: [],
      };

      return NextResponse.json({
        sessionId,
        uploadId: uploadData.UploadId,
        key,
        publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
      });
    }

    // ── UPLOAD: Upload a chunk
    if (action === "upload") {
      const { uploadSessionId, chunkNumber, chunkData } = body;
      const session = activeUploads[uploadSessionId];

      if (!session) {
        return NextResponse.json(
          { error: "Upload session not found" },
          { status: 404 },
        );
      }

      if (!chunkNumber || !chunkData) {
        return NextResponse.json(
          { error: "Chunk number or data not provided" },
          { status: 400 },
        );
      }

      // Decode base64 to buffer
      const chunkBuffer = Buffer.from(chunkData, "base64");

      const uploadCmd = new UploadPartCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: session.key,
        UploadId: session.uploadId,
        PartNumber: chunkNumber,
        Body: chunkBuffer,
      });

      const uploadData = await r2.send(uploadCmd);

      // Store part info for completion
      session.parts.push({
        ETag: uploadData.ETag!,
        PartNumber: chunkNumber,
      });

      // Sort by part number
      session.parts.sort((a, b) => a.PartNumber - b.PartNumber);

      return NextResponse.json({
        success: true,
        chunkNumber,
        etag: uploadData.ETag,
      });
    }

    // ── COMPLETE: Finish multipart upload
    if (action === "complete") {
      const { uploadSessionId } = body;
      const session = activeUploads[uploadSessionId];

      if (!session) {
        return NextResponse.json(
          { error: "Upload session not found" },
          { status: 404 },
        );
      }

      const completeCmd = new CompleteMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: session.key,
        UploadId: session.uploadId,
        MultipartUpload: {
          Parts: session.parts,
        },
      });

      await r2.send(completeCmd);

      // Clean up session
      delete activeUploads[uploadSessionId];

      return NextResponse.json({
        success: true,
        key: session.key,
        publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${session.key}`,
      });
    }

    // ── ABORT: Cancel multipart upload
    if (action === "abort") {
      const { uploadSessionId } = body;
      const session = activeUploads[uploadSessionId];

      if (session) {
        const abortCmd = new AbortMultipartUploadCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: session.key,
          UploadId: session.uploadId,
        });

        await r2.send(abortCmd);
        delete activeUploads[uploadSessionId];
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[CHUNKED_UPLOAD]", err);
    return NextResponse.json(
      { error: "Upload failed", details: String(err) },
      { status: 500 },
    );
  }
}
