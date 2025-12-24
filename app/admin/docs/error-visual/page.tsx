"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Eye, Download } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function ErrorVisualDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Visual Guide</h1>
              <p className="text-gray-400">Visual examples and UI previews</p>
            </div>
          </div>
          <Button
            color="secondary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/ERROR-VISUAL-GUIDE.md"
            download
          >
            Download MD
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Error Page Previews */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🎨 Error Page Previews</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Standard Error */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-400">Standard Error Page (500)</h3>
                <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black border-2 border-gray-700 rounded-lg">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-red-600/20 rounded-full border border-red-500/30">
                        <div className="w-12 h-12 text-red-400 flex items-center justify-center text-2xl">🚨</div>
                      </div>
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
                      500
                    </h1>
                    <h2 className="text-2xl font-bold">10-00: Officer Down</h2>
                    <p className="text-gray-400 text-sm">
                      System error with debugging info
                    </p>
                    <div className="flex gap-2 justify-center">
                      <div className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-xs">
                        Runtime Error
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Error */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-400">Global Error Page (500 Critical)</h3>
                <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black border-2 border-red-700 rounded-lg">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-red-600/20 rounded-full border-2 border-red-500/50">
                        <div className="w-12 h-12 text-red-400 flex items-center justify-center text-2xl">💥</div>
                      </div>
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-transparent bg-clip-text">
                      500
                    </h1>
                    <h2 className="text-2xl font-bold">10-33: Emergency - System Critical</h2>
                    <div className="px-4 py-2 bg-red-900/20 border-2 border-red-500/50 rounded-lg">
                      <p className="text-red-400 font-semibold">CRITICAL SYSTEM ERROR</p>
                      <p className="text-gray-400 text-sm mt-2">Catastrophic failure detected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 404 */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-400">404 Not Found</h3>
                <div className="p-6 bg-gradient-to-b from-black via-gray-900 to-black border-2 border-yellow-700 rounded-lg">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-yellow-600/20 rounded-full border border-yellow-500/30">
                        <div className="w-12 h-12 text-yellow-400 flex items-center justify-center text-2xl">⚠️</div>
                      </div>
                    </div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                      404
                    </h1>
                    <h2 className="text-2xl font-bold">10-78: Page Not Found</h2>
                    <p className="text-gray-400 text-sm">
                      The requested page is off the grid
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Dashboard Preview */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">📊 Error Dashboard Preview</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-white">24</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-500">3</div>
                    <div className="text-xs text-gray-400">Critical</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-orange-500">8</div>
                    <div className="text-xs text-gray-400">High</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-500">13</div>
                    <div className="text-xs text-gray-400">Medium</div>
                  </div>
                </div>

                {/* Sample Errors */}
                <div className="space-y-2">
                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded text-xs text-red-400">CRITICAL</span>
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs">database</span>
                        </div>
                        <p className="text-sm font-medium">Database connection failed</p>
                        <p className="text-xs text-gray-500">Dec 24, 10:30 AM</p>
                      </div>
                      <div className="text-2xl">🌐</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-orange-600/20 border border-orange-500/30 rounded text-xs text-orange-400">HIGH</span>
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs">api</span>
                        </div>
                        <p className="text-sm font-medium">API endpoint timeout</p>
                        <p className="text-xs text-gray-500">Dec 24, 10:25 AM</p>
                      </div>
                      <div className="text-2xl">💾</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">🎨 Color Scheme</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-400">Severity Colors</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-red-400">Critical</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-900/20 border border-orange-500/30 rounded">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-orange-400">High</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-yellow-400">Medium</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-blue-400">Low</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-400">UI Elements</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-gradient-to-b from-black via-gray-900 to-black border border-gray-700 rounded">
                      Background Gradient
                    </div>
                    <div className="p-3 bg-gray-800/50 border border-gray-700 rounded">
                      Card Background
                    </div>
                    <div className="p-3 bg-black/30 font-mono text-gray-300 rounded">
                      Code Block
                    </div>
                    <button className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors">
                      Button Style
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">📈 Before vs After</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-400">Before Error System</h3>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>❌ Generic errors</li>
                    <li>❌ No stack traces</li>
                    <li>❌ No error tracking</li>
                    <li>❌ Manual debugging</li>
                    <li>❌ Lost error context</li>
                    <li>❌ No error history</li>
                    <li>❌ Production silent fails</li>
                    <li>❌ No error analytics</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-400">After Error System</h3>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>✅ Categorized errors</li>
                    <li>✅ Full stack traces (dev)</li>
                    <li>✅ Error dashboard</li>
                    <li>✅ Auto-categorization</li>
                    <li>✅ Context preserved</li>
                    <li>✅ Error logs & stats</li>
                    <li>✅ User-friendly messages</li>
                    <li>✅ Statistics & trends</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
