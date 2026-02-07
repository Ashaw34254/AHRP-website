"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Radio, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function CADSystemDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Radio className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CAD System Documentation</h1>
              <p className="text-gray-400">Complete Computer-Aided Dispatch system reference</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/CAD-README.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚨 Overview</h2></CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300">
                The Computer-Aided Dispatch (CAD) system is the central hub for emergency services coordination, 
                providing real-time dispatch capabilities, unit management, and incident tracking for Police, Fire, and EMS departments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold text-blue-400 mb-2">Dispatch Console</h3>
                  <p className="text-sm text-gray-400">Unified interface for managing active calls, assigning units, and coordinating responses</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold text-green-400 mb-2">Unit Management</h3>
                  <p className="text-sm text-gray-400">Track active units, status updates, locations, and officer assignments in real-time</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">Civil Records</h3>
                  <p className="text-sm text-gray-400">Search citizens, vehicles, warrants, and criminal history databases</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎯 Key Features</h2></CardHeader>
            <CardBody>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong>Real-time Call Management:</strong> Create, assign, update, and close emergency calls with priority levels</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong>Unit Tracking:</strong> Monitor unit status (10-8, 10-7, 10-6, etc.) with automatic location updates</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong>Multi-unit Dispatch:</strong> Assign multiple units to calls with primary/backup designation</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong>Call Notes & History:</strong> Timestamped notes and complete call history with search/filter</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong>Department Filtering:</strong> Separate views for POLICE, FIRE, and EMS operations</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong>Voice Alerts:</strong> Text-to-speech notifications for new calls, panic alerts, and status changes</div>
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📊 Call Management</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Call Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Traffic Stop</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Medical Emergency</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Fire</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Theft</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Assault</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Vehicle Pursuit</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Domestic Disturbance</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Suspicious Activity</span>
                  <span className="px-3 py-2 bg-gray-800/50 rounded">Welfare Check</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Priority Levels</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <span className="text-red-400 font-semibold">HIGH</span>
                    <span className="text-sm text-gray-400">Life-threatening emergencies, active crimes, officer down</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <span className="text-yellow-400 font-semibold">MEDIUM</span>
                    <span className="text-sm text-gray-400">In-progress incidents, property crimes, suspicious activity</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                    <span className="text-blue-400 font-semibold">LOW</span>
                    <span className="text-sm text-gray-400">Non-urgent calls, routine checks, administrative tasks</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚔 Unit Status Codes</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">10-8:</strong> <span className="text-gray-400">In Service / Available</span>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">10-6:</strong> <span className="text-gray-400">Busy</span>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">10-7:</strong> <span className="text-gray-400">Out of Service</span>
                </div>
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                  <strong className="text-purple-400">10-19:</strong> <span className="text-gray-400">Return to Station</span>
                </div>
                <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded">
                  <strong className="text-orange-400">10-97:</strong> <span className="text-gray-400">Arrived on Scene</span>
                </div>
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">10-99:</strong> <span className="text-gray-400">Panic / Emergency</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📱 API Endpoints</h2></CardHeader>
            <CardBody className="space-y-3">
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">GET /api/cad/calls</code>
                <p className="text-xs text-gray-400 mt-1">Fetch calls with filters (status, type, priority, search, dateRange)</p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">POST /api/cad/calls</code>
                <p className="text-xs text-gray-400 mt-1">Create new call (auto-generates call number)</p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">POST /api/cad/calls/[id]/assign</code>
                <p className="text-xs text-gray-400 mt-1">Assign unit to call</p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">GET /api/cad/units</code>
                <p className="text-xs text-gray-400 mt-1">Fetch all units with officers and assigned calls</p>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">{"GET /api/cad/civil/citizen?q={query}"}</code>
                <p className="text-xs text-gray-400 mt-1">Search citizen by name or State ID</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/cad-dispatch" variant="flat" className="justify-start">
                  CAD Dispatch System Details
                </Button>
                <Button as="a" href="/admin/docs/cad-terminology" variant="flat" className="justify-start">
                  Victoria CAD Terminology
                </Button>
                <Button as="a" href="/admin/docs/voice-alerts" variant="flat" className="justify-start">
                  Voice Alerts Guide
                </Button>
                <Button as="a" href="/dashboard/police/cad" variant="flat" color="primary" className="justify-start">
                  Open Police CAD →
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
