"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

/* ────────────────────────────────────────────────────────── */
/* Breakpoints                                               */
/* ────────────────────────────────────────────────────────── */
function useBreakpoint() {
  const [width, setWidth] = useState(1400);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (width < 480) return "xs";
  if (width < 640) return "sm";
  if (width < 768) return "md";
  if (width < 1024) return "lg";
  if (width < 1440) return "xl";
  return "2xl";
}

/* ────────────────────────────────────────────────────────── */
/* Theme Toggle                                             */
/* ────────────────────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        width: "2.7rem",
        height: "2.7rem",
        borderRadius: "999px",
        border: "1px solid var(--glass-border)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "1rem",
        color: "var(--text-primary)",
        transition: "all 0.25s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Header                                                   */
/* ────────────────────────────────────────────────────────── */
interface HeaderProps {
  onSignIn: () => void;
}

export default function Header({ onSignIn }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const breakpoint = useBreakpoint();

  const isXs = breakpoint === "xs";
  const isMobile = isXs || breakpoint === "sm" || breakpoint === "md";
  const isCompact = breakpoint === "lg";

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  /* Scroll show/hide header */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY.current;

      if (scrollDifference < -10 || currentScrollY < 100) {
        setIsHeaderVisible(true);
      } else if (scrollDifference > 10 && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Logo ── */
  const logoSrc = isMobile
    ? theme === "light"
      ? "/images/logosmallblue.png"
      : "/images/logosmalllight.png"
    : theme === "light"
      ? "/images/logowhite.png"
      : "/images/logo.png";

  const logoHeightPx = (() => {
    switch (breakpoint) {
      case "xs":
        return "2.2rem";
      case "sm":
        return "2.4rem";
      case "md":
        return "2.6rem";
      case "lg":
        return "2.8rem";
      case "xl":
        return "3rem";
      default:
        return "3rem";
    }
  })();

  const navGap = (() => {
    switch (breakpoint) {
      case "lg":
        return "0.9rem";
      case "xl":
        return "1.4rem";
      default:
        return "1.6rem";
    }
  })();

  const navFontSize = breakpoint === "lg" ? "0.82rem" : "0.9rem";

  /* ── Handlers ── */
  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/academy");
  };

  const handleDashboard = () => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/student/dashboard");
    }
    setDropdownOpen(false);
  };

  const navLinks = [
    { href: "/academy/about", label: "About" },
    { href: "/academy/software", label: "Software" },
    { href: "/academy/programmes", label: "Programmes" },
  ];

  const navHeight = (() => {
    switch (breakpoint) {
      case "xs":
        return "3.4rem";
      case "sm":
        return "4.2rem";
      case "md":
        return "4.6rem";
      default:
        return "5rem";
    }
  })();

  const roleLabel =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? "Admin"
      : "Student";

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: navHeight,
          display: "flex",
          paddingLeft: breakpoint === "xs" ? "0.9rem" : "1.5rem",
          paddingRight: breakpoint === "xs" ? "0.9rem" : "1.5rem",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          transform: isHeaderVisible
            ? "translateY(0)"
            : `translateY(-${navHeight})`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* ── LEFT: Logo ── */}
        <Link
          href="/academy"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src={logoSrc}
            alt="Chicad Academy"
            width={200}
            height={200}
            priority
            style={{
              width: "auto",
              height: logoHeightPx,
              objectFit: "contain",
            }}
          />
        </Link>

        {/* ── DESKTOP NAV (lg and up) ── */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: navGap,
              flexWrap: "nowrap",
              minWidth: 0,
            }}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active
                      ? "var(--accent-primary)"
                      : "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: navFontSize,
                    fontWeight: 700,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <ThemeToggle />

            {/* ── AUTH ── */}
            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                {/* Trigger button */}
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{
                    height: isXs ? "2.3rem" : "2.7rem",
                    padding: isCompact ? "0 0.75rem" : "0 1rem",
                    borderRadius: "999px",
                    border: "1px solid var(--glass-border)",
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: isCompact ? "0.8rem" : "0.85rem",
                    transition: "all 0.25s ease",
                    flexShrink: 0,
                  }}
                >
                  {/* Profile icon circle */}
                  <div
                    style={{
                      width: "1.9rem",
                      height: "1.9rem",
                      borderRadius: "50%",
                      background: "var(--gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <span>{user?.student?.firstName || "Account"}</span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      opacity: 0.6,
                      transition: "transform 0.2s",
                      transform: dropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      display: "inline-block",
                    }}
                  >
                    ▼
                  </span>
                </button>

                {/* ── Dropdown ── */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 0.7rem)",
                      right: 0,
                      width: "240px",
                      zIndex: 210,
                      borderRadius: "1.1rem",
                      overflow: "hidden",
                      background:
                        "linear-gradient(145deg, rgba(15,25,50,0.88) 0%, rgba(10,15,35,0.94) 100%)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid rgba(56,189,248,0.18)",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* User info header */}
                    <div
                      style={{
                        padding: "1rem 1rem 0.75rem",
                        borderBottom: "1px solid rgba(56,189,248,0.10)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "2.4rem",
                          height: "2.4rem",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {user?.student?.firstName || "Account"}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.72rem",
                            color: "rgba(56,189,248,0.80)",
                          }}
                        >
                          {roleLabel}
                        </p>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "0.5rem" }}>
                      <button
                        onClick={handleDashboard}
                        style={dropdownBtnStyle}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(56,189,248,0.10)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span
                          style={iconWrapStyle(
                            "rgba(56,189,248,0.15)",
                            "rgba(56,189,248,0.28)",
                          )}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                        </span>
                        Dashboard
                      </button>

                      <div
                        style={{
                          height: "1px",
                          background: "rgba(56,189,248,0.08)",
                          margin: "0.3rem 0",
                        }}
                      />

                      <button
                        onClick={handleLogout}
                        style={{ ...dropdownBtnStyle, color: "#f87171" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(248,113,113,0.10)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span
                          style={iconWrapStyle(
                            "rgba(248,113,113,0.10)",
                            "rgba(248,113,113,0.22)",
                          )}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#f87171"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                        </span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="btn-primary"
                style={{
                  height: "2.7rem",
                  padding: isCompact ? "0 1rem" : "0 1.25rem",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: isCompact ? "0.8rem" : "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        )}

        {/* ── MOBILE RIGHT (hamburger) ── */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenu((v) => !v)}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
              style={{
                width: "2.5rem",
                height: isXs ? "2.4rem" : "2.7rem",
                borderRadius: "999px",
                border: "1px solid var(--glass-border)",
                background: "var(--glass-bg)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "1rem",
                transition: "background 0.2s",
              }}
            >
              {mobileMenu ? "✕" : "☰"}
            </button>
          </div>
        )}
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: navHeight,
            left: 0,
            right: 0,
            zIndex: 200,
            padding: "0.75rem",
            background: "var(--glass-bg)",
            borderBottom: "1px solid var(--glass-border)",
            display: "flex",
            flexDirection: "column",

            borderRadius: "0 0 1.2rem 1.2rem",
            gap: "0.6rem",
            maxHeight: mobileMenu ? "400px" : "0px",
            overflow: "hidden",
            visibility: mobileMenu ? "visible" : "hidden",
            opacity: mobileMenu ? 1 : 0,
            pointerEvents: mobileMenu ? "auto" : "none",
            transition:
              "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              padding: "0.25rem 0 0.5rem",
            }}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "0.9rem",
                    textDecoration: "none",
                    color: active
                      ? "var(--accent-primary)"
                      : "var(--text-primary)",
                    background: active
                      ? "var(--glass-bg)"
                      : "var(--glass-bg-subtle)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    border: active
                      ? "1px solid var(--accent-primary)"
                      : "1px solid transparent",
                    transition: "background 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    handleDashboard();
                    setMobileMenu(false);
                  }}
                  style={mobileBtnStyle}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenu(false);
                  }}
                  style={{ ...mobileBtnStyle, color: "#f87171" }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onSignIn();
                  setMobileMenu(false);
                }}
                className="btn-primary"
                style={{
                  height: "3rem",
                  borderRadius: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Styles                                                   */
/* ────────────────────────────────────────────────────────── */

const dropdownBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  background: "transparent",
  border: "none",
  borderRadius: "0.7rem",
  color: "rgba(255,255,255,0.88)",
  textAlign: "left",
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  transition: "background 0.2s ease",
};

const iconWrapStyle = (bg: string, border: string): React.CSSProperties => ({
  width: "1.8rem",
  height: "1.8rem",
  borderRadius: "0.45rem",
  background: bg,
  border: `1px solid ${border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const mobileBtnStyle: React.CSSProperties = {
  width: "100%",
  height: "3rem",
  borderRadius: "0.9rem",
  border: "1px solid var(--glass-border)",
  background: "var(--glass-bg-subtle)",
  color: "var(--text-primary)",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "0.95rem",
  textAlign: "left",
  padding: "0 1rem",
};
