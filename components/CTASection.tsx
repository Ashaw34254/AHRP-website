"use client";

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            animate={{
              y: ["0%", "100%"],
              x: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-purple-300" />
            <span className="text-purple-300 text-sm font-semibold">
              Start Your Journey Today
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Ready to Begin Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Roleplay Story?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of players in Aurora Horizon Roleplay and experience 
            the most immersive and professional FiveM roleplay community.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button
              as="a"
              href="https://discord.gg/ahrp"
              target="_blank"
              size="lg"
              color="primary"
              className="min-w-[250px] text-lg font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
              endContent={<Users className="w-5 h-5" />}
            >
              Join Discord Now
            </Button>
            
            <Button
              as="a"
              href="/apply"
              size="lg"
              variant="bordered"
              className="min-w-[250px] text-lg font-semibold border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10"
              endContent={<ArrowRight className="w-5 h-5" />}
            >
              Submit Application
            </Button>
          </motion.div>

          <motion.div
            className="mt-10 pt-10 border-t border-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-gray-500 text-sm">
              By joining, you agree to follow our community guidelines and roleplay standards
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

