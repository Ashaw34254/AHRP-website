"use client";

import { Home, ServerCrash, RefreshCw, Radio, Shield, Copy, Download, Code, Terminal, AlertCircle, Bug } from "lucide-react";
import { useEffect, useState } from "react";

interface GlobalErrorDetails {
  message: string;
  digest?: string;
  stack?: string;
  timestamp: string;
  userAgent: string;
  errorType: string;
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorDetails, setErrorDetails] = useState<GlobalErrorDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Log comprehensive error details
    console.group('🚨 CRITICAL GLOBAL ERROR');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Digest:', error.digest);
    console.groupEnd();

    // Collect error information
    const details: GlobalErrorDetails = {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      errorType: categorizeGlobalError(error),
    };
    setErrorDetails(details);
  }, [error]);

  const categorizeGlobalError = (err: Error): string => {
    const msg = err.message.toLowerCase();
    if (msg.includes('chunk') || msg.includes('module')) return 'Module Loading Error';
    if (msg.includes('hydration') || msg.includes('render')) return 'React Rendering Error';
    if (msg.includes('memory')) return 'Memory Error';
    if (msg.includes('script')) return 'Script Loading Error';
    return 'Critical System Error';
  };

  const copyErrorReport = () => {
    if (!errorDetails) return;
    
    const report = `
═══════════════════════════════════════════════════
🚨 AURORA HORIZON RP - CRITICAL ERROR REPORT
═══════════════════════════════════════════════════

ERROR TYPE: ${errorDetails.errorType}
SEVERITY: CRITICAL (Global Error)
TIMESTAMP: ${errorDetails.timestamp}
DIGEST: ${errorDetails.digest || 'N/A'}

ERROR MESSAGE:
${errorDetails.message}

ENVIRONMENT:
User Agent: ${errorDetails.userAgent}
Mode: ${isDev ? 'Development' : 'Production'}

${errorDetails.stack ? `STACK TRACE:\n${errorDetails.stack}\n` : ''}
═══════════════════════════════════════════════════

IMMEDIATE ACTIONS REQUIRED:
1. Check server logs for related errors
2. Verify all environment variables are set
3. Check database connectivity
4. Review recent deployments
5. Monitor error frequency in production
`;
    
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadErrorReport = () => {
    if (!errorDetails) return;
    
    const report = {
      severity: 'CRITICAL',
      type: errorDetails.errorType,
      timestamp: errorDetails.timestamp,
      digest: errorDetails.digest,
      message: errorDetails.message,
      stack: errorDetails.stack,
      userAgent: errorDetails.userAgent,
      environment: isDev ? 'development' : 'production',
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `critical-error-${errorDetails.digest || Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

            {/* Error Type Badge */}
            {errorDetails && (
              <div className="mb-6 flex justify-center">
                <div className="px-4 py-2 bg-red-600/30 border-2 border-red-500/50 rounded-full">
                  <span className="text-sm font-bold text-red-300">
                    {errorDetails.errorType}
                  </span>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-lg text-gray-300 mb-3">
                    <strong className="text-red-400">CRITICAL SYSTEM ERROR</strong>
                  </p>
                  <p className="text-gray-400 mb-2">
                    A catastrophic error has occurred that affected the entire application. 
                    This is rare and our emergency response team has been automatically alerted.
                  </p>
                  {errorDetails && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm bg-black/30 p-3 rounded">
                        <span className="text-gray-500">Emergency Code:</span>
                        <span className="text-gray-300 font-mono ml-2">
                          {errorDetails.digest || 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm bg-black/30 p-3 rounded">
                        <span className="text-gray-500">Error Type:</span>
                        <span className="text-red-400 font-mono ml-2">
                          {errorDetails.errorType}
                        </span>
                      </div>
                      <div className="text-sm bg-black/30 p-3 rounded">
                        <span className="text-gray-500">Message:</span>
                        <span className="text-red-400 font-mono ml-2 block mt-1">
                          {errorDetails.message}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 flex justify-center gap-3">
              <button
                onClick={copyErrorReport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors text-white"
              >
                {copied ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Error Report</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadErrorReport}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors text-white"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
            </div>
            
            {/* Developer Debug Section */}
            {isDev && errorDetails && (
              <div className="bg-yellow-900/20 border-2 border-yellow-500/30 rounded-lg p-6 max-w-3xl mx-auto mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Developer Emergency Debug
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-yellow-500 font-semibold block mb-2">Stack Trace:</span>
                    <pre className="text-xs text-gray-400 font-mono bg-black/50 p-4 rounded overflow-x-auto max-h-64 overflow-y-auto">
                      {errorDetails.stack || 'No stack trace available'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-yellow-500 font-semibold block mb-2">Critical Debug Steps:</span>
                    <div className="space-y-1 font-mono text-xs bg-black/30 p-3 rounded text-gray-300">
                      <div>1. Check server logs immediately</div>
                      <div>2. Verify: <code className="text-indigo-400">npx prisma studio</code> (DB connectivity)</div>
                      <div>3. Check environment: <code className="text-indigo-400">cat .env.local</code></div>
                      <div>4. Rebuild: <code className="text-indigo-400">rm -rf .next && npm run dev</code></div>
                      <div>5. Check browser console for JS errors</div>
                      <div>6. Review recent git commits: <code className="text-indigo-400">git log -5</code></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-yellow-500 font-semibold block mb-2">Likely Causes:</span>
                    <div className="text-gray-400 bg-black/30 p-3 rounded">
                      {errorDetails.errorType === 'Module Loading Error' && (
                        <>
                          <div>→ Missing or corrupted npm packages</div>
                          <div>→ Run: <code className="text-indigo-400">npm install</code> and restart</div>
                          <div>→ Check for circular dependencies in imports</div>
                        </>
                      )}
                      {errorDetails.errorType === 'React Rendering Error' && (
                        <>
                          <div>→ Hydration mismatch between server and client</div>
                          <div>→ Check for browser-only code running on server</div>
                          <div>→ Verify all components have proper "use client" directives</div>
                        </>
                      )}
                      {errorDetails.errorType === 'Script Loading Error' && (
                        <>
                          <div>→ External script failed to load</div>
                          <div>→ Check network connectivity and CDN status</div>
                          <div>→ Verify script URLs are correct and accessible</div>
                        </>
                      )}
                      {!['Module Loading Error', 'React Rendering Error', 'Script Loading Error'].includes(errorDetails.errorType) && (
                        <>
                          <div>→ Critical application logic failure</div>
                          <div>→ Check all provider components in app/layout.tsx</div>
                          <div>→ Verify database connection and auth setup</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
