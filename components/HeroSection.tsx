"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Session } from "next-auth";
import { motion } from "framer-motion";
import { PlayCircle, Users, Zap } from "lucide-react";

interface HeroSectionProps {
  session: Session | null;
}

export function HeroSection({ session }: HeroSectionProps) {
  const [particles, setParticles] = useState<Array<{ initialX: number; initialY: number; targetX: number; targetY: number; duration: number }>>([]);

  useEffect(() => {
    // Generate particle positions only on client to avoid hydration mismatch
    const newParticles = [...Array(20)].map(() => ({
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
      duration: Math.random() * 10 + 20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.25] [background-image:url('https://images.unsplash.com/photo-1519669417670-68775a50919c?q=80&w=2070')]"
        />
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-purple-900/20 to-black"
          animate={{
            background: [
              "linear-gradient(to bottom, rgba(67, 56, 202, 0.3), rgba(126, 34, 206, 0.2), rgba(0, 0, 0, 1))",
              "linear-gradient(to bottom, rgba(126, 34, 206, 0.3), rgba(67, 56, 202, 0.2), rgba(0, 0, 0, 1))",
              "linear-gradient(to bottom, rgba(67, 56, 202, 0.3), rgba(126, 34, 206, 0.2), rgba(0, 0, 0, 1))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            initial={{
              x: particle.initialX,
              y: particle.initialY,
            }}
            animate={{
              y: [null, particle.targetY],
              x: [null, particle.targetX],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-purple-300 text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Next-Generation Roleplay
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight">
            Aurora Horizon
          </h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-200 font-semibold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Roleplay Experience
          </motion.p>

          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Immerse yourself in the most advanced FiveM roleplay community. 
            Professional CAD systems, realistic departments, and a thriving player base.
          </motion.p>
        </motion.div>

        {/* Quick stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">500+</div>
            <div className="text-sm text-gray-400">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">24/7</div>
            <div className="text-sm text-gray-400">Server Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">Custom</div>
            <div className="text-sm text-gray-400">CAD System</div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            as="a"
            href="https://discord.gg/ahrp"
            target="_blank"
            size="lg"
            color="primary"
            className="min-w-[200px] font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
            startContent={<Users className="w-5 h-5" />}
          >
            Join Discord
          </Button>
          
          {session ? (
            <Button
              as="a"
              href="/dashboard"
              size="lg"
              color="secondary"
              variant="bordered"
              className="min-w-[200px] font-semibold text-lg border-purple-500 hover:bg-purple-500/10"
              startContent={<PlayCircle className="w-5 h-5" />}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              as="a"
              href="/apply"
              size="lg"
              color="secondary"
              variant="bordered"
              className="min-w-[200px] font-semibold text-lg border-purple-500 hover:bg-purple-500/10"
              startContent={<PlayCircle className="w-5 h-5" />}
            >
              Apply Now
            </Button>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-transparent rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}
