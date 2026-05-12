"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

// ─────────────────────────────────────────────
// EASING CONSTANTS
// ─────────────────────────────────────────────
type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.22, 1, 0.36, 1];
const EASE_IN_OUT: CubicBezier = [0.77, 0, 0.18, 1];

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: EASE_OUT },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE_OUT },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

// ─────────────────────────────────────────────
// SCROLL-REVEAL WRAPPER
// ─────────────────────────────────────────────
function Reveal({
  children,
  variants = fadeUp,
  custom = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  variants?: any;
  custom?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      custom={custom}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.12, rotate: 15 }}
      whileTap={{ scale: 0.92 }}
      className="glass-sm"
      style={{
        width: "2.4rem",
        height: "2.4rem",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        cursor: "pointer",
        border: "1px solid var(--glass-border)",
        flexShrink: 0,
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// HERO SLIDER
// ─────────────────────────────────────────────
const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=85&fit=crop",
    tag: "Ghana's Premier Engineering Company · Est. 2009",
    headline: ["Building", "Tomorrow's", "Structures."],
    sub: "Chicad Engineering delivers world-class construction, civil engineering, and infrastructure solutions across Ghana and West Africa.",
    accent: "var(--gold)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=85&fit=crop",
    tag: "General Construction · Structural Engineering",
    headline: ["Steel, Concrete,", "Built to", "Last Forever."],
    sub: "From residential estates to 18-storey commercial towers — precision engineering backed by 15+ years of proven execution.",
    accent: "var(--royal-light)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&fit=crop",
    tag: "Roads · Bridges · Drainage · Infrastructure",
    headline: ["Connecting", "Communities", "Across Ghana."],
    sub: "320+ completed projects spanning highways, bridges, drainage systems and public infrastructure — built to last generations.",
    accent: "var(--gold-light)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=1800&q=85&fit=crop",
    tag: "ISO 9001 Certified · 80+ Expert Engineers",
    headline: ["Expert Teams.", "Proven", "Processes."],
    sub: "Our 80+ engineers apply international quality standards to every project — from planning and procurement to commissioning.",
    accent: "var(--gold-bright)",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number, dir = 1) => {
      if (isTransitioning) return;
      setDirection(dir);
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 900);
    },
    [isTransitioning],
  );

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length, 1),
    [current, goTo],
  );
  const prev = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1),
    [current, goTo],
  );

  useEffect(() => {
    timerRef.current = setTimeout(next, 6500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, next]);

  const slide = SLIDES[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.9, ease: EASE_IN_OUT },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.9, ease: EASE_IN_OUT },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay: i * 0.14, ease: EASE_OUT },
    }),
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 620,
        overflow: "hidden",
      }}
    >
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        >
          {/* Photo with parallax scale */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 7, ease: "linear" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Deep gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, rgba(8,8,26,0.92) 0%, rgba(13,13,40,0.70) 48%, rgba(8,8,26,0.30) 100%)",
            }}
          />
          {/* Royal blue tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(45,45,143,0.22) 0%, transparent 60%)",
            }}
          />
          {/* Gold grid — architectural feel */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.055,
              backgroundImage: `
              linear-gradient(rgba(201,168,76,0.9) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,168,76,0.9) 1px, transparent 1px)
            `,
              backgroundSize: "52px 52px",
            }}
          />
          {/* Accent glow bottom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, rgba(201,168,76,0.12) 0%, transparent 50%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 clamp(1.5rem, 7vw, 8rem)",
          maxWidth: "950px",
          paddingTop: "3.75rem",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* Tag */}
            <motion.div
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "99px",
                padding: "0.45rem 1.1rem",
                fontSize: "0.73rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginBottom: "1.6rem",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "0.45rem",
                  height: "0.45rem",
                  borderRadius: "50%",
                  background: slide.accent,
                  flexShrink: 0,
                }}
              />
              {slide.tag}
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 6rem)",
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "#fff",
                margin: "0 0 1.6rem",
              }}
            >
              {slide.headline.map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {i === 0 ? (
                    <span
                      style={{
                        background: `linear-gradient(135deg, #fff 0%, ${slide.accent} 100%)`,
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
            </motion.h1>

            {/* Sub */}
            <motion.p
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: "clamp(0.9rem, 1.7vw, 1.12rem)",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.78,
                maxWidth: "520px",
                margin: "0 0 2.5rem",
              }}
            >
              {slide.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-accent animate-pulse-glow"
                style={{
                  padding: "0.9rem 2.2rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: "0.7rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                View Our Projects →
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
                style={{
                  padding: "0.9rem 2.2rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderRadius: "0.7rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Get a Quote
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow controls */}
      {[
        { fn: prev, pos: "left", icon: "←" },
        { fn: next, pos: "right", icon: "→" },
      ].map(({ fn, pos, icon }) => (
        <motion.button
          key={pos}
          onClick={fn}
          whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.22)" }}
          whileTap={{ scale: 0.93 }}
          style={{
            position: "absolute",
            [pos]: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: "2.8rem",
            height: "2.8rem",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </motion.button>
      ))}

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "0.55rem",
          alignItems: "center",
        }}
      >
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            animate={{
              width: i === current ? "2rem" : "0.5rem",
              background:
                i === current ? "var(--gold)" : "rgba(255,255,255,0.38)",
            }}
            transition={{ duration: 0.35 }}
            style={{
              height: "0.5rem",
              borderRadius: "99px",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
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
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6.5, ease: "linear" }}
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, var(--royal-light), var(--gold))",
          }}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: EASE_OUT }}
      className={scrolled ? "glass-nav" : ""}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "3.75rem",
        padding: "0 clamp(1rem, 4vw, 3rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: -4 }}
          style={{
            width: "2.1rem",
            height: "2.1rem",
            borderRadius: "0.5rem",
            background: "var(--gradient-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: scrolled ? "var(--navy)" : "white",
            fontWeight: 900,
            fontSize: "0.72rem",
            boxShadow: "var(--btn-accent-shadow)",
          }}
        >
          CE
        </motion.div>
        <div
          style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: "0.9rem",
              color: scrolled ? "var(--text-primary)" : "#fff",
            }}
          >
            Chicad
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.62)",
              fontWeight: 600,
            }}
          >
            Construction
          </span>
        </div>
      </Link>

      {/* Desktop links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.1rem",
          fontSize: "0.85rem",
        }}
      >
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
            whileHover={{
              background: scrolled
                ? "var(--glass-bg-hover)"
                : "rgba(255,255,255,0.12)",
            }}
            style={{
              padding: "0.45rem 0.85rem",
              borderRadius: "0.5rem",
              color: scrolled
                ? "var(--text-secondary)"
                : "rgba(255,255,255,0.8)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {l.label}
          </motion.a>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ThemeToggle />
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          className="btn-accent"
          style={{
            padding: "0.5rem 1.3rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            borderRadius: "0.6rem",
            whiteSpace: "nowrap",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          Get a Quote →
        </motion.a>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────
// STATS STRIP
// ─────────────────────────────────────────────
const STATS = [
  { value: "320+", label: "Projects Completed", icon: "🏗️" },
  { value: "15+", label: "Years Experience", icon: "📅" },
  { value: "98%", label: "Client Satisfaction", icon: "⭐" },
  { value: "80+", label: "Expert Engineers", icon: "👷" },
];

function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      style={{
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--divider)",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: i * 0.1,
              duration: 0.55,
              ease: EASE_OUT,
            }}
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              borderRight:
                i < STATS.length - 1 ? "1px solid var(--divider)" : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <motion.span
              animate={inView ? { scale: [0.6, 1.18, 1] } : {}}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
              style={{ fontSize: "1.5rem" }}
            >
              {s.icon}
            </motion.span>
            <span
              className="text-gradient-secondary"
              style={{ fontSize: "1.7rem", fontWeight: 800, display: "block" }}
            >
              {s.value}
            </span>
            <span
              style={{
                fontSize: "0.73rem",
                color: "var(--text-muted)",
                lineHeight: 1.35,
              }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────
const PILLARS = [
  {
    icon: "🏆",
    title: "Excellence",
    desc: "We hold ourselves to the highest standards in every project we deliver.",
  },
  {
    icon: "🤝",
    title: "Integrity",
    desc: "Honest communication and transparent processes with every client.",
  },
  {
    icon: "💡",
    title: "Innovation",
    desc: "Applying modern engineering solutions to complex challenges.",
  },
  {
    icon: "🌍",
    title: "Sustainability",
    desc: "Building with the environment and future generations in mind.",
  },
];

function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "5.5rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-base)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--gold)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            WHO WE ARE
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            About Chicad Engineering
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Founded in 2009, Chicad Engineering has grown into one of Ghana's
            most trusted construction and civil engineering firms.
          </p>
        </Reveal>

        {/* Two-column */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3.5rem",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          {/* Left visual */}
          <Reveal variants={slideInLeft}>
            <motion.div
              className="glass-gold"
              whileHover={{ boxShadow: "var(--glass-shadow-lg)" }}
              style={{ borderRadius: "1.5rem", padding: "2rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  className="text-gradient-secondary"
                  style={{ fontSize: "5rem", fontWeight: 900, lineHeight: 1 }}
                >
                  15
                </span>
                <div style={{ paddingBottom: "0.5rem" }}>
                  <p
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 900,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Years
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    of Building Excellence
                  </p>
                </div>
              </div>
              <div
                style={{
                  height: "1px",
                  background: "var(--divider)",
                  marginBottom: "1.5rem",
                }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                {[
                  { v: "320+", l: "Projects Completed" },
                  { v: "80+", l: "Engineers & Staff" },
                  { v: "12", l: "Regions Covered" },
                  { v: "98%", l: "On-Time Delivery" },
                ].map((item, i) => (
                  <motion.div
                    key={item.l}
                    className="glass-sm"
                    whileHover={{
                      scale: 1.04,
                      background: "var(--glass-bg-hover)",
                    }}
                    style={{ borderRadius: "0.75rem", padding: "1rem" }}
                  >
                    <p
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                        margin: "0 0 0.15rem",
                      }}
                    >
                      {item.v}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        margin: 0,
                      }}
                    >
                      {item.l}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Reveal>

          {/* Right text */}
          <Reveal variants={slideInRight}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                We combine decades of local expertise with international
                engineering standards to deliver infrastructure that lasts
                generations. From roads and bridges to commercial towers and
                residential estates.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {[
                  "Licensed by Ghana's Public Procurement Authority",
                  "Member of the Ghana Institution of Engineers",
                  "ISO 9001:2015 Quality Management Certified",
                  "ECOWAS regional construction clearance holder",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.45 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      style={{
                        width: "1.4rem",
                        height: "1.4rem",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "var(--badge-gold-bg)",
                        color: "var(--gold-dark)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </motion.span>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-accent"
                style={{
                  padding: "0.8rem 1.8rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  borderRadius: "0.65rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  alignSelf: "flex-start",
                }}
              >
                Work With Us →
              </motion.a>
            </div>
          </Reveal>
        </div>

        {/* Pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} custom={i}>
              <motion.div
                className="glass"
                whileHover={{ y: -6, boxShadow: "var(--glass-shadow-lg)" }}
                style={{
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  cursor: "default",
                  height: "100%",
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.25, rotate: 8 }}
                  style={{ fontSize: "1.8rem", display: "inline-block" }}
                >
                  {p.icon}
                </motion.span>
                <h3
                  style={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {p.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────────
const SERVICES = [
  {
    icon: "🏗️",
    title: "General Construction",
    desc: "Full-cycle construction management for residential, commercial, and industrial buildings from foundation to finishing.",
    features: [
      "Site preparation",
      "Structural works",
      "MEP installations",
      "Interior finishing",
    ],
    accent: "var(--gold)",
    bg: "var(--badge-gold-bg)",
    text: "var(--gold-deep)",
  },
  {
    icon: "🛣️",
    title: "Road & Infrastructure",
    desc: "Design and construction of highways, bridges, drainage systems, and public infrastructure across Ghana.",
    features: [
      "Road construction",
      "Bridge engineering",
      "Drainage systems",
      "Traffic management",
    ],
    accent: "var(--royal-light)",
    bg: "var(--badge-royal-bg)",
    text: "var(--royal-dark)",
  },
  {
    icon: "🏢",
    title: "Commercial Developments",
    desc: "Large-scale commercial buildings, shopping centres, office complexes, and mixed-use developments.",
    features: [
      "Office towers",
      "Retail centres",
      "Warehouses",
      "Mixed-use complexes",
    ],
    accent: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    text: "#065f46",
  },
  {
    icon: "🏠",
    title: "Residential Estates",
    desc: "Premium residential housing developments, gated communities, and affordable housing solutions.",
    features: [
      "Estate planning",
      "Custom homes",
      "Gated communities",
      "Affordable housing",
    ],
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    text: "#5b21b6",
  },
  {
    icon: "⚡",
    title: "Electrical Engineering",
    desc: "Industrial and commercial electrical installations, power systems, substations, and renewable energy solutions.",
    features: [
      "Power systems",
      "Substations",
      "Solar installation",
      "Street lighting",
    ],
    accent: "var(--gold-light)",
    bg: "rgba(232,197,106,0.12)",
    text: "var(--gold-deep)",
  },
  {
    icon: "💧",
    title: "Water & Sanitation",
    desc: "Borehole drilling, water treatment plants, sewage systems, and sanitation infrastructure for communities.",
    features: [
      "Borehole drilling",
      "Treatment plants",
      "Sewage systems",
      "Community water",
    ],
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    text: "#164e63",
  },
];

function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        padding: "5.5rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-gradient)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--royal-light)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            WHAT WE DO
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Our Services
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            End-to-end engineering solutions tailored to your project needs,
            delivered on time and within budget.
          </p>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} custom={i % 3}>
              <motion.div
                className="glass"
                whileHover={{ y: -6, boxShadow: "var(--glass-shadow-lg)" }}
                style={{
                  padding: "1.6rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.9rem",
                  cursor: "default",
                  borderTop: `3px solid ${s.accent}`,
                  height: "100%",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.75rem",
                    background: s.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  {s.icon}
                </motion.div>
                <h3
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    margin: 0,
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  {s.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span
                        style={{
                          width: "0.35rem",
                          height: "0.35rem",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: s.accent,
                        }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: s.text,
                    background: s.bg,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "99px",
                    width: "fit-content",
                    marginTop: "auto",
                  }}
                >
                  ✓ Available now
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PROJECTS SECTION
// ─────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Accra Ring Road Expansion",
    category: "Roads",
    location: "Accra, Greater Accra",
    year: "2023",
    status: "Completed",
    value: "$4.2M",
    desc: "12km dual carriageway expansion with modern drainage systems and street lighting.",
    icon: "🛣️",
    accent: "var(--royal-light)",
    bg: "var(--badge-royal-bg)",
  },
  {
    title: "Kumasi Commercial Tower",
    category: "Buildings",
    location: "Kumasi, Ashanti",
    year: "2023",
    status: "Completed",
    value: "$8.7M",
    desc: "18-storey mixed-use commercial tower with underground parking and green rooftop.",
    icon: "🏢",
    accent: "var(--gold)",
    bg: "var(--badge-gold-bg)",
  },
  {
    title: "Tema Housing Estate",
    category: "Residential",
    location: "Tema, Greater Accra",
    year: "2024",
    status: "Ongoing",
    value: "$12.1M",
    desc: "240-unit gated residential estate with school, clinic, and retail facilities.",
    icon: "🏘️",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
  {
    title: "Volta River Water Plant",
    category: "Water",
    location: "Volta Region",
    year: "2022",
    status: "Completed",
    value: "$3.5M",
    desc: "20,000m³/day water treatment plant serving 5 communities in the Volta Region.",
    icon: "💧",
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
  },
  {
    title: "Northern Grid Substation",
    category: "Power",
    location: "Tamale, Northern Region",
    year: "2024",
    status: "Ongoing",
    value: "$6.8M",
    desc: "132kV power substation expanding electricity access to 3 northern districts.",
    icon: "⚡",
    accent: "var(--gold-light)",
    bg: "rgba(232,197,106,0.12)",
  },
  {
    title: "Cape Coast Bridge",
    category: "Roads",
    location: "Cape Coast, Central Region",
    year: "2023",
    status: "Completed",
    value: "$2.9M",
    desc: "200m span reinforced concrete bridge replacing an aging colonial-era structure.",
    icon: "🌉",
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
  },
];

function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = [
    "All",
    "Roads",
    "Buildings",
    "Residential",
    "Water",
    "Power",
  ];
  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      style={{
        padding: "5.5rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-base)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--gold)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            OUR WORK
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Featured Projects
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Landmark projects that define our engineering capability and
            commitment to quality.
          </p>
        </Reveal>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "0.65rem",
                fontSize: "0.83rem",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background:
                  activeFilter === f
                    ? "var(--btn-accent-bg)"
                    : "var(--glass-bg)",
                color:
                  activeFilter === f
                    ? "var(--btn-accent-text)"
                    : "var(--text-muted)",
                backdropFilter: "blur(12px)",
                boxShadow:
                  activeFilter === f
                    ? "var(--btn-accent-shadow)"
                    : "var(--glass-shadow)",
                transition: "background 0.25s, color 0.25s",
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass"
                whileHover={{ y: -6, boxShadow: "var(--glass-shadow-lg)" }}
                style={{
                  borderRadius: "1rem",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    background: p.bg,
                    padding: "1.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `2px solid ${p.accent}22`,
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 6 }}
                    style={{ fontSize: "2.8rem", display: "inline-block" }}
                  >
                    {p.icon}
                  </motion.span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.75rem",
                        borderRadius: "99px",
                        background:
                          p.status === "Completed"
                            ? "rgba(16,185,129,0.15)"
                            : "var(--badge-gold-bg)",
                        color:
                          p.status === "Completed"
                            ? "#065f46"
                            : "var(--gold-deep)",
                      }}
                    >
                      {p.status === "Completed" ? "✓ " : "⏳ "}
                      {p.status}
                    </span>
                    <span
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                      }}
                    >
                      {p.value}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {p.category} · {p.year}
                  </span>
                  <h3
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.73rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    📍 {p.location}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      margin: "0.25rem 0 0",
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TEAM SECTION
// ─────────────────────────────────────────────
const TEAM = [
  {
    name: "Ing. Kwame Chicad",
    role: "Founder & CEO",
    dept: "Civil Engineering",
    exp: "25 years",
    emoji: "👨🏾‍💼",
    accent: "var(--gold)",
  },
  {
    name: "Ing. Linda Osei-Bonsu",
    role: "Chief Engineer",
    dept: "Structural Engineering",
    exp: "18 years",
    emoji: "👩🏾‍🔧",
    accent: "var(--royal-light)",
  },
  {
    name: "Ing. Samuel Darko",
    role: "Project Director",
    dept: "Infrastructure",
    exp: "15 years",
    emoji: "👨🏾‍🔬",
    accent: "#10b981",
  },
  {
    name: "Ing. Ama Acheampong",
    role: "Head of Design",
    dept: "Architectural Engineering",
    exp: "12 years",
    emoji: "👩🏾‍💻",
    accent: "#8b5cf6",
  },
];

function TeamSection() {
  return (
    <section
      id="team"
      style={{
        padding: "5.5rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-gradient)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--royal-light)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            OUR PEOPLE
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Meet the Leadership
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Experienced engineers and managers who bring world-class expertise
            to every project.
          </p>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          {TEAM.map((member, i) => (
            <Reveal key={member.name} custom={i}>
              <motion.div
                className="glass"
                whileHover={{ y: -6, boxShadow: "var(--glass-shadow-lg)" }}
                style={{
                  borderRadius: "1rem",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "1rem",
                  borderTop: `3px solid ${member.accent}`,
                  cursor: "default",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: -4 }}
                  className="glass-sm"
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {member.emoji}
                </motion.div>
                <div>
                  <p
                    style={{
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      color: "var(--text-primary)",
                      margin: "0 0 0.2rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {member.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: member.accent,
                      margin: "0 0 0.15rem",
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {member.dept}
                  </p>
                </div>
                <span
                  className="glass-sm"
                  style={{
                    padding: "0.3rem 0.8rem",
                    borderRadius: "99px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  {member.exp} experience
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Join CTA */}
        <Reveal>
          <motion.div
            className="glass-gold gradient-border-gold"
            whileHover={{ boxShadow: "var(--glass-shadow-lg)" }}
            style={{
              borderRadius: "1.25rem",
              padding: "2rem 2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  margin: "0 0 0.4rem",
                }}
              >
                Join Our Team
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  margin: 0,
                  maxWidth: "380px",
                }}
              >
                We're always looking for talented engineers, architects, and
                project managers to grow with us.
              </p>
            </div>
            <motion.a
              href="mailto:careers@chicadengineering.com"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-accent"
              style={{
                padding: "0.8rem 1.8rem",
                fontSize: "0.9rem",
                fontWeight: 700,
                borderRadius: "0.65rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                flexShrink: 0,
              }}
            >
              View Open Roles →
            </motion.a>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CONTACT SECTION
// ─────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
  };

  const contacts = [
    {
      icon: "📍",
      label: "Head Office",
      value: "15 Independence Ave, Accra, Ghana",
    },
    { icon: "📞", label: "Phone", value: "+233 302 000 001" },
    { icon: "✉️", label: "Email", value: "info@chicadengineering.com" },
    {
      icon: "🕐",
      label: "Working Hours",
      value: "Mon – Fri, 8:00 AM – 5:00 PM",
    },
  ];

  return (
    <section
      id="contact"
      style={{
        padding: "5.5rem clamp(1.5rem, 5vw, 3rem)",
        background: "var(--bg-base)",
        borderTop: "1px solid var(--divider)",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--gold)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            GET IN TOUCH
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: "0 0 0.75rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Start Your Project
          </h2>
          <p
            style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Ready to build something great? Reach out for a free consultation
            and project quote.
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Contact info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {contacts.map((c, i) => (
              <Reveal key={c.label} custom={i}>
                <motion.div
                  className="glass-sm"
                  whileHover={{ x: 4, background: "var(--glass-bg-hover)" }}
                  style={{
                    borderRadius: "0.9rem",
                    padding: "1.1rem 1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.9rem",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
                    {c.icon}
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: "0.67rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: "0 0 0.2rem",
                      }}
                    >
                      {c.label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {c.value}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
            <Reveal>
              <div
                className="glass"
                style={{
                  borderRadius: "0.9rem",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  height: "8rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🗺️</span>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Accra, Ghana
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal variants={slideInRight}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass"
                  style={{
                    borderRadius: "1.25rem",
                    padding: "3rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    textAlign: "center",
                    minHeight: "420px",
                  }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    style={{ fontSize: "3rem" }}
                  >
                    ✅
                  </motion.span>
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 900,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Message Received!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      maxWidth: "300px",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    Our team will get back to you within 24 hours.
                  </p>
                  <motion.button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        service: "",
                        message: "",
                      });
                    }}
                    whileHover={{ scale: 1.04 }}
                    className="btn-accent"
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.75rem 1.75rem",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      borderRadius: "0.65rem",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="glass"
                  style={{
                    borderRadius: "1.25rem",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: "0 0 0.25rem",
                    }}
                  >
                    Request a Free Quote
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.85rem",
                    }}
                  >
                    {[
                      {
                        label: "Full Name *",
                        key: "name",
                        type: "text",
                        placeholder: "Kwame Asante",
                        required: true,
                      },
                      {
                        label: "Email *",
                        key: "email",
                        type: "email",
                        placeholder: "kwame@company.com",
                        required: true,
                      },
                      {
                        label: "Phone",
                        key: "phone",
                        type: "text",
                        placeholder: "+233 24 000 0000",
                        required: false,
                      },
                    ].map((field) => (
                      <div
                        key={field.key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        <label
                          style={{
                            fontSize: "0.67rem",
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {field.label}
                        </label>
                        <input
                          required={field.required}
                          type={field.type}
                          value={(form as any)[field.key]}
                          onChange={(e) =>
                            setForm({ ...form, [field.key]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          className="glass-input"
                          style={{
                            padding: "0.7rem 0.9rem",
                            fontSize: "0.85rem",
                          }}
                        />
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.35rem",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "0.67rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Service Needed
                      </label>
                      <select
                        value={form.service}
                        onChange={(e) =>
                          setForm({ ...form, service: e.target.value })
                        }
                        className="glass-input"
                        style={{
                          padding: "0.7rem 0.9rem",
                          fontSize: "0.85rem",
                        }}
                      >
                        <option value="">Select a service…</option>
                        <option>General Construction</option>
                        <option>Road & Infrastructure</option>
                        <option>Commercial Development</option>
                        <option>Residential Estate</option>
                        <option>Electrical Engineering</option>
                        <option>Water & Sanitation</option>
                      </select>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.67rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Project Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Describe your project, timeline, budget range…"
                      className="glass-input"
                      style={{
                        padding: "0.7rem 0.9rem",
                        fontSize: "0.85rem",
                        resize: "none",
                      }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={!sending ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!sending ? { scale: 0.97 } : {}}
                    className="btn-accent"
                    style={{
                      padding: "0.85rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      cursor: sending ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      opacity: sending ? 0.75 : 1,
                      borderRadius: "0.65rem",
                      border: "none",
                    }}
                  >
                    {sending ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{
                            width: "1rem",
                            height: "1rem",
                            border: "2px solid rgba(255,255,255,0.35)",
                            borderTopColor: "white",
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        />
                        Sending…
                      </>
                    ) : (
                      "Send Message →"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--divider)",
        padding: "1.75rem 2rem",
        background: "var(--bg-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "0.5rem",
            background: "var(--gradient-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--navy)",
            fontWeight: 900,
            fontSize: "0.65rem",
          }}
        >
          CE
        </motion.div>
        <div>
          <p
            style={{
              fontWeight: 800,
              fontSize: "0.82rem",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Chicad Engineering
          </p>
          <p
            style={{
              fontSize: "0.67rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Building Excellence Since 2009
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {["About", "Services", "Projects", "Team", "Contact"].map((l) => (
          <motion.a
            key={l}
            href={`#${l.toLowerCase()}`}
            whileHover={{ color: "var(--text-primary)" }}
            style={{
              fontSize: "0.77rem",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            {l}
          </motion.a>
        ))}
        <Link
          href="/academy"
          style={{
            fontSize: "0.77rem",
            color: "var(--gold)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Academy Portal →
        </Link>
      </div>
      <p
        style={{
          fontSize: "0.72rem",
          color: "var(--text-disabled)",
          margin: 0,
        }}
      >
        © {new Date().getFullYear()} Chicad Engineering Ltd.
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function ConstructionPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <HeroSlider />
      <StatsStrip />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <TeamSection />
      <ContactSection />

      {/* Final CTA */}
      <section
        style={{
          padding: "6rem clamp(1.5rem, 5vw, 3rem)",
          background: "var(--bg-gradient)",
          borderTop: "1px solid var(--divider)",
          textAlign: "center",
        }}
      >
        <Reveal
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: -4 }}
            className="animate-pulse-glow"
            style={{
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "1.2rem",
              background: "var(--gradient-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--navy)",
              fontWeight: 900,
              fontSize: "1.4rem",
              boxShadow: "var(--btn-accent-shadow-hover)",
            }}
          >
            CE
          </motion.div>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              margin: 0,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Ready to build something great?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              margin: 0,
              maxWidth: "460px",
            }}
          >
            Contact Chicad Engineering today for a free consultation. Our team
            is ready to bring your vision to life.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-accent animate-pulse-glow"
              style={{
                padding: "0.95rem 2.8rem",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "0.75rem",
                textDecoration: "none",
                display: "inline-flex",
              }}
            >
              Get a Free Quote →
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/academy"
                className="btn-secondary"
                style={{
                  padding: "0.95rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  display: "inline-flex",
                }}
              >
                Visit our Academy →
              </Link>
            </motion.div>
          </div>
          <p
            style={{
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            📍 Head Office: Accra, Ghana · 🏅 ISO 9001 Certified
          </p>
        </Reveal>
      </section>

      <Footer />

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 3.75rem; }
        @media (max-width: 700px) { nav a { display: none; } }
        @media (max-width: 800px) {
          div[style*="grid-template-columns: 1fr 1fr"],
          div[style*="grid-template-columns: 2fr 3fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
