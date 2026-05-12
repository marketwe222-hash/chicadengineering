"use client";

import { HeroSection } from "./HeroSection";

import { TestimonialsSection } from "./TestimonialsSection";

import { FinalCTASection } from "./FinalCTASection";

export default function Home({
  onSignIn,
  onBackToHome,
}: {
  onSignIn: () => void;

  onBackToHome: () => void;
}) {
  return (
    <>
      <HeroSection onSignIn={onSignIn} />

      <TestimonialsSection />
    </>
  );
}
