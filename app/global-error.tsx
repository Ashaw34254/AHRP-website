"use client";

import { Home, ServerCrash } from "lucide-react";

export default function GlobalError() {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="p-6 bg-red-600/20 rounded-full">
                <ServerCrash className="w-20 h-20 text-red-400" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
              500
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Critical Error
            </h2>
            
            <p className="text-lg text-gray-400 mb-8">
              A critical error occurred. Please refresh the page or contact support if the issue persists.
            </p>
            
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
