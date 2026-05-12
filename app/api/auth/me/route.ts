import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Not authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          student: user.student,
          admin: user.admin,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[ME]", err);
    return NextResponse.json(
      { error: "Server error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
