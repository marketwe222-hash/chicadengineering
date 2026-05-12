"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Avatar } from "@/components/ui/Avatar";

// ── Nav Item Type ─────────────────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
}

const ADMIN_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "students", label: "Students", icon: "🎓" },
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "reports", label: "Reports", icon: "📊" },
];

// ── Single Nav Link ───────────────────────────────────────────
function NavLink({
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
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-sm font-medium transition-all duration-200
        group relative text-left
        ${
          active
            ? "bg-[var(--sidebar-item-active)] text-[var(--accent-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:bg-[var(--sidebar-item-hover)] hover:text-[var(--text-primary)]"
        }
      `}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-primary)] rounded-r-full" />
      )}

      {/* Icon */}
      <span
        className={`
          text-lg flex-shrink-0 transition-transform duration-200
          ${active ? "scale-110" : "group-hover:scale-110"}
        `}
      >
        {item.icon}
      </span>

      {/* Label */}
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

      {/* Badge */}
      {!collapsed && item.badge && (
        <span className="text-xs bg-sky-500 text-white px-1.5 py-0.5 rounded-full font-bold">
          {item.badge}
        </span>
      )}

      {/* Tooltip when collapsed */}
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

// ── Admin Sidebar ─────────────────────────────────────────────
interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.admin
    ? `${user.admin.firstName ?? ""} ${user.admin.lastName ?? ""}`.trim() ||
      "Administrator"
    : "Administrator";
  const displayId = user?.admin?.department ?? "Admin";
  const profileImage = user?.admin?.profileImage;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      success("Signed out", "You have been logged out successfully.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen
        transition-all duration-300 ease-in-out
        border-r border-[var(--sidebar-border)]
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* ── Top: Logo + Collapse Toggle ── */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--sidebar-border)]">
        {!collapsed && (
          <button
            onClick={() => onViewChange("dashboard")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center text-white font-bold">
              CE
            </div>
            <span className="font-semibold text-[var(--text-primary)]">
              Admin Portal
            </span>
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            p-1.5 rounded-lg text-[var(--text-muted)]
            hover:bg-[var(--sidebar-item-hover)]
            hover:text-[var(--text-primary)]
            transition-colors duration-200
          "
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-lg">{collapsed ? "→" : "←"}</span>
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.id}
            item={item}
            collapsed={collapsed}
            active={currentView === item.id}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </nav>

      {/* ── Bottom: User Profile + Logout ── */}
      <div className="p-3 border-t border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={profileImage} name={displayName} size="sm" />

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {displayName}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {displayId}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            w-full flex items-center justify-center gap-2
            px-3 py-2 rounded-lg text-sm font-medium
            text-red-600 hover:bg-red-50 dark:hover:bg-red-950
            transition-colors duration-200 disabled:opacity-50
          "
        >
          <span>🚪</span>
          {!collapsed && (
            <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
