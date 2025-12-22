"use client";

import { motion } from "framer-motion";
import { Users, Clock, Award, Zap, Shield, Heart } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Active Players",
    gradient: "from-indigo-500 to-purple-500",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-500",
    shadow: "group-hover:shadow-indigo-500/50",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Server Uptime",
    gradient: "from-purple-500 to-pink-500",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    shadow: "group-hover:shadow-purple-500/50",
  },
  {
    icon: Award,
    value: "50+",
    label: "Staff Members",
    gradient: "from-pink-500 to-red-500",
    iconBg: "bg-gradient-to-br from-pink-500 to-red-500",
    shadow: "group-hover:shadow-pink-500/50",
  },
  {
    icon: Zap,
    value: "Custom",
    label: "CAD System",
    gradient: "from-yellow-500 to-orange-500",
    iconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
    shadow: "group-hover:shadow-orange-500/50",
  },
  {
    icon: Shield,
    value: "Active",
    label: "Police Force",
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
    shadow: "group-hover:shadow-blue-500/50",
  },
  {
    icon: Heart,
    value: "Dedicated",
    label: "EMS & Fire",
    gradient: "from-red-500 to-pink-500",
    iconBg: "bg-gradient-to-br from-red-500 to-pink-500",
    shadow: "group-hover:shadow-red-500/50",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-black">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Why We&apos;re Different
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join a community built on professionalism and immersion
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className={`relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-transparent transition-all duration-500 ${stat.shadow} shadow-lg overflow-hidden`}>
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ padding: '1px' }}>
                    <div className="h-full w-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Icon with gradient background */}
                    <motion.div 
                      className={`${stat.iconBg} p-4 rounded-xl mb-4 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </motion.div>
                    
                    {/* Value with gradient text */}
                    <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} text-transparent bg-clip-text`}>
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-xs md:text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                      {stat.label}
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
