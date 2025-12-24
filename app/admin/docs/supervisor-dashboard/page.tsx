"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Settings, Download } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function SupervisorDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <Settings className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Supervisor Dashboard & Alerts</h1>
              <p className="text-gray-400">Command staff oversight and monitoring</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/SUPERVISOR-DASHBOARD-ALERTS.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">👮‍♂️ Supervisor Features</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Real-time Unit Monitoring:</strong> Track all active units and their status</li>
                <li>• <strong>Call Oversight:</strong> Monitor high-priority calls and response times</li>
                <li>• <strong>Resource Management:</strong> View department-wide resource allocation</li>
                <li>• <strong>Alert System:</strong> Notifications for critical events and policy violations</li>
                <li>• <strong>Performance Metrics:</strong> Officer performance and call statistics</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚨 Alert Types</h2></CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">Critical:</strong> <span className="text-gray-400">Officer panic, pursuit, shots fired</span>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">Warning:</strong> <span className="text-gray-400">Extended call times, backup requests</span>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">Info:</strong> <span className="text-gray-400">Shift changes, unit availability</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Components</h2></CardHeader>
            <CardBody>
              <Button variant="flat" className="justify-start" disabled>SupervisorAlerts.tsx Component</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
