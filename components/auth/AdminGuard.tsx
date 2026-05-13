"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/academy/login");
      } else if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading || !isAuthenticated || !isAdmin) return null;

  return <>{children}</>;
}
