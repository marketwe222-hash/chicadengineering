import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } },
) {
  const { courseId } = params;

  // your logic here
  return NextResponse.json({ courseId });
}
