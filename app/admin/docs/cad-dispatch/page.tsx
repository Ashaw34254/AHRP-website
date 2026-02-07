"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Radio, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function CADDispatchDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <Radio className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CAD Dispatch System</h1>
              <p className="text-gray-400">Dispatch console operations and workflows</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/CAD-DISPATCH-SYSTEM.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📻 Dispatch Console Features</h2></CardHeader>
            <CardBody>
              <p className="text-gray-300 mb-4">
                The dispatch console is the command center for emergency operations, providing dispatchers with 
                comprehensive tools for call management, unit coordination, and real-time status monitoring.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Unified call queue with pending/active call separation</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Quick-view unit availability with status indicators</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> One-click multi-unit dispatch with drag-and-drop assignment</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Real-time call updates with auto-refresh (10s intervals)</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Integrated civil records search within dispatch view</li>
                <li className="flex items-start gap-2"><span className="text-cyan-400">•</span> Quick actions: Priority escalation, backup requests, status updates</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔄 Dispatch Workflow</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Call Creation</h4>
                    <p className="text-sm text-gray-400">Call is created with type, location, priority, and description</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Unit Assignment</h4>
                    <p className="text-sm text-gray-400">Dispatcher assigns available units based on proximity and department</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">En Route</h4>
                    <p className="text-sm text-gray-400">Units acknowledge and update status to en route (10-76)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">On Scene</h4>
                    <p className="text-sm text-gray-400">Units arrive and mark on scene (10-97), dispatcher adds notes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Resolution</h4>
                    <p className="text-sm text-gray-400">Call is closed with outcome, units return to service (10-8)</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚡ Quick Dispatch Actions</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-2">Multi-Unit Dispatch</h4>
                  <p className="text-sm text-gray-400">Assign multiple units to high-priority calls with one action</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-2">Priority Escalation</h4>
                  <p className="text-sm text-gray-400">Quickly upgrade call priority when situation deteriorates</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-2">Backup Request</h4>
                  <p className="text-sm text-gray-400">Request additional units with automatic priority increase</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-2">Status Broadcast</h4>
                  <p className="text-sm text-gray-400">Push status updates to all assigned units simultaneously</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎛️ Dispatcher Tools</h2></CardHeader>
            <CardBody className="space-y-3 text-gray-300">
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-cyan-400">Call Templates:</strong> Pre-configured call types with default fields and priorities
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-cyan-400">Zone Management:</strong> Geographic zones for automatic unit recommendations
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-cyan-400">Shift Scheduling:</strong> Track active dispatchers and shift handoffs
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-cyan-400">Dispatcher Chat:</strong> Direct communication with field units
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-cyan-400">Response Time Tracker:</strong> Monitor and report on response metrics
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Resources</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/cad-system" variant="flat" className="justify-start">
                  ← Back to CAD Overview
                </Button>
                <Button as="a" href="/admin/docs/cad-terminology" variant="flat" className="justify-start">
                  Victoria CAD Terminology
                </Button>
                <Button as="a" href="/dashboard/police/cad" variant="flat" color="primary" className="justify-start">
                  Open Dispatch Console →
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
