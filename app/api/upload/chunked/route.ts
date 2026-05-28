import { NextRequest, NextResponse } from "next/server";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

const activeUploads: Record<
  string,
  {
    uploadId: string;
    key: string;
    parts: Array<{ ETag: string; PartNumber: number }>;
  }
> = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ── INIT: start multipart upload, return uploadId + sessionId
    if (action === "init") {
      const { fileName, fileType } = body;
      const key = `uploads/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

      const cmd = new CreateMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: fileType,
      });
      const { UploadId } = await r2.send(cmd);

      const sessionId = crypto.randomUUID();
      activeUploads[sessionId] = { uploadId: UploadId!, key, parts: [] };

      return NextResponse.json({
        sessionId,
        uploadId: UploadId,
        key,
        publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
      });
    }

    // ── PRESIGN: return a presigned PUT URL for one chunk
    if (action === "presign") {
      const { uploadSessionId, chunkNumber } = body;
      const session = activeUploads[uploadSessionId];
      if (!session)
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );

      const cmd = new UploadPartCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: session.key,
        UploadId: session.uploadId,
        PartNumber: chunkNumber,
      });

      // URL valid for 1 hour — browser uploads directly to R2
      const presignedUrl = await getSignedUrl(r2, cmd, { expiresIn: 3600 });

      return NextResponse.json({ presignedUrl });
    }

    // ── RECORD_PART: store the ETag returned by R2 after a direct PUT
    if (action === "record_part") {
      const { uploadSessionId, chunkNumber, etag } = body;
      const session = activeUploads[uploadSessionId];
      if (!session)
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );

      session.parts.push({ ETag: etag, PartNumber: chunkNumber });
      session.parts.sort((a, b) => a.PartNumber - b.PartNumber);

      return NextResponse.json({ success: true });
    }

    // ── COMPLETE: finish the multipart upload
    if (action === "complete") {
      const { uploadSessionId } = body;
      const session = activeUploads[uploadSessionId];
      if (!session)
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );

      const cmd = new CompleteMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: session.key,
        UploadId: session.uploadId,
        MultipartUpload: { Parts: session.parts },
      });
      await r2.send(cmd);

      const { key, uploadId: _uid } = session;
      delete activeUploads[uploadSessionId];

      return NextResponse.json({
        success: true,
        key,
        publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
      });
    }

    // ── ABORT
    if (action === "abort") {
      const { uploadSessionId } = body;
      const session = activeUploads[uploadSessionId];
      if (session) {
        await r2.send(
          new AbortMultipartUploadCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: session.key,
            UploadId: session.uploadId,
          }),
        );
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
