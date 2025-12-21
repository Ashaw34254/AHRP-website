"use client";

import { Button } from "@nextui-org/react";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Ready to Begin Your Story?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join hundreds of players in Aurora Horizon Roleplay and experience 
          the most immersive FiveM roleplay community.
        </p>
        <Button
          as="a"
          href="https://discord.gg/ahrp"
          target="_blank"
          size="lg"
          color="primary"
          className="min-w-[250px] text-lg font-semibold"
        >
          Get Started Today
        </Button>
      </div>
    </section>
  );
}
