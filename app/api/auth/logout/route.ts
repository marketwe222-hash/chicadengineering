import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("[LOGOUT]", err);
    return NextResponse.json(
      { error: "Server error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
