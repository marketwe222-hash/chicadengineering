"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/academy/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      fallback ?? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Animated logo */}
            <div
              className="
                w-16 h-16 rounded-2xl
                bg-gradient-to-br from-sky-500 to-orange-400
                flex items-center justify-center
                text-white font-black text-xl
                animate-pulse-glow
              "
            >
              CE
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <svg
                className="animate-spin w-4 h-4 text-sky-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Verifying session…
            </div>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
