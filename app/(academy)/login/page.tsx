"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useTheme } from "@/hooks/useTheme";

/* ─────────────────────────────────────────────
   Responsive Logo
───────────────────────────────────────────── */
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

  const breakpoints = {
    xs: screenWidth <= 480,
    sm: screenWidth > 480 && screenWidth <= 640,
    md: screenWidth > 640 && screenWidth <= 768,
  };

  let logoSrc =
    theme === "light" ? "/images/logowhite.png" : "/images/logo.png";
  let logoWidth = 180;

  if (breakpoints.xs || breakpoints.sm || breakpoints.md) {
    logoSrc =
      theme === "light"
        ? "/images/logosmalllight.png"
        : "/images/logosmallblue.png";

    if (breakpoints.xs) logoWidth = 70;
    else if (breakpoints.sm) logoWidth = 85;
    else logoWidth = 100;
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
        cursor: "pointer",
        background: "transparent",
        border: "none",
        transform: hovered ? "translateY(-2px) scale(1.03)" : "none",
        transition:
          "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
      }}
      aria-label="Back Home"
    >
      <Image
        src={logoSrc}
        alt="Chicad Engineering"
        width={logoWidth}
        height={logoWidth}
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

/* ─────────────────────────────────────────────
   Theme Toggle
───────────────────────────────────────────── */
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
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "1.1rem",
        color: "white",
        transition: "all 0.3s ease",
      }}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Spinner
───────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      style={{
        width: "1rem",
        height: "1rem",
        animation: "spin 0.7s linear infinite",
      }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.2"
      />
      <path
        d="M22 12A10 10 0 0012 2"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
const STUDENT_ID_PATTERN = /^[A-Z]{2,}-\d{4}-\d{4}$/i;

export default function StudentLoginPage() {
  const router = useRouter();

  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [mounted, setMounted] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    studentId?: string;
    password?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else if (!STUDENT_ID_PATTERN.test(studentId.trim())) {
      newErrors.studentId = "Invalid format (example: ACA-2024-0001)";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await login(studentId.trim(), password);

      success("Welcome back!", "Redirecting to your dashboard...");

      router.push("/academy/dashboard");
    } catch (err: unknown) {
      toastError(
        "Login Failed",
        err instanceof Error ? err.message : "Invalid credentials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/images/academy-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          zIndex: -3,
        }}
      />

      {/* DARK OVERLAY */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: `
            linear-gradient(
              135deg,
              rgba(2,6,23,0.96) 0%,
              rgba(2,6,23,0.90) 35%,
              rgba(2,6,23,0.72) 65%,
              rgba(2,6,23,0.38) 100%
            )
          `,
          zIndex: -2,
        }}
      />

      {/* EXTRA GLOW */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-15%",
          left: "-10%",
          width: "32rem",
          height: "32rem",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: -1,
        }}
      />

      <LogoButton />
      <ThemeToggle />

      {/* LOGIN */}
      <div
        style={{
          width: "100%",
          maxWidth: "30rem",
          position: "relative",
          animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",

            borderRadius: "2rem",

            padding: "2.8rem",

            background: "rgba(255,255,255,0.03)",

            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",

            boxShadow: `
              0 8px 40px rgba(0,0,0,0.20),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* TOP GLOW */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-25%",
              left: "-15%",
              width: "18rem",
              height: "18rem",
              background:
                "radial-gradient(circle, rgba(14,165,233,0.20) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* BOTTOM GLOW */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-35%",
              right: "-20%",
              width: "18rem",
              height: "18rem",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />

          {/* CONTENT */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "1.8rem",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "1.5rem",
                  background: "linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                  boxShadow: "0 12px 30px rgba(14,165,233,0.35)",
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}
              >
                🎓
              </div>

              <div>
                <h1
                  style={{
                    fontSize: "clamp(2rem,4vw,2.6rem)",
                    fontWeight: 900,
                    color: "white",
                    margin: 0,
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                  }}
                >
                  Student Portal
                </h1>

                <p
                  style={{
                    marginTop: "0.8rem",
                    marginBottom: 0,
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.7,
                    fontSize: "0.92rem",
                  }}
                >
                  Access your courses, grades, attendance and learning
                  resources.
                </p>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* STUDENT ID */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  Student ID
                </label>

                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1rem",
                      opacity: 0.7,
                    }}
                  >
                    🪪
                  </span>

                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="ACA-2024-0001"
                    autoComplete="username"
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 2.8rem",

                      background: "rgba(255,255,255,0.04)",

                      backdropFilter: "blur(14px)",

                      border: errors.studentId
                        ? "1px solid rgba(239,68,68,0.6)"
                        : "1px solid rgba(255,255,255,0.08)",

                      borderRadius: "1rem",

                      color: "white",

                      outline: "none",

                      fontSize: "0.92rem",

                      transition: "all 0.25s ease",
                    }}
                  />
                </div>

                {errors.studentId && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "#f87171",
                    }}
                  >
                    {errors.studentId}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  Password
                </label>

                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1rem",
                      opacity: 0.7,
                    }}
                  >
                    🔒
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      padding: "1rem 3rem 1rem 2.8rem",

                      background: "rgba(255,255,255,0.04)",

                      backdropFilter: "blur(14px)",

                      border: errors.password
                        ? "1px solid rgba(239,68,68,0.6)"
                        : "1px solid rgba(255,255,255,0.08)",

                      borderRadius: "1rem",

                      color: "white",

                      outline: "none",

                      fontSize: "0.92rem",

                      transition: "all 0.25s ease",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.password && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "#f87171",
                    }}
                  >
                    {errors.password}
                  </span>
                )}
              </div>

              {/* FORGOT PASSWORD */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",

                  padding: "1rem 1.5rem",

                  borderRadius: "1rem",

                  border: "none",

                  background: "linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%)",

                  color: "white",

                  fontSize: "0.95rem",

                  fontWeight: 800,

                  cursor: isLoading ? "not-allowed" : "pointer",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",

                  boxShadow: "0 12px 30px rgba(14,165,233,0.35)",

                  transition: "transform 0.25s ease, box-shadow 0.25s ease",

                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login to Academy
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div
              style={{
                textAlign: "center",
                fontSize: "0.72rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.42)",
              }}
            >
              © {new Date().getFullYear()} Chicad Engineering
              <br />
              Secure Student Authentication System
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder {
          color: rgba(255,255,255,0.35);
        }

        input:focus {
          border-color: rgba(14,165,233,0.5) !important;

          box-shadow:
            0 0 0 4px rgba(14,165,233,0.10),
            0 8px 30px rgba(14,165,233,0.08);

          transform: translateY(-1px);
        }

        button:hover {
          transform: translateY(-1px);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow:
              0 12px 30px rgba(14,165,233,0.25);
          }

          50% {
            box-shadow:
              0 16px 40px rgba(14,165,233,0.45);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
