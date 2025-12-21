"use client";

import { useSession } from "next-auth/react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToJoinSection } from "@/components/HowToJoinSection";
import { ServerInfoSection } from "@/components/ServerInfoSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <HeroSection session={session} />
      <AboutSection />
      <DepartmentsSection />
      <FeaturesSection />
      <HowToJoinSection />
      <ServerInfoSection />
      <CTASection />
      <Footer />
    </main>
  );
}
