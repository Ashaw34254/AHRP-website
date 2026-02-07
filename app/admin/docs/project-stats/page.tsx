"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { BarChart3, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function ProjectStatsDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Project Statistics & Metrics</h1>
              <p className="text-gray-400">Codebase metrics and development progress</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/PROJECT-STATISTICS.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📊 Codebase Metrics</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-800/50 rounded text-center">
                  <div className="text-3xl font-bold text-green-400">70+</div>
                  <div className="text-sm text-gray-400">Components</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded text-center">
                  <div className="text-3xl font-bold text-blue-400">30+</div>
                  <div className="text-sm text-gray-400">API Routes</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded text-center">
                  <div className="text-3xl font-bold text-purple-400">1749</div>
                  <div className="text-sm text-gray-400">Schema Lines</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded text-center">
                  <div className="text-3xl font-bold text-pink-400">30+</div>
                  <div className="text-sm text-gray-400">Database Models</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🏗️ Architecture Breakdown</h2></CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                  <span className="text-gray-300">CAD System</span>
                  <span className="text-green-400">Fully Implemented</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                  <span className="text-gray-300">FiveM Integration</span>
                  <span className="text-green-400">Complete (11 scripts)</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                  <span className="text-gray-300">Character System</span>
                  <span className="text-green-400">Operational</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-800/50 rounded">
                  <span className="text-gray-300">Voice Alerts</span>
                  <span className="text-green-400">v2.0 Advanced</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📈 Development Progress</h2></CardHeader>
            <CardBody>
              <p className="text-gray-300">This project represents hundreds of hours of development across full-stack Next.js, database design, game integration, and UI/UX design.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
