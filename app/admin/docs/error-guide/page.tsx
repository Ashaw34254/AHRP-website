"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { BookOpen, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function ErrorGuideDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Error Handling Guide</h1>
              <p className="text-gray-400">Complete usage documentation and best practices</p>
            </div>
          </div>
          <Button
            color="success"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/ERROR-HANDLING-GUIDE.md"
            download
          >
            Download MD
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Error Logger Usage */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">📚 Error Logger Usage</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">Basic Error Logging</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{`import { logError } from "@/lib/error-logger";

try {
  // Your code
} catch (error) {
  logError(error as Error, {
    customField: "value",
    userId: user.id
  });
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">API Error Logging</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{`import { logApiError } from "@/lib/error-logger";

try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(\`API Error: \${response.statusText}\`);
  }
} catch (error) {
  logApiError(
    error as Error,
    '/api/endpoint',
    'GET',
    response?.status
  );
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">Database Error Logging</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{`import { logDatabaseError } from "@/lib/error-logger";

try {
  const user = await prisma.user.findUnique({ where: { id } });
} catch (error) {
  logDatabaseError(
    error as Error,
    'findUnique',
    'User'
  );
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-400">Advanced Usage</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{`import { ErrorLogger } from "@/lib/error-logger";

// Log with full options
ErrorLogger.logError(error, {
  severity: 'critical',
  category: 'database',
  context: {
    operation: 'createUser',
    model: 'User',
    data: sanitizedData
  },
  userId: currentUser?.id
});

// Get error statistics
const stats = ErrorLogger.getStatistics();
console.log(\`Total errors: \${stats.total}\`);

// Get filtered logs
const criticalErrors = ErrorLogger.getErrorLogs({
  severity: 'critical',
  limit: 10
});

// Export logs
const json = ErrorLogger.exportLogs();

// Clear logs
ErrorLogger.clearLogs();`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">✅ Best Practices</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">DO ✅</h4>
                  <ul className="space-y-1 text-sm text-gray-300 ml-4">
                    <li>• Always wrap risky code in try/catch</li>
                    <li>• Provide context when logging errors</li>
                    <li>• Use appropriate severity levels</li>
                    <li>• Sanitize sensitive data before logging</li>
                    <li>• Show user-friendly messages</li>
                    <li>• Log errors before throwing/rethrowing</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h4 className="font-semibold text-red-400 mb-2">DON&apos;T ❌</h4>
                  <ul className="space-y-1 text-sm text-gray-300 ml-4">
                    <li>• Log passwords or sensitive data</li>
                    <li>• Show stack traces to users in production</li>
                    <li>• Ignore errors silently</li>
                    <li>• Use console.log for error tracking</li>
                    <li>• Mark everything as critical</li>
                    <li>• Forget to clean up error handlers</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Development vs Production */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🔄 Development vs Production</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-yellow-400">Development Mode</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>✅ Stack traces visible on error pages</li>
                    <li>✅ Developer debug sections with command hints</li>
                    <li>✅ Errors saved to localStorage</li>
                    <li>✅ Detailed console logging with colors</li>
                    <li>✅ Environment info displayed</li>
                    <li>✅ Quick debug commands shown</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-400">Production Mode</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>❌ No stack traces shown to users</li>
                    <li>❌ No sensitive debug info exposed</li>
                    <li>✅ User-friendly error messages</li>
                    <li>✅ Error digest for support tickets</li>
                    <li>✅ External logging (when configured)</li>
                    <li>✅ Clean error reports</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Common Scenarios */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🎯 Common Scenarios</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-400">API Route Error</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`// In API route
try {
  const data = await prisma.user.findMany();
  return NextResponse.json({ data });
} catch (error) {
  logDatabaseError(error, 'findMany', 'User');
  return NextResponse.json(
    { error: 'Failed to fetch users' }, 
    { status: 500 }
  );
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-400">Component Error</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`// In component
try {
  await fetch('/api/data');
} catch (error) {
  logApiError(error, '/api/data', 'GET');
  toast.error('Failed to load data');
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-400">Form Validation</h3>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-300">{`if (!email.includes('@')) {
  const error = new Error('Invalid email');
  logError(error, { field: 'email' });
  return;
}`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>

          {/* Debugging Tips */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🔍 Debugging Tips</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-indigo-400 mb-2">Check Error Logs in Development</h4>
                <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                  <code className="text-gray-300">{`// Open browser console
console.log(ErrorLogger.getStatistics());
console.log(ErrorLogger.getErrorLogs());

// Or check localStorage
const logs = localStorage.getItem('ahrp_error_logs');
console.log(JSON.parse(logs));`}</code>
                </pre>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-indigo-400 mb-2">Find Specific Error Types</h4>
                <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                  <code className="text-gray-300">{`// In browser console
const dbErrors = ErrorLogger.getErrorLogs({
  category: 'database'
});

const criticalErrors = ErrorLogger.getErrorLogs({
  severity: 'critical',
  limit: 5
});`}</code>
                </pre>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-indigo-400 mb-2">Export and Share Logs</h4>
                <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                  <code className="text-gray-300">{`// Download logs
const json = ErrorLogger.exportLogs();
// Save to file or share with team`}</code>
                </pre>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
