"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Gamepad2, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function FiveMIntegrationDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <Gamepad2 className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">FiveM Integration Guide</h1>
              <p className="text-gray-400">Complete in-game CAD integration documentation</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/FIVEM-INTEGRATION.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎮 Overview</h2></CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300">
                Complete FiveM resource for real-time CAD integration, enabling officers to access dispatch, 
                update status, and manage calls directly from the game without alt-tabbing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                  <h3 className="font-semibold text-orange-400 mb-2">11 Lua Scripts</h3>
                  <p className="text-sm text-gray-400">6 client + 5 server + shared utilities</p>
                </div>
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h3 className="font-semibold text-red-400 mb-2">Real-time Sync</h3>
                  <p className="text-sm text-gray-400">Location (5s), status (10s), panic alerts</p>
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">NUI Interface</h3>
                  <p className="text-sm text-gray-400">In-game HTML interface with full CAD access</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📁 Resource Structure</h2></CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm font-mono">
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-orange-400">fxmanifest.lua</strong> <span className="text-gray-400">- Resource metadata and file declarations</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-orange-400">config.lua</strong> <span className="text-gray-400">- Configuration (API URL, keys, keybinds)</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-orange-400">client/*.lua</strong> <span className="text-gray-400">- 6 client scripts (main, panic, duty, blips, etc.)</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-orange-400">server/*.lua</strong> <span className="text-gray-400">- 5 server scripts (API, sync, commands, etc.)</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-orange-400">html/</strong> <span className="text-gray-400">- NUI interface (index.html, CSS, JS)</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚙️ Quick Setup (15 minutes)</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-400 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-orange-400">Copy Resource</h4>
                    <p className="text-sm text-gray-400">Copy <code>fivem-resource/ahrp-cad/</code> to server resources folder</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-400 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-orange-400">Configure API</h4>
                    <p className="text-sm text-gray-400">Edit <code>config.lua</code> - set API URL and authentication key</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-400 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-orange-400">Start Resource</h4>
                    <p className="text-sm text-gray-400">Add <code>ensure ahrp-cad</code> to server.cfg</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center text-orange-400 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-orange-400">Test In-Game</h4>
                    <p className="text-sm text-gray-400">Press F5 to open CAD, F9 for panic button</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎮 In-Game Commands</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-orange-400">/duty</code> <span className="text-gray-400">- Go on/off duty</span>
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-orange-400">/status [code]</code> <span className="text-gray-400">- Update unit status</span>
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-red-400">/panic</code> <span className="text-gray-400">- Trigger emergency alert</span>
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-orange-400">/backup</code> <span className="text-gray-400">- Request additional units</span>
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-orange-400">/calls</code> <span className="text-gray-400">- View active calls</span>
                </div>
                <div className="p-3 bg-gray-900 rounded">
                  <code className="text-orange-400">/callsign [sign]</code> <span className="text-gray-400">- Set callsign</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⌨️ Keybinds</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                  <span className="text-gray-300">Open CAD Interface</span>
                  <kbd className="px-4 py-2 bg-gray-700 rounded text-lg font-bold">F5</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                  <span className="text-gray-300 text-red-400">Panic Button (Emergency)</span>
                  <kbd className="px-4 py-2 bg-red-900 rounded text-lg font-bold text-red-300">F9</kbd>
                </div>
                <p className="text-xs text-gray-400 mt-2">⚙️ Configurable in config.lua</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔄 Real-time Sync Features</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> <strong>Location Updates:</strong> Automatic GPS sync every 5 seconds while on duty</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> <strong>Status Polling:</strong> Check for new calls and status changes every 10 seconds</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> <strong>Unit Blips:</strong> Show other active units on minimap with department colors</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> <strong>Panic Alerts:</strong> Instant notifications with location beacon when officer hits F9</li>
                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> <strong>Call Notifications:</strong> Visual and audio alerts for new call assignments</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔌 API Integration Points</h2></CardHeader>
            <CardBody className="space-y-3">
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">POST /api/fivem/location</code>
                <p className="text-xs text-gray-400 mt-1">Update unit GPS coordinates from game</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">GET /api/fivem/calls</code>
                <p className="text-xs text-gray-400 mt-1">Fetch active calls for in-game display</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">POST /api/fivem/status</code>
                <p className="text-xs text-gray-400 mt-1">Update unit status (10-8, 10-6, etc.)</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">POST /api/fivem/panic</code>
                <p className="text-xs text-gray-400 mt-1">Trigger panic alert with location</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎯 Framework Support</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded text-center">
                  <h4 className="font-semibold text-blue-400 mb-2">ESX</h4>
                  <p className="text-sm text-gray-400">Auto-detected</p>
                </div>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded text-center">
                  <h4 className="font-semibold text-purple-400 mb-2">QB-Core</h4>
                  <p className="text-sm text-gray-400">Auto-detected</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded text-center">
                  <h4 className="font-semibold text-green-400 mb-2">Standalone</h4>
                  <p className="text-sm text-gray-400">Works without framework</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚠️ Important Notes</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">Security:</strong>
                  <p className="text-sm text-gray-400 mt-1">API authentication required - configure unique key in config.lua</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">Performance:</strong>
                  <p className="text-sm text-gray-400 mt-1">Sync intervals optimized to minimize server load</p>
                </div>
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">NUI vs Browser:</strong>
                  <p className="text-sm text-gray-400 mt-1">NUI opens actual website in iframe - no duplicate interfaces</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/fivem-api-setup" variant="flat" className="justify-start">
                  API Setup Guide
                </Button>
                <Button as="a" href="/admin/docs/fivem-quick-start" variant="flat" className="justify-start">
                  Quick Start Guide
                </Button>
                <Button variant="flat" className="justify-start" disabled>
                  fxmanifest.lua Reference
                </Button>
                <Button variant="flat" className="justify-start" disabled>
                  config.lua Options
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
