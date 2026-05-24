import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const { fileName, fileType } = await req.json();

  const key = `uploads/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    }),
    { expiresIn: 300 }, // 5 minutes — enough for large files
  );

  return NextResponse.json({
    uploadUrl: signedUrl,
    publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
    key,
  });
}
