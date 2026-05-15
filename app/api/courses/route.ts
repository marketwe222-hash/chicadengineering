import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
