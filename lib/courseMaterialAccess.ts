import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

type CourseMaterialAccess =
  | { ok: true; user: CurrentUser }
  | { ok: false; response: NextResponse };

export async function getCourseMaterialAccess(): Promise<CourseMaterialAccess> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "private, no-store" } },
      ),
    };
  }

  if (user.role === "STUDENT" && user.student?.status === "WITHDRAWN") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Course materials are unavailable for this account." },
        { status: 403, headers: { "Cache-Control": "private, no-store" } },
      ),
    };
  }

  return { ok: true, user };
}

export async function getCourseAdminAccess(): Promise<CourseMaterialAccess> {
  const access = await getCourseMaterialAccess();
  if (!access.ok) return access;

  if (
    access.user.role !== "ADMIN" &&
    access.user.role !== "SUPER_ADMIN"
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: { "Cache-Control": "private, no-store" } },
      ),
    };
  }

  return access;
}
