"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Radio, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function VoiceAlertsDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-600/20 rounded-lg">
              <Radio className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Voice Alerts System Guide</h1>
              <p className="text-gray-400">Text-to-speech notifications for CAD events</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/VOICE-ALERTS-GUIDE.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔊 Overview</h2></CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300">
                The Voice Alerts system provides advanced text-to-speech (TTS) notifications for CAD events, 
                keeping dispatchers and officers informed of critical events without requiring constant screen monitoring.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                  <h3 className="font-semibold text-pink-400 mb-2">Multiple TTS Providers</h3>
                  <p className="text-sm text-gray-400">Web Speech API (free), Google Cloud, Azure, ElevenLabs</p>
                </div>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <h3 className="font-semibold text-purple-400 mb-2">Voice Profiles</h3>
                  <p className="text-sm text-gray-400">Different voices for call types (dispatch, medical, admin)</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h3 className="font-semibold text-blue-400 mb-2">Smart Features</h3>
                  <p className="text-sm text-gray-400">Priority scaling, queue management, keyboard shortcuts</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎯 Alert Types</h2></CardHeader>
            <CardBody>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">•</span>
                  <div><strong className="text-red-400">New Calls:</strong> Announces call number, type, priority, and location</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl">•</span>
                  <div><strong className="text-yellow-400">BOLO Hits:</strong> Alerts when searched citizen/vehicle matches active BOLO</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">•</span>
                  <div><strong className="text-red-400">Panic Alerts:</strong> Emergency notifications when officer triggers 10-99</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 text-xl">•</span>
                  <div><strong className="text-blue-400">Status Changes:</strong> Unit status updates (10-8, 10-97, etc.)</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-400 text-xl">•</span>
                  <div><strong className="text-orange-400">Backup Requests:</strong> Additional units requested at scene</div>
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚙️ Configuration Options</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-pink-400 mb-2">TTS Provider Selection</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>Web Speech API:</strong> Built-in browser TTS (free, no API key)</li>
                  <li>• <strong>Google Cloud TTS:</strong> High-quality voices with WaveNet</li>
                  <li>• <strong>Azure Cognitive Services:</strong> Neural voices with SSML support</li>
                  <li>• <strong>ElevenLabs:</strong> AI-generated ultra-realistic voices</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-pink-400 mb-2">Voice Profiles</h4>
                <p className="text-sm text-gray-400 mb-2">Assign different voices for different alert types:</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>Dispatch:</strong> General call announcements</li>
                  <li>• <strong>Medical:</strong> EMS/medical emergency alerts</li>
                  <li>• <strong>Admin:</strong> System notifications</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-pink-400 mb-2">Priority Scaling</h4>
                <p className="text-sm text-gray-400">Adjust volume and speed based on call priority (HIGH priority gets louder/faster)</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-pink-400 mb-2">Sound Effects</h4>
                <p className="text-sm text-gray-400">Optional emergency tones before high-priority announcements</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⌨️ Keyboard Shortcuts</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-900 rounded flex items-center justify-between">
                  <span className="text-gray-300">Toggle Mute</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded text-xs">M</kbd>
                </div>
                <div className="p-3 bg-gray-900 rounded flex items-center justify-between">
                  <span className="text-gray-300">Skip Current Alert</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded text-xs">S</kbd>
                </div>
                <div className="p-3 bg-gray-900 rounded flex items-center justify-between">
                  <span className="text-gray-300">Test Voice</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded text-xs">T</kbd>
                </div>
                <div className="p-3 bg-gray-900 rounded flex items-center justify-between">
                  <span className="text-gray-300">Clear Queue</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded text-xs">C</kbd>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">💾 Storage & Persistence</h2></CardHeader>
            <CardBody className="space-y-3 text-gray-300">
              <p>Voice configuration is stored in browser LocalStorage under <code className="text-pink-400">voiceConfig</code> key.</p>
              <p>Settings persist across browser sessions and apply to all CAD interfaces.</p>
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                <strong className="text-blue-400">Department-Specific Overrides:</strong>
                <p className="text-sm text-gray-400 mt-1">Configure different settings for POLICE, FIRE, and EMS departments</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📊 Analytics & History</h2></CardHeader>
            <CardBody className="space-y-3 text-gray-300">
              <p>The system logs all voice alerts for analysis and review:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-pink-400">•</span> Alert type and timestamp</li>
                <li className="flex items-start gap-2"><span className="text-pink-400">•</span> Message content and duration</li>
                <li className="flex items-start gap-2"><span className="text-pink-400">•</span> TTS provider and voice used</li>
                <li className="flex items-start gap-2"><span className="text-pink-400">•</span> Success/failure status</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔧 Usage in Code</h2></CardHeader>
            <CardBody>
              <div className="p-4 bg-gray-900 rounded-lg">
                <pre className="text-sm text-green-400 overflow-x-auto">
{`import { useCADVoiceAlerts } from "@/lib/use-voice-alerts";

const { announceCall, announceStatusChange } = useCADVoiceAlerts();

// Announce new call
announceCall(call, { 
  priority: "HIGH", 
  department: "POLICE" 
});

// Announce status change
announceStatusChange("Unit A-12 is now 10-8");`}
                </pre>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Components</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/cad-system" variant="flat" className="justify-start">
                  ← CAD System Overview
                </Button>
                <Button variant="flat" className="justify-start" disabled>
                  EnhancedVoiceWidget.tsx Component
                </Button>
                <Button variant="flat" className="justify-start" disabled>
                  VoiceSettings.tsx Component
                </Button>
                <Button variant="flat" className="justify-start" disabled>
                  lib/voice-context.tsx Provider
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
