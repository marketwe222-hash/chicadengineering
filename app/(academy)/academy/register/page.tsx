"use client";
import { Header, Footer } from "@/components/academy";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, CSSProperties, ReactNode } from "react";

/* ─── Software catalogue ────────────────────────────────────── */
const SOFTWARES = [
  {
    id: "lumion",
    name: "Lumion",
    icon: "🌅",
    category: "Visualization",
    duration: "1 Month",
    registrationFee: 5000,
    trainingFee: 30000,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.40)",
    accent: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
    description: "3D rendering & real-time visualization for architecture",
    details:
      "Master photorealistic rendering and immersive virtual walkthroughs. Create stunning visual presentations that bring architectural designs to life.",
  },
  {
    id: "excel",
    name: "Ms Excel",
    icon: "📊",
    category: "Productivity",
    duration: "1 Month",
    registrationFee: 5000,
    trainingFee: 30000,
    color: "#22c55e",
    glow: "rgba(34,197,94,0.40)",
    accent: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    description: "Advanced spreadsheets, data analysis & project management",
    details:
      "From pivot tables to VBA macros, learn professional-grade data workflows used daily in engineering firms and construction management.",
  },
  {
    id: "revit",
    name: "Revit",
    icon: "🏗️",
    category: "BIM",
    duration: "3 Months",
    registrationFee: 5000,
    trainingFee: 70000,
    color: "#7dd3fc",
    glow: "rgba(125,211,252,0.40)",
    accent: "rgba(14,111,168,0.18)",
    border: "rgba(125,211,252,0.35)",
    description: "Building Information Modeling for architects & engineers",
    details:
      "The industry-standard BIM platform. Model complete buildings, generate construction documents, coordinate MEP systems, and collaborate across disciplines.",
  },
  {
    id: "autocad",
    name: "AutoCAD",
    icon: "📐",
    category: "CAD",
    duration: "3 Months",
    registrationFee: 5000,
    trainingFee: 70000,
    color: "#ef4444",
    glow: "rgba(239,68,68,0.40)",
    accent: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    description: "Industry-standard 2D/3D drafting & design software",
    details:
      "Master precision drafting, 3D modeling, annotation, and sheet sets. The most widely used CAD platform in engineering and architecture worldwide.",
  },
  {
    id: "archicad",
    name: "ArchiCAD",
    icon: "🏛️",
    category: "BIM",
    duration: "3 Months",
    registrationFee: 5000,
    trainingFee: 70000,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.40)",
    accent: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.35)",
    description: "BIM software focused on architectural design & documentation",
    details:
      "Architect-first BIM workflow with intuitive design tools, parametric objects, teamwork collaboration, and seamless IFC exchange for open BIM projects.",
  },
  {
    id: "sap2000",
    name: "SAP2000",
    icon: "🔩",
    category: "Structural Analysis",
    duration: "2 Months",
    registrationFee: 5000,
    trainingFee: 50000,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.40)",
    accent: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.35)",
    description: "Structural analysis & design for buildings & bridges",
    details:
      "Perform linear and nonlinear analysis of complex structures. Design steel, concrete, and composite members to international codes.",
  },
  {
    id: "abaqus",
    name: "ABAQUS",
    icon: "⚙️",
    category: "FEA",
    duration: "2 Months",
    registrationFee: 5000,
    trainingFee: 50000,
    color: "#e879f9",
    glow: "rgba(232,121,249,0.40)",
    accent: "rgba(232,121,249,0.12)",
    border: "rgba(232,121,249,0.35)",
    description: "Finite element analysis for complex structural simulations",
    details:
      "Industry-leading FEA suite for advanced simulations including nonlinear mechanics, dynamic analysis, thermal coupling, and fatigue prediction.",
  },
];

const STEPS = [
  { id: 1, label: "Identity", icon: "👤", short: "Who You Are" },
  { id: 2, label: "Background", icon: "🎓", short: "Your Background" },
  { id: 3, label: "Motivation", icon: "🚀", short: "Your Goals" },
  { id: 4, label: "Commitment", icon: "📋", short: "Final Step" },
];

const INITIAL = {
  software: "",
  fullName: "",
  phone: "",
  email: "",
  city: "",
  status: "",
  school: "",
  field: "",
  whyRevit: "",
  revitLevel: "",
  followsSocial: "",
  joinChallenge: "",
  howHeard: "",
  referrer: "",
  commitment: false,
};

type FormData = typeof INITIAL;
type SetFn = (key: keyof FormData, val: string | boolean) => void;

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

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.78rem 1rem",
  background: "rgba(7,24,40,0.55)",
  border: "1px solid rgba(125,211,252,0.18)",
  borderRadius: "0.65rem",
  color: "var(--text-primary, #e2f4ff)",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "100px",
};

/* ─── Atoms ─────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        ...inputStyle,
        borderColor: focused
          ? "rgba(125,211,252,0.55)"
          : "rgba(125,211,252,0.18)",
        boxShadow: focused ? "0 0 0 3px rgba(14,111,168,0.25)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        ...textareaStyle,
        borderColor: focused
          ? "rgba(125,211,252,0.55)"
          : "rgba(125,211,252,0.18)",
        boxShadow: focused ? "0 0 0 3px rgba(14,111,168,0.25)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: "2rem",
              border: active
                ? "1px solid rgba(125,211,252,0.55)"
                : "1px solid rgba(125,211,252,0.18)",
              background: active
                ? "rgba(14,111,168,0.38)"
                : "rgba(7,24,40,0.45)",
              color: active ? "#7dd3fc" : "rgba(180,210,240,0.7)",
              fontSize: "0.8rem",
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Background Scene ───────────────────────────────────────── */
function BgScene() {
  return (
    <>
      {/* Hero background image — same as software page */}
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
      {/* Gradient overlay — identical to software page */}
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

/* ─── Software Selector ─────────────────────────────────────── */
function SoftwareSelector({
  selected,
  onSelect,
  onConfirm,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const expandedSw = SOFTWARES.find((s) => s.id === expanded);

  const handleCardClick = (id: string) => {
    setExpanded(id);
    onSelect(id);
  };

  /* ── Expanded detail view ── */
  if (expanded && expandedSw) {
    return (
      <div style={{ animation: "fadeSlideIn 0.25s ease" }}>
        <button
          type="button"
          onClick={() => setExpanded(null)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "0.48rem 1rem",
            borderRadius: "0.6rem",
            border: "1px solid rgba(125,211,252,0.18)",
            background: "rgba(7,24,40,0.55)",
            color: "var(--text-secondary, rgba(180,210,240,0.85))",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(14,111,168,0.25)";
            e.currentTarget.style.borderColor = "rgba(125,211,252,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(7,24,40,0.55)";
            e.currentTarget.style.borderColor = "rgba(125,211,252,0.18)";
          }}
        >
          ← Back to all programs
        </button>

        {/* Feature card */}
        <div
          style={{
            borderRadius: "1.25rem",
            padding: "2rem",
            background: expandedSw.accent,
            border: `1px solid ${expandedSw.border}`,
            boxShadow: `0 0 50px ${expandedSw.glow}`,
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "66px",
                height: "66px",
                borderRadius: "1rem",
                flexShrink: 0,
                background: `radial-gradient(circle at 30% 30%, ${expandedSw.color}33, transparent 70%), rgba(7,24,40,0.7)`,
                border: `1px solid ${expandedSw.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.1rem",
                boxShadow: `0 0 28px ${expandedSw.glow}`,
              }}
            >
              {expandedSw.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  marginBottom: "0.3rem",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.65rem",
                    fontWeight: 900,
                    color: expandedSw.color,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {expandedSw.name}
                </h2>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: expandedSw.color,
                    background: `${expandedSw.color}22`,
                    border: `1px solid ${expandedSw.border}`,
                    borderRadius: "1rem",
                    padding: "0.2rem 0.6rem",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  {expandedSw.category}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.86rem",
                  color: "var(--text-secondary, rgba(180,210,240,0.7))",
                  lineHeight: 1.6,
                }}
              >
                {expandedSw.description}
              </p>
            </div>
          </div>

          <p
            style={{
              margin: "0 0 1.5rem",
              fontSize: "0.84rem",
              color: "var(--text-secondary, rgba(180,210,240,0.65))",
              lineHeight: 1.8,
              borderLeft: `3px solid ${expandedSw.border}`,
              paddingLeft: "1rem",
            }}
          >
            {expandedSw.details}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.85rem",
            }}
          >
            {[
              { label: "Duration", value: expandedSw.duration, icon: "⏱" },
              {
                label: "Registration",
                value: `${expandedSw.registrationFee.toLocaleString()} FRS`,
                icon: "🎟",
              },
              {
                label: "Training Fee",
                value: `${expandedSw.trainingFee.toLocaleString()} FRS`,
                icon: "💳",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(7,24,40,0.50)",
                  borderRadius: "0.85rem",
                  padding: "1rem 0.85rem",
                  border: `1px solid ${expandedSw.border}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.15rem", marginBottom: "0.25rem" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "rgba(125,211,252,0.45)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 800,
                    color: expandedSw.color,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          style={{
            width: "100%",
            padding: "1rem 2rem",
            borderRadius: "0.85rem",
            border: "none",
            background: `linear-gradient(135deg, ${expandedSw.color}ee, ${expandedSw.color}88)`,
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: "-0.01em",
            boxShadow: `0 6px 28px ${expandedSw.glow}`,
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Register for {expandedSw.name} {expandedSw.icon} →
        </button>
      </div>
    );
  }

  /* ── Grid (all cards visible) ── */
  return (
    <div style={{ animation: "fadeSlideIn 0.2s ease" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(192px, 1fr))",
          gap: "0.85rem",
        }}
      >
        {SOFTWARES.map((sw) => (
          <button
            key={sw.id}
            type="button"
            onClick={() => handleCardClick(sw.id)}
            style={{
              padding: "1.2rem 1.1rem",
              borderRadius: "1rem",
              border: "1px solid rgba(125,211,252,0.10)",
              background: "rgba(7,24,40,0.52)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${sw.border}`;
              e.currentTarget.style.background = sw.accent;
              e.currentTarget.style.boxShadow = `0 0 24px ${sw.glow}`;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1px solid rgba(125,211,252,0.10)";
              e.currentTarget.style.background = "rgba(7,24,40,0.52)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Top color stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${sw.color}, transparent)`,
                borderRadius: "1rem 1rem 0 0",
              }}
            />
            <div style={{ fontSize: "1.7rem", marginBottom: "0.55rem" }}>
              {sw.icon}
            </div>
            <div
              style={{
                fontSize: "0.93rem",
                fontWeight: 800,
                color: "var(--text-primary, #e2f4ff)",
                marginBottom: "0.18rem",
              }}
            >
              {sw.name}
            </div>
            <div
              style={{
                fontSize: "0.61rem",
                fontWeight: 700,
                color: sw.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
            >
              {sw.category}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted, rgba(180,210,240,0.48))",
                lineHeight: 1.55,
                marginBottom: "0.85rem",
              }}
            >
              {sw.description}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "rgba(125,211,252,0.55)",
                  background: "rgba(14,111,168,0.18)",
                  borderRadius: "1rem",
                  padding: "0.18rem 0.52rem",
                  border: "1px solid rgba(125,211,252,0.12)",
                }}
              >
                ⏱ {sw.duration}
              </span>
              <span
                style={{
                  fontSize: "0.76rem",
                  color: sw.color,
                  fontWeight: 700,
                }}
              >
                View →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Form Steps ─────────────────────────────────────────────── */
function Step1({ data, set }: { data: FormData; set: SetFn }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <Field label="Full Name / Nom Complet *">
        <Input
          value={data.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          placeholder="Jean-Baptiste Ngono"
        />
      </Field>
      <Field label="Phone / Téléphone *">
        <Input
          value={data.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+237 6XX XXX XXX"
          type="tel"
        />
      </Field>
      <Field label="Email *">
        <Input
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.com"
          type="email"
        />
      </Field>
      <Field label="City / Ville *">
        <Input
          value={data.city}
          onChange={(e) => set("city", e.target.value)}
          placeholder="Yaoundé, Douala…"
        />
      </Field>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: SetFn }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
      <Field label="Current Status *">
        <RadioGroup
          value={data.status}
          onChange={(v) => set("status", v)}
          options={[
            { value: "student", label: "🎓 Student" },
            { value: "graduate", label: "📜 Graduate" },
            { value: "professional", label: "💼 Professional" },
          ]}
        />
      </Field>
      <Field label="School or Workplace *">
        <Input
          value={data.school}
          onChange={(e) => set("school", e.target.value)}
          placeholder="ENSP, Polytechnique, Firm name…"
        />
      </Field>
      <Field label="Field of Study or Work *">
        <Input
          value={data.field}
          onChange={(e) => set("field", e.target.value)}
          placeholder="Civil Engineering, Architecture…"
        />
      </Field>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: SetFn }) {
  const sw = SOFTWARES.find((s) => s.id === data.software);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
      <Field label={`Why ${sw?.name ?? "this software"}? *`}>
        <Textarea
          value={data.whyRevit}
          onChange={(e) => set("whyRevit", e.target.value)}
          placeholder="Share your motivation — career goals, projects, opportunities…"
        />
      </Field>
      <Field label="Current Level">
        <RadioGroup
          value={data.revitLevel}
          onChange={(v) => set("revitLevel", v)}
          options={[
            { value: "beginner", label: "🌱 Beginner" },
            { value: "intermediate", label: "⚡ Intermediate" },
            { value: "advanced", label: "🔥 Advanced" },
          ]}
        />
      </Field>
      <Field label="How did you hear about us? *">
        <RadioGroup
          value={data.howHeard}
          onChange={(v) => set("howHeard", v)}
          options={[
            { value: "social", label: "📱 Social Media" },
            { value: "friend", label: "👥 Friend" },
            { value: "other", label: "💡 Other" },
          ]}
        />
      </Field>
      <Field label="Recommended by *">
        <Input
          value={data.referrer}
          onChange={(e) => set("referrer", e.target.value)}
          placeholder="Name or 'None'"
        />
      </Field>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: SetFn }) {
  const sw = SOFTWARES.find((s) => s.id === data.software);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
      <Field label="Follow our socials? *">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
            marginBottom: "0.75rem",
          }}
        >
          {[
            {
              icon: "📘",
              name: "Facebook",
              url: "https://www.facebook.com/people/Chicad-Academy/61569297197332/",
            },
            {
              icon: "💼",
              name: "LinkedIn",
              url: "https://www.linkedin.com/company/105801746/",
            },
            {
              icon: "📸",
              name: "Instagram",
              url: "https://www.instagram.com/p/DIau-76sl8s/",
            },
          ].map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.5rem 0.9rem",
                borderRadius: "0.6rem",
                background: "rgba(14,111,168,0.15)",
                border: "1px solid rgba(125,211,252,0.14)",
                color: "#7dd3fc",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                width: "fit-content",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(14,111,168,0.28)";
                e.currentTarget.style.borderColor = "rgba(125,211,252,0.30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(14,111,168,0.15)";
                e.currentTarget.style.borderColor = "rgba(125,211,252,0.14)";
              }}
            >
              {s.icon} Follow {s.name}
            </a>
          ))}
        </div>
        <RadioGroup
          value={data.followsSocial}
          onChange={(v) => set("followsSocial", v)}
          options={[
            { value: "yes", label: "✅ Yes, I follow" },
            { value: "no", label: "❌ Not yet" },
          ]}
        />
      </Field>

      <Field label="Join the CHICAD Challenge? *">
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--text-secondary, rgba(180,210,240,0.6))",
            lineHeight: 1.6,
            margin: "0 0 0.7rem",
          }}
        >
          Students showcase design skills through real-life projects.
        </p>
        <RadioGroup
          value={data.joinChallenge}
          onChange={(v) => set("joinChallenge", v)}
          options={[
            { value: "yes", label: "🏆 Yes" },
            { value: "no", label: "⏭ No" },
          ]}
        />
      </Field>

      {/* Commitment checkbox */}
      <div
        style={{
          ...glassStyle("rgba(14,111,168,0.10)"),
          borderRadius: "0.85rem",
          padding: "1.2rem 1.25rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onClick={() => set("commitment", !data.commitment)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(14,111,168,0.20)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(14,111,168,0.10)";
        }}
      >
        <div
          style={{
            width: "1.4rem",
            height: "1.4rem",
            borderRadius: "0.4rem",
            flexShrink: 0,
            border: data.commitment
              ? "2px solid #7dd3fc"
              : "2px solid rgba(125,211,252,0.3)",
            background: data.commitment
              ? "rgba(14,111,168,0.5)"
              : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.18s",
            marginTop: "0.05rem",
          }}
        >
          {data.commitment && (
            <span style={{ color: "#7dd3fc", fontSize: "0.9rem" }}>✓</span>
          )}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--text-secondary, rgba(180,210,240,0.8))",
            lineHeight: 1.65,
          }}
        >
          <strong style={{ color: "var(--text-primary, #e2f4ff)" }}>
            I commit
          </strong>{" "}
          to actively participating in all sessions, completing assignments, and
          submitting my final project.{" "}
          <em style={{ color: "rgba(125,211,252,0.6)" }}>
            Je m'engage à participer activement à toutes les sessions.
          </em>
        </p>
      </div>

      {/* Payment block */}
      <div
        style={{
          ...glassStyle("rgba(255,160,0,0.08)"),
          borderRadius: "0.85rem",
          padding: "1.2rem 1.25rem",
          border: "1px solid rgba(255,180,30,0.25)",
        }}
      >
        <p
          style={{
            margin: "0 0 0.65rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "#fbbf24",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          💳 Payment / Paiement
        </p>
        {sw && (
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginBottom: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.65rem",
                  color: "rgba(250,220,100,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Registration
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#fde68a",
                }}
              >
                {sw.registrationFee.toLocaleString()} FRS
              </p>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.65rem",
                  color: "rgba(250,220,100,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Training Fee
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#fde68a",
                }}
              >
                {sw.trainingFee.toLocaleString()} FRS
              </p>
            </div>
          </div>
        )}
        <p
          style={{
            margin: "0 0 0.3rem",
            fontSize: "0.82rem",
            color: "rgba(250,230,150,0.85)",
            lineHeight: 1.6,
          }}
        >
          MoMo: <strong style={{ color: "#fde68a" }}>673 422 430</strong> ·
          Name: Wyamba Gemma
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.77rem",
            color: "rgba(250,220,100,0.65)",
          }}
        >
          ⚠️ Send screenshot via WhatsApp after payment.
        </p>
        <a
          href="https://chat.whatsapp.com/FESw1ckjav52EL5r4cSMtV"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.85rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            background: "rgba(37,211,102,0.15)",
            border: "1px solid rgba(37,211,102,0.3)",
            color: "#4ade80",
            fontSize: "0.8rem",
            fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(37,211,102,0.25)";
            e.currentTarget.style.borderColor = "rgba(37,211,102,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(37,211,102,0.15)";
            e.currentTarget.style.borderColor = "rgba(37,211,102,0.3)";
          }}
        >
          💬 Join WhatsApp Group
        </a>
      </div>
    </div>
  );
}

/* ─── Gradient Text ──────────────────────────────────────────── */
function GradientText({ children }: { children: ReactNode }) {
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

/* ─── Main Page ─────────────────────────────────────────────── */
export default function RegisterPage() {
  const [phase, setPhase] = useState<"select" | "form">("select");
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const set: SetFn = (key, val) => setData((d) => ({ ...d, [key]: val }));
  const selectedSw = SOFTWARES.find((s) => s.id === data.software);

  const canNext = () => {
    if (step === 1)
      return data.fullName && data.phone && data.email && data.city;
    if (step === 2) return data.status && data.school && data.field;
    if (step === 3) return data.whyRevit && data.howHeard && data.referrer;
    if (step === 4)
      return data.followsSocial && data.joinChallenge && data.commitment;
    return true;
  };

  /* ── Success Screen ── */
  if (submitted) {
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
          <Header onSignIn={() => router.push("/academy/login")} />
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5rem 1.5rem 2rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                ...glassStyle("rgba(14,111,168,0.18)"),
                borderRadius: "1.5rem",
                padding: "3rem 2.5rem",
                maxWidth: "480px",
                width: "100%",
                textAlign: "center",
                animation: "fadeSlideIn 0.4s ease",
              }}
            >
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
              <h2
                style={{
                  color: "var(--text-primary, #e2f4ff)",
                  margin: "0 0 0.75rem",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                Registration Submitted!
              </h2>
              {selectedSw && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 1rem",
                    borderRadius: "2rem",
                    background: selectedSw.accent,
                    border: `1px solid ${selectedSw.border}`,
                    marginBottom: "1rem",
                  }}
                >
                  <span>{selectedSw.icon}</span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: selectedSw.color,
                    }}
                  >
                    {selectedSw.name} — {selectedSw.duration}
                  </span>
                </div>
              )}
              <p
                style={{
                  color: "var(--text-secondary, rgba(180,210,240,0.75))",
                  lineHeight: 1.7,
                  fontSize: "0.88rem",
                  margin: "0 0 1.5rem",
                }}
              >
                Welcome to CHICAD Academy Batch 11! Pay your registration fee of{" "}
                <strong style={{ color: "#fde68a" }}>
                  {selectedSw?.registrationFee.toLocaleString()} FRS
                </strong>{" "}
                to MoMo{" "}
                <strong style={{ color: "#fde68a" }}>673 422 430</strong> and
                send the screenshot via WhatsApp.
              </p>
              <a
                href="https://chat.whatsapp.com/FESw1ckjav52EL5r4cSMtV"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.8rem 1.8rem",
                  borderRadius: "0.65rem",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(5,150,105,0.35)",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                💬 Join WhatsApp Group
              </a>
            </div>
          </div>
          <Footer />
        </div>
        <GlobalStyles />
      </>
    );
  }

  /* ── Software Selection Phase ── */
  if (phase === "select") {
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
          <Header onSignIn={() => router.push("/academy/login")} />

          {/* ── Software grid ── */}
          <main
            style={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              maxWidth: "1000px",
              margin: "0 auto",
              width: "100%",
              padding: "3rem 1.5rem 4rem",
            }}
          >
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "var(--sky, #7dd3fc)",
                  textTransform: "uppercase",
                  margin: "0 0 0.5rem",
                }}
              >
                Available Programs
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 900,
                  margin: "0 0 0.6rem",
                  color: "var(--text-primary, #e2f4ff)",
                  letterSpacing: "-0.03em",
                }}
              >
                Choose Your Program
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary, rgba(180,210,240,0.55))",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Click any card to explore details, then register.
              </p>
            </div>

            <div
              style={{
                ...glassStyle("rgba(7,24,40,0.40)"),
                borderRadius: "1.5rem",
                padding: "1.75rem",
              }}
            >
              <SoftwareSelector
                selected={data.software}
                onSelect={(id) => set("software", id)}
                onConfirm={() => setPhase("form")}
              />
            </div>
          </main>

          <Footer />
        </div>
        <GlobalStyles />
      </>
    );
  }

  /* ── Multi-step Form Phase ── */
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
        <Header onSignIn={() => router.push("/academy/login")} />

        <div
          style={{
            flex: 1,
            display: "flex",
            paddingTop: "60px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── Sidebar ── */}
          <div
            className="sidebar"
            style={{
              width: "265px",
              flexShrink: 0,
              padding: "2.25rem 1.75rem",
              borderRight: "1px solid rgba(125,211,252,0.10)",
              display: "flex",
              flexDirection: "column",
              background: "rgba(5,16,32,0.52)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            {/* Selected program badge */}
            {selectedSw && (
              <div
                style={{
                  marginBottom: "1.75rem",
                  padding: "0.9rem 1rem",
                  background: selectedSw.accent,
                  border: `1px solid ${selectedSw.border}`,
                  borderRadius: "0.85rem",
                  boxShadow: `0 0 18px ${selectedSw.glow}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{selectedSw.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 900,
                        color: selectedSw.color,
                      }}
                    >
                      {selectedSw.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.62rem",
                        color: "var(--text-muted, rgba(180,210,240,0.48))",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {selectedSw.duration} · {selectedSw.category}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhase("select");
                    setStep(1);
                  }}
                  style={{
                    fontSize: "0.67rem",
                    color: "rgba(125,211,252,0.48)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  ✎ Change program
                </button>
              </div>
            )}

            {/* Step indicators */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                flex: 1,
              }}
            >
              {STEPS.map((s, i) => {
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div
                    key={s.id}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        padding: "0.82rem 0.9rem",
                        borderRadius: "0.75rem",
                        background: active
                          ? "rgba(14,111,168,0.25)"
                          : done
                            ? "rgba(14,111,168,0.10)"
                            : "transparent",
                        border: active
                          ? "1px solid rgba(125,211,252,0.28)"
                          : "1px solid transparent",
                        transition: "all 0.25s",
                        cursor: done ? "pointer" : "default",
                      }}
                      onClick={() => done && setStep(s.id)}
                    >
                      <div
                        style={{
                          width: "1.95rem",
                          height: "1.95rem",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: done
                            ? "linear-gradient(135deg,#059669,#047857)"
                            : active
                              ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                              : "rgba(14,111,168,0.12)",
                          border:
                            done || active
                              ? "none"
                              : "1px solid rgba(125,211,252,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: done ? "0.78rem" : "0.82rem",
                          boxShadow: active
                            ? "0 4px 14px rgba(59,130,246,0.35)"
                            : done
                              ? "0 4px 14px rgba(5,150,105,0.3)"
                              : "none",
                          transition: "all 0.25s",
                        }}
                      >
                        {done ? "✓" : s.icon}
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.78rem",
                            fontWeight: 800,
                            color: active
                              ? "var(--text-primary, #e2f4ff)"
                              : done
                                ? "rgba(180,210,240,0.82)"
                                : "rgba(180,210,240,0.38)",
                          }}
                        >
                          Step {s.id} — {s.label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.64rem",
                            color: active
                              ? "rgba(125,211,252,0.72)"
                              : "rgba(125,211,252,0.28)",
                          }}
                        >
                          {s.short}
                        </p>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        style={{
                          width: "1px",
                          height: "1.2rem",
                          margin: "0.08rem 0 0.08rem 1.85rem",
                          background: done
                            ? "rgba(5,150,105,0.5)"
                            : "rgba(125,211,252,0.09)",
                          transition: "background 0.3s",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fee reminder */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "0.85rem 0.95rem",
                ...glassStyle("rgba(14,111,168,0.10)"),
                borderRadius: "0.75rem",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.28rem",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#fbbf24",
                }}
              >
                💳 Registration Fee
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.76rem",
                  color: "rgba(250,220,100,0.8)",
                  lineHeight: 1.5,
                }}
              >
                {selectedSw?.registrationFee.toLocaleString()} FRS via MoMo
                <br />
                <span style={{ fontWeight: 700, color: "#fde68a" }}>
                  673 422 430
                </span>
              </p>
            </div>
          </div>

          {/* ── Main form area ── */}
          <div
            style={{
              flex: 1,
              padding: "2.25rem clamp(1.25rem, 5vw, 4rem) 3rem",
              overflowY: "auto",
            }}
          >
            {/* Progress bar */}
            <div style={{ marginBottom: "1.85rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.42rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    color: "rgba(125,211,252,0.6)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Step {step} of {STEPS.length}
                </span>
                <span
                  style={{
                    fontSize: "0.67rem",
                    fontWeight: 700,
                    color: "rgba(125,211,252,0.48)",
                  }}
                >
                  {Math.round(((step - 1) / STEPS.length) * 100 + 25)}% Complete
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  background: "rgba(125,211,252,0.09)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${((step - 1) / STEPS.length) * 100 + 25}%`,
                    background: "linear-gradient(90deg, #3b82f6, #7dd3fc)",
                    borderRadius: "2px",
                    transition: "width 0.45s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: "0 0 10px rgba(125,211,252,0.4)",
                  }}
                />
              </div>
            </div>

            {/* Step heading */}
            <div style={{ marginBottom: "1.65rem" }}>
              <p
                style={{
                  ...labelStyle,
                  marginBottom: "0.28rem",
                }}
              >
                {STEPS[step - 1].icon} {STEPS[step - 1].label}
              </p>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.3rem, 3vw, 1.85rem)",
                  fontWeight: 900,
                  color: "var(--text-primary, #e2f4ff)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                {step === 1 && (
                  <span>
                    Tell us <GradientText>who you are</GradientText>
                  </span>
                )}
                {step === 2 && (
                  <span>
                    Share your <GradientText>background</GradientText>
                  </span>
                )}
                {step === 3 && (
                  <span>
                    Your <GradientText>goals</GradientText> matter
                  </span>
                )}
                {step === 4 && (
                  <span>
                    Almost <GradientText>there!</GradientText>
                  </span>
                )}
              </h1>
              <p
                style={{
                  margin: "0.42rem 0 0",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary, rgba(180,210,240,0.52))",
                  lineHeight: 1.6,
                }}
              >
                {step === 1 &&
                  "Basic info so we can reach you and personalise your experience."}
                {step === 2 &&
                  "Tell us about your academic or professional background."}
                {step === 3 &&
                  "Help us understand your motivation and how you discovered us."}
                {step === 4 &&
                  "Review your commitment, follow our socials, and complete payment."}
              </p>
            </div>

            {/* Form card */}
            <div
              style={{
                ...glassStyle("rgba(14,111,168,0.10)"),
                borderRadius: "1.25rem",
                padding: "1.75rem",
                maxWidth: "600px",
              }}
            >
              {step === 1 && <Step1 data={data} set={set} />}
              {step === 2 && <Step2 data={data} set={set} />}
              {step === 3 && <Step3 data={data} set={set} />}
              {step === 4 && <Step4 data={data} set={set} />}

              {/* Navigation buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1.65rem",
                  paddingTop: "1.2rem",
                  borderTop: "1px solid rgba(125,211,252,0.08)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    step === 1
                      ? (setPhase("select"), setStep(1))
                      : setStep((s) => s - 1)
                  }
                  style={{
                    padding: "0.76rem 1.35rem",
                    borderRadius: "0.65rem",
                    border: "1px solid rgba(125,211,252,0.18)",
                    background: "rgba(14,111,168,0.10)",
                    color: "var(--text-secondary, rgba(180,210,240,0.8))",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.22)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.30)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(14,111,168,0.10)";
                    e.currentTarget.style.borderColor =
                      "rgba(125,211,252,0.18)";
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!canNext()}
                  onClick={() => {
                    if (step < STEPS.length) setStep((s) => s + 1);
                    else setSubmitted(true);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.76rem 1.35rem",
                    borderRadius: "0.65rem",
                    border: "none",
                    background: canNext()
                      ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                      : "rgba(14,111,168,0.12)",
                    color: canNext() ? "#fff" : "rgba(180,210,240,0.3)",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    cursor: canNext() ? "pointer" : "not-allowed",
                    boxShadow: canNext()
                      ? "0 4px 20px rgba(59,130,246,0.35)"
                      : "none",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    if (canNext()) {
                      e.currentTarget.style.opacity = "0.88";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {step < STEPS.length
                    ? `Continue → Step ${step + 1}`
                    : "🎉 Submit Registration"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
      <GlobalStyles />
    </>
  );
}

/* ─── Global Styles ─────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
      body { margin: 0; }
      input::placeholder,
      textarea::placeholder { color: rgba(125,211,252,0.28); }
      input:focus,
      textarea:focus { outline: none; }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .btn-primary {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: #fff;
        border: none;
        box-shadow: 0 4px 20px rgba(59,130,246,0.35);
        transition: opacity 0.2s, transform 0.2s;
      }
      .btn-primary:hover {
        opacity: 0.88;
        transform: translateY(-2px);
      }
      .btn-secondary {
        background: rgba(14,111,168,0.15);
        color: #7dd3fc;
        border: 1px solid rgba(125,211,252,0.22);
        backdrop-filter: blur(10px);
        transition: background 0.2s, border-color 0.2s;
      }
      .btn-secondary:hover {
        background: rgba(14,111,168,0.28);
        border-color: rgba(125,211,252,0.38);
      }
      @media (max-width: 640px) {
        .sidebar { display: none !important; }
      }
    `}</style>
  );
}
