"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Home, Footer } from "@/components/academy";

// ─── Sign-In Modal ────────────────────────────────────────────────────────────

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AcademyLandingPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
        }}
      >
        <Header onSignIn={handleSignIn} />
        <Home onSignIn={handleSignIn} onBackToHome={() => router.push("/")} />
        <Footer />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 3.75rem; }
        @media (max-width: 700px) {
          nav a { display: none; }
        }
        @media (max-width: 800px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
