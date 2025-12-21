"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-red-600/20 rounded-full">
            <AlertCircle className="w-20 h-20 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          500
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Something Went Wrong
        </h2>
        
        <p className="text-lg text-gray-400 mb-2">
          An unexpected error occurred. Don&apos;t worry, our team has been notified.
        </p>
        
        {error.digest && (
          <p className="text-sm text-gray-500 mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
