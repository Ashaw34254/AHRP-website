"use client";

import { Card, CardBody } from "@heroui/react";
import { Award, Code, Ambulance, DollarSign, Globe, Cpu, Radio, Car } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Award,
    title: "Experienced Staff Team",
    description: "Dedicated and fair staff with years of roleplay experience providing top-tier support",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Custom Scripts & Systems",
    description: "Unique custom-built features and mechanics for immersive gameplay experiences",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Ambulance,
    title: "Realistic Emergency Services",
    description: "Fully functional police, fire, and EMS departments with proper protocols and training",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Balanced Economy",
    description: "Fair and balanced economy system ensuring long-term engagement and progression",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "AU/NZ-Friendly Community",
    description: "Optimized for Australian and New Zealand time zones with active players around the clock",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Cpu,
    title: "Advanced CAD System",
    description: "Professional-grade Computer-Aided Dispatch system for emergency services coordination",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Radio,
    title: "Realistic Communications",
    description: "Voice and radio systems that simulate real-world emergency communications",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Car,
    title: "Extensive Vehicle Fleet",
    description: "Realistic vehicles for all departments including police, fire, EMS, and civilian options",
    gradient: "from-orange-500 to-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Why Choose <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">AHRP</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the most comprehensive roleplay features and systems
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 h-full"
                >
                  <CardBody className="p-6">
                    <div className="mb-4">
                      <div className={`p-3 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-lg inline-block`}>
                        <Icon className={`w-7 h-7 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text`} style={{ stroke: 'url(#gradient)' }} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
