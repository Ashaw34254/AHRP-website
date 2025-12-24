"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Gamepad2, Download } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function FiveMAPISetupDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <Gamepad2 className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">FiveM API Setup</h1>
              <p className="text-gray-400">API configuration and authentication</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/API-SETUP.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔑 API Authentication</h2></CardHeader>
            <CardBody className="space-y-4">
              <p>Configure API authentication to secure communication between FiveM server and web CAD system.</p>
              <pre className="p-4 bg-gray-900 rounded text-sm text-green-400">
{`-- config.lua
Config.API = {
  URL = "https://yourdomain.com/api/fivem",
  Key = "your-secure-api-key-here",
  Timeout = 5000
}`}
              </pre>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🌐 Web API Endpoints</h2></CardHeader>
            <CardBody>
              <p className="text-gray-300 mb-4">Configure these endpoints in your Next.js application:</p>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-green-400">POST /api/fivem/location</code> - Update unit location
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-green-400">GET /api/fivem/calls</code> - Fetch active calls
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-green-400">POST /api/fivem/status</code> - Update unit status
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-green-400">POST /api/fivem/panic</code> - Trigger panic alert
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🛡️ Security Best Practices</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300">
                <li>• Use HTTPS for all API communication</li>
                <li>• Generate strong API keys (32+ characters)</li>
                <li>• Rotate API keys regularly</li>
                <li>• Implement rate limiting on endpoints</li>
                <li>• Log all API requests for audit trail</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
