"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Database, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function DatabaseIntegrationDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-600/20 rounded-lg">
              <Database className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Database Integration Guide</h1>
              <p className="text-gray-400">Prisma setup, migrations, and best practices</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/DATABASE-INTEGRATION.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚀 Quick Start</h2></CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300">Setting up Prisma and running your first migrations:</p>
              <div className="space-y-3">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <code className="text-sm text-green-400">npm install</code>
                  <p className="text-xs text-gray-400 mt-1">Install dependencies (includes Prisma)</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <code className="text-sm text-green-400">npx prisma generate</code>
                  <p className="text-xs text-gray-400 mt-1">Generate Prisma Client from schema</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <code className="text-sm text-green-400">npx prisma migrate dev</code>
                  <p className="text-xs text-gray-400 mt-1">Create and apply migrations</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <code className="text-sm text-green-400">npm run db:seed</code>
                  <p className="text-xs text-gray-400 mt-1">Seed database with sample data</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📁 File Structure</h2></CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm font-mono">
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-teal-400">prisma/schema.prisma</strong> <span className="text-gray-400">- Database schema definition (1749 lines)</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-teal-400">prisma/seed.ts</strong> <span className="text-gray-400">- Sample data seeding script</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-teal-400">lib/prisma.ts</strong> <span className="text-gray-400">- Prisma Client singleton (prevents multiple instances)</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-teal-400">dev.db</strong> <span className="text-gray-400">- SQLite database file (development)</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-teal-400">prisma/migrations/</strong> <span className="text-gray-400">- Migration history</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔄 Migration Workflow</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">1. Modify Schema</h4>
                <p className="text-sm text-gray-400">Edit <code>prisma/schema.prisma</code> to add/modify models, fields, or relations</p>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">2. Create Migration</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
                  npx prisma migrate dev --name add_new_field
                </pre>
                <p className="text-xs text-gray-400 mt-2">Creates migration SQL and updates database</p>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">3. Regenerate Client</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
                  npx prisma generate
                </pre>
                <p className="text-xs text-gray-400 mt-2">Updates TypeScript types (auto-runs after migrate)</p>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">4. Restart Dev Server</h4>
                <p className="text-sm text-gray-400">Restart Next.js to load new Prisma Client</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🛠️ Useful Commands</h2></CardHeader>
            <CardBody className="space-y-3">
              <div className="p-3 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">npx prisma studio</code>
                <p className="text-xs text-gray-400 mt-1">Open database GUI for visual editing</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">npx prisma migrate reset</code>
                <p className="text-xs text-gray-400 mt-1">⚠️ Reset database (deletes all data, re-runs migrations and seeds)</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">npx prisma db push</code>
                <p className="text-xs text-gray-400 mt-1">Push schema changes without creating migration (dev only)</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">npx prisma format</code>
                <p className="text-xs text-gray-400 mt-1">Format schema.prisma file</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <code className="text-sm text-green-400">npx prisma validate</code>
                <p className="text-xs text-gray-400 mt-1">Validate schema syntax</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📝 Prisma Client Usage</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Import Singleton</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
{`import { prisma } from "@/lib/prisma";`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Basic Queries</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`// Find many with filtering
const calls = await prisma.call.findMany({
  where: { status: "ACTIVE" },
  include: { units: true },
  orderBy: { createdAt: 'desc' }
});

// Create new record
const newCall = await prisma.call.create({
  data: {
    callNumber: "2024-001",
    type: "TRAFFIC_STOP",
    priority: "HIGH"
  }
});

// Update existing record
await prisma.call.update({
  where: { id: callId },
  data: { status: "CLOSED" }
});`}
                </pre>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚠️ Important Gotchas</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">SQLite Limitations:</strong>
                  <ul className="text-sm text-gray-400 mt-2 space-y-1">
                    <li>• No native enum support - use string fields</li>
                    <li>• Limited ALTER TABLE support - may require migration recreation</li>
                    <li>• No JSON query operations (use PostgreSQL in production)</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">Dev Hot-Reload:</strong>
                  <p className="text-sm text-gray-400 mt-1">Always use Prisma Client singleton from lib/prisma.ts to prevent "too many clients" errors</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">Production Migration:</strong>
                  <p className="text-sm text-gray-400 mt-1">Use <code>npx prisma migrate deploy</code> in production (not migrate dev)</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🌐 Production Setup</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Switch to PostgreSQL</h4>
                <p className="text-sm text-gray-400 mb-2">Update schema.prisma:</p>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Set Environment Variable</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
{`DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-teal-400 mb-2">Deploy Migrations</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
                  npx prisma migrate deploy
                </pre>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/database-complete" variant="flat" className="justify-start">
                  ← Complete Schema Reference
                </Button>
                <Button as="a" href="https://www.prisma.io/docs" target="_blank" variant="flat" className="justify-start">
                  Prisma Official Docs →
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
