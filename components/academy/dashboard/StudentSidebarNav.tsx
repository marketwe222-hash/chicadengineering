"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

export type View =
  | "overview"
  | "courses"
  | "lessons"
  | "certificates"
  | "resources"
  | "profile";

interface NavItem {
  id: View;
  label: string;
  icon: string;
  badge?: number;
}

interface StudentSidebarNavProps {
  view: View;
  setView: (v: View) => void;
  open: boolean;
  onClose: () => void;
}

export default function StudentSidebarNav({
  view,
  setView,
  open,
  onClose,
}: StudentSidebarNavProps) {
  const { logout, user } = useAuthContext();
  const student = user?.student;

  const initials = student
    ? `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
    : "??";

  const fullName = student
    ? `${student.firstName} ${student.lastName[0]}.`
    : "—";

  const courseNames =
    (student?.enrollments ?? [])
      .filter((e) => e.status === "ACTIVE")
      .map((e) => e.course.name)
      .join(", ") || "—";

  const activeCount =
    student?.enrollments.filter((e) => e.status === "ACTIVE").length ?? 0;

  const mainNav: NavItem[] = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "courses", label: "My Courses", icon: "📚", badge: activeCount },
    { id: "lessons", label: "Lessons", icon: "▶️" },
    { id: "certificates", label: "Certificates", icon: "🎓" },
    { id: "resources", label: "Resources", icon: "📁" },
  ];

  function handleNav(id: View) {
    setView(id);
    onClose();
  }

  return (
    <aside
      className={`app-sidebar${open ? " sidebar-open" : ""}`}
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflow: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          borderBottom: "1px solid var(--sidebar-border)",
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link href="/academy">
          <Image
            src="https://pub-608e7a106efa47bda7aae56ff6f486a3.r2.dev/FinalLogo.png"
            alt="CHICAD Academy"
            width={200}
            height={100}
            priority
          />
        </Link>
      </div>

      {/* ── Student profile chip ── */}
      <div
        style={{
          padding: "0.85rem 1rem",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(125,211,252,0.12)",
              border: "1.5px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "var(--sky)",
              flexShrink: 0,
              fontFamily: "var(--font-mono)",
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fullName}
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {courseNames}
            </div>
          </div>
        </div>

        {/* Active status dot */}
        <div
          style={{
            marginTop: "0.55rem",
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
              background: "var(--success-text)",
              boxShadow: "0 0 5px var(--success-text)",
            }}
            className="animate-pulse-glow"
          />
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "var(--success-text)",
              letterSpacing: "0.06em",
            }}
          >
            ✓ Active
          </span>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav style={{ padding: "0.65rem 0.7rem", flex: 1, overflowY: "auto" }}>
        <p
          style={{
            fontSize: "0.56rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 0.45rem",
            marginBottom: "0.35rem",
          }}
        >
          Menu
        </p>

        {mainNav.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.58rem 0.7rem",
                borderRadius: 8,
                marginBottom: "0.12rem",
                background: active
                  ? "var(--sidebar-item-active)"
                  : "transparent",
                border: active
                  ? "1px solid var(--glass-border)"
                  : "1px solid transparent",
                cursor: "pointer",
                transition: "all var(--transition-base)",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--sidebar-item-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
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
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    background: active
                      ? "var(--sky)"
                      : "var(--glass-border-subtle)",
                    color: active ? "var(--navy)" : "var(--text-muted)",
                    padding: "0.08rem 0.42rem",
                    borderRadius: "1rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Account section */}
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.56rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 0.45rem",
            marginBottom: "0.35rem",
          }}
        >
          Account
        </p>

        <button
          onClick={() => handleNav("profile")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.58rem 0.7rem",
            borderRadius: 8,
            marginBottom: "0.12rem",
            background:
              view === "profile" ? "var(--sidebar-item-active)" : "transparent",
            border:
              view === "profile"
                ? "1px solid var(--glass-border)"
                : "1px solid transparent",
            cursor: "pointer",
            transition: "all var(--transition-base)",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            if (view !== "profile")
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--sidebar-item-hover)";
          }}
          onMouseLeave={(e) => {
            if (view !== "profile")
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
          }}
        >
          <span style={{ fontSize: "0.88rem", width: 16, textAlign: "center" }}>
            👤
          </span>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: view === "profile" ? 700 : 500,
              color:
                view === "profile"
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
            }}
          >
            My Profile
          </span>
        </button>
      </nav>

      {/* ── Logout ── */}
      <div
        style={{
          padding: "0.7rem",
          borderTop: "1px solid var(--sidebar-border)",
        }}
      >
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.55rem 0.7rem",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            transition: "all var(--transition-base)",
            textAlign: "left",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "var(--error-bg)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "transparent")
          }
        >
          <span style={{ fontSize: "0.85rem" }}>🚪</span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
