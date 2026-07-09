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

const PAD_X = "1.1rem";
const TOPBAR_H = 56;

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

  const pageTitle =
    view === "overview"
      ? "Dashboard Overview"
      : view === "students"
        ? "Students"
        : view === "courses"
          ? "Courses"
          : view === "editcourse"
            ? "Edit Course"
            : view === "payments"
              ? "Payments"
              : view === "reports"
                ? "Reports & Analytics"
                : view === "content"
                  ? "Content Management"
                  : view === "addstudent"
                    ? "Add New Student"
                    : view === "addcourse"
                      ? "Create New Course"
                      : view === "settings"
                        ? "Settings"
                        : "";

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
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.56rem 0.65rem 0.56rem 0.85rem",
          borderRadius: 8,
          marginBottom: "0.15rem",
          background: active ? "rgba(220,38,38,0.12)" : "transparent",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "18%",
            bottom: "18%",
            width: 3,
            borderRadius: 2,
            background: active ? "#dc2626" : "transparent",
            transition: "background 0.15s ease",
          }}
        />
        <span
          style={{
            fontSize: "0.85rem",
            width: 16,
            textAlign: "center",
            flexShrink: 0,
            opacity: active ? 1 : 0.85,
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
            letterSpacing: "0.01em",
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
              lineHeight: 1.5,
            }}
          >
            {badge}
          </span>
        )}
      </div>
    );
  }

  /* ── Shared sidebar content (logo + nav + logout) ── */
  function SidebarContent() {
    return (
      <>
        {/* Logo (replaces the old profile section) */}
        <div
          style={{
            borderBottom: "1px solid var(--border2)",
          }}
        >
          <Link href="/academy" style={{ display: "inline-block" }}>
            <Image
              src="https://pub-608e7a106efa47bda7aae56ff6f486a3.r2.dev/FinalLogo.png"
              alt="CHICAD"
              width={100}
              height={100}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav
          style={{
            padding: `0.9rem ${PAD_X}`,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <SectionLabel>Dashboard</SectionLabel>
          <div style={{ marginTop: "0.4rem" }}>
            {nav.map((item) => (
              <NavItem key={item.id} {...item} />
            ))}
          </div>
          <div style={{ marginTop: "1.35rem" }}>
            <SectionLabel>Management</SectionLabel>
            <div style={{ marginTop: "0.4rem" }}>
              {manage.map((item) => (
                <NavItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: `0.85rem ${PAD_X}`,
            borderTop: "1px solid var(--border2)",
          }}
        >
          <div
            className="nav-item"
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.55rem 0.65rem 0.55rem 0.85rem",
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.15s ease",
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

  /* ── Top Bar ── */
  function TopBar() {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isMobile ? 0 : 220,
          right: 0,
          height: TOPBAR_H,
          zIndex: 30,
          background: "#0f172a",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 1rem 0 3.5rem" : "0 1.5rem 0 1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {pageTitle}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(220,38,38,0.18)",
              border: "1.5px solid rgba(220,38,38,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#dc2626",
              flexShrink: 0,
              fontFamily: "var(--mono)",
            }}
          >
            {adminInitials}
          </div>
          <div style={{ display: isMobile ? "none" : "block" }}>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text)",
                lineHeight: 1.2,
              }}
            >
              {adminName}
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "var(--text3)",
                fontFamily: "var(--mono)",
              }}
            >
              {adminRole}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-main { padding-top: ${TOPBAR_H + 12}px !important; }
        }
        .admin-main { padding-top: ${TOPBAR_H + 8}px; }
      `}</style>

      <TopBar />

      {/* ── Mobile ── */}
      {isMobile && (
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

          <button
            onClick={() => setOpen(true)}
            style={{
              position: "fixed",
              top: 9,
              left: 10,
              zIndex: 35,
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f172a",
              color: "var(--text2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.15rem",
            }}
          >
            ☰
          </button>

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 50,
              width: 264,
              background: "#0f172a",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              transform: open ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.26s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: open ? "4px 0 30px rgba(0,0,0,0.5)" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: `0.6rem ${PAD_X} 0`,
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: "1px solid var(--border2)",
                  background: "transparent",
                  color: "var(--text3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                }}
              >
                ✕
              </button>
            </div>
            <SidebarContent />
          </div>
        </>
      )}

      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <aside
          style={{
            width: 220,
            flexShrink: 0,
            background: "#0f172a",
            borderRight: "1px solid rgba(255,255,255,0.06)",
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
      )}
    </>
  );
}
