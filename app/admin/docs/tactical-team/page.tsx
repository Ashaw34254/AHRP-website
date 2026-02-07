"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Settings, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function TacticalTeamDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <Settings className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tactical Team Management</h1>
              <p className="text-gray-400">SWAT, K9, and specialized units</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/TACTICAL-TEAM-MANAGEMENT.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚔 Specialized Units</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-red-400 mb-2">SWAT</h4>
                  <p className="text-sm text-gray-400">Tactical operations, hostage rescue, high-risk warrants</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-amber-400 mb-2">K9</h4>
                  <p className="text-sm text-gray-400">Canine units for tracking, narcotics, apprehension</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded">
                  <h4 className="font-semibold text-blue-400 mb-2">Traffic</h4>
                  <p className="text-sm text-gray-400">DUI enforcement, accident investigation, speed control</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📋 Features</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300">
                <li>• Team roster management with specializations</li>
                <li>• Equipment tracking and assignment</li>
                <li>• Training requirements and certifications</li>
                <li>• Mission logs and after-action reports</li>
                <li>• Callout notifications for tactical situations</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
