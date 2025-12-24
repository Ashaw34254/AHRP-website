"use client";

import { AdminLayout } from "@/components/AdminLayout";
import ErrorDashboard from "@/components/ErrorDashboard";
import { Card, CardBody } from "@nextui-org/card";
import { Bug, Info } from "lucide-react";

export default function ErrorMonitoringPage() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/20 rounded-lg">
            <Bug className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Error Monitoring</h1>
            <p className="text-gray-400">
              Real-time error tracking and debugging dashboard
            </p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-600/10 border border-blue-500/30">
          <CardBody>
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-blue-400 mb-2">
                  Developer Error Tracking System
                </p>
                <ul className="space-y-1 text-gray-400">
                  <li>• Errors are automatically logged and categorized</li>
                  <li>• In development: Errors are saved to localStorage</li>
                  <li>• Filter by severity and category to find specific issues</li>
                  <li>• Export logs as JSON for sharing with the team</li>
                  <li>• Check browser console for detailed error information</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Error Dashboard */}
        <ErrorDashboard />

        {/* Documentation Link */}
        <Card>
          <CardBody className="text-center">
            <p className="text-gray-400 text-sm mb-3">
              For complete documentation on the error handling system
            </p>
            <a
              href="/docs/ERROR-HANDLING-GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              View Error Handling Guide
            </a>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
