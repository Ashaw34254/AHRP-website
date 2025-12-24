"use client";

import Link from "next/link";
import { Home, AlertTriangle, Search, Radio, FileText, Shield, Code, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    setCurrentUrl(window.location.href);
    
    // Log 404 for developers
    console.group('📍 404 Not Found');
    console.warn('Path:', window.location.pathname);
    console.warn('URL:', window.location.href);
    console.warn('Referrer:', document.referrer);
    console.groupEnd();
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          className="text-lg text-gray-400 mb-8 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Dispatch, we&apos;ve got a 10-78 - the requested page is off the grid. 
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or you don&apos;t have permission to access it.
        </motion.p>

        {/* URL Display with Copy */}
        {currentUrl && (
          <motion.div
            className="mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Requested URL:</span>
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-300 font-mono bg-black/30 p-3 rounded break-all">
                {currentUrl}
              </p>
            </div>
          </motion.div>
        )}

        {/* Developer Debug Info */}
        {isDev && (
          <motion.div
            className="mb-8 max-w-2xl mx-auto bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">Developer Info</span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Path:</span>
                <span className="text-gray-300 font-mono ml-2">{typeof window !== 'undefined' ? window.location.pathname : ''}</span>
              </div>
              <div className="pt-3 border-t border-yellow-500/20">
                <span className="text-yellow-500 font-semibold block mb-2">Common Causes:</span>
                <ul className="space-y-1 text-gray-400 text-xs">
                  <li>• Page/route doesn't exist in app directory</li>
                  <li>• Typo in the URL or link</li>
                  <li>• Missing dynamic route handler</li>
                  <li>• Route requires authentication (middleware redirect)</li>
                  <li>• API route returns 404 (check API implementation)</li>
                </ul>
              </div>
              <div className="pt-3 border-t border-yellow-500/20">
                <span className="text-yellow-500 font-semibold block mb-2">Debug Steps:</span>
                <div className="space-y-1 text-gray-400 text-xs font-mono bg-black/30 p-3 rounded">
                  <div>1. Check app/ directory structure</div>
                  <div>2. Verify route file naming (page.tsx, layout.tsx)</div>
                  <div>3. Check middleware.ts for redirects</div>
                  <div>4. Review browser console for client-side errors</div>
                  <div>5. Check git history for deleted routes</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
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
