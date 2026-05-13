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
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "999px",
        border: "1px solid rgba(125,211,252,0.22)",
        background: "rgba(14,111,168,0.18)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "0.95rem",
        color: "var(--text-primary)",
        transition: "all 0.25s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) rotate(12deg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Profile Icon SVG                                         */
/* ────────────────────────────────────────────────────────── */
function ProfileIcon({
  size = 16,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
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
  const [scrolled, setScrolled] = useState(false);

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

  /* Scroll show/hide + tint header */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const diff = y - lastScrollY.current;
      setScrolled(y > 20);
      if (diff < -10 || y < 100) setIsHeaderVisible(true);
      else if (diff > 10 && y > 100) setIsHeaderVisible(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Logo */
  const logoSrc = isMobile
    ? theme === "light"
      ? "/images/logosmallblue.png"
      : "/images/logosmalllight.png"
    : theme === "light"
      ? "/images/logowhite.png"
      : "/images/logo.png";

  const logoHeight = isXs
    ? "2.1rem"
    : isMobile
      ? "2.4rem"
      : isCompact
        ? "2.6rem"
        : "2.9rem";

  const navHeight = isXs ? "3.4rem" : isMobile ? "4.2rem" : "4.8rem";
  const navFontSize = isCompact ? "0.82rem" : "0.88rem";
  const navGap = isCompact ? "1rem" : "1.5rem";

  const navLinks = [
    { href: "/academy/about", label: "About" },
    { href: "/academy/software", label: "Software" },
    { href: "/academy/programmes", label: "Programmes" },
  ];

  const roleLabel =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? "Admin"
      : "Student";

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenu(false);
    router.push("/academy");
  };

  const handleDashboard = () => {
    const dest =
      user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
        ? "/admin/dashboard"
        : "/academy/dashboard";
    router.push(dest);
    setDropdownOpen(false);
    setMobileMenu(false);
  };

  /* ── Glass pill for the auth/profile button ── */
  const glassPillStyle: React.CSSProperties = {
    height: "2.5rem",
    padding: isCompact ? "0 0.85rem" : "0 1rem",
    borderRadius: "999px",
    border: "1px solid rgba(125,211,252,0.22)",
    background: "rgba(14,111,168,0.20)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: navFontSize,
    transition: "all 0.2s ease",
    flexShrink: 0,
  };

  return (
    <>
      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: navHeight,
          display: "flex",
          paddingLeft: isXs ? "0.9rem" : "1.5rem",
          paddingRight: isXs ? "0.9rem" : "1.5rem",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          background: scrolled ? "rgba(7,20,40,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(125,211,252,0.10)"
            : "1px solid transparent",
          transition:
            "transform 0.3s ease, background 0.35s ease, border-color 0.35s ease",
          transform: isHeaderVisible
            ? "translateY(0)"
            : `translateY(-${navHeight})`,
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/academy"
          style={{
            display: "flex",
            alignItems: "center",
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
            style={{ width: "auto", height: logoHeight, objectFit: "contain" }}
          />
        </Link>

        {/* ── DESKTOP NAV ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: navGap }}>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active ? "#7dd3fc" : "rgba(255,255,255,0.70)",
                    textDecoration: "none",
                    fontSize: navFontSize,
                    fontWeight: 700,
                    transition: "color 0.2s ease",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.color = "rgba(255,255,255,0.70)";
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-4px",
                        left: 0,
                        right: 0,
                        height: "2px",
                        borderRadius: "999px",
                        background: "linear-gradient(90deg, #7dd3fc, #6366f1)",
                      }}
                    />
                  )}
                </Link>
              );
            })}

            <ThemeToggle />

            {/* ── AUTH ── */}
            {isAuthenticated ? (
              /* Logged-in: avatar + name pill + dropdown */
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={glassPillStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.35)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.40)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.20)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.22)";
                  }}
                >
                  <div
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ProfileIcon size={13} />
                  </div>
                  <span style={{ color: "#fff" }}>
                    {user?.student?.firstName || "Account"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "rgba(125,211,252,0.7)",
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

                {dropdownOpen && (
                  <AuthDropdown
                    user={user}
                    roleLabel={roleLabel}
                    onDashboard={handleDashboard}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            ) : (
              /* Logged-out: profile icon pill → shows register/login */
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={glassPillStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.35)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.40)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.20)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.22)";
                  }}
                >
                  <div
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      background: "rgba(125,211,252,0.15)",
                      border: "1px solid rgba(125,211,252,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ProfileIcon size={13} color="#7dd3fc" />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>
                    Account
                  </span>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "rgba(125,211,252,0.7)",
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

                {dropdownOpen && (
                  <GuestDropdown
                    onSignIn={() => {
                      onSignIn();
                      setDropdownOpen(false);
                    }}
                    onRegister={() => {
                      router.push("/academy/register");
                      setDropdownOpen(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* ── MOBILE: theme + hamburger ── */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenu((v) => !v)}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "999px",
                border: "1px solid rgba(125,211,252,0.22)",
                background: mobileMenu
                  ? "rgba(14,111,168,0.35)"
                  : "rgba(14,111,168,0.18)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#7dd3fc",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              {mobileMenu ? (
                /* X icon */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Hamburger */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              )}
            </button>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════
          MOBILE MENU
      ════════════════════════════════════════ */}
      {isMobile && (
        <>
          {/* Backdrop blur */}
          <div
            onClick={() => setMobileMenu(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 149,
              background: "rgba(4,10,22,0.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              opacity: mobileMenu ? 1 : 0,
              pointerEvents: mobileMenu ? "auto" : "none",
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: "fixed",
              top: navHeight,
              left: "0.75rem",
              right: "0.75rem",
              zIndex: 150,
              borderRadius: "1.5rem",
              overflow: "hidden",
              background: "rgba(7,20,40,0.88)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(125,211,252,0.18)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
              transform: mobileMenu
                ? "translateY(0) scale(1)"
                : "translateY(-1rem) scale(0.97)",
              opacity: mobileMenu ? 1 : 0,
              pointerEvents: mobileMenu ? "auto" : "none",
              transition:
                "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
            }}
          >
            {/* ── Nav Links ── */}
            <div style={{ padding: "1.25rem 1.25rem 0" }}>
              <p
                style={{
                  margin: "0 0 0.75rem 0.25rem",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(125,211,252,0.5)",
                }}
              >
                Navigation
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
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
                        padding: "0.9rem 1rem",
                        borderRadius: "0.9rem",
                        textDecoration: "none",
                        color: active ? "#7dd3fc" : "rgba(255,255,255,0.82)",
                        background: active
                          ? "rgba(14,111,168,0.28)"
                          : "rgba(255,255,255,0.04)",
                        border: active
                          ? "1px solid rgba(125,211,252,0.28)"
                          : "1px solid transparent",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            width: "1.9rem",
                            height: "1.9rem",
                            borderRadius: "0.5rem",
                            background: active
                              ? "rgba(125,211,252,0.18)"
                              : "rgba(255,255,255,0.07)",
                            border: `1px solid ${active ? "rgba(125,211,252,0.3)" : "rgba(255,255,255,0.10)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                          }}
                        >
                          {link.label === "About"
                            ? "ℹ️"
                            : link.label === "Software"
                              ? "💻"
                              : "📋"}
                        </span>
                        {link.label}
                      </span>
                      {active && (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: "#7dd3fc",
                            opacity: 0.7,
                          }}
                        >
                          ●
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Divider ── */}
            <div
              style={{
                margin: "1rem 1.25rem",
                height: "1px",
                background: "rgba(125,211,252,0.10)",
              }}
            />

            {/* ── Auth section ── */}
            <div style={{ padding: "0 1.25rem 1.25rem" }}>
              {isAuthenticated ? (
                <>
                  {/* User info card */}
                  <div
                    style={{
                      padding: "1rem",
                      borderRadius: "1rem",
                      background: "rgba(14,111,168,0.18)",
                      border: "1px solid rgba(125,211,252,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.75rem",
                        height: "2.75rem",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ProfileIcon size={16} />
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.92rem",
                          fontWeight: 800,
                          color: "#fff",
                        }}
                      >
                        {user?.student?.firstName || "Account"}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.7rem",
                          color: "rgba(125,211,252,0.75)",
                          fontWeight: 600,
                        }}
                      >
                        {roleLabel} · CHICAD Academy
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <button
                      onClick={handleDashboard}
                      style={mobileActionBtn("#38bdf8")}
                    >
                      <span
                        style={mobileIconBox(
                          "rgba(56,189,248,0.15)",
                          "rgba(56,189,248,0.3)",
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
                    <button
                      onClick={handleLogout}
                      style={mobileActionBtn("#f87171")}
                    >
                      <span
                        style={mobileIconBox(
                          "rgba(248,113,113,0.10)",
                          "rgba(248,113,113,0.25)",
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
                </>
              ) : (
                <>
                  <p
                    style={{
                      margin: "0 0 0.75rem 0.25rem",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(125,211,252,0.5)",
                    }}
                  >
                    Your Account
                  </p>

                  {/* Sign In button */}
                  <button
                    onClick={() => {
                      onSignIn();
                      setMobileMenu(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.95rem 1rem",
                      borderRadius: "0.9rem",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                      boxShadow: "0 4px 20px rgba(14,165,233,0.35)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.01)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <span
                      style={mobileIconBox(
                        "rgba(255,255,255,0.18)",
                        "rgba(255,255,255,0.3)",
                      )}
                    >
                      <ProfileIcon size={14} color="#fff" />
                    </span>
                    Sign In
                  </button>

                  {/* Register button */}
                  <button
                    onClick={() => {
                      router.push("/academy/register");
                      setMobileMenu(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.95rem 1rem",
                      borderRadius: "0.9rem",
                      border: "1px solid rgba(125,211,252,0.22)",
                      background: "rgba(14,111,168,0.15)",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(14,111,168,0.28)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(14,111,168,0.15)";
                    }}
                  >
                    <span
                      style={mobileIconBox(
                        "rgba(125,211,252,0.12)",
                        "rgba(125,211,252,0.25)",
                      )}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7dd3fc"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                      </svg>
                    </span>
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Desktop dropdowns                                        */
/* ────────────────────────────────────────────────────────── */

/* Shared dropdown shell */
function DropdownShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 0.65rem)",
        right: 0,
        minWidth: "220px",
        zIndex: 210,
        borderRadius: "1.1rem",
        overflow: "hidden",
        background: "rgba(7,20,40,0.92)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        border: "1px solid rgba(125,211,252,0.18)",
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
        animation: "dropIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      {children}
      <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-6px) scale(0.97) } to { opacity:1; transform:none scale(1) } }`}</style>
    </div>
  );
}

/* Guest: sign in / register */
function GuestDropdown({
  onSignIn,
  onRegister,
}: {
  onSignIn: () => void;
  onRegister: () => void;
}) {
  return (
    <DropdownShell>
      <div style={{ padding: "0.75rem 0.85rem 0.15rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(125,211,252,0.5)",
          }}
        >
          Your Account
        </p>
      </div>
      <div style={{ padding: "0.4rem 0.5rem 0.65rem" }}>
        <button
          onClick={onSignIn}
          style={desktopDropBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(14,111,168,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            style={mobileIconBox(
              "rgba(125,211,252,0.12)",
              "rgba(125,211,252,0.28)",
            )}
          >
            <ProfileIcon size={13} color="#7dd3fc" />
          </span>
          <span>Sign In</span>
        </button>
        <button
          onClick={onRegister}
          style={desktopDropBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(14,111,168,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            style={mobileIconBox(
              "rgba(125,211,252,0.10)",
              "rgba(125,211,252,0.22)",
            )}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </span>
          <span>Create Account</span>
        </button>
      </div>
    </DropdownShell>
  );
}

/* Authenticated: user info + dashboard + logout */
function AuthDropdown({
  user,
  roleLabel,
  onDashboard,
  onLogout,
}: {
  user: any;
  roleLabel: string;
  onDashboard: () => void;
  onLogout: () => void;
}) {
  return (
    <DropdownShell>
      {/* User info */}
      <div
        style={{
          padding: "0.9rem 1rem 0.75rem",
          borderBottom: "1px solid rgba(125,211,252,0.10)",
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
            background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ProfileIcon size={15} />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.87rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {user?.student?.firstName || "Account"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.7rem",
              color: "rgba(125,211,252,0.75)",
            }}
          >
            {roleLabel}
          </p>
        </div>
      </div>

      <div style={{ padding: "0.4rem 0.5rem 0.55rem" }}>
        <button
          onClick={onDashboard}
          style={desktopDropBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(56,189,248,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            style={mobileIconBox(
              "rgba(56,189,248,0.15)",
              "rgba(56,189,248,0.28)",
            )}
          >
            <svg
              width="13"
              height="13"
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
            background: "rgba(125,211,252,0.08)",
            margin: "0.3rem 0.4rem",
          }}
        />

        <button
          onClick={onLogout}
          style={{ ...desktopDropBtn, color: "#f87171" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span
            style={mobileIconBox(
              "rgba(248,113,113,0.10)",
              "rgba(248,113,113,0.22)",
            )}
          >
            <svg
              width="13"
              height="13"
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
    </DropdownShell>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Shared style helpers                                      */
/* ────────────────────────────────────────────────────────── */
const desktopDropBtn: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  background: "transparent",
  border: "none",
  borderRadius: "0.65rem",
  color: "rgba(255,255,255,0.85)",
  textAlign: "left",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  transition: "background 0.15s ease",
};

function mobileIconBox(bg: string, border: string): React.CSSProperties {
  return {
    width: "1.75rem",
    height: "1.75rem",
    borderRadius: "0.45rem",
    background: bg,
    border: `1px solid ${border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}

function mobileActionBtn(color: string): React.CSSProperties {
  return {
    width: "100%",
    padding: "0.8rem 0.9rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0.85rem",
    color: color,
    fontWeight: 700,
    fontSize: "0.88rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    transition: "background 0.2s ease",
  };
}
