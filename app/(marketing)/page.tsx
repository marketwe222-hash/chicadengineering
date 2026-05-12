"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import Image from "next/image";

/* ─── Logo Button ─────────────────────────────────────────── */
function LogoButton() {
  const router = useRouter();
  const { theme } = useTheme();

  const [hovered, setHovered] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1920);

  useEffect(() => {
    const updateSize = () => {
      setScreenWidth(window.innerWidth);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  /* ─────────────────────────────────────────────
     6 Responsive Breakpoints
  ───────────────────────────────────────────── */

  const breakpoints = {
    xs: screenWidth <= 480,
    sm: screenWidth > 480 && screenWidth <= 640,
    md: screenWidth > 640 && screenWidth <= 768,
    lg: screenWidth > 768 && screenWidth <= 1024,
    xl: screenWidth > 1024 && screenWidth <= 1440,
    xxl: screenWidth > 1440,
  };

  /* ─────────────────────────────────────────────
     Logo Selection + Sizes
  ───────────────────────────────────────────── */

  let logoSrc =
    theme === "light" ? "/images/logowhite.png" : "/images/logo.png";
  let logoWidth = 200;
  let logoHeight = 200;

  // Mobile logos
  if (breakpoints.xs || breakpoints.sm || breakpoints.md) {
    logoSrc =
      theme === "light"
        ? "/images/logosmalllight.png"
        : "/images/logosmallblue.png";
  }

  // Sizes per breakpoint
  if (breakpoints.xs) {
    logoWidth = 70;
    logoHeight = 70;
  } else if (breakpoints.sm) {
    logoWidth = 85;
    logoHeight = 85;
  } else if (breakpoints.md) {
    logoWidth = 100;
    logoHeight = 100;
  } else if (breakpoints.lg) {
    logoWidth = 140;
    logoHeight = 140;
  } else if (breakpoints.xl) {
    logoWidth = 180;
    logoHeight = 180;
  } else if (breakpoints.xxl) {
    logoWidth = 220;
    logoHeight = 220;
  }

  return (
    <button
      onClick={() => router.push("/")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        top: "1.5vh",
        left: "1.5vh",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px) scale(1.03)" : "none",
        transition:
          "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
        animation: "logoPillIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
      aria-label="Chicad Engineering home"
    >
      <Image
        src={logoSrc}
        alt="Chicad Engineering logo"
        width={logoWidth}
        height={logoHeight}
        priority
        style={{
          width: `${logoWidth}px`,
          height: "auto",
          transition: "all 0.3s ease",
        }}
      />
    </button>
  );
}
/* ─── Theme Toggle ────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: "1.5vh",
        right: "1.5vh",
        zIndex: 50,
        width: "4.5vh",
        height: "4.5vh",
        minWidth: "2.5rem",
        minHeight: "2.5rem",
        borderRadius: "50%",
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur-sm)",
        WebkitBackdropFilter: "var(--glass-blur-sm)",
        border: "1px solid var(--glass-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.8vh",
        cursor: "pointer",
        transition: "transform 0.3s, background 0.3s",
        boxShadow: "var(--glass-shadow)",
        animation: "logoPillIn 0.7s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

/* ─── Portal Card ─────────────────────────────────────────── */
interface PortalCardProps {
  type: "academy" | "construction";
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
  accentColor: string;
  bgImage: string;
  onClick: () => void;
}

function PortalCard({
  title,
  subtitle,
  description,
  features,
  icon,
  accentColor,
  bgImage,
  onClick,
}: PortalCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "1.4rem",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        cursor: "pointer",
        minHeight: "360px",
        overflow: "hidden",
        background: "var(--card-bg)",
        border: hovered
          ? `1.5px solid ${accentColor}`
          : "1px solid var(--card-border)",
        boxShadow: hovered ? "var(--glass-shadow-lg)" : "var(--card-shadow)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        transform: hovered ? "translateY(-8px) scale(1.015)" : "none",
        transition:
          "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s",
      }}
    >
      {/* ── Background photo: visible at top edges, fades to transparent toward center ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          borderRadius: "inherit",
          zIndex: 0,
          /* Photo starts at ~20% opacity at the very top corners,
             and is completely hidden by the 50% point downward.
             The radial fade hides the centre where text lives. */
          /* image fully visible on right, fades out toward left where text is */
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.85) 75%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.85) 75%, black 100%)",
          transition: "opacity 0.35s ease",
          opacity: hovered ? 0.55 : 0.38,
        }}
      />

      {/* ── Left-side veil so text stays readable ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          zIndex: 0,
          background:
            "linear-gradient(to right, var(--card-bg) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── All card content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          flex: 1,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "3.6rem",
            height: "3.6rem",
            borderRadius: "0.9rem",
            background: "var(--glass-bg-subtle)",
            border: "1px solid var(--glass-border-subtle)",
            backdropFilter: "var(--glass-blur-sm)",
            WebkitBackdropFilter: "var(--glass-blur-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.7rem",
            flexShrink: 0,
            transform: hovered ? "scale(1.12) rotate(5deg)" : "none",
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
            }}
          >
            {subtitle}
          </p>
          <h2
            style={{
              fontSize: "clamp(1.3rem, 2.5vh, 1.75rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "clamp(0.78rem, 1.15vh, 0.875rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        </div>

        {/* Features */}
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
            listStyle: "none",
            padding: 0,
            margin: 0,
            flex: 1,
          }}
        >
          {features.map((feature, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                fontSize: "clamp(0.75rem, 1.1vh, 0.85rem)",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: "var(--glass-bg-subtle)",
                  border: "1px solid var(--glass-border-subtle)",
                  color: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          style={{
            padding: "0.9rem 1.5rem",
            borderRadius: "0.75rem",
            border: "none",
            background: accentColor,
            color: "white",
            fontWeight: 700,
            fontSize: "clamp(0.8rem, 1.3vh, 0.9rem)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: hovered
              ? `0 8px 28px ${accentColor}55`
              : `0 4px 16px ${accentColor}38`,
            transition: "box-shadow 0.25s, transform 0.2s",
            transform: hovered ? "translateY(-1px)" : "none",
            marginTop: "auto",
          }}
        >
          Enter Portal <span>→</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const portals: PortalCardProps[] = [
    {
      type: "academy",
      title: "Chicad Academy",
      subtitle: "Education Portal",
      description:
        "Access your courses, grades, attendance records and academic resources all in one place.",
      features: [
        "Student & Admin secure login",
        "Revit · AutoCAD · ArchiCAD · Lumion",
        "Robot Structural · SAP2000 · ABAQUS · Excel",
      ],
      icon: "🎓",
      accentColor: "#0ea5e9",
      bgImage: "/images/academy-bg.jpg",
      onClick: () => router.push("/academy"),
    },
    {
      type: "construction",
      title: "Chicad Construction",
      subtitle: "Company Portal",
      description:
        "Explore our construction services, ongoing projects, portfolio and get in touch.",
      features: [
        "Project portfolio showcase",
        "Engineering services overview",
        "Client inquiry & contact",
      ],
      icon: "🏗️",
      accentColor: "#f97316",
      bgImage: "/images/construction-bg.jpg",
      onClick: () => router.push("/construction"),
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2vh 2vw",
        gap: "2.5vh",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* ── Full-page hero photo — clearly visible ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          zIndex: -2,
        }}
      />
      {/* ── Diagonal veil: opaque at top-left, bottom-left, bottom-right; clear at top-right ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: `
  linear-gradient(135deg,
    var(--bg-base)       0%,
    var(--overlay-heavy)   25%,
    var(--overlay-mid)     45%,
    var(--overlay-soft)    65%,
    var(--overlay-faint)   80%,
    transparent            100%
  )
`,
          zIndex: -1,
        }}
      />

      <LogoButton />
      <ThemeToggle />

      {/* Heading */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          animation: "fadeSlideUp 0.6s 0.25s both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "var(--glass-bg)",
            backdropFilter: "var(--glass-blur-sm)",
            WebkitBackdropFilter: "var(--glass-blur-sm)",
            border: "1px solid var(--glass-border)",
            borderRadius: "99px",
            padding: "0.4rem 1rem",
            fontSize: "clamp(0.65rem, 1.2vh, 0.78rem)",
            color: "var(--text-muted)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              background: "#34d399",
              borderRadius: "50%",
              flexShrink: 0,
              animation: "pulse 2s infinite",
            }}
          />
          Select your portal to continue
        </div>

        <h1
          style={{
            fontSize: "clamp(1.6rem, 4vh, 3rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "var(--text-primary)",
            textAlign: "center",
          }}
        >
          <span style={{ color: "var(--accent-primary)" }}>Chicad</span>{" "}
          Engineering
        </h1>

        <p
          style={{
            fontSize: "clamp(0.7rem, 1.3vh, 0.875rem)",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          Building Knowledge · Building Excellence
        </p>
      </div>

      {/* Portal Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "780px",
          animation: "fadeSlideUp 0.65s 0.4s both",
        }}
      >
        {portals.map((p) => (
          <PortalCard key={p.type} {...p} />
        ))}
      </div>

      <p
        style={{
          fontSize: "clamp(0.62rem, 1.1vh, 0.75rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          textAlign: "center",
          lineHeight: 1.6,
          animation: "fadeSlideUp 0.6s 0.55s both",
        }}
      >
        © {new Date().getFullYear()} Chicad Engineering. All rights reserved.
        <br />
        <span style={{ color: "var(--text-secondary)" }}>
          Secure portal · All data encrypted · Yaoundé, Cameroon
        </span>
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(1.25rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPillIn {
          from { opacity: 0; transform: translateX(-1rem) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
