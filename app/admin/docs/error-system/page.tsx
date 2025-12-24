"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function ErrorSystemDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Error System Documentation</h1>
              <p className="text-gray-400">Complete overview of the error handling system</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/ERROR-SYSTEM-SUMMARY.md"
            download
          >
            Download MD
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🎯 What Was Built</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-400">1. Enhanced Error Pages</h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• <strong>Standard Error Page</strong> - Route-level errors with debugging info</li>
                  <li>• <strong>Global Error Page</strong> - Critical system failures</li>
                  <li>• <strong>404 Page</strong> - Enhanced not found with dev hints</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-400">2. Error Logging System</h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• Automatic error categorization and severity detection</li>
                  <li>• In-memory logs (last 100 errors)</li>
                  <li>• LocalStorage persistence (dev mode, last 50 errors)</li>
                  <li>• Structured console logging with colors</li>
                  <li>• Export logs as JSON</li>
                  <li>• Error statistics and filtering</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-400">3. Error Dashboard</h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• Real-time error monitoring</li>
                  <li>• Statistics by severity and category</li>
                  <li>• Filter by severity and category</li>
                  <li>• Expandable error details</li>
                  <li>• Export and clear functions</li>
                  <li>• Auto-refresh every 5 seconds</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Quick Start */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🚀 Quick Start</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-400">Using Error Logging in Code</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{`import { logError, logApiError, logDatabaseError } from "@/lib/error-logger";

// Basic error logging
try {
  // your code
} catch (error) {
  logError(error as Error, { userId: user.id });
}

// API error logging
logApiError(error, '/api/endpoint', 'GET', statusCode);

// Database error logging
logDatabaseError(error, 'create', 'User');`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-400">Viewing Errors</h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• Open admin panel → <a href="/admin/errors" className="text-indigo-400 hover:underline">Error Monitoring</a></li>
                  <li>• Browser console: <code className="bg-gray-900 px-2 py-1 rounded text-sm">ErrorLogger.getErrorLogs()</code></li>
                  <li>• LocalStorage: <code className="bg-gray-900 px-2 py-1 rounded text-sm">ahrp_error_logs</code></li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Error Categories */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">📊 Error Categories</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">Network</h4>
                  <p className="text-sm text-gray-400">Fetch failures, timeouts, connection issues</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">Database</h4>
                  <p className="text-sm text-gray-400">Prisma errors, SQL issues, connection failures</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-2">Authentication</h4>
                  <p className="text-sm text-gray-400">Auth failures, permission errors</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">Validation</h4>
                  <p className="text-sm text-gray-400">Invalid input, missing fields</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-red-400 mb-2">Runtime</h4>
                  <p className="text-sm text-gray-400">JavaScript errors, null references</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-pink-400 mb-2">API</h4>
                  <p className="text-sm text-gray-400">API endpoint failures</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Severity Levels */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🔴 Severity Levels</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <span className="text-2xl">🔴</span>
                <div>
                  <h4 className="font-semibold text-red-400">Critical</h4>
                  <p className="text-sm text-gray-400">Database failures, auth crashes, data corruption, security breaches</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <span className="text-2xl">🚨</span>
                <div>
                  <h4 className="font-semibold text-orange-400">High</h4>
                  <p className="text-sm text-gray-400">API failures, permission errors, user-facing issues</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-400">Medium</h4>
                  <p className="text-sm text-gray-400">Network timeouts, rate limits, non-critical errors</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-blue-400">Low</h4>
                  <p className="text-sm text-gray-400">Minor issues, edge cases, dev-only errors</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Related Links */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🔗 Related Documentation</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  as="a"
                  href="/admin/docs/error-guide"
                  variant="flat"
                  color="primary"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Complete Error Handling Guide
                </Button>
                <Button
                  as="a"
                  href="/admin/docs/error-quick"
                  variant="flat"
                  color="primary"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Quick Reference Guide
                </Button>
                <Button
                  as="a"
                  href="/admin/docs/error-visual"
                  variant="flat"
                  color="primary"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Visual Guide
                </Button>
                <Button
                  as="a"
                  href="/admin/errors"
                  variant="flat"
                  color="success"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Error Monitoring Dashboard
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
