"use client";

import { motion } from "framer-motion";
import { CheckCircle, Target, Users, Heart, Shield, Sparkles, BookOpen, Trophy } from "lucide-react";
import { Card, CardBody } from "@heroui/react";

const highlights = [
  "Professional staff and management team",
  "Story-driven immersive roleplay",
  "Mature and respectful community",
  "Long-term character development focus",
  "Multiple career paths and opportunities",
  "Regular server events and activities",
];

const coreValues = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To create the most realistic and immersive FiveM roleplay experience where every player's story matters and contributes to our living, breathing community.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We prioritize our community's wellbeing, fostering an inclusive environment where respect, fairness, and collaboration are at the heart of everything we do.",
    gradient: "from-pink-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Professional Standards",
    description: "Maintaining the highest standards of professionalism through rigorous training programs, accountability systems, and transparent leadership.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Constantly evolving with custom-built systems, cutting-edge technology, and community feedback to deliver unique gameplay experiences.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

const statistics = [
  { icon: Users, value: "500+", label: "Active Members" },
  { icon: BookOpen, value: "3+", label: "Years Running" },
  { icon: Trophy, value: "50+", label: "Staff Team" },
  { icon: Shield, value: "99.9%", label: "Uptime" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-purple-300 text-sm font-semibold">Our Story</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            About <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Aurora Horizon RP</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-6">
            Aurora Horizon RP is a premier FiveM roleplay community committed to delivering immersive, story-driven experiences. Our focus is on creating a realistic world where player choices matter, characters evolve over time, and every action has meaningful consequences.

We pride ourselves on:

Professional management that ensures a smooth, consistent experience for all players.

Fair and approachable staff who enforce rules transparently while supporting roleplay freedom.

Long-term character development, encouraging players to build stories, relationships, and legacies within our world.

At Aurora Horizon RP, our goal is more than just gameplay—it’s a thriving community where creativity, collaboration, and realism come together, giving every player a space to explore and grow in their roleplay journey.
          </p>
          
      
        </motion.div>

        {/* Core Values Grid */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.2, duration: 0.6 }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
>
  {coreValues.map((value, index) => {
    const Icon = value.icon;

    return (
      <motion.div
        key={value.title} // use title instead of index for better key stability
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 * index, duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="h-full bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
          <CardBody className="p-6 flex flex-col">
            <div
              className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${value.gradient} mb-4`}
            >
              <Icon className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
          </CardBody>
        </Card>
      </motion.div>
    );
  })}
</motion.div>


        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 border border-purple-500/30 rounded-2xl p-8 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
{/* What Makes Us Special */}
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.5, duration: 0.6 }}
  className="py-12"
>
  <h3 className="text-3xl font-bold text-center text-white mb-10">
    What Makes Us{' '}
    <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
      Special
    </span>
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {highlights.map((highlight, index) => (
      <motion.div
        key={highlight} // use highlight text for stable key
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08 * index, duration: 0.5, ease: 'easeOut' }}
        className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-purple-500/50 hover:bg-gray-900/70 transition-all duration-300"
      >
        <CheckCircle
          className="w-6 h-6 text-green-400 flex-shrink-0"
          aria-hidden="true"
        />
        <p className="text-gray-300 text-sm font-medium">{highlight}</p>
      </motion.div>
    ))}
  </div>
</motion.section>

      </div>
    </section>
  );
}
