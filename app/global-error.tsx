"use client";

import { Home, ServerCrash, RefreshCw, Radio, Shield } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Animated Icon */}
            <div className="mb-8 flex justify-center animate-pulse">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                <div className="relative p-6 bg-red-600/20 rounded-full border-2 border-red-500/50">
                  <ServerCrash className="w-24 h-24 text-red-400" />
                </div>
              </div>
            </div>
            
            {/* Error Code */}
            <h1 className="text-9xl md:text-[12rem] font-bold mb-6 text-center bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-transparent bg-clip-text leading-none">
              500
            </h1>
            
            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-center text-white">
              10-33: Emergency - System Critical
            </h2>
            
            {/* Description */}
            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-gray-300 mb-3">
                    <strong className="text-red-400">CRITICAL SYSTEM ERROR</strong>
                  </p>
                  <p className="text-gray-400 mb-2">
                    A catastrophic error has occurred that affected the entire application. 
                    This is rare and our emergency response team has been automatically alerted.
                  </p>
                  {error.digest && (
                    <p className="text-sm text-gray-500 font-mono mt-3 bg-black/30 p-2 rounded">
                      Emergency Code: {error.digest}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all hover:scale-105 text-lg"
              >
                <RefreshCw className="w-6 h-6" />
                Restart System
              </button>
              
              <a
                href="/"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-red-500 hover:border-red-400 hover:bg-red-500/10 text-white font-semibold rounded-lg transition-all text-lg"
              >
                <Home className="w-6 h-6" />
                Emergency Exit
              </a>
            </div>

            {/* Recovery Instructions */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Radio className="w-6 h-6 text-indigo-400" />
                Emergency Recovery Steps
              </h3>
              <ol className="space-y-3 text-gray-400">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white">1</span>
                  <span>Click &quot;Restart System&quot; to attempt automatic recovery</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white">2</span>
                  <span>If the error persists, clear your browser cache and cookies</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white">3</span>
                  <span>Try accessing the site from a different browser or device</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white">4</span>
                  <span>Contact emergency dispatch if the problem continues</span>
                </li>
              </ol>
              
              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Priority 1 Support - Immediate Response Required
                </p>
                <a
                  href="https://discord.gg/aurorahorizon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                >
                  <Radio className="w-5 h-5" />
                  Emergency Dispatch (Discord)
                </a>
              </div>
            </div>

            {/* System Status Note */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Automatic incident report filed at {new Date().toLocaleString()}
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
