import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Routes that require any login ──────────────────────────────
const PROTECTED_ROUTES = [
  "/academy/dashboard",
  "/profile",
  "/courses",
  "/grades",
  "/attendance",
  "/admin",
];

// ── Routes that require ADMIN or SUPER_ADMIN role ──────────────
const ADMIN_ROUTES = ["/admin"];

// ── Public academy landing — no login required ─────────────────
const PUBLIC_ACADEMY_ROUTE = "/academy";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // ── Not logged in → redirect to /academy (public landing) ──
  if (isProtected && !token) {
    const academyUrl = new URL(PUBLIC_ACADEMY_ROUTE, request.url);
    academyUrl.searchParams.set("from", pathname); // remember where they came from
    return NextResponse.redirect(academyUrl);
  }

  // ── Admin user should not land on the student dashboard ────
  if (
    token &&
    (userRole === "ADMIN" || userRole === "SUPER_ADMIN") &&
    pathname.startsWith("/academy/dashboard") &&
    pathname !== "/admin/dashboard"
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // ── Logged in but not admin → redirect to dashboard ────────
  if (isAdminRoute && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/academy/dashboard", request.url));
  }

  // ── Already logged in → skip /login page (but allow /academy) ─────
  if (pathname === "/academy/login" && token) {
    const dest =
      userRole === "ADMIN" || userRole === "SUPER_ADMIN"
        ? "/admin/dashboard"
        : "/academy/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

// ── Tell Next.js which paths this middleware runs on ───────────
export const config = {
  matcher: [
    /*
     * Match everything EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - /api routes   (handled by route handlers)
     *  - public folder files (svg, png, jpg …)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
