"use client";

import Link from "next/link";
import { Home, AlertTriangle, Search, Radio, FileText, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  const quickLinks = [
    { href: "/", icon: Home, label: "Homepage" },
    { href: "/dashboard", icon: Radio, label: "Dashboard" },
    { href: "/apply", icon: FileText, label: "Applications" },
    { href: "/about", icon: Shield, label: "About Us" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Animated Icon */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative p-6 bg-yellow-600/20 rounded-full border border-yellow-500/30">
              <AlertTriangle className="w-20 h-20 text-yellow-400" />
            </div>
          </div>
        </motion.div>
        
        {/* Error Code */}
        <motion.h1 
          className="text-8xl md:text-9xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        
        {/* Title */}
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-4 text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          10-78: Page Not Found
        </motion.h2>
        
        {/* Description */}
        <motion.p 
          className="text-lg text-gray-400 mb-12 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Dispatch, we&apos;ve got a 10-78 - the requested page is off the grid. 
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or you don&apos;t have permission to access it.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Return to Base
          </Link>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/10 text-white font-semibold rounded-lg transition-all"
          >
            <Radio className="w-5 h-5" />
            Open CAD
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="flex flex-col items-center gap-2 p-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-indigo-500 rounded-lg transition-all group"
                >
                  <link.icon className="w-8 h-8 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-gray-500 mb-2">
            Need assistance? Contact our dispatch team
          </p>
          <a
            href="https://discord.gg/aurorahorizon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Join our Discord
          </a>
        </motion.div>
      </div>
    </main>
  );
}
