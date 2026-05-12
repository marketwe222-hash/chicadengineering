"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";

/* ─── Programme Data ──────────────────────────────────────── */
const PROGRAMMES = [
  {
    id: "3-month",
    name: "3-Month Intensive Programme",
    duration: "3 Months",
    price: "750,000 CFA",
    originalPrice: "900,000 CFA",
    badge: "Most Popular",
    description:
      "Perfect for students and professionals looking to quickly gain essential CAD skills for immediate career application.",
    highlights: [
      "8 Professional Software Tools",
      "Hands-on Project Work",
      "Industry Case Studies",
      "Basic Certification",
      "Portfolio Development",
      "Job Placement Support",
    ],
    curriculum: [
      {
        month: "Month 1",
        title: "Foundation Skills",
        tools: ["AutoCAD", "SketchUp Pro"],
        focus: "2D drafting, basic 3D modeling, technical drawing standards",
      },
      {
        month: "Month 2",
        title: "Advanced Design",
        tools: ["Revit Architecture", "ArchiCAD", "Lumion"],
        focus: "BIM modeling, architectural design, 3D visualization",
      },
      {
        month: "Month 3",
        title: "Project Integration",
        tools: ["SAP2000", "ETABS"],
        focus: "Structural analysis, building systems, final project",
      },
    ],
    features: [
      "Daily 4-hour sessions",
      "Small class sizes (max 15 students)",
      "Practical assignments",
      "Industry guest speakers",
      "Certificate of completion",
      "3-month internship placement",
    ],
    accentColor: "text-sky-500",
    badgeBg: "from-sky-500 to-indigo-500",
    headerBg: "from-sky-500/5 to-indigo-500/5",
    dotBg: "from-sky-500 to-indigo-500",
    icon: "⚡",
  },
  {
    id: "6-month",
    name: "6-Month Comprehensive Programme",
    duration: "6 Months",
    price: "1,200,000 CFA",
    originalPrice: "1,500,000 CFA",
    badge: "Complete Mastery",
    description:
      "The ultimate training experience for those seeking complete mastery of civil engineering design tools and professional certification.",
    highlights: [
      "All 8 Software Tools + Advanced Modules",
      "Real Construction Site Visits",
      "Professional Certification Prep",
      "Advanced Structural Analysis",
      "Leadership & Business Skills",
      "Guaranteed Job Placement",
    ],
    curriculum: [
      {
        month: "Months 1-2",
        title: "Core Foundation",
        tools: ["AutoCAD", "SketchUp Pro", "Revit Architecture"],
        focus: "Complete 2D/3D design workflow, parametric modeling",
      },
      {
        month: "Months 3-4",
        title: "Specialized Design",
        tools: ["ArchiCAD", "Lumion", "SAFE"],
        focus: "Architectural BIM, visualization, foundation design",
      },
      {
        month: "Months 5-6",
        title: "Advanced Analysis & Integration",
        tools: ["SAP2000", "ETABS"],
        focus: "Complex structural analysis, multi-disciplinary projects",
      },
    ],
    features: [
      "Daily 6-hour intensive sessions",
      "Small class sizes (max 12 students)",
      "Real construction site visits",
      "Professional certification exams",
      "Business development training",
      "6-month guaranteed internship",
      "Industry networking events",
      "Personal mentorship program",
    ],
    accentColor: "text-orange-500",
    badgeBg: "from-orange-500 to-yellow-400",
    headerBg: "from-orange-500/5 to-yellow-400/5",
    dotBg: "from-orange-500 to-yellow-400",
    icon: "🏆",
  },
];

/* ─── Programme Comparison ────────────────────────────────── */
const COMPARISON_DATA = [
  {
    feature: "Software Tools Covered",
    basic: "6 Core Tools",
    premium: "8+ Advanced Tools",
  },
  { feature: "Class Duration", basic: "4 hours/day", premium: "6 hours/day" },
  {
    feature: "Class Size",
    basic: "Max 15 students",
    premium: "Max 12 students",
  },
  { feature: "Site Visits", basic: "2 visits", premium: "Monthly visits" },
  {
    feature: "Certification",
    basic: "Completion Certificate",
    premium: "Professional Certification",
  },
  {
    feature: "Job Placement",
    basic: "Support provided",
    premium: "Guaranteed placement",
  },
  {
    feature: "Mentorship",
    basic: "Group sessions",
    premium: "1-on-1 mentorship",
  },
  {
    feature: "Business Training",
    basic: "Basic overview",
    premium: "Comprehensive course",
  },
];

/* ─── Single Software Courses ───────────────────────────────── */
const SOFTWARE_COURSES = [
  {
    id: "autocad",
    name: "AutoCAD Fundamentals",
    software: "AutoCAD",
    price: "70,000 CFA",
    hours: "150 hours",
    description:
      "A focused software course to build your 2D drafting, annotation, and technical drawing skills.",
    accentColor: "text-sky-500",
    selectedBorder: "border-sky-500",
  },
  {
    id: "revit",
    name: "Revit Architecture Essentials",
    software: "Revit Architecture",
    price: "70,000 CFA",
    hours: "150 hours",
    description:
      "Learn BIM modeling, architectural documentation, and collaborative design workflows.",
    accentColor: "text-blue-600",
    selectedBorder: "border-blue-600",
  },
  {
    id: "sap2000",
    name: "SAP2000 Structural Analysis",
    software: "SAP2000",
    price: "70,000 CFA",
    hours: "150 hours",
    description:
      "Master structural modeling, load analysis, and design checks for real-world structures.",
    accentColor: "text-emerald-600",
    selectedBorder: "border-emerald-600",
  },
  {
    id: "lumion",
    name: "Lumion Visualization Lab",
    software: "Lumion",
    price: "70,000 CFA",
    hours: "150 hours",
    description:
      "Build renderings and visual storytelling skills with real-time visualization workflows.",
    accentColor: "text-pink-600",
    selectedBorder: "border-pink-600",
  },
];

/* ─── Icons ───────────────────────────────────────────────── */
function CheckIcon({ className = "stroke-current" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* ─── Course Card ─────────────────────────────────────────── */
function CourseCard({
  course,
  selected,
  onSelect,
}: {
  course: (typeof SOFTWARE_COURSES)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      type="button"
      className={[
        "w-full text-left rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 cursor-pointer hover:-translate-y-0.5",
        selected
          ? `bg-sky-500/5 border-2 ${course.selectedBorder}`
          : "bg-[var(--card-bg)] border border-[var(--card-border)]",
      ].join(" ")}
    >
      <div className="flex justify-between gap-4">
        <div>
          <p
            className={`m-0 text-xs font-bold uppercase tracking-widest ${course.accentColor}`}
          >
            {course.software}
          </p>
          <h3 className="mt-1.5 text-[1.05rem] font-extrabold text-[var(--text-primary)] leading-tight">
            {course.name}
          </h3>
        </div>
        <span
          className={`text-sm font-black whitespace-nowrap ${course.accentColor}`}
        >
          {course.price}
        </span>
      </div>

      <p className="m-0 text-[0.82rem] text-[var(--text-secondary)] leading-relaxed">
        {course.description}
      </p>

      <div className="flex justify-between items-center gap-3 text-[0.8rem] text-[var(--text-secondary)]">
        <span>{course.hours}</span>
        <span
          className={`font-bold ${selected ? "text-sky-500" : "text-[var(--text-primary)]"}`}
        >
          {selected ? "Selected" : "Select Course"}
        </span>
      </div>
    </button>
  );
}

/* ─── Programme Card ──────────────────────────────────────── */
function ProgrammeCard({ programme }: { programme: (typeof PROGRAMMES)[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Badge */}
      {programme.badge && (
        <div
          className={`absolute top-6 right-6 bg-gradient-to-br ${programme.badgeBg} text-white px-3 py-1.5 rounded-full text-[0.7rem] font-extrabold tracking-wide uppercase z-10`}
        >
          {programme.badge}
        </div>
      )}

      {/* Header */}
      <div
        className={`p-8 pb-6 bg-gradient-to-br ${programme.headerBg} border-b border-[var(--card-border)]`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${programme.dotBg} flex items-center justify-center text-3xl shrink-0`}
          >
            {programme.icon}
          </div>
          <div className="flex-1">
            <h3 className="m-0 mb-1 text-[1.3rem] font-black text-[var(--text-primary)] tracking-tight leading-tight">
              {programme.name}
            </h3>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1.5 text-[0.8rem] font-bold ${programme.accentColor}`}
              >
                <ClockIcon />
                {programme.duration}
              </div>
              <div className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--text-secondary)]">
                <UsersIcon />
                Small classes
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span
              className={`text-[1.8rem] font-black tracking-tight ${programme.accentColor}`}
            >
              {programme.price}
            </span>
            <span className="text-[0.9rem] text-[var(--text-muted)] line-through font-semibold">
              {programme.originalPrice}
            </span>
          </div>
          <p
            className={`text-[0.75rem] font-bold m-0 ${programme.accentColor}`}
          >
            Early bird discount applied
          </p>
        </div>

        <p className="m-0 mb-6 text-[0.9rem] text-[var(--text-secondary)] leading-relaxed">
          {programme.description}
        </p>

        {/* Highlights */}
        <div className="mb-6">
          <p className="text-[0.7rem] font-bold tracking-widest uppercase text-[var(--text-muted)] m-0 mb-2">
            What's Included
          </p>
          <div className="grid grid-cols-2 gap-2">
            {programme.highlights.map((highlight, j) => (
              <div
                key={j}
                className="flex items-center gap-2 text-[0.75rem] text-[var(--text-secondary)]"
              >
                <span
                  className={`w-4 h-4 rounded-full bg-gradient-to-br ${programme.dotBg} bg-opacity-10 border border-white/20 flex items-center justify-center shrink-0`}
                >
                  <CheckIcon className="stroke-white" />
                </span>
                {highlight}
              </div>
            ))}
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 px-4 rounded-xl border border-[var(--card-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-subtle)] text-[var(--text-primary)] text-[0.85rem] font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isExpanded ? "Show Less" : "View Full Curriculum"}
          <span className="text-xs opacity-70">{isExpanded ? "−" : "+"}</span>
        </button>
      </div>

      {/* Expanded Content */}
      <div
        className={`transition-all duration-400 overflow-hidden ${
          isExpanded ? "max-h-[800px] p-6" : "max-h-0 p-0"
        }`}
      >
        {/* Curriculum */}
        <div className="mb-8">
          <h4 className="text-[0.9rem] font-extrabold text-[var(--text-primary)] m-0 mb-4 tracking-tight">
            Curriculum Overview
          </h4>
          <div className="flex flex-col gap-4">
            {programme.curriculum.map((month, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--glass-bg-subtle)] border border-[var(--card-border)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${programme.dotBg} text-white flex items-center justify-center text-[0.7rem] font-black shrink-0`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[0.8rem] font-extrabold text-[var(--text-primary)] m-0 mb-0.5">
                      {month.month}: {month.title}
                    </p>
                    <p
                      className={`text-[0.7rem] font-semibold m-0 ${programme.accentColor}`}
                    >
                      {month.tools.join(", ")}
                    </p>
                  </div>
                </div>
                <p className="text-[0.75rem] text-[var(--text-secondary)] m-0 leading-relaxed">
                  {month.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h4 className="text-[0.9rem] font-extrabold text-[var(--text-primary)] m-0 mb-4 tracking-tight">
            Programme Features
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {programme.features.map((feature, j) => (
              <div
                key={j}
                className="flex items-center gap-2 text-[0.75rem] text-[var(--text-secondary)]"
              >
                <CheckIcon
                  className={programme.accentColor.replace("text-", "stroke-")}
                />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-[var(--card-border)] text-center">
          <p className="text-[0.8rem] text-[var(--text-muted)] m-0 mb-4 font-semibold">
            ⚠️ Students may only enroll in one programme at a time
          </p>
          <button className="btn-primary py-3.5 px-8 text-[0.9rem] font-bold rounded-xl cursor-pointer w-full">
            Enroll Now - {programme.price}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ProgrammesPage() {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const selectedCourse = SOFTWARE_COURSES.find(
    (c) => c.id === selectedCourseId,
  );

  return (
    <>
      <div className="min-h-screen font-sans">
        <Header onSignIn={() => router.push("/login")} />

        {/* ── HERO ── */}
        <section className="pt-28 pb-16 px-[clamp(1.5rem,5vw,3rem)] bg-[var(--bg-base)] border-b border-[var(--card-border)]">
          <div className="max-w-4xl mx-auto">
            <p className="text-[0.72rem] font-bold tracking-[0.14em] text-sky-500 uppercase m-0 mb-3">
              Our Programmes
            </p>

            <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-black m-0 mb-6 text-[var(--text-primary)] tracking-tight leading-none max-w-2xl">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                Learning Path
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.8] m-0 mb-5">
                  Whether you're looking to quickly gain essential CAD skills or
                  pursue complete mastery, we offer flexible programmes designed
                  for different career goals and time commitments.
                </p>
                <p className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.8] m-0 mb-8">
                  <strong className="text-[var(--text-primary)]">
                    Important:
                  </strong>{" "}
                  Students may only enroll in{" "}
                  <strong className="text-[var(--text-primary)]">
                    one programme or one software course at a time
                  </strong>{" "}
                  to ensure focused learning and optimal results.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => router.push("/academy")}
                    className="btn-primary py-3 px-7 text-[0.9rem] font-bold cursor-pointer rounded-xl"
                  >
                    Get Started Today
                  </button>
                  <a
                    href="#programmes"
                    className="btn-secondary py-3 px-7 text-[0.9rem] font-semibold no-underline rounded-xl flex items-center"
                  >
                    Compare Programmes
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* 3-month card */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-2xl mx-auto mb-4">
                    ⚡
                  </div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] m-0 mb-2">
                    3-Month Programme
                  </h3>
                  <p className="text-2xl font-black text-sky-500 m-0 mb-1">
                    750,000 CFA
                  </p>
                  <p className="text-[0.75rem] text-[var(--text-muted)] m-0">
                    From 900,000 CFA
                  </p>
                </div>

                {/* 6-month card */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-3 py-0.5 rounded-full text-[0.65rem] font-extrabold uppercase tracking-wider">
                    Most Popular
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-2xl mx-auto mb-4">
                    🏆
                  </div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] m-0 mb-2">
                    6-Month Programme
                  </h3>
                  <p className="text-2xl font-black text-sky-500 m-0 mb-1">
                    1,200,000 CFA
                  </p>
                  <p className="text-[0.75rem] text-[var(--text-muted)] m-0">
                    From 1,500,000 CFA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROGRAMMES ── */}
        <section
          id="programmes"
          className="py-20 px-[clamp(1.5rem,5vw,3rem)] bg-[var(--bg-base)]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <p className="text-[0.72rem] font-bold tracking-[0.14em] text-sky-500 uppercase m-0 mb-2.5">
                Choose Your Programme
              </p>
              <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-black m-0 mb-3 text-[var(--text-primary)] tracking-tight leading-tight">
                Intensive CAD Training Programmes
              </h2>
              <p className="text-[0.9rem] text-[var(--text-secondary)] m-0 mx-auto max-w-lg leading-[1.7]">
                Both programmes include comprehensive software training,
                hands-on projects, and career support. Click on any programme to
                explore the detailed curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {PROGRAMMES.map((programme, i) => (
                <ProgrammeCard key={i} programme={programme} />
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section className="py-20 px-[clamp(1.5rem,5vw,3rem)] bg-[var(--bg-gradient)] border-t border-[var(--card-border)]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <p className="text-[0.72rem] font-bold tracking-[0.14em] text-sky-500 uppercase m-0 mb-2.5">
                Compare Programmes
              </p>
              <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black m-0 text-[var(--text-primary)] tracking-tight">
                Find the Right Fit for You
              </h2>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr] bg-[var(--glass-bg-subtle)] border-b border-[var(--card-border)]">
                <div className="p-6 font-extrabold text-[var(--text-primary)]">
                  Features
                </div>
                <div className="p-6 text-center font-extrabold text-[var(--text-primary)] border-l border-[var(--card-border)]">
                  3-Month
                  <div className="text-[0.8rem] font-semibold text-sky-500 mt-1">
                    750,000 CFA
                  </div>
                </div>
                <div className="p-6 text-center font-extrabold text-[var(--text-primary)] border-l border-[var(--card-border)] relative">
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-2 py-0.5 rounded-lg text-[0.6rem] font-extrabold uppercase">
                    Popular
                  </div>
                  6-Month
                  <div className="text-[0.8rem] font-semibold text-sky-500 mt-1">
                    1,200,000 CFA
                  </div>
                </div>
              </div>

              {/* Table Rows */}
              {COMPARISON_DATA.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[2fr_1fr_1fr] ${
                    i < COMPARISON_DATA.length - 1
                      ? "border-b border-[var(--card-border)]"
                      : ""
                  }`}
                >
                  <div className="py-4 px-6 font-semibold text-[var(--text-primary)]">
                    {row.feature}
                  </div>
                  <div className="py-4 px-6 text-center text-[var(--text-secondary)] border-l border-[var(--card-border)]">
                    {row.basic}
                  </div>
                  <div className="py-4 px-6 text-center text-[var(--text-secondary)] border-l border-[var(--card-border)]">
                    {row.premium}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SINGLE SOFTWARE COURSES ── */}
        <section className="py-20 px-[clamp(1.5rem,5vw,3rem)] bg-[var(--bg-gradient)] border-t border-[var(--card-border)]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <p className="text-[0.72rem] font-bold tracking-[0.14em] text-sky-500 uppercase m-0 mb-2.5">
                Select a Course
              </p>
              <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-black m-0 mb-3 text-[var(--text-primary)] tracking-tight leading-tight">
                One Software Course at a Time
              </h2>
              <p className="text-[0.9rem] text-[var(--text-secondary)] m-0 mx-auto max-w-2xl leading-[1.7]">
                Every course is priced at 70,000 CFA for 150 hours. Students may
                only enroll in one software course at a time to keep learning
                focused and practical.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              {SOFTWARE_COURSES.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  selected={selectedCourseId === course.id}
                  onSelect={() => setSelectedCourseId(course.id)}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-7">
                <h3 className="m-0 text-[1.15rem] font-black text-[var(--text-primary)] mb-4">
                  Course Selection Summary
                </h3>
                <p className="m-0 text-[0.9rem] text-[var(--text-secondary)] leading-[1.75]">
                  Pick a single software course to proceed. Once selected, you
                  can pay the fixed course fee of 70,000 CFA and reserve your
                  training slot.
                </p>
              </div>

              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <p className="m-0 text-[0.75rem] font-bold tracking-widest uppercase text-sky-500 mb-3">
                    Payment Panel
                  </p>
                  {selectedCourse ? (
                    <>
                      <p className="text-[0.95rem] font-extrabold text-[var(--text-primary)] m-0 mb-2">
                        {selectedCourse.name}
                      </p>
                      <p className="m-0 mb-4 text-[0.85rem] text-[var(--text-secondary)] leading-relaxed">
                        70,000 CFA · 150 hours · {selectedCourse.software}
                      </p>
                    </>
                  ) : (
                    <p className="m-0 text-[0.85rem] text-[var(--text-secondary)] leading-relaxed">
                      Select a course to reveal the payment button and secure
                      your seat.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!selectedCourseId) return;
                    router.push("/login");
                  }}
                  disabled={!selectedCourseId}
                  className={`btn-primary w-full py-4 px-4 rounded-2xl text-[0.95rem] font-extrabold mt-4 transition-opacity ${
                    selectedCourseId
                      ? "cursor-pointer opacity-100"
                      : "cursor-not-allowed opacity-55"
                  }`}
                >
                  {selectedCourse ? `Pay 70,000 CFA` : "Select a course first"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="py-20 px-[clamp(1.5rem,5vw,3rem)] bg-[var(--bg-base)] border-t border-[var(--card-border)]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <p className="text-[0.72rem] font-bold tracking-[0.14em] text-sky-500 uppercase m-0 mb-2.5">
                Why Choose CHICAD
              </p>
              <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-black m-0 text-[var(--text-primary)] tracking-tight">
                Your Success is Our Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--card-border)] rounded-2xl overflow-hidden border border-[var(--card-border)]">
              {[
                {
                  icon: "🎓",
                  title: "Expert Faculty",
                  desc: "Learn from certified professionals with decades of industry experience in civil engineering and architecture.",
                },
                {
                  icon: "🏗️",
                  title: "Real-World Projects",
                  desc: "Work on actual construction projects and case studies from Cameroonian infrastructure developments.",
                },
                {
                  icon: "💼",
                  title: "Career Support",
                  desc: "Comprehensive job placement assistance with connections to leading construction firms across Cameroon.",
                },
                {
                  icon: "🌟",
                  title: "Industry Recognition",
                  desc: "Our certifications are recognized by engineering councils and construction companies nationwide.",
                },
                {
                  icon: "🤝",
                  title: "Small Class Sizes",
                  desc: "Maximum 15 students per class ensures personalized attention and hands-on learning experience.",
                },
                {
                  icon: "🚀",
                  title: "Modern Facilities",
                  desc: "State-of-the-art computer labs with licensed software and high-speed internet connectivity.",
                },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="bg-[var(--card-bg)] p-7 flex flex-col gap-3"
                >
                  <span className="text-[1.4rem]">{benefit.icon}</span>
                  <p className="m-0 text-[0.95rem] font-extrabold text-[var(--text-primary)] tracking-tight">
                    {benefit.title}
                  </p>
                  <p className="m-0 text-[0.8rem] text-[var(--text-secondary)] leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
      `}</style>
    </>
  );
}
