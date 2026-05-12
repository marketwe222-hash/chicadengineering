"use client";

import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const displayName = isAdmin
    ? `${user?.admin?.firstName ?? ""} ${user?.admin?.lastName ?? ""}`.trim()
    : `${user?.student?.firstName ?? ""} ${user?.student?.lastName ?? ""}`.trim();

  const profileImage = isAdmin
    ? user?.admin?.profileImage
    : user?.student?.profileImage;

  return (
    <header
      className="
        glass-nav h-16 flex items-center justify-between
        px-6 flex-shrink-0 sticky top-0 z-40
      "
    >
      {/* ── Left: Page title ── */}
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-lg font-bold text-[var(--text-primary)]">
            {title}
          </h1>
        )}
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="
            w-9 h-9 rounded-xl glass-sm
            flex items-center justify-center
            text-base transition-all duration-200
            hover:scale-110 active:scale-95
          "
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Notifications */}
        <button
          className="
            relative w-9 h-9 rounded-xl glass-sm
            flex items-center justify-center
            text-base transition-all duration-200
            hover:scale-110 active:scale-95
          "
          aria-label="Notifications"
        >
          🔔
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-400 rounded-full border border-[var(--bg-base)]" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--divider)]" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
              {displayName || "Loading…"}
            </span>
            <Badge variant={isAdmin ? "orange" : "sky"} size="sm">
              {isAdmin ? "Admin" : "Student"}
            </Badge>
          </div>
          <Avatar
            src={profileImage}
            name={displayName || "User"}
            size="sm"
            online
          />
        </div>
      </div>
    </header>
  );
}
