"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw, Home, Copy, Check, Radio, Bug, Code, Terminal, Download, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorDetails {
  message: string;
  digest?: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  viewport: string;
  errorType: string;
  componentStack?: string;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; cause?: any };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showStackTrace, setShowStackTrace] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Enhanced logging with full details
    console.group('🚨 Application Error');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Digest:', error.digest);
    console.error('Cause:', error.cause);
    console.groupEnd();

    // Collect comprehensive error details
    const details: ErrorDetails = {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      errorType: categorizeError(error),
      componentStack: error.cause?.componentStack || undefined,
    };
    setErrorDetails(details);
  }, [error]);

  // Categorize error type for better debugging
  const categorizeError = (err: Error): string => {
    const msg = err.message.toLowerCase();
    if (msg.includes('fetch') || msg.includes('network')) return 'Network Error';
    if (msg.includes('timeout')) return 'Timeout Error';
    if (msg.includes('undefined') || msg.includes('null')) return 'Null Reference Error';
    if (msg.includes('parse') || msg.includes('json')) return 'Data Parsing Error';
    if (msg.includes('permission') || msg.includes('unauthorized')) return 'Authorization Error';
    if (msg.includes('not found') || msg.includes('404')) return 'Resource Not Found';
    if (msg.includes('database') || msg.includes('prisma')) return 'Database Error';
    return 'Runtime Error';
  };

  const copyErrorDetails = () => {
    if (!errorDetails) return;
    
    const details = `
═══════════════════════════════════════════════════
🚨 AURORA HORIZON RP - ERROR REPORT
═══════════════════════════════════════════════════

ERROR TYPE: ${errorDetails.errorType}
TIMESTAMP: ${errorDetails.timestamp}
DIGEST: ${errorDetails.digest || 'N/A'}

ERROR MESSAGE:
${errorDetails.message}

LOCATION:
URL: ${errorDetails.url}

ENVIRONMENT:
User Agent: ${errorDetails.userAgent}
Viewport: ${errorDetails.viewport}
Mode: ${isDev ? 'Development' : 'Production'}

${errorDetails.stack ? `STACK TRACE:\n${errorDetails.stack}\n` : ''}
${errorDetails.componentStack ? `COMPONENT STACK:\n${errorDetails.componentStack}\n` : ''}
═══════════════════════════════════════════════════
`;
    
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadErrorReport = () => {
    if (!errorDetails) return;
    
    const report = {
      type: errorDetails.errorType,
      timestamp: errorDetails.timestamp,
      digest: errorDetails.digest,
      message: errorDetails.message,
      stack: errorDetails.stack,
      componentStack: errorDetails.componentStack,
      url: errorDetails.url,
      userAgent: errorDetails.userAgent,
      viewport: errorDetails.viewport,
      environment: isDev ? 'development' : 'production',
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${errorDetails.digest || Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSuggestedFix = (): string[] => {
    if (!errorDetails) return [];
    const msg = error.message.toLowerCase();
    
    if (msg.includes('fetch') || msg.includes('network')) {
      return [
        'Check your internet connection',
        'Verify the API endpoint is accessible',
        'Check for CORS issues in browser console',
        'Ensure the backend server is running'
      ];
    }
    if (msg.includes('undefined') || msg.includes('null')) {
      return [
        'Check for missing data in the component props',
        'Verify API responses contain expected fields',
        'Add null checks before accessing properties',
        'Review the component rendering conditions'
      ];
    }
    if (msg.includes('database') || msg.includes('prisma')) {
      return [
        'Check database connection string',
        'Run: npx prisma generate',
        'Verify migrations are up to date',
        'Check Prisma Studio for data issues'
      ];
    }
    return [
      'Try refreshing the page',
      'Clear browser cache and cookies',
      'Check browser console for additional errors',
      'Review recent code changes'
    ];
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
        
        {/* Error Type Badge */}
        {errorDetails && (
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <div className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full">
              <span className="text-sm font-semibold text-red-400">
                {errorDetails.errorType}
              </span>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="mb-8 flex justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={copyErrorDetails}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Report</span>
              </>
            )}
          </button>
          <button
            onClick={downloadErrorReport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
        </motion.div>

        {/* Error Details Card */}
        {errorDetails && (
          <motion.div
            className="mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
              {/* Error Reference */}
              <div className="p-5 border-b border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Bug className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-semibold text-gray-300">Error Reference</span>
                </div>
                <p className="text-sm text-gray-400 font-mono bg-black/30 p-3 rounded break-all">
                  {errorDetails.digest || 'No digest available'}
                </p>
              </div>

              {/* Error Message */}
              <div className="p-5 border-b border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-semibold text-gray-300">Error Message</span>
                </div>
                <p className="text-sm text-red-400 font-mono bg-black/30 p-3 rounded leading-relaxed">
                  {errorDetails.message}
                </p>
              </div>

              {/* Environment Info */}
              <div className="p-5 border-b border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-gray-300">Environment</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Mode:</span>
                    <span className={`ml-2 font-mono ${isDev ? 'text-yellow-400' : 'text-green-400'}`}>
                      {isDev ? 'Development' : 'Production'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <span className="ml-2 font-mono text-gray-300">
                      {new Date(errorDetails.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">URL:</span>
                    <span className="ml-2 font-mono text-gray-300 text-xs break-all">
                      {errorDetails.url}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Viewport:</span>
                    <span className="ml-2 font-mono text-gray-300">
                      {errorDetails.viewport}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stack Trace (Dev Mode or Expandable) */}
              {errorDetails.stack && (
                <div className="border-b border-gray-700">
                  <button
                    onClick={() => setShowStackTrace(!showStackTrace)}
                    className="w-full p-5 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300">Stack Trace</span>
                      {isDev && <span className="text-xs text-yellow-400">(Dev Mode)</span>}
                    </div>
                    {showStackTrace ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {showStackTrace && (
                    <div className="px-5 pb-5">
                      <pre className="text-xs text-gray-400 font-mono bg-black/50 p-4 rounded overflow-x-auto max-h-64 overflow-y-auto">
                        {errorDetails.stack}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Fixes */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-300">Suggested Fixes</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {getSuggestedFix().map((fix, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
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

        {/* Developer Debug Section */}
        {isDev && (
          <motion.div
            className="bg-yellow-900/20 border-2 border-yellow-500/30 rounded-lg p-6 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Developer Debug Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-yellow-500 font-semibold">Quick Debug Commands:</span>
                <div className="mt-2 space-y-1 font-mono text-xs bg-black/30 p-3 rounded">
                  <div className="text-gray-300">• Check console for detailed error logs</div>
                  <div className="text-gray-300">• Run <code className="text-indigo-400">npx prisma studio</code> to inspect DB</div>
                  <div className="text-gray-300">• Run <code className="text-indigo-400">npm run build</code> to check for build errors</div>
                  <div className="text-gray-300">• Clear .next folder: <code className="text-indigo-400">rm -rf .next</code></div>
                </div>
              </div>
              <div>
                <span className="text-yellow-500 font-semibold">Common Causes:</span>
                <div className="mt-2 text-gray-400">
                  {errorDetails?.errorType === 'Database Error' && '→ Check Prisma schema, run migrations, or verify DB connection'}
                  {errorDetails?.errorType === 'Network Error' && '→ Check API routes, verify fetch calls, or check CORS settings'}
                  {errorDetails?.errorType === 'Null Reference Error' && '→ Add null checks, verify data structure, or check API responses'}
                  {errorDetails?.errorType === 'Data Parsing Error' && '→ Verify JSON structure, check API response format'}
                  {!errorDetails?.errorType.includes('Database') && 
                   !errorDetails?.errorType.includes('Network') && 
                   !errorDetails?.errorType.includes('Null') && 
                   !errorDetails?.errorType.includes('Parsing') && 
                   '→ Check component logic, verify props, or review recent changes'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div 
          className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 max-w-3xl mx-auto"
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
            <li>• The error has been automatically logged with timestamp and details</li>
            <li>• {isDev ? 'Check the Developer Debug Info section above for quick fixes' : 'Engineers are investigating if this is a widespread issue'}</li>
            <li>• You can try refreshing the page or returning to the homepage</li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500 mb-3">
              {isDev 
                ? 'Copy the error report above and check browser console for more details. If you need help, share this info with the team.'
                : 'If this error persists, please report it to our dispatch team with the error reference above:'}
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
