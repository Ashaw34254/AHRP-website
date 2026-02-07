"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Code, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function DevModeDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <Code className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Development Mode Guide</h1>
              <p className="text-gray-400">Authentication bypass and dev workflow</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/DEV-MODE-GUIDE.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔓 Dev Mode Features</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Authentication disabled</strong> - No Discord OAuth required</li>
                <li>• <strong>Mock session</strong> - Pre-configured user with admin or user role</li>
                <li>• <strong>All routes accessible</strong> - /dashboard and /admin work without login</li>
                <li>• <strong>Hot-reload friendly</strong> - Changes reflect immediately</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚙️ Switch User Role</h2></CardHeader>
            <CardBody>
              <p className="mb-3">Edit <code className="text-cyan-400">lib/dev-session.ts</code>:</p>
              <pre className="p-4 bg-gray-900 rounded text-sm text-green-400">
{`export const devSession = {
  user: {
    id: "dev-user",
    name: "Dev User",
    email: "dev@aurorahorizon.local",
    role: "admin", // Change to "user" for testing user permissions
    departments: ["POLICE", "FIRE", "EMS"]
  }
}`}
              </pre>
              <p className="text-sm text-gray-400 mt-3">No restart needed - changes apply on hot-reload</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚨 Important Notes</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">Production Disabled:</strong>
                  <p className="text-sm text-gray-400 mt-1">Dev mode automatically disables when NODE_ENV=production</p>
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">Security:</strong>
                  <p className="text-sm text-gray-400 mt-1">Never deploy with dev bypass active</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
