"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Hero Slider ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&q=85&fit=crop",
    tag: "Registered CAD Training Centre · Yaoundé, Cameroon",
    headline: ["Shape the Future", "of Civil &", "Architectural Design."],
    sub: "CHICAD Academy is a registered CAD centre that builds and shapes the minds of civil engineering and architectural students using industry-leading design tools.",
    accentVar: "var(--sky-light)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&fit=crop",
    tag: "Autodesk Revit · AutoCAD · Lumion · SAP2000",
    headline: ["Master the Tools", "That Build", "the World."],
    sub: "Train on Autodesk Revit Architecture, Robot Structural Analysis, AutoCAD, SAP2000, ABAQUS, Lumion, ArchiCAD and more — in one intensive programme.",
    accentVar: "var(--orange-light)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=85&fit=crop",
    tag: "2–3 Month Intensive Programme",
    headline: ["Theory Meets", "the Construction", "Site."],
    sub: "Our 2–3 month programme is galvanised with on-site visits that blend technical CAD training with real-world structural and architectural practice.",
    accentVar: "var(--sky)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=1800&q=85&fit=crop",
    tag: "Leadership · Marketing · Networking",
    headline: ["Graduate Ready", "to Win", "Clients."],
    sub: "Beyond software skills, we arm you with leadership strategies, client acquisition techniques, and professional networking — so you thrive from day one.",
    accentVar: "var(--sky-light)",
  },
];

/* ─── Breakpoint hook ─────────────────────────────────────── */
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
  return "xl";
}

/* ─── Component ───────────────────────────────────────────── */
export function HeroSection({ onSignIn }: { onSignIn: () => void }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isSmall = breakpoint === "xs";

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (transitioning) return;
      setDirection(dir);
      setPrev(current);
      setTransitioning(true);
      setCurrent(index);
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 850);
    },
    [current, transitioning],
  );

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length, "next"),
    [current, goTo],
  );
  const goBack = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length, "prev"),
    [current, goTo],
  );

  useEffect(() => {
    timerRef.current = setTimeout(next, 6000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, next]);

  const slide = SLIDES[current];

  /* ── Responsive values ── */
  const contentPaddingX = isSmall
    ? "1.25rem"
    : isMobile
      ? "1.75rem"
      : "clamp(1.5rem, 7vw, 8rem)";

  // On mobile, collapse tag text to avoid overflow
  const tagText = isMobile ? slide.tag.split("·")[0].trim() : slide.tag;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: isSmall
          ? "75svh"
          : isMobile
            ? "70svh"
            : breakpoint === "md"
              ? "80svh"
              : "100svh",
        minHeight: "560px",
        overflow: "hidden",
      }}
    >
      {/* ── Slides ── */}
      {SLIDES.map((s, i) => {
        const isActive = i === current;
        const isPrev = i === prev;
        if (!isActive && !isPrev) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: isActive ? 2 : 1,
              animation: isActive
                ? direction === "next"
                  ? "slideInRight 0.9s cubic-bezier(0.77,0,0.18,1) forwards"
                  : "slideInLeft  0.9s cubic-bezier(0.77,0,0.18,1) forwards"
                : direction === "next"
                  ? "slideOutLeft  0.9s cubic-bezier(0.77,0,0.18,1) forwards"
                  : "slideOutRight 0.9s cubic-bezier(0.77,0,0.18,1) forwards",
            }}
          >
            {/* Photo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: isActive ? "scale(1.07)" : "scale(1)",
                transition: "transform 7s ease",
              }}
            />
            {/* Gradient — stronger on mobile for readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isMobile
                  ? "linear-gradient(180deg, rgba(4,10,20,0.85) 0%, rgba(4,10,20,0.70) 60%, rgba(4,10,20,0.45) 100%)"
                  : "linear-gradient(110deg, rgba(4,10,20,0.88) 0%, rgba(4,10,20,0.62) 50%, rgba(4,10,20,0.28) 100%)",
              }}
            />
            {/* Blueprint grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.07,
                backgroundImage: `
                  linear-gradient(rgba(56,189,248,0.8) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(56,189,248,0.8) 1px, transparent 1px)
                `,
                backgroundSize: isSmall ? "32px 32px" : "48px 48px",
              }}
            />
            {/* Accent tint */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, ${s.accentVar}18 0%, transparent 45%)`,
              }}
            />
          </div>
        );
      })}

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "flex-end" : "center",
          paddingLeft: contentPaddingX,
          paddingRight: contentPaddingX,
          paddingBottom: isMobile ? "5.5rem" : "2rem",
          maxWidth: isMobile ? "100%" : "950px",
          boxSizing: "border-box",
        }}
      >
        {/* Headline */}
        <h1
          key={`h-${current}`}
          style={{
            fontSize: isSmall
              ? "clamp(2rem, 9vw, 2.8rem)"
              : isMobile
                ? "clamp(2.4rem, 8vw, 3.5rem)"
                : "clamp(2.6rem, 6.8vw, 5.8rem)",
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            color: "#fff",
            margin: `0 0 ${isSmall ? "1rem" : "1.6rem"}`,
            animation: "fadeSlideUp 0.6s 0.3s both",
          }}
        >
          {slide.headline.map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              {i === 0 ? (
                <span
                  style={{
                    background: `linear-gradient(135deg, #fff 0%, ${slide.accentVar} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {line}
                </span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        {/* Sub — hidden on xs to avoid clutter */}
        {!isSmall && (
          <p
            key={`sub-${current}`}
            style={{
              fontSize: isMobile
                ? "clamp(0.82rem, 3.5vw, 0.95rem)"
                : "clamp(0.9rem, 1.7vw, 1.12rem)",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.75,
              maxWidth: isMobile ? "100%" : "530px",
              margin: `0 0 ${isMobile ? "1.5rem" : "2.5rem"}`,
              animation: "fadeSlideUp 0.6s 0.45s both",
            }}
          >
            {slide.sub}
          </p>
        )}

        {/* On xs show a shorter sub */}
        {isSmall && (
          <p
            key={`sub-xs-${current}`}
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.6,
              margin: "0 0 1.25rem",
              animation: "fadeSlideUp 0.6s 0.45s both",
            }}
          >
            {slide.sub.slice(0, 90)}…
          </p>
        )}

        {/* CTAs */}
        <div
          key={`cta-${current}`}
          style={{
            display: "flex",
            gap: isSmall ? "0.6rem" : "0.9rem",
            flexWrap: isSmall ? "wrap" : "nowrap",
            animation: "fadeSlideUp 0.6s 0.6s both",
          }}
        >
          <button
            onClick={onSignIn}
            className="btn-primary animate-pulse-glow"
            style={{
              padding: isSmall ? "0.75rem 1.4rem" : "0.9rem 2.2rem",
              fontSize: isSmall ? "0.85rem" : "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: "0.7rem",
              flexShrink: 0,
            }}
          >
            Access Your Portal →
          </button>
          <a
            href="#about"
            className="btn-secondary"
            style={{
              padding: isSmall ? "0.75rem 1.2rem" : "0.9rem 2.2rem",
              fontSize: isSmall ? "0.85rem" : "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              borderRadius: "0.7rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            About
          </a>
        </div>
      </div>

      {/* ── Arrow controls — hidden on xs ── */}
      {!isSmall &&
        [
          { fn: goBack, pos: "left" as const, icon: "←" },
          { fn: next, pos: "right" as const, icon: "→" },
        ].map(({ fn, pos, icon }) => (
          <button
            key={pos}
            onClick={fn}
            aria-label={pos === "left" ? "Previous slide" : "Next slide"}
            style={{
              position: "absolute",
              [pos]: isMobile ? "0.75rem" : "1.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: isMobile ? "2.4rem" : "2.8rem",
              height: isMobile ? "2.4rem" : "2.8rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
          >
            {icon}
          </button>
        ))}

      {/* ── Dots ── */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "1.75rem" : "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "0.55rem",
          alignItems: "center",
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? "2rem" : "0.5rem",
              height: "0.5rem",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              padding: 0,
              background:
                i === current ? "var(--sky-light)" : "rgba(255,255,255,0.38)",
              transition: "width 0.4s, background 0.3s",
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(255,255,255,0.08)",
          zIndex: 20,
        }}
      >
        <div
          key={current}
          style={{
            height: "100%",
            background: "var(--gradient-primary)",
            animation: "progressBar 6s linear forwards",
            transformOrigin: "left",
          }}
        />
      </div>

      <style>{`
        @keyframes slideInRight   { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes slideInLeft    { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        @keyframes slideOutLeft   { from { transform:translateX(0) } to { transform:translateX(-100%) } }
        @keyframes slideOutRight  { from { transform:translateX(0) } to { transform:translateX(100%) } }
        @keyframes fadeSlideUp    { from { opacity:0; transform:translateY(1.5rem) } to { opacity:1; transform:none } }
        @keyframes progressBar    { from { width:0% } to { width:100% } }
        @keyframes pulse          { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
      `}</style>
    </section>
  );
}
