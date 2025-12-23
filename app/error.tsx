"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Home, Copy, Check, Radio, Bug } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const copyErrorDetails = () => {
    const details = `Error: ${error.message}\nDigest: ${error.digest || "N/A"}\nTimestamp: ${new Date().toISOString()}`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Animated Icon */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative p-6 bg-red-600/20 rounded-full border border-red-500/30">
              <AlertCircle className="w-20 h-20 text-red-400" />
            </div>
          </div>
        </motion.div>
        
        {/* Error Code */}
        <motion.h1 
          className="text-8xl md:text-9xl font-bold mb-4 text-center bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          500
        </motion.h1>
        
        {/* Title */}
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-4 text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          10-00: Officer Down
        </motion.h2>
        
        {/* Description */}
        <motion.p 
          className="text-lg text-gray-400 mb-6 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Dispatch, we have a 10-00 - system critical error. Our engineers have been automatically notified 
          and are responding Code 3.
        </motion.p>
        
        {/* Error Details Card */}
        {error.digest && (
          <motion.div
            className="mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bug className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-semibold text-gray-300">Error Reference</span>
                </div>
                <button
                  onClick={copyErrorDetails}
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
              <p className="text-sm text-gray-400 font-mono bg-black/30 p-3 rounded break-all">
                {error.digest}
              </p>
              
              {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-500 mb-2">Error Message:</p>
                  <p className="text-sm text-red-400 font-mono bg-black/30 p-3 rounded">
                    {error.message}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 underline"
              >
                {showDetails ? "Hide" : "Show"} technical details
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Operation
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/10 text-white font-semibold rounded-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Return to Base
          </Link>
        </motion.div>

        {/* Help Section */}
        <motion.div 
          className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400" />
            What happened?
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Something unexpected occurred while processing your request</li>
            <li>• Our monitoring system has automatically logged this incident</li>
            <li>• Engineers are investigating the issue if it&apos;s widespread</li>
            <li>• You can try refreshing the page or returning to the homepage</li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500 mb-3">
              If this error persists, please report it to our dispatch team with the error reference above:
            </p>
            <a
              href="https://discord.gg/aurorahorizon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              <Radio className="w-4 h-4" />
              Contact Support on Discord
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
