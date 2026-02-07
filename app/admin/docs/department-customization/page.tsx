"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Code, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function DepartmentCustomizationDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Code className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Department Customization Guide</h1>
              <p className="text-gray-400">Configure Police, Fire, and EMS departments</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/DEPARTMENT-CUSTOMIZATION-COMPLETE.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🏢 Department Structure</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <h4 className="font-semibold text-blue-400 mb-2">POLICE</h4>
                  <p className="text-sm text-gray-400">Law enforcement operations, traffic, investigations</p>
                </div>
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                  <h4 className="font-semibold text-red-400 mb-2">FIRE</h4>
                  <p className="text-sm text-gray-400">Fire suppression, rescue, hazmat response</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <h4 className="font-semibold text-green-400 mb-2">EMS</h4>
                  <p className="text-sm text-gray-400">Emergency medical services, patient transport</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚙️ Configuration Options</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300">
                <li>• Department-specific CAD interfaces</li>
                <li>• Custom unit callsign formats</li>
                <li>• Specialized call types per department</li>
                <li>• Role-based access control</li>
                <li>• Department-specific voice alert settings</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎨 UI Customization</h2></CardHeader>
            <CardBody>
              <p className="mb-3">Each department has unique color schemes and icons:</p>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-900/20 rounded flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span><strong>Police:</strong> Blue theme (primary: indigo)</span>
                </div>
                <div className="p-3 bg-red-900/20 rounded flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span><strong>Fire:</strong> Red theme (primary: red)</span>
                </div>
                <div className="p-3 bg-green-900/20 rounded flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span><strong>EMS:</strong> Green theme (primary: green)</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
