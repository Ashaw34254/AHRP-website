"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Gamepad2, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function FiveMQuickStartDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Gamepad2 className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">FiveM Quick Start (15min)</h1>
              <p className="text-gray-400">Get up and running fast</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/QUICK-START.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚡ 4-Step Installation</h2></CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold">Copy Resource</h4>
                    <p className="text-sm text-gray-400">Copy <code>ahrp-cad</code> folder to <code>resources/</code></p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold">Configure</h4>
                    <p className="text-sm text-gray-400">Edit <code>config.lua</code> with your API URL and key</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold">Add to server.cfg</h4>
                    <p className="text-sm text-gray-400">Add <code>ensure ahrp-cad</code> to server configuration</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold">Restart & Test</h4>
                    <p className="text-sm text-gray-400">Restart server, press F5 in-game to test</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">✅ Verification Steps</h2></CardHeader>
            <CardBody>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer">
                  <input type="checkbox" />
                  <span>F5 opens CAD interface</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer">
                  <input type="checkbox" />
                  <span>/duty command works</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer">
                  <input type="checkbox" />
                  <span>Location updates in web CAD</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer">
                  <input type="checkbox" />
                  <span>F9 panic button triggers alert</span>
                </label>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
