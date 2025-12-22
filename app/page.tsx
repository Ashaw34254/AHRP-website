"use client";

import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GallerySection } from "@/components/GallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { UpdatesSection } from "@/components/UpdatesSection";
import { HowToJoinSection } from "@/components/HowToJoinSection";
import { FAQSection } from "@/components/FAQSection";
import { ServerInfoSection } from "@/components/ServerInfoSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />
      <HeroSection session={session} />
      <AboutSection />
      <FeaturesSection />
      <DepartmentsSection />
      <GallerySection />
      <TestimonialsSection />
      <UpdatesSection />
      <HowToJoinSection />
      <FAQSection />
      <ServerInfoSection />
      <CTASection />
      <Footer />
    </main>
  );
}
