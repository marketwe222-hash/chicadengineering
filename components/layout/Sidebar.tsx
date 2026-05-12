"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/lib/constants";

// ── Nav Item Type ─────────────────────────────────────────────
interface NavItem {
  label: string;
  href?: string;
  view?: string; // for state-based navigation
  icon: string;
  badge?: string | number;
}

const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "⊞" },
  { label: "My Courses", href: ROUTES.COURSES, icon: "📚" },
  { label: "Grades", href: ROUTES.GRADES, icon: "📊" },
  { label: "Attendance", href: ROUTES.ATTENDANCE, icon: "📅" },
  { label: "Profile", href: ROUTES.PROFILE, icon: "👤" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", view: "dashboard", icon: "⊞" },
  { label: "Students", view: "students", icon: "🎓" },
  { label: "Courses", view: "courses", icon: "📚" },
  { label: "Reports", view: "reports", icon: "📊" },
  { label: "Profile", href: ROUTES.PROFILE, icon: "👤" },
];

// ── Single Nav Link (Link-based for students) ─────────────────
function NavLinkStandard({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={item.href!}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-200
        group relative
        ${
          active
            ? "bg-[var(--sidebar-item-active)] text-[var(--accent-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-primary)]"
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-primary)] rounded-r-full" />
      )}

      <span
        className={`
          text-lg flex-shrink-0 transition-transform duration-200
          ${active ? "scale-110" : "group-hover:scale-110"}
        `}
      >
        {item.icon}
      </span>

      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

      {!collapsed && item.badge && (
        <span className="text-xs bg-sky-500 text-white px-1.5 py-0.5 rounded-full font-bold">
          {item.badge}
        </span>
      )}

      {collapsed && (
        <div
          className="
            absolute left-full ml-3 px-2.5 py-1.5
            glass rounded-lg text-xs font-medium
            text-[var(--text-primary)] whitespace-nowrap
            opacity-0 pointer-events-none
            group-hover:opacity-100
            transition-opacity duration-200 z-50
            shadow-lg
          "
        >
          {item.label}
          {item.badge && (
            <span className="ml-1.5 text-sky-400">({item.badge})</span>
          )}
        </div>
      )}
    </Link>
  );
}

// ── Nav Button (State-based for admin views) ──────────────────
function NavButton({
  item,
  collapsed,
  active,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-200
        group relative w-full text-left
        ${
          active
            ? "bg-[var(--sidebar-item-active)] text-[var(--accent-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-primary)]"
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-primary)] rounded-r-full" />
      )}

      <span
        className={`
          text-lg flex-shrink-0 transition-transform duration-200
          ${active ? "scale-110" : "group-hover:scale-110"}
        `}
      >
        {item.icon}
      </span>

      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

      {!collapsed && item.badge && (
        <span className="text-xs bg-sky-500 text-white px-1.5 py-0.5 rounded-full font-bold">
          {item.badge}
        </span>
      )}

      {collapsed && (
        <div
          className="
            absolute left-full ml-3 px-2.5 py-1.5
            glass rounded-lg text-xs font-medium
            text-[var(--text-primary)] whitespace-nowrap
            opacity-0 pointer-events-none
            group-hover:opacity-100
            transition-opacity duration-200 z-50
            shadow-lg
          "
        >
          {item.label}
          {item.badge && (
            <span className="ml-1.5 text-sky-400">({item.badge})</span>
          )}
        </div>
      )}
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { success } = useToast();

  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const navItems = isAdmin ? ADMIN_NAV : STUDENT_NAV;

  const displayName = isAdmin
    ? `${user?.admin?.firstName ?? ""} ${user?.admin?.lastName ?? ""}`.trim()
    : `${user?.student?.firstName ?? ""} ${user?.student?.lastName ?? ""}`.trim();

  const displaySub = isAdmin
    ? (user?.admin?.department ?? "Administrator")
    : (user?.student?.studentId ?? "");

  const profileImage = isAdmin
    ? user?.admin?.profileImage
    : user?.student?.profileImage;

  const roleBadge =
    user?.role === "SUPER_ADMIN" ? "SUPER" : isAdmin ? "ADMIN" : "STU";

  const roleBadgeStyle =
    user?.role === "SUPER_ADMIN"
      ? "bg-purple-500/15 text-purple-400"
      : isAdmin
        ? "bg-orange-500/15 text-orange-400"
        : "bg-sky-500/15 text-sky-400";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      success("Signed out", "You have been logged out successfully.");
    } finally {
      setLoggingOut(false);
    }
  };

  // ── For admin, navigate by changing query param ──────────────
  const handleAdminNav = (view: string) => {
    router.push(`/admin/dashboard?view=${view}`);
  };

  // ── Get current active view for admin ────────────────────────
  const currentView = searchParams.get("view") ?? "dashboard";

  return (
    <aside
      className={`
        relative flex flex-col h-screen flex-shrink-0
        transition-all duration-300 ease-in-out
        border-r border-[var(--sidebar-border)]
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* ── Logo + Collapse ── */}
      <div
        className={`
          flex items-center h-16 px-4 flex-shrink-0
          border-b border-[var(--sidebar-border)]
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="
                w-8 h-8 rounded-lg flex-shrink-0
                bg-gradient-to-br from-sky-500 to-orange-400
                flex items-center justify-center
                text-white font-black text-sm shadow-md
              "
            >
              CE
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                Chicad
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wide">
                {isAdmin ? "Admin Panel" : "Academy"}
              </span>
            </div>
          </Link>
        )}

        {collapsed && (
          <Link href="/">
            <div
              className="
                w-8 h-8 rounded-lg
                bg-gradient-to-br from-sky-500 to-orange-400
                flex items-center justify-center
                text-white font-black text-sm shadow-md
              "
            >
              CE
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`
            w-7 h-7 rounded-lg glass-sm
            flex items-center justify-center
            text-[var(--text-muted)] hover:text-[var(--text-primary)]
            transition-all duration-200 hover:scale-110
            ${
              collapsed
                ? "absolute -right-3.5 top-5 shadow-md border border-[var(--glass-border)]"
                : ""
            }
          `}
          aria-label={collapsed ? "Expand" : "Collapse"}
        >
          <span
            className={`text-xs transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            ◀
          </span>
        </button>
      </div>

      {/* ── User card ── */}
      <div
        className={`
          flex-shrink-0 px-3 py-4
          border-b border-[var(--sidebar-border)]
          ${collapsed ? "flex justify-center" : ""}
        `}
      >
        {collapsed ? (
          <Avatar
            src={profileImage}
            name={displayName || "User"}
            size="sm"
            online
          />
        ) : (
          <div className="glass-sm rounded-xl p-3 flex items-center gap-3">
            <Avatar
              src={profileImage}
              name={displayName || "User"}
              size="sm"
              online
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {displayName || "Loading…"}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {displaySub}
              </p>
            </div>
            <span
              className={`
                text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
                ${roleBadgeStyle}
              `}
            >
              {roleBadge}
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {!collapsed && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-disabled)] px-3 mb-2">
            {isAdmin ? "Administration" : "Student Menu"}
          </p>
        )}

        {navItems.map((item) => {
          // Admin uses view-based state navigation
          if (isAdmin && item.view) {
            const active = currentView === item.view;
            return (
              <NavButton
                key={item.view}
                item={item}
                collapsed={collapsed}
                active={active}
                onClick={() => handleAdminNav(item.view!)}
              />
            );
          }

          // Profile and student pages use normal links
          if (item.href) {
            const isDashboardItem =
              item.href === ROUTES.DASHBOARD ||
              item.href === ROUTES.ADMIN.DASHBOARD;

            const active = isDashboardItem
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <NavLinkStandard
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={active}
              />
            );
          }

          return null;
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-[var(--sidebar-border)]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-[var(--text-muted)]
            hover:bg-red-500/10 hover:text-red-400
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <span className="text-lg flex-shrink-0">
            {loggingOut ? "⏳" : "🚪"}
          </span>
          {!collapsed && (
            <span>{loggingOut ? "Signing out…" : "Sign Out"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
