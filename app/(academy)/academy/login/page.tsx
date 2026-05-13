"use client";

import { useState, ChangeEvent, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";
import { useToastContext } from "@/context/ToastContext";
import { useAuthContext } from "@/context/AuthContext";

/* ─── Style helpers ─────────────────────────────────────────── */
const glassStyle = (bg = "rgba(14,111,168,0.12)"): CSSProperties => ({
  background: bg,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(125,211,252,0.18)",
  boxShadow:
    "0 4px 24px rgba(5,20,40,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
});

const labelStyle: CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(125,211,252,0.75)",
  marginBottom: "0.45rem",
  display: "block",
};

const inputBase: CSSProperties = {
  width: "100%",
  padding: "0.82rem 1rem",
  background: "rgba(7,24,40,0.55)",
  border: "1px solid rgba(125,211,252,0.18)",
  borderRadius: "0.65rem",
  color: "var(--text-primary, #e2f4ff)",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

/* ─── Constants ─────────────────────────────────────────────── */
const STUDENT_ID_PATTERN = /^[A-Z]{2,}-\d{4}-\d{4}$/i;

/* ─── Background ─────────────────────────────────────────────── */
function BgScene() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url(/images/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.38,
          zIndex: -2,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(14,111,168,0.20) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(99,102,241,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 60% 15%, rgba(14,111,168,0.12) 0%, transparent 50%),
            linear-gradient(145deg, rgba(7,24,40,0.75) 0%, rgba(10,34,54,0.70) 40%, rgba(6,14,24,0.80) 100%)
          `,
          zIndex: -1,
        }}
      />
    </>
  );
}

/* ─── Floating input with focus glow ────────────────────────── */
function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightSlot,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: string;
  rightSlot?: React.ReactNode;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        {/* Left icon */}
        <span
          style={{
            position: "absolute",
            left: "0.9rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1rem",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            ...inputBase,
            paddingLeft: "2.6rem",
            paddingRight: rightSlot ? "3rem" : "1rem",
            borderColor: error
              ? "rgba(239,68,68,0.6)"
              : focused
                ? "rgba(125,211,252,0.55)"
                : "rgba(125,211,252,0.18)",
            boxShadow: error
              ? "0 0 0 3px rgba(239,68,68,0.15)"
              : focused
                ? "0 0 0 3px rgba(14,111,168,0.25)"
                : "none",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* Right slot (e.g. show/hide password) */}
        {rightSlot && (
          <span
            style={{
              position: "absolute",
              right: "0.9rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          >
            {rightSlot}
          </span>
        )}
      </div>

      {error && (
        <span
          style={{
            fontSize: "0.72rem",
            color: "#f87171",
            marginTop: "0.35rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}

/* ─── Gradient text ──────────────────────────────────────────── */
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background:
          "linear-gradient(135deg, #7dd3fc 0%, #6366f1 50%, #0ea5e9 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Divider ────────────────────────────────────────────────── */
function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        margin: "0.25rem 0",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "rgba(125,211,252,0.10)",
        }}
      />
      <span
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "rgba(125,211,252,0.35)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "rgba(125,211,252,0.10)",
        }}
      />
    </div>
  );
}

/* ─── Social button ──────────────────────────────────────────── */
function SocialBtn({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.7rem 0.5rem",
        borderRadius: "0.65rem",
        border: hovered
          ? "1px solid rgba(125,211,252,0.30)"
          : "1px solid rgba(125,211,252,0.14)",
        background: hovered ? "rgba(14,111,168,0.22)" : "rgba(7,24,40,0.50)",
        color: "var(--text-secondary, rgba(180,210,240,0.8))",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.18s",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: "1rem" }}>{icon}</span>
      {label}
    </button>
  );
}

/* ─── Types ──────────────────────────────────────────────────── */
type Mode = "login" | "signup" | "forgot";

/* ─── Login Page ─────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const { success, error: showError } = useToastContext();
  const { login: authLogin } = useAuthContext();

  const [mode, setMode] = useState<Mode>("login");

  /* login */
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  /* signup extras */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  /* forgot */
  const [forgotStudentId, setForgotStudentId] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  /* ui */
  const [loading, setLoading] = useState(false);

  /* field errors */
  const [fieldErrors, setFieldErrors] = useState<{
    studentId?: string;
    email?: string;
    password?: string;
    confirmPass?: string;
    fullName?: string;
  }>({});

  /* ── helpers ── */
  const reset = () => {
    setFieldErrors({});
    setLoading(false);
  };

  const switchMode = (m: Mode) => {
    reset();
    setMode(m);
  };

  /* ── validation ── */
  const validateLogin = () => {
    const errors: typeof fieldErrors = {};

    if (!studentId.trim()) {
      errors.studentId = "Student ID is required";
    } else if (!STUDENT_ID_PATTERN.test(studentId.trim())) {
      errors.studentId = "Invalid format (e.g., ACA-2024-0001)";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignup = () => {
    const errors: typeof fieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!studentId.trim()) {
      errors.studentId = "Student ID is required";
    } else if (!STUDENT_ID_PATTERN.test(studentId.trim())) {
      errors.studentId = "Invalid format (e.g., ACA-2024-0001)";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPass) {
      errors.confirmPass = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ── API calls ── */
  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    setFieldErrors({});

    try {
      // Use the auth context login function
      await authLogin(studentId.trim(), password);
      success("Welcome back!", "Redirecting to your dashboard...");
    } catch (err: unknown) {
      showError(
        "Login Failed",
        err instanceof Error ? err.message : "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;

    setLoading(true);
    setFieldErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          studentId: studentId.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      success(
        "Account Created!",
        "Your account has been created successfully. You can now sign in.",
      );

      // Reset form
      setFullName("");
      setStudentId("");
      setEmail("");
      setPassword("");
      setConfirmPass("");

      setTimeout(() => {
        switchMode("login");
      }, 1500);
    } catch (err: unknown) {
      showError(
        "Registration Failed",
        err instanceof Error ? err.message : "Please try again later",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!forgotStudentId.trim()) {
      showError("Required Field", "Please enter your Student ID");
      return;
    }

    if (!STUDENT_ID_PATTERN.test(forgotStudentId.trim())) {
      showError(
        "Invalid Format",
        "Student ID format should be like: ACA-2024-0001",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: forgotStudentId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setForgotSent(true);
      success(
        "Reset Link Sent!",
        "Check your email for password reset instructions",
      );
    } catch (err: unknown) {
      showError(
        "Request Failed",
        err instanceof Error ? err.message : "Unable to send reset link",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── password strength ── */
  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"][
    strength
  ];

  /* ── show/hide password button ── */
  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(125,211,252,0.45)",
        fontSize: "1rem",
        padding: 0,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
      }}
      tabIndex={-1}
    >
      {show ? "🙈" : "👁️"}
    </button>
  );

  /* ── card titles ── */
  const titles: Record<
    Mode,
    { eyebrow: string; heading: React.ReactNode; sub: string }
  > = {
    login: {
      eyebrow: "Welcome back",
      heading: (
        <>
          Sign in to <GradientText>CHICAD</GradientText>
        </>
      ),
      sub: "Access your academy dashboard, courses, and progress.",
    },
    signup: {
      eyebrow: "Join the Academy",
      heading: (
        <>
          Create your <GradientText>account</GradientText>
        </>
      ),
      sub: "Start your journey with CHICAD Academy today.",
    },
    forgot: {
      eyebrow: "Account recovery",
      heading: (
        <>
          Reset your <GradientText>password</GradientText>
        </>
      ),
      sub: "We'll send a reset link to your registered email address.",
    },
  };

  const { eyebrow, heading, sub } = titles[mode];

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          position: "relative",
        }}
      >
        <BgScene />
        <Header onSignIn={() => {}} />

        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 1.5rem 3rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ width: "100%", maxWidth: "440px" }}>
            {/* ── Eyebrow + heading ── */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                animation: "fadeSlideIn 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.25rem 0.9rem",
                  borderRadius: "2rem",
                  background: "rgba(14,111,168,0.18)",
                  border: "1px solid rgba(125,211,252,0.18)",
                  marginBottom: "0.9rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.63rem",
                    fontWeight: 700,
                    color: "#7dd3fc",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  ✦ {eyebrow}
                </span>
              </div>

              <h1
                style={{
                  margin: "0 0 0.55rem",
                  fontSize: "clamp(1.65rem, 4vw, 2.1rem)",
                  fontWeight: 900,
                  color: "var(--text-primary, #e2f4ff)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                }}
              >
                {heading}
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "var(--text-secondary, rgba(180,210,240,0.58))",
                  lineHeight: 1.7,
                }}
              >
                {sub}
              </p>
            </div>

            {/* ── Glass card ── */}
            <div
              style={{
                ...glassStyle("rgba(14,111,168,0.12)"),
                borderRadius: "1.5rem",
                padding: "2rem",
                animation: "fadeSlideIn 0.35s ease",
              }}
            >
              {/* ════════════════════════════════
                  LOGIN FORM
              ════════════════════════════════ */}
              {mode === "login" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.1rem",
                  }}
                >
                  {/* Social login row */}
                  <div style={{ display: "flex", gap: "0.65rem" }}>
                    <SocialBtn icon="🔵" label="Google" />
                    <SocialBtn icon="⬛" label="GitHub" />
                  </div>

                  <Divider label="or sign in with Student ID" />

                  <FloatingInput
                    label="Student ID"
                    type="text"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      setFieldErrors({ ...fieldErrors, studentId: undefined });
                    }}
                    placeholder="ACA-2024-0001"
                    icon="🪪"
                    error={fieldErrors.studentId}
                  />

                  <FloatingInput
                    label="Password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors({ ...fieldErrors, password: undefined });
                    }}
                    placeholder="••••••••"
                    icon="🔒"
                    error={fieldErrors.password}
                    rightSlot={
                      <EyeBtn
                        show={showPass}
                        toggle={() => setShowPass((v) => !v)}
                      />
                    }
                  />

                  {/* Remember + forgot row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        color: "rgba(180,210,240,0.7)",
                        fontWeight: 500,
                      }}
                    >
                      <div
                        onClick={() => setRemember((v) => !v)}
                        style={{
                          width: "1.1rem",
                          height: "1.1rem",
                          borderRadius: "0.3rem",
                          border: remember
                            ? "2px solid #7dd3fc"
                            : "2px solid rgba(125,211,252,0.25)",
                          background: remember
                            ? "rgba(14,111,168,0.5)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.18s",
                          flexShrink: 0,
                        }}
                      >
                        {remember && (
                          <span
                            style={{ color: "#7dd3fc", fontSize: "0.65rem" }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      Remember me
                    </label>

                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#7dd3fc",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <SubmitBtn
                    loading={loading}
                    label="Sign In"
                    loadingLabel="Signing in…"
                    onClick={handleLogin}
                  />

                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                      fontSize: "0.78rem",
                      color: "rgba(180,210,240,0.55)",
                    }}
                  >
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#7dd3fc",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                        fontSize: "0.78rem",
                      }}
                    >
                      Create one →
                    </button>
                  </p>
                </div>
              )}

              {/* ════════════════════════════════
                  SIGN-UP FORM
              ════════════════════════════════ */}
              {mode === "signup" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.1rem",
                  }}
                >
                  <FloatingInput
                    label="Full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setFieldErrors({ ...fieldErrors, fullName: undefined });
                    }}
                    placeholder="Jean-Baptiste Ngono"
                    icon="👤"
                    error={fieldErrors.fullName}
                  />

                  <FloatingInput
                    label="Student ID"
                    type="text"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      setFieldErrors({ ...fieldErrors, studentId: undefined });
                    }}
                    placeholder="ACA-2024-0001"
                    icon="🪪"
                    error={fieldErrors.studentId}
                  />

                  <FloatingInput
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors({ ...fieldErrors, email: undefined });
                    }}
                    placeholder="you@example.com"
                    icon="✉️"
                    error={fieldErrors.email}
                  />

                  <div>
                    <FloatingInput
                      label="Password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors({ ...fieldErrors, password: undefined });
                      }}
                      placeholder="Min. 8 characters"
                      icon="🔒"
                      error={fieldErrors.password}
                      rightSlot={
                        <EyeBtn
                          show={showPass}
                          toggle={() => setShowPass((v) => !v)}
                        />
                      }
                    />
                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <div
                          style={{
                            height: "3px",
                            background: "rgba(125,211,252,0.09)",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${(strength / 4) * 100}%`,
                              background: strengthColor,
                              borderRadius: "2px",
                              transition: "width 0.3s ease, background 0.3s",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            margin: "0.3rem 0 0",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: strengthColor,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {strengthLabel}
                        </p>
                      </div>
                    )}
                  </div>

                  <FloatingInput
                    label="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      setFieldErrors({
                        ...fieldErrors,
                        confirmPass: undefined,
                      });
                    }}
                    placeholder="Repeat your password"
                    icon="🔑"
                    error={fieldErrors.confirmPass}
                    rightSlot={
                      <EyeBtn
                        show={showConfirm}
                        toggle={() => setShowConfirm((v) => !v)}
                      />
                    }
                  />

                  {/* Match indicator */}
                  {confirmPass.length > 0 && !fieldErrors.confirmPass && (
                    <p
                      style={{
                        margin: "-0.55rem 0 0",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: password === confirmPass ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {password === confirmPass
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}

                  <SubmitBtn
                    loading={loading}
                    label="Create Account"
                    loadingLabel="Creating account…"
                    onClick={handleSignup}
                  />

                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                      fontSize: "0.78rem",
                      color: "rgba(180,210,240,0.55)",
                    }}
                  >
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#7dd3fc",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                        fontSize: "0.78rem",
                      }}
                    >
                      Sign in →
                    </button>
                  </p>
                </div>
              )}

              {/* ════════════════════════════════
                  FORGOT PASSWORD
              ════════════════════════════════ */}
              {mode === "forgot" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.1rem",
                  }}
                >
                  {forgotSent ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "1.5rem 0.5rem",
                        animation: "fadeSlideIn 0.3s ease",
                      }}
                    >
                      <div
                        style={{ fontSize: "2.8rem", marginBottom: "0.75rem" }}
                      >
                        📬
                      </div>
                      <p
                        style={{
                          margin: "0 0 0.4rem",
                          fontSize: "1rem",
                          fontWeight: 800,
                          color: "var(--text-primary, #e2f4ff)",
                        }}
                      >
                        Check your inbox
                      </p>
                      <p
                        style={{
                          margin: "0 0 1.4rem",
                          fontSize: "0.82rem",
                          color: "rgba(180,210,240,0.6)",
                          lineHeight: 1.65,
                        }}
                      >
                        We sent a password reset link to the email associated
                        with{" "}
                        <strong style={{ color: "#7dd3fc" }}>
                          {forgotStudentId}
                        </strong>
                        . Check your spam folder if you don't see it.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotSent(false);
                          setForgotStudentId("");
                          switchMode("login");
                        }}
                        style={{
                          padding: "0.7rem 1.5rem",
                          borderRadius: "0.65rem",
                          border: "1px solid rgba(125,211,252,0.20)",
                          background: "rgba(14,111,168,0.15)",
                          color: "#7dd3fc",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.18s",
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
                        ← Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <>
                      <FloatingInput
                        label="Student ID"
                        type="text"
                        value={forgotStudentId}
                        onChange={(e) => setForgotStudentId(e.target.value)}
                        placeholder="ACA-2024-0001"
                        icon="🪪"
                      />

                      <SubmitBtn
                        loading={loading}
                        label="Send Reset Link"
                        loadingLabel="Sending…"
                        onClick={handleForgot}
                      />

                      <p
                        style={{
                          margin: 0,
                          textAlign: "center",
                          fontSize: "0.78rem",
                          color: "rgba(180,210,240,0.55)",
                        }}
                      >
                        Remember your password?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("login")}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#7dd3fc",
                            fontWeight: 700,
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "0.78rem",
                          }}
                        >
                          Sign in →
                        </button>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Register CTA ── */}
            {mode !== "signup" && (
              <div
                style={{
                  marginTop: "1.5rem",
                  ...glassStyle("rgba(14,111,168,0.08)"),
                  borderRadius: "1rem",
                  padding: "1.1rem 1.4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                  animation: "fadeSlideIn 0.4s ease",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 0.18rem",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      color: "var(--text-primary, #e2f4ff)",
                    }}
                  >
                    New to CHICAD Academy?
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.72rem",
                      color: "rgba(180,210,240,0.5)",
                    }}
                  >
                    Join Batch 11 — limited seats available.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/academy/register")}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(125,211,252,0.22)",
                    background: "rgba(14,111,168,0.18)",
                    color: "#7dd3fc",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.32)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.38)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.18)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.22)";
                  }}
                >
                  Register Now →
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        input::placeholder { color: rgba(125,211,252,0.28); }
        input:focus { outline: none; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

/* ─── Submit button with spinner ────────────────────────────── */
function SubmitBtn({
  loading,
  label,
  loadingLabel,
  onClick,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "0.88rem 1.5rem",
        borderRadius: "0.65rem",
        border: "none",
        background: loading
          ? "rgba(14,111,168,0.25)"
          : hovered
            ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
            : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: loading ? "rgba(180,210,240,0.4)" : "#fff",
        fontSize: "0.9rem",
        fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        letterSpacing: "-0.01em",
        boxShadow: loading
          ? "none"
          : hovered
            ? "0 6px 28px rgba(59,130,246,0.50)"
            : "0 4px 20px rgba(59,130,246,0.35)",
        transition: "all 0.22s",
        transform: hovered && !loading ? "translateY(-2px)" : "translateY(0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading && (
        <span
          style={{
            width: "1rem",
            height: "1rem",
            border: "2px solid rgba(180,210,240,0.25)",
            borderTopColor: "#7dd3fc",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}
