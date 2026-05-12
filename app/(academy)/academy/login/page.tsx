//lets import out main login component here and render it
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/academy";

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
        }}
      >
        <Header onSignIn={() => router.push("/login")} />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Login Page</h1>
          <p>This is where the login form will go.</p>
        </div>
        <Footer />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 3.75rem; }
      `}</style>
    </>
  );
}
