"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Settings, Download } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function Final5FeaturesDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-600/20 rounded-lg">
              <Settings className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Final 5 CAD Features</h1>
              <p className="text-gray-400">Advanced CAD system capabilities</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/FINAL-5-FEATURES.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎯 Feature Overview</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-pink-400 mb-2">1. Call Templates</h4>
                  <p className="text-sm text-gray-400">Pre-configured call types with default fields</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-pink-400 mb-2">2. Zone Management</h4>
                  <p className="text-sm text-gray-400">Geographic dispatch zones with auto-assignment</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-pink-400 mb-2">3. Response Time Tracking</h4>
                  <p className="text-sm text-gray-400">Metrics and analytics for call response</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-pink-400 mb-2">4. Shift Scheduling</h4>
                  <p className="text-sm text-gray-400">Officer duty schedule management</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-pink-400 mb-2">5. Advanced Filtering</h4>
                  <p className="text-sm text-gray-400">Multi-criteria search and filtering</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚡ Implementation Status</h2></CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">✅ Implemented:</strong> Call templates, zone management, response tracking
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">🔄 Partial:</strong> Shift scheduling (database models ready)
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">📝 Planned:</strong> Advanced analytics dashboard
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Components</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="flat" className="justify-start" disabled>CallTemplateManager.tsx</Button>
                <Button variant="flat" className="justify-start" disabled>ZoneManagement.tsx</Button>
                <Button variant="flat" className="justify-start" disabled>ResponseTimeTracker.tsx</Button>
                <Button variant="flat" className="justify-start" disabled>ShiftScheduling.tsx</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
