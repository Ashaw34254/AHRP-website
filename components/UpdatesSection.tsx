"use client";

import { motion } from "framer-motion";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { Sparkles, Wrench, Bug, Plus, Calendar } from "lucide-react";

const updates = [
  {
    version: "v2.4.0",
    date: "December 20, 2024",
    type: "major",
    title: "Advanced CAD System Launch",
    items: [
      "Complete CAD system overhaul with real-time dispatch",
      "Integrated BOLO (Be On Lookout) system",
      "Enhanced civil records database",
      "Multi-department dispatch coordination",
      "Voice-to-text incident reports",
    ],
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
  {
    version: "v2.3.5",
    date: "December 15, 2024",
    type: "update",
    title: "Department Expansion & Improvements",
    items: [
      "New Fire Department fleet vehicles",
      "Enhanced EMS medical roleplay system",
      "Police training academy updates",
      "Department rank structure overhaul",
    ],
    icon: Plus,
    color: "from-blue-500 to-indigo-500",
  },
  {
    version: "v2.3.2",
    date: "December 10, 2024",
    type: "patch",
    title: "Performance & Stability",
    items: [
      "Server performance optimizations",
      "Fixed vehicle spawning issues",
      "Improved inventory system stability",
      "Various bug fixes and improvements",
    ],
    icon: Wrench,
    color: "from-green-500 to-emerald-500",
  },
];

const typeConfig = {
  major: { label: "Major Update", color: "secondary" as const },
  update: { label: "Update", color: "primary" as const },
  patch: { label: "Patch", color: "success" as const },
};

export function UpdatesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-purple-300 text-sm font-semibold">What&apos;s New</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Recent <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Updates</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes
          </p>
        </motion.div>

        <div className="space-y-6">
          {updates.map((update, index) => {
            const Icon = update.icon;
            const config = typeConfig[update.type];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                  <CardBody className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Icon Section */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${update.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <Chip
                            color={config.color}
                            variant="flat"
                            size="sm"
                            className="font-semibold"
                          >
                            {config.label}
                          </Chip>
                          <span className="text-sm font-mono text-purple-400">
                            {update.version}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {update.date}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4">
                          {update.title}
                        </h3>

                        <ul className="space-y-2">
                          {update.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3 text-gray-400"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${update.color} mt-2 flex-shrink-0`} />
                              <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View Full Changelog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 text-white font-semibold rounded-lg transition-all duration-300">
            View Full Changelog
          </button>
        </motion.div>
      </div>
    </section>
  );
}
