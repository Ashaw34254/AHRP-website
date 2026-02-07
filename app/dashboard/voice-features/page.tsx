'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardBody, Tabs, Tab } from '@heroui/react';
import PanicButtonEnhanced from '@/components/PanicButtonEnhanced';
import BOLOManagementIntegration from '@/components/BOLOManagementIntegration';
import IncidentTimelineVoiceNotes from '@/components/IncidentTimelineVoiceNotes';
import { AlertTriangle, Radio, MessageSquare } from 'lucide-react';

export default function VoiceFeaturesDemo() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Voice Alert Features Demo</h1>
          <p className="text-gray-400">
            Test all new voice-enhanced CAD features: Panic Button, BOLO Management, and Incident Timeline
          </p>
        </div>

        <Tabs aria-label="Voice Features" color="primary" variant="underlined" size="lg">
          <Tab
            key="panic"
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Panic Button</span>
              </div>
            }
          >
            <div className="py-4">
              <PanicButtonEnhanced userCallsign="A-247" userLocation="Downtown District" />
            </div>
          </Tab>

          <Tab
            key="bolo"
            title={
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                <span>BOLO Management</span>
              </div>
            }
          >
            <div className="py-4">
              <BOLOManagementIntegration />
            </div>
          </Tab>

          <Tab
            key="timeline"
            title={
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Incident Timeline</span>
              </div>
            }
          >
            <div className="py-4">
              <IncidentTimelineVoiceNotes incidentId="INC-2024-001" />
            </div>
          </Tab>
        </Tabs>

        {/* Feature Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardBody>
              <h3 className="font-bold text-white mb-2">🚨 Panic Button Enhanced</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Proximity alerts for nearby units</li>
                <li>• Auto-escalation countdown</li>
                <li>• Supervisor override voice alerts</li>
                <li>• Real-time response tracking</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-bold text-white mb-2">📻 BOLO Management</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Voice alerts for BOLO hits</li>
                <li>• Expiration warnings (15, 10, 5, 1 min)</li>
                <li>• Auto-deactivation system</li>
                <li>• Vehicle & person tracking</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-bold text-white mb-2">🎤 Voice Notes Timeline</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Record voice memos on scene</li>
                <li>• Automatic transcription (simulated)</li>
                <li>• Playback with timestamps</li>
                <li>• Manual note entry option</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
