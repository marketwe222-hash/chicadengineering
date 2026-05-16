"use client";

import { useState, ChangeEvent, CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToastContext } from "@/context/ToastContext";
import { useAuthContext } from "@/context/AuthContext";

/* ─── Styles ─────────────────────────────────────────────── */
const glassStyle: CSSProperties = {
  background: "rgba(30,8,8,0.55)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(220,38,38,0.22)",
  boxShadow: "0 4px 24px rgba(5,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
};

const labelStyle: CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(252,165,165,0.75)",
  marginBottom: "0.45rem",
  display: "block",
};

const inputBase: CSSProperties = {
  width: "100%",
  padding: "0.82rem 1rem",
  background: "rgba(40,7,7,0.55)",
  border: "1px solid rgba(220,38,38,0.22)",
  borderRadius: "0.65rem",
  color: "#ffe4e4",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

/* ─── Background ─────────────────────────────────────────── */
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
          opacity: 0.25,
          zIndex: -2,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(168,14,14,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(220,38,38,0.12) 0%, transparent 55%),
            linear-gradient(145deg, rgba(20,4,4,0.85) 0%, rgba(30,6,6,0.80) 100%)
          `,
          zIndex: -1,
        }}
      />
    </>
  );
}

/* ─── Floating input ─────────────────────────────────────── */
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
              ? "rgba(239,68,68,0.7)"
              : focused
                ? "rgba(220,38,38,0.6)"
                : "rgba(220,38,38,0.22)",
            boxShadow: error
              ? "0 0 0 3px rgba(239,68,68,0.15)"
              : focused
                ? "0 0 0 3px rgba(220,38,38,0.18)"
                : "none",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
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

/* ─── Submit button ──────────────────────────────────────── */
function SubmitBtn({
  loading,
  onClick,
}: {
  loading: boolean;
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
          ? "rgba(220,38,38,0.2)"
          : hovered
            ? "linear-gradient(135deg, #b91c1c, #991b1b)"
            : "linear-gradient(135deg, #dc2626, #b91c1c)",
        color: loading ? "rgba(252,165,165,0.4)" : "#fff",
        fontSize: "0.9rem",
        fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading
          ? "none"
          : hovered
            ? "0 6px 28px rgba(220,38,38,0.50)"
            : "0 4px 20px rgba(220,38,38,0.35)",
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
            border: "2px solid rgba(252,165,165,0.25)",
            borderTopColor: "#fca5a5",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      )}
      {loading ? "Signing in…" : "Sign In as Admin"}
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminLoginPage() {
  const { success, error: showError } = useToastContext();
  const { login: authLogin } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email format";
    if (!password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await authLogin(email.trim(), password);
      success("Welcome back!", "Redirecting to admin dashboard…");
    } catch (err: unknown) {
      showError(
        "Login Failed",
        err instanceof Error ? err.message : "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(252,165,165,0.45)",
        fontSize: "1rem",
        padding: 0,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {show ? "🙈" : "👁️"}
    </button>
  );

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          position: "relative",
          padding: "2rem 1.5rem",
        }}
      >
        <BgScene />

        {/* Back link */}
        <Link
          href="/academy/login"
          style={{
            position: "fixed",
            top: "1.25rem",
            left: "1.5rem",
            fontSize: "0.75rem",
            color: "rgba(252,165,165,0.6)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontWeight: 600,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(252,165,165,0.9)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(252,165,165,0.6)")
          }
        >
          ← Student Login
        </Link>

        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Logo + heading */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              animation: "fadeSlideIn 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <Image
                src="/images/logowhite.png"
                alt="CHICAD"
                width={120}
                height={60}
                style={{ height: "auto" }}
                priority
              />
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.25rem 0.9rem",
                borderRadius: "2rem",
                background: "rgba(220,38,38,0.18)",
                border: "1px solid rgba(220,38,38,0.30)",
                marginBottom: "0.9rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.63rem",
                  fontWeight: 700,
                  color: "#fca5a5",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                🔐 Admin Access
              </span>
            </div>

            <h1
              style={{
                margin: "0 0 0.45rem",
                fontSize: "clamp(1.5rem, 4vw, 1.9rem)",
                fontWeight: 900,
                color: "#ffe4e4",
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
              }}
            >
              Admin{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fca5a5 0%, #dc2626 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Sign In
              </span>
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                color: "rgba(252,165,165,0.5)",
                lineHeight: 1.6,
              }}
            >
              Restricted to authorised CHICAD staff only.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              ...glassStyle,
              borderRadius: "1.5rem",
              padding: "2rem",
              animation: "fadeSlideIn 0.35s ease",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
            >
              <FloatingInput
                label="Admin Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                placeholder="admin@chicad.cm"
                icon="✉️"
                error={fieldErrors.email}
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

              <SubmitBtn loading={loading} onClick={handleLogin} />

              <p
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: "0.72rem",
                  color: "rgba(252,165,165,0.35)",
                  lineHeight: 1.6,
                }}
              >
                This portal is monitored. Unauthorised access attempts are
                logged.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input::placeholder { color: rgba(220,38,38,0.3); }
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
