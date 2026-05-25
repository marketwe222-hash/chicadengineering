import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/academy/dashboard",
  "/profile",
  "/courses",
  "/grades",
  "/attendance",
  "/admin",
];

const ADMIN_ROUTES = ["/admin"];
const PUBLIC_ACADEMY_ROUTE = "/academy";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  // ── Allow public auth pages through FIRST before any other check ──
  if (pathname === "/admin/login") {
    if (token)
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.next();
  }

  if (pathname === "/academy/login") {
    if (token) {
      const dest =
        userRole === "ADMIN" || userRole === "SUPER_ADMIN"
          ? "/admin/dashboard"
          : "/academy/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // ── Not logged in → redirect to /academy ──────────────────────
  if (isProtected && !token) {
    const academyUrl = new URL(PUBLIC_ACADEMY_ROUTE, request.url);
    academyUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(academyUrl);
  }

  // ── Logged in but not admin → block admin routes ───────────────
  if (
    isAdminRoute &&
    token &&
    userRole !== "ADMIN" &&
    userRole !== "SUPER_ADMIN"
  ) {
    return NextResponse.redirect(new URL("/academy/dashboard", request.url));
  }

  // ── Admin landing on student dashboard → redirect to admin ─────
  if (
    token &&
    (userRole === "ADMIN" || userRole === "SUPER_ADMIN") &&
    pathname.startsWith("/academy/dashboard")
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webpo|ico|css|js)$).*)",
  ],
};
