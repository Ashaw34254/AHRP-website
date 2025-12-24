"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Users, Download } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function CharacterPoliceSetupDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Character & Police Setup Guide</h1>
              <p className="text-gray-400">Step-by-step configuration for character profiles</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/CHARACTER-POLICE-SETUP.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📋 Setup Checklist</h2></CardHeader>
            <CardBody>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-800/70 transition">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-gray-300">Database schema includes Character and Officer models</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-800/70 transition">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-gray-300">Character creation API endpoint implemented</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-800/70 transition">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-gray-300">Officer profile management added to admin panel</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-800/70 transition">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-gray-300">CAD system integrated with officer records</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-800/70 transition">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-gray-300">Character approval workflow configured</span>
                </label>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🏗️ Database Setup</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h4 className="font-semibold text-indigo-400 mb-2">1. Run Migrations</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
                  npx prisma migrate dev --name add_character_officer_models
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-400 mb-2">2. Generate Prisma Client</h4>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
                  npx prisma generate
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-400 mb-2">3. Verify Models</h4>
                <p className="text-sm text-gray-400">Open Prisma Studio to confirm models exist:</p>
                <pre className="p-4 bg-gray-900 rounded-lg text-sm text-green-400">
                  npx prisma studio
                </pre>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🎨 UI Components</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-indigo-400 mb-2">Character Creation Form</h4>
                  <p className="text-sm text-gray-400">Multi-step form with personal info, appearance, background, employment</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-indigo-400 mb-2">Character List</h4>
                  <p className="text-sm text-gray-400">Grid/list view of user's characters with edit/delete actions</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-indigo-400 mb-2">Admin Approval Panel</h4>
                  <p className="text-sm text-gray-400">Review pending characters, approve/reject with feedback</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold text-indigo-400 mb-2">Officer Management</h4>
                  <p className="text-sm text-gray-400">Admin interface to create/edit officer profiles and assign units</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔌 API Endpoints</h2></CardHeader>
            <CardBody className="space-y-3">
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">GET /api/characters</code>
                <p className="text-xs text-gray-400 mt-1">List user's characters</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">POST /api/characters</code>
                <p className="text-xs text-gray-400 mt-1">Create new character</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">PATCH /api/characters/[id]</code>
                <p className="text-xs text-gray-400 mt-1">Update character details</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">DELETE /api/characters/[id]</code>
                <p className="text-xs text-gray-400 mt-1">Delete character</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">POST /api/admin/officers</code>
                <p className="text-xs text-gray-400 mt-1">Create officer profile (admin only)</p>
              </div>
              <div className="p-3 bg-gray-900 rounded">
                <code className="text-sm text-green-400">PATCH /api/admin/characters/[id]/approve</code>
                <p className="text-xs text-gray-400 mt-1">Approve/reject character (admin only)</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔐 Permissions & Access Control</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">Regular Users:</strong>
                  <p className="text-sm text-gray-400 mt-1">Can create/edit/delete own characters; cannot create officer profiles</p>
                </div>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded">
                  <strong className="text-purple-400">Admins:</strong>
                  <p className="text-sm text-gray-400 mt-1">Can approve characters, create officer profiles, assign units, manage all data</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">CAD Access:</strong>
                  <p className="text-sm text-gray-400 mt-1">Only approved characters with officer profiles can access CAD system</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📝 Character Creation Flow</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-indigo-400">Personal Information</h4>
                    <p className="text-sm text-gray-400">Name, DOB, gender, contact info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-indigo-400">Physical Appearance</h4>
                    <p className="text-sm text-gray-400">Height, weight, eye/hair color, build, distinguishing features</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-indigo-400">Employment & Background</h4>
                    <p className="text-sm text-gray-400">Occupation, department selection, backstory (rich text)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-indigo-400">Medical Information</h4>
                    <p className="text-sm text-gray-400">Blood type, allergies, chronic conditions, organ donor status</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-indigo-400">Review & Submit</h4>
                    <p className="text-sm text-gray-400">Preview character, submit for admin approval</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">⚙️ Configuration Options</h2></CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-indigo-400">Auto State ID Generation:</strong> <span className="text-gray-400">Auto-generate unique State IDs on character creation</span>
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-indigo-400">Approval Required:</strong> <span className="text-gray-400">Toggle admin approval requirement for new characters</span>
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-indigo-400">Character Limit:</strong> <span className="text-gray-400">Set max number of characters per user</span>
              </div>
              <div className="p-3 bg-gray-800/50 rounded">
                <strong className="text-indigo-400">Rich Text Editor:</strong> <span className="text-gray-400">Enable HTML formatting for backstory field</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/character-police-data" variant="flat" className="justify-start">
                  ← Data Integration Guide
                </Button>
                <Button as="a" href="/admin/docs/character-police-implementation" variant="flat" className="justify-start">
                  Implementation Complete Guide
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
