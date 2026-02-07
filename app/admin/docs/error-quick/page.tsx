"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Zap, Download, ExternalLink } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function ErrorQuickDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Quick Reference Guide</h1>
              <p className="text-gray-400">Fast access to error handling essentials</p>
            </div>
          </div>
          <Button
            color="warning"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/README-ERRORS.md"
            download
          >
            Download MD
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Quick Access */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🎯 Quick Access</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">For Developers</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <strong className="text-indigo-400">View Errors:</strong>
                    <code className="ml-2 text-sm bg-gray-900 px-2 py-1 rounded">/admin/errors</code>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <strong className="text-indigo-400">Browser Console:</strong>
                    <pre className="mt-2 text-sm bg-gray-900 p-2 rounded overflow-x-auto">
                      <code>{`// Get all errors
ErrorLogger.getErrorLogs()

// Get statistics
ErrorLogger.getStatistics()

// Get critical errors only
ErrorLogger.getErrorLogs({ severity: 'critical' })

// Export logs
ErrorLogger.exportLogs()

// Clear logs
ErrorLogger.clearLogs()`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Usage Examples */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🛠️ Usage</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">Basic Error</h4>
                  <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                    <code>{`import { logError } from "@/lib/error-logger";

try {
  // your code
} catch (error) {
  logError(error as Error);
}`}</code>
                  </pre>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">API Error</h4>
                  <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                    <code>{`import { logApiError } from "@/lib/error-logger";

logApiError(
  error, 
  '/api/endpoint', 
  'GET', 
  statusCode
);`}</code>
                  </pre>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">Database Error</h4>
                  <pre className="text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                    <code>{`import { logDatabaseError } from "@/lib/error-logger";

logDatabaseError(
  error, 
  'create', 
  'User'
);`}</code>
                  </pre>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Categories & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">📊 Error Categories</h2>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>🌐 <strong>Network</strong> - Fetch failures, timeouts</li>
                  <li>💾 <strong>Database</strong> - Prisma errors, SQL issues</li>
                  <li>🔒 <strong>Authentication</strong> - Auth failures, permissions</li>
                  <li>✅ <strong>Validation</strong> - Invalid input, missing fields</li>
                  <li>⚙️ <strong>Runtime</strong> - JavaScript errors</li>
                  <li>🎨 <strong>Rendering</strong> - React errors</li>
                  <li>🔌 <strong>API</strong> - API endpoint failures</li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">🔴 Severity Levels</h2>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>🔴 <strong className="text-red-400">Critical</strong> - Database failures, auth crashes</li>
                  <li>🚨 <strong className="text-orange-400">High</strong> - API failures, user-facing issues</li>
                  <li>⚠️ <strong className="text-yellow-400">Medium</strong> - Timeouts, non-critical errors</li>
                  <li>ℹ️ <strong className="text-blue-400">Low</strong> - Minor issues, edge cases</li>
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🎯 Common Scenarios</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-indigo-400 mb-2">API Route Error</h4>
                <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                  <code>{`try {
  const data = await prisma.user.findMany();
  return NextResponse.json({ data });
} catch (error) {
  logDatabaseError(error, 'findMany', 'User');
  return NextResponse.json({ error: 'Failed' }, { status: 500 });
}`}</code>
                </pre>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-indigo-400 mb-2">Component Error</h4>
                <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                  <code>{`try {
  await fetch('/api/data');
} catch (error) {
  logApiError(error, '/api/data', 'GET');
  toast.error('Failed to load data');
}`}</code>
                </pre>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-indigo-400 mb-2">Form Validation</h4>
                <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                  <code>{`if (!email.includes('@')) {
  const error = new Error('Invalid email');
  logError(error, { field: 'email' });
  return;
}`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          {/* Testing Checklist */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">✅ Testing Checklist</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Test standard error page (throw error)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Test 404 page (visit /test-404)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Test error logging in API route</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Test error logging in component</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Visit error dashboard at /admin/errors</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Filter errors by severity</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Filter errors by category</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Export error logs</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Check localStorage (dev mode)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Review browser console logs</span>
                </label>
              </div>
            </CardBody>
          </Card>

          {/* Related Links */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🔗 Related Pages</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  as="a"
                  href="/admin/docs/error-system"
                  variant="flat"
                  color="primary"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Error System Overview
                </Button>
                <Button
                  as="a"
                  href="/admin/docs/error-guide"
                  variant="flat"
                  color="primary"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Complete Error Guide
                </Button>
                <Button
                  as="a"
                  href="/admin/docs/error-visual"
                  variant="flat"
                  color="primary"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Visual Examples
                </Button>
                <Button
                  as="a"
                  href="/admin/errors"
                  variant="flat"
                  color="success"
                  startContent={<ExternalLink className="w-4 h-4" />}
                  className="justify-start"
                >
                  Error Dashboard
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
