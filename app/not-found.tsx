import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-yellow-600/20 rounded-full">
            <AlertTriangle className="w-20 h-20 text-yellow-400" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <a
            href="https://discord.gg/aurorahorizon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
