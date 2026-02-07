"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Database, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function DatabaseCompleteDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600/20 rounded-lg">
              <Database className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Database Schema Documentation</h1>
              <p className="text-gray-400">Complete Prisma schema reference with all models</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/DATABASE-COMPLETE.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📋 Schema Overview</h2></CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300">
                The database schema is built with <strong className="text-emerald-400">Prisma ORM</strong> and consists of 
                <strong className="text-emerald-400"> 1749 lines</strong> defining comprehensive CAD, character, and community management systems.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <h3 className="font-semibold text-emerald-400 mb-2">Database Provider</h3>
                  <p className="text-sm text-gray-400">SQLite (development), PostgreSQL (production)</p>
                </div>
                <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                  <h3 className="font-semibold text-emerald-400 mb-2">Total Models</h3>
                  <p className="text-sm text-gray-400">30+ models covering all system aspects</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">👤 User & Authentication Models</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-emerald-400 mb-2">User</h4>
                  <p className="text-sm text-gray-400">Core user model with Discord OAuth, roles (admin/user), departments, character relationships</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-emerald-400 mb-2">Account, Session, VerificationToken</h4>
                  <p className="text-sm text-gray-400">NextAuth.js authentication tables for OAuth providers and session management</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎭 Character System Models</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <div><strong>Character:</strong> Detailed profiles (physical appearance, IDs, employment, medical, backstory)</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <div><strong>Fields:</strong> firstName, lastName, dateOfBirth, stateId, gender, height, weight, eyeColor, hairColor</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <div><strong>Employment:</strong> occupation, department (POLICE/FIRE/EMS/CIVILIAN), rank, badge number</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <div><strong>Medical:</strong> bloodType, allergies, chronicConditions, organDonor</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <div><strong>Background:</strong> backstory (rich text), personalityTraits (JSON), skills (JSON)</div>
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚨 CAD System Models</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-800/50 rounded">
                  <h5 className="font-semibold text-emerald-400 mb-1">Call</h5>
                  <p className="text-xs text-gray-400">Emergency calls with priority, status, type, location, units</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <h5 className="font-semibold text-emerald-400 mb-1">Unit</h5>
                  <p className="text-xs text-gray-400">Emergency units with callsign, status, department, officers</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <h5 className="font-semibold text-emerald-400 mb-1">Officer</h5>
                  <p className="text-xs text-gray-400">Personnel records linked to units and users</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <h5 className="font-semibold text-emerald-400 mb-1">CallNote</h5>
                  <p className="text-xs text-gray-400">Timestamped notes added during call handling</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">👥 Civil Records Models</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-emerald-400 mb-2">Citizen</h4>
                  <p className="text-sm text-gray-400 mb-2">Civil records with warrants, licenses, criminal history</p>
                  <p className="text-xs text-gray-400">Relations: vehicles, warrants, citations, trafficStops</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-emerald-400 mb-2">Vehicle</h4>
                  <p className="text-sm text-gray-400 mb-2">Vehicle registrations with plates, ownership, stolen flags</p>
                  <p className="text-xs text-gray-400">Fields: plate, make, model, year, color, vin, registeredOwner, isStolen</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚖️ Law Enforcement Models</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-emerald-400">Warrant:</strong> <span className="text-gray-400">Active warrants with bail, charges</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-emerald-400">Citation:</strong> <span className="text-gray-400">Traffic/criminal citations with fines</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-emerald-400">TrafficStop:</strong> <span className="text-gray-400">Traffic stop records with outcomes</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-emerald-400">Incident:</strong> <span className="text-gray-400">Incident reports with narratives</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-emerald-400">BOLO:</strong> <span className="text-gray-400">Be On Lookout alerts</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong className="text-emerald-400">ArrestRecord:</strong> <span className="text-gray-400">Arrest history with charges</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🗂️ Additional Models</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><strong className="text-emerald-400">Application:</strong> Community application forms</li>
                <li><strong className="text-emerald-400">TrainingRecord:</strong> Officer training logs</li>
                <li><strong className="text-emerald-400">Shift:</strong> Duty shift tracking</li>
                <li><strong className="text-emerald-400">MedicalRecord:</strong> Character medical history</li>
                <li><strong className="text-emerald-400">CourtCase:</strong> Court proceedings</li>
                <li><strong className="text-emerald-400">Message:</strong> MDT messaging system</li>
                <li><strong className="text-emerald-400">Notification:</strong> User notifications</li>
                <li><strong className="text-emerald-400">Zone:</strong> Geographic dispatch zones</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔧 Prisma Query Patterns</h2></CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2">Include Relations</h4>
                  <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`const calls = await prisma.call.findMany({
  include: {
    units: true,
    createdBy: { select: { name: true } }
  }
});`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2">Where Filtering</h4>
                  <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400 overflow-x-auto">
{`where: {
  status: { in: ["PENDING", "ACTIVE"] },
  department: "POLICE"
}`}
                  </pre>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">💡 Important Notes</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">SQLite Limitation:</strong>
                  <p className="text-sm text-gray-400 mt-1">No native enum support - use string fields with comments documenting valid values</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">Prisma Singleton:</strong>
                  <p className="text-sm text-gray-400 mt-1">Use lib/prisma.ts singleton to prevent multiple client instances in dev hot-reload</p>
                </div>
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">Migrations:</strong>
                  <p className="text-sm text-gray-400 mt-1">Run <code>npx prisma migrate dev --name &lt;name&gt;</code> after schema changes</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/database-integration" variant="flat" className="justify-start">
                  Database Integration Guide
                </Button>
                <Button variant="flat" className="justify-start" disabled>
                  Prisma Studio (npx prisma studio)
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
