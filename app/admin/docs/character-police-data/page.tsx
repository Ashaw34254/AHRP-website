"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Users, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function CharacterPoliceDataDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Character & Police Data Integration</h1>
              <p className="text-gray-400">Linking characters with CAD officer profiles</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/CHARACTER-POLICE-DATA.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Data Integration Overview</h2></CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-300">
                Character and police data are integrated through a unified system that links character profiles 
                with CAD officer records, enabling seamless roleplay and operational tracking.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h3 className="font-semibold text-blue-400 mb-2">Character Profile</h3>
                  <p className="text-sm text-gray-400">Personal details, physical appearance, backstory, employment</p>
                </div>
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <h3 className="font-semibold text-purple-400 mb-2">Officer Record</h3>
                  <p className="text-sm text-gray-400">Badge number, rank, department, unit assignment, certifications</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">👤 Character Model Fields</h2></CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-800/50 rounded">
                    <strong className="text-blue-400">Personal:</strong> firstName, lastName, dateOfBirth, gender
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <strong className="text-blue-400">Identification:</strong> stateId (auto-generated), bloodType
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <strong className="text-blue-400">Physical:</strong> height, weight, eyeColor, hairColor, build
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <strong className="text-blue-400">Employment:</strong> occupation, department, rank, badgeNumber
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <strong className="text-blue-400">Medical:</strong> allergies, chronicConditions, organDonor
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded">
                    <strong className="text-blue-400">Background:</strong> backstory, personalityTraits (JSON), skills (JSON)
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">👮 Officer Model Fields</h2></CardHeader>
            <CardBody>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <div><strong>badgeNumber:</strong> Unique identifier (e.g., "1A-01", "FIRE-1", "EMS-5")</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <div><strong>rank:</strong> Officer, Sergeant, Lieutenant, Captain, etc.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <div><strong>department:</strong> POLICE, FIRE, EMS</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <div><strong>certifications:</strong> JSON array of training certifications</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <div><strong>specializations:</strong> K9, SWAT, Traffic, Detective, etc.</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <div><strong>Relations:</strong> Linked to User, Unit, and TrainingRecords</div>
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔄 Data Flow</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-blue-400">Character Creation</h4>
                    <p className="text-sm text-gray-400">User creates character with personal details, appearance, and backstory</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-blue-400">Department Selection</h4>
                    <p className="text-sm text-gray-400">If joining POLICE/FIRE/EMS, department field is set on character</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-blue-400">Officer Profile Generation</h4>
                    <p className="text-sm text-gray-400">Admin creates Officer record linking to character and user</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-blue-400">Unit Assignment</h4>
                    <p className="text-sm text-gray-400">Officer is assigned to Unit with callsign (e.g., 1A-01)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-blue-400">CAD Integration</h4>
                    <p className="text-sm text-gray-400">Officer/Unit appears in CAD system for dispatch and call assignment</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📊 Database Relations</h2></CardHeader>
            <CardBody>
              <div className="p-4 bg-gray-900 rounded-lg">
                <pre className="text-sm text-green-400 overflow-x-auto">
{`Character
├── user (User)
├── department: "POLICE" | "FIRE" | "EMS" | "CIVILIAN"
└── ...character fields

Officer
├── user (User)
├── character (Character) - optional link
├── units (Unit[])
├── department: "POLICE" | "FIRE" | "EMS"
├── badgeNumber: string
├── rank: string
└── certifications: JSON

Unit
├── officers (Officer[])
├── calls (Call[])
├── department: "POLICE" | "FIRE" | "EMS"
└── callsign: string`}
                </pre>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">💡 Best Practices</h2></CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">Character-First Approach:</strong>
                  <p className="text-sm text-gray-400 mt-1">Create detailed character profile before generating officer record</p>
                </div>
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">Single Source of Truth:</strong>
                  <p className="text-sm text-gray-400 mt-1">Store personal details in Character, operational data in Officer</p>
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">Approval Workflow:</strong>
                  <p className="text-sm text-gray-400 mt-1">Use Character.isApproved flag for admin review before CAD access</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/character-police-setup" variant="flat" className="justify-start">
                  Character/Police Setup Guide
                </Button>
                <Button as="a" href="/admin/docs/character-police-implementation" variant="flat" className="justify-start">
                  Implementation Details
                </Button>
                <Button as="a" href="/admin/docs/database-complete" variant="flat" className="justify-start">
                  Database Schema Reference
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
