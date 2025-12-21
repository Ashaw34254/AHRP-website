"use client";

import { Button } from "@nextui-org/react";
import { Session } from "next-auth";

interface HeroSectionProps {
  session: Session | null;
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.3] [background-image:url('https://images.unsplash.com/photo-1519669417670-68775a50919c?q=80&w=2070')]"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Aurora Horizon Roleplay
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          A next-generation FiveM roleplay experience
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            as="a"
            href="https://discord.gg/ahrp"
            target="_blank"
            size="lg"
            color="primary"
            className="min-w-[200px] font-semibold"
          >
            Join Our Discord
          </Button>
          
          {session ? (
            <Button
              as="a"
              href="/dashboard"
              size="lg"
              color="secondary"
              variant="bordered"
              className="min-w-[200px] font-semibold"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              as="a"
              href="/apply"
              size="lg"
              color="secondary"
              variant="bordered"
              className="min-w-[200px] font-semibold"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}
