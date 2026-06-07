"use client";

import { useMemo, useState } from "react";
import { CourseLogo } from "@/components/ui/CourseLogo";
import { useCourses } from "@/hooks/useCourse";
import type { Course } from "@/types";

const CATEGORY_COLOR: Record<string, string> = {
  CAD: "#ef4444",
  BIM: "#7dd3fc",
  FEA: "#a78bfa",
  Visualization: "#f59e0b",
  Productivity: "#22c55e",
  "Structural Analysis": "#fb923c",
};

function getCategoryColor(category?: string) {
  return category ? (CATEGORY_COLOR[category] ?? "#3b82f6") : "#3b82f6";
}

interface EnrollViewProps {
  studentId: string;
  enrolledIds: string[];
  onEnrolled: () => void;
}

export default function EnrollView({
  studentId,
  enrolledIds,
  onEnrolled,
}: EnrollViewProps) {
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    courses,
    isLoading,
    error: fetchError,
  } = useCourses({
    page: 1,
    search,
    status: "ACTIVE",
  });

  const availableCourses = useMemo(
    () => courses.filter((course) => !enrolledIds.includes(course.id)),
    [courses, enrolledIds],
  );

  async function handleEnroll(courseId: string) {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/students/${studentId}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Enrollment failed");
      }

      setMessage("You have been enrolled successfully.");
      onEnrolled();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              fontSize: "1.05rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "0.3rem",
            }}
          >
            Browse available courses
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Select a course you are not already enrolled in and join it now.
          </p>
        </div>

        <label
          style={{
            display: "block",
            minWidth: 250,
            flex: "0 1 320px",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.4rem",
            }}
          >
            Search courses
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by course name"
            style={{
              width: "100%",
              padding: "0.9rem 1rem",
              borderRadius: 14,
              border: "1px solid var(--glass-border)",
              background: "var(--glass-bg)",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
            }}
          />
        </label>
      </div>

      {message && (
        <div
          className="glass"
          style={{
            padding: "1rem 1.1rem",
            borderLeft: "4px solid var(--success-text)",
            color: "var(--success-text)",
          }}
        >
          {message}
        </div>
      )}

      {(error || fetchError) && (
        <div
          className="glass"
          style={{
            padding: "1rem 1.1rem",
            borderLeft: "4px solid var(--error-text)",
            color: "var(--error-text)",
          }}
        >
          {error || fetchError}
        </div>
      )}

      {isLoading ? (
        <div
          className="glass"
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Loading courses...
        </div>
      ) : availableCourses.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>🎯</div>
          <p style={{ fontSize: "0.95rem" }}>
            There are no active courses available for enrollment.
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            If you believe this is wrong, contact support for course access.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "1rem",
          }}
        >
          {availableCourses.map((course) => {
            const color = getCategoryColor(course.category);
            return (
              <div
                key={course.id}
                className="glass"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <CourseLogo
                    logoImage={course.logoImage}
                    icon={course.icon ?? "📐"}
                    size="xl"
                    style={{ background: "rgba(148,163,184,0.12)" }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {course.name}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: color,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      {course.category}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "0.86rem",
                  }}
                >
                  {course.description ?? "No description available."}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Code: {course.courseCode}
                  </span>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={isSubmitting}
                    style={{
                      border: "none",
                      borderRadius: 10,
                      padding: "0.65rem 1rem",
                      background: "var(--sky)",
                      color: "white",
                      fontWeight: 700,
                      cursor: "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    Enroll now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
