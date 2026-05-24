"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "@/components/admin/shared";

export type View =
  | "overview"
  | "students"
  | "courses"
  | "payments"
  | "reports"
  | "content"
  | "addstudent"
  | "addcourse"
  | "editcourse"
  | "settings";

interface Props {
  view: View;
  setView: (v: View) => void;
  onLogout: () => void;
  user: any;
  pendingCount: number;
}

export function AdminSidebarNav({
  view,
  setView,
  onLogout,
  user,
  pendingCount,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const adminName = user?.admin
    ? `${user.admin.firstName} ${user.admin.lastName}`
    : (user?.email ?? "Admin");
  const adminInitials = user?.admin
    ? `${user.admin.firstName[0]}${user.admin.lastName[0]}`.toUpperCase()
    : "AD";
  const adminRole = user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin";

  const nav: {
    id: View;
    label: string;
    icon: string;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "students", label: "Students", icon: "👥" },
    { id: "courses", label: "Courses", icon: "📚" },
    {
      id: "payments",
      label: "Payments",
      icon: "💳",
      badge: pendingCount || undefined,
      badgeColor: pendingCount > 0 ? "#ef4444" : undefined,
    },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "content", label: "Content", icon: "🖊️" },
  ];

  const manage: { id: View; label: string; icon: string }[] = [
    { id: "addstudent", label: "Add Student", icon: "➕" },
    { id: "addcourse", label: "New Course", icon: "🆕" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  function NavItem({
    id,
    label,
    icon,
    badge,
    badgeColor,
  }: {
    id: View;
    label: string;
    icon: string;
    badge?: number;
    badgeColor?: string;
  }) {
    const active = view === id;
    return (
      <div
        className="nav-item"
        onClick={() => {
          setView(id);
          setOpen(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.58rem 0.7rem",
          borderRadius: 8,
          marginBottom: "0.12rem",
          background: active ? "rgba(220,38,38,0.15)" : "transparent",
          border: active
            ? "1px solid rgba(220,38,38,0.28)"
            : "1px solid transparent",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: "0.88rem",
            width: 16,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: active ? 700 : 500,
            color: active ? "var(--text)" : "var(--text2)",
            flex: 1,
          }}
        >
          {label}
        </span>
        {badge !== undefined && (
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 800,
              background: active
                ? (badgeColor ?? "#dc2626")
                : badgeColor
                  ? `${badgeColor}22`
                  : "rgba(125,211,252,0.12)",
              color: active ? "#fff" : (badgeColor ?? "var(--text3)"),
              padding: "0.08rem 0.42rem",
              borderRadius: "1rem",
              fontFamily: "var(--mono)",
            }}
          >
            {badge}
          </span>
        )}
      </div>
    );
  }

  function SidebarContent() {
    return (
      <>
        {/* Logo */}
        <div
          style={{
            padding: "1.1rem 1.1rem 0.9rem",
            borderBottom: "1px solid var(--border2)",
          }}
        >
          <Link href="/academy">
            <Image
              src="/images/logowhite.png"
              alt="CHICAD"
              width={100}
              height={50}
            />
          </Link>
        </div>

        {/* Admin profile */}
        <div
          style={{
            padding: "0.85rem 1rem",
            borderBottom: "1px solid var(--border2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(220,38,38,0.18)",
                border: "1.5px solid rgba(220,38,38,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.78rem",
                fontWeight: 800,
                color: "#dc2626",
                flexShrink: 0,
                fontFamily: "var(--mono)",
              }}
            >
              {adminInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {adminName}
              </div>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--text3)",
                  fontFamily: "var(--mono)",
                }}
              >
                {adminRole}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#dc2626",
                boxShadow: "0 0 5px #dc2626",
                animation: "pulse-dot 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#dc2626",
                letterSpacing: "0.06em",
              }}
            >
              Admin Access
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "0.65rem 0.7rem", flex: 1, overflowY: "auto" }}>
          <SectionLabel>Dashboard</SectionLabel>
          {nav.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
          <div style={{ marginTop: "1rem" }}>
            <SectionLabel>Management</SectionLabel>
            {manage.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div
          style={{ padding: "0.7rem", borderTop: "1px solid var(--border2)" }}
        >
          <div
            className="nav-item"
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.55rem 0.7rem",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>🚪</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
              Logout
            </span>
          </div>
        </div>
      </>
    );
  }

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <>
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(0,0,0,0.55)",
            }}
          />
        )}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            width: 240,
            background: "var(--surface)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.28s ease",
          }}
        >
          <SidebarContent />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            height: 56,
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <button
            onClick={() => setOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: "var(--text2)",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>☰</span>
            <span
              style={{
                fontSize: "0.5rem",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Menu
            </span>
          </button>
          {nav.slice(0, 4).map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  color: active ? "#dc2626" : "var(--text2)",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  /* ── Desktop ── */
  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      <SidebarContent />
    </aside>
  );
}
