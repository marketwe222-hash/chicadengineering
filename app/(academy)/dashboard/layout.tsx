"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {/* ── Sidebar ── */}
        <Sidebar />

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar title="Dashboard" />

          <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>

          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
