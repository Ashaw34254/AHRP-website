"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Radio, Download } from "lucide-react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function CADTerminologyDocsPage() {
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Radio className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Victoria CAD Terminology</h1>
              <p className="text-gray-400">Standard codes, terms, and radio procedures</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Download className="w-4 h-4" />}
            as="a"
            href="/docs/VICTORIA-CAD-TERMINOLOGY.md"
            download
          >
            Download MD
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📻 Ten-Codes (10-Codes)</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">10-4:</strong> <span className="text-gray-400">Acknowledged / OK</span>
                </div>
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">10-8:</strong> <span className="text-gray-400">In Service / Available</span>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">10-6:</strong> <span className="text-gray-400">Busy / Standby</span>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <strong className="text-blue-400">10-7:</strong> <span className="text-gray-400">Out of Service</span>
                </div>
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                  <strong className="text-purple-400">10-19:</strong> <span className="text-gray-400">Return to Station</span>
                </div>
                <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded">
                  <strong className="text-orange-400">10-20:</strong> <span className="text-gray-400">Location / What's your 20?</span>
                </div>
                <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded">
                  <strong className="text-cyan-400">10-23:</strong> <span className="text-gray-400">Arrived on Scene</span>
                </div>
                <div className="p-3 bg-pink-900/20 border border-pink-500/30 rounded">
                  <strong className="text-pink-400">10-41:</strong> <span className="text-gray-400">Beginning Shift</span>
                </div>
                <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded">
                  <strong className="text-indigo-400">10-42:</strong> <span className="text-gray-400">Ending Shift</span>
                </div>
                <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded">
                  <strong className="text-orange-400">10-76:</strong> <span className="text-gray-400">En Route</span>
                </div>
                <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded">
                  <strong className="text-cyan-400">10-97:</strong> <span className="text-gray-400">Arrived / On Scene</span>
                </div>
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">10-99:</strong> <span className="text-gray-400">Panic / Emergency / Officer Down</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚨 Signal Codes</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">Code 3:</strong> <span className="text-gray-400">Emergency Response (Lights & Sirens)</span>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <strong className="text-yellow-400">Code 2:</strong> <span className="text-gray-400">Urgent Response (No Lights/Sirens)</span>
                </div>
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <strong className="text-green-400">Code 1:</strong> <span className="text-gray-400">Routine Response</span>
                </div>
                <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                  <strong className="text-purple-400">Code 4:</strong> <span className="text-gray-400">No Further Assistance Needed</span>
                </div>
                <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded">
                  <strong className="text-orange-400">Code 5:</strong> <span className="text-gray-400">Stakeout / Surveillance</span>
                </div>
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                  <strong className="text-red-400">Code 99:</strong> <span className="text-gray-400">Emergency / All Units Respond</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">👤 Phonetic Alphabet</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 bg-gray-800/50 rounded"><strong>A</strong> - Alpha</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>B</strong> - Bravo</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>C</strong> - Charlie</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>D</strong> - Delta</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>E</strong> - Echo</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>F</strong> - Foxtrot</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>G</strong> - Golf</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>H</strong> - Hotel</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>I</strong> - India</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>J</strong> - Juliet</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>K</strong> - Kilo</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>L</strong> - Lima</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>M</strong> - Mike</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>N</strong> - November</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>O</strong> - Oscar</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>P</strong> - Papa</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>Q</strong> - Quebec</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>R</strong> - Romeo</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>S</strong> - Sierra</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>T</strong> - Tango</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>U</strong> - Uniform</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>V</strong> - Victor</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>W</strong> - Whiskey</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>X</strong> - X-ray</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>Y</strong> - Yankee</div>
                <div className="p-2 bg-gray-800/50 rounded"><strong>Z</strong> - Zulu</div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🚗 Call Signs</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Police Units</h4>
                <p className="text-sm text-gray-400">1A-01 through 1A-99 (Patrol), 2A-01 (Traffic), K9-01 (Canine), AIR-1 (Helicopter)</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-2">Fire Units</h4>
                <p className="text-sm text-gray-400">ENGINE-1, LADDER-1, RESCUE-1, BATTALION-1 (Chief)</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">EMS Units</h4>
                <p className="text-sm text-gray-400">MEDIC-1, MEDIC-2, RESCUE-1, AIR-MEDIC (Air Ambulance)</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">📝 Common Abbreviations</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong>DUI:</strong> Driving Under Influence
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong>BOLO:</strong> Be On the Lookout
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong>ETA:</strong> Estimated Time of Arrival
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong>RO:</strong> Registered Owner
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong>DOB:</strong> Date of Birth
                </div>
                <div className="p-3 bg-gray-800/50 rounded">
                  <strong>MVA:</strong> Motor Vehicle Accident
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="text-2xl font-bold">🔗 Related Documentation</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button as="a" href="/admin/docs/cad-system" variant="flat" className="justify-start">
                  ← CAD System Overview
                </Button>
                <Button as="a" href="/admin/docs/cad-dispatch" variant="flat" className="justify-start">
                  Dispatch System Guide
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
