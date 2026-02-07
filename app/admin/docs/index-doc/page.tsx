"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { BarChart3, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function IndexDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-600/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Documentation Index</h1>
              <p className="text-gray-400">Complete documentation reference</p>
            </div>
          </div>
          <Button color="primary" startContent={<Download />} as="a" href="/docs/INDEX.md" download>
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📚 Documentation Overview</h2></CardHeader>
            <CardBody>
              <p className="text-gray-300 mb-4">
                Comprehensive documentation for the Aurora Horizon Roleplay CAD system, covering all aspects 
                from development setup to production deployment.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-violet-900/20 border border-violet-500/30 rounded">
                  <h4 className="font-semibold text-violet-400 mb-2">24 Documents</h4>
                  <p className="text-sm text-gray-400">Organized into 8 categories</p>
                </div>
                <div className="p-4 bg-violet-900/20 border border-violet-500/30 rounded">
                  <h4 className="font-semibold text-violet-400 mb-2">Full Coverage</h4>
                  <p className="text-sm text-gray-400">CAD, database, FiveM, development, features</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📂 Document Categories</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong className="text-orange-400">Error System:</strong> 4 comprehensive error handling guides</li>
                <li>• <strong className="text-blue-400">CAD System:</strong> 4 complete dispatch system references</li>
                <li>• <strong className="text-green-400">Database:</strong> 2 schema and integration guides</li>
                <li>• <strong className="text-purple-400">Character & Personnel:</strong> 3 character management docs</li>
                <li>• <strong className="text-amber-400">FiveM Integration:</strong> 4 in-game integration guides</li>
                <li>• <strong className="text-cyan-400">Development:</strong> 2 developer workflow guides</li>
                <li>• <strong className="text-pink-400">Features & Systems:</strong> 3 advanced feature docs</li>
                <li>• <strong className="text-violet-400">Project Info:</strong> 2 statistics and index files</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Quick Access</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs" variant="flat" color="primary" className="justify-start">
                  Browse All Documentation →
                </Button>
                <Button as="a" href="/admin/docs/cad-system" variant="flat" className="justify-start">
                  CAD System Overview
                </Button>
                <Button as="a" href="/admin/docs/fivem-integration" variant="flat" className="justify-start">
                  FiveM Integration
                </Button>
                <Button as="a" href="/admin/docs/database-complete" variant="flat" className="justify-start">
                  Database Schema
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
