"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getDepartmentSettings } from "@/lib/department-settings";
import { 
  Card, 
  CardBody, 
  Chip,
  Button,
  Tabs,
  Tab,
  Avatar,
  Progress
} from "@nextui-org/react";
import { 
  Heart,
  Activity,
  Users,
  Ambulance,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Radio,
  Stethoscope,
  TrendingUp,
  Plus,
  Shield,
  FileText,
  Award,
  BookOpen,
  UserCircle
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function EMSDashboardPage() {
  const { data: session } = useSession();
  const deptSettings = useMemo(() => getDepartmentSettings("EMS"), []);
  const [selectedTab, setSelectedTab] = useState("home");
  const [totalParamedics] = useState(18);
  const [onDuty] = useState(9);
  const [activeCalls] = useState(4);
  const [patientsToday] = useState(27);

  const activeCallsData = [
    { id: "EMS-247", type: "Cardiac Arrest", location: "Downtown Mall", priority: "critical", status: "en route", medic: "Unit M-3" },
    { id: "EMS-248", type: "Vehicle Accident", location: "Highway 101", priority: "high", status: "on scene", medic: "Unit M-1" },
    { id: "EMS-249", type: "Minor Injury", location: "City Park", priority: "low", status: "treating", medic: "Unit M-5" },
    { id: "EMS-250", type: "Overdose", location: "Motel 6", priority: "high", status: "responding", medic: "Unit M-2" },
  ];

  const onlineMedics = [
    { name: "Sarah Johnson", unit: "M-1", rank: "Paramedic", status: "On Scene", specialty: "Advanced Life Support" },
    { name: "Mike Wilson", unit: "M-2", rank: "EMT", status: "Responding", specialty: "Basic Life Support" },
    { name: "Emily Davis", unit: "M-3", rank: "Senior Paramedic", status: "En Route", specialty: "Critical Care" },
    { name: "Robert Brown", unit: "M-5", rank: "Paramedic", status: "Available", specialty: "Trauma Care" },
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "critical": return "danger";
      case "high": return "warning";
      case "low": return "default";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "responding": case "en route": return "warning";
      case "on scene": case "treating": return "primary";
      case "available": return "success";
      default: return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative h-32 rounded-lg overflow-hidden" style={{
          background: `linear-gradient(to right, ${deptSettings.theme.primaryColor}, ${deptSettings.theme.secondaryColor}, ${deptSettings.theme.accentColor})`
        }}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex items-center px-6">
            <Heart className="w-16 h-16 text-white mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">{deptSettings.theme.displayName}</h1>
              <p className="text-green-100">{deptSettings.motto}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-0">
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={(key) => setSelectedTab(key as string)}
              variant="underlined"
              classNames={{
                tabList: "w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full",
                tab: "max-w-fit px-6 h-12",
                tabContent: "group-data-[selected=true]:font-semibold"
              }}
              style={{
                '--nextui-cursor': deptSettings.theme.primaryColor,
                '--nextui-tab-color': deptSettings.theme.primaryColor
              } as React.CSSProperties}
            >
              <Tab key="home" title={
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Home</span>
                </div>
              } />
              <Tab key="leadership" title={
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Leadership</span>
                </div>
              } />
              <Tab key="roster" title={
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Roster</span>
                </div>
              } />
              <Tab key="ranks" title={
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Ranks</span>
                </div>
              } />
              <Tab key="protocols" title={
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Protocols</span>
                </div>
              } />
              <Tab key="training" title={
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Training</span>
                </div>
              } />
              <Tab key="profile" title={
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-4 h-4" />
                  <span>My Profile</span>
                </div>
              } />
            </Tabs>
          </CardBody>
        </Card>

        {/* Tab Content */}
        {selectedTab === "home" && (
          <>
            {/* Welcome Message */}
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <Heart 
                    className="w-12 h-12 flex-shrink-0" 
                    style={{ color: deptSettings.theme.accentColor }}
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {deptSettings.theme.displayName}
                    </h2>
                    {deptSettings.motto && (
                      <p 
                        className="text-lg italic mb-3"
                        style={{ color: deptSettings.theme.accentColor }}
                      >
                        "{deptSettings.motto}"
                      </p>
                    )}
                    {deptSettings.description && (
                      <p className="text-gray-300 mb-4 font-semibold">
                        {deptSettings.description}
                      </p>
                    )}
                    <div className="prose prose-invert max-w-none">
                      {deptSettings.homepageContent.split("\n\n").map((paragraph, i) => {
                        if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
                          return (
                            <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">
                              {paragraph.replace(/\*\*/g, "").replace(":", "")}
                            </h3>
                          );
                        }
                        if (paragraph.startsWith("-")) {
                          return (
                            <ul key={i} className="list-disc list-inside text-gray-300 space-y-1 mb-3">
                              {paragraph.split("\n").map((item, j) => (
                                <li key={j}>{item.replace(/^- /, "")}</li>
                              ))}
                            </ul>
                          );
                        }
                        return (
                          <p key={i} className="text-gray-300 mb-3">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-green-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8" style={{ color: deptSettings.theme.accentColor }} />
                    <Chip style={{ backgroundColor: deptSettings.theme.primaryColor + '40', color: deptSettings.theme.primaryColor }} variant="flat" size="sm">Active</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{totalParamedics}</div>
                  <p className="text-sm text-gray-400">Total Medics</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-blue-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-blue-400" />
                    <Chip color="primary" variant="flat" size="sm">Online</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{onDuty}</div>
                  <p className="text-sm text-gray-400">On Duty Now</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-red-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Radio className="w-8 h-8 text-red-400" />
                    <Chip color="danger" variant="flat" size="sm">Active</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{activeCalls}</div>
                  <p className="text-sm text-gray-400">Active Calls</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-purple-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-purple-400" />
                    <Chip color="secondary" variant="flat" size="sm">Today</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{patientsToday}</div>
                  <p className="text-sm text-gray-400">Patients Treated</p>
                </CardBody>
              </Card>
            </div>

            {/* Active Calls & On Duty Medics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Calls */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Active Medical Calls
                  </h3>
                  <div className="space-y-3">
                    {activeCallsData.map((call, i) => (
                      <div key={i} className="p-3 bg-gray-800/50 rounded-lg border-l-4" style={{
                        borderLeftColor: call.priority === 'critical' ? '#dc2626' : call.priority === 'high' ? '#f59e0b' : '#6b7280'
                      }}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono font-bold">{call.id}</span>
                            <Chip size="sm" variant="flat" color={getPriorityColor(call.priority)}>
                              {call.priority.toUpperCase()}
                            </Chip>
                          </div>
                          <Chip size="sm" variant="flat" color={getStatusColor(call.status)}>
                            {call.status}
                          </Chip>
                        </div>
                        <p className="text-white font-medium mb-1">{call.type}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">📍 {call.location}</span>
                          <span className="text-gray-500">{call.medic}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* On Duty Medics */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    On Duty Medics
                  </h3>
                  <div className="space-y-3">
                    {onlineMedics.map((medic, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Avatar
                          name={medic.name}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{medic.name}</p>
                            <Chip size="sm" variant="flat" style={{ backgroundColor: deptSettings.theme.primaryColor + '40', color: deptSettings.theme.primaryColor }}>{medic.unit}</Chip>
                          </div>
                          <p className="text-xs text-gray-400">{medic.rank} - {medic.specialty}</p>
                        </div>
                        <Chip size="sm" variant="flat" color={getStatusColor(medic.status.toLowerCase())}>
                          {medic.status}
                        </Chip>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Performance & Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Performance */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Response Time (Avg)</span>
                        <span className="text-white font-medium">2.8 min</span>
                      </div>
                      <Progress value={92} size="sm" className="mt-2" style={{ '--nextui-progress-indicator': deptSettings.theme.primaryColor } as React.CSSProperties} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Patient Survival Rate</span>
                        <span className="text-white font-medium">96%</span>
                      </div>
                      <Progress value={96} color="primary" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Unit Availability</span>
                        <span className="text-white font-medium">67%</span>
                      </div>
                      <Progress value={67} color="warning" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Department Activity</span>
                        <span className="text-white font-medium">High</span>
                      </div>
                      <Progress value={82} color="secondary" size="sm" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Medical Supplies */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Medical Supplies
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Plus className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">First Aid Kits</p>
                          <p className="text-xs text-gray-400">In Stock</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">24</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">AED Units</p>
                          <p className="text-xs text-gray-400">Functional</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">8/8</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Ambulance className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Ambulances</p>
                          <p className="text-xs text-gray-400">Available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">5/7</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        )}

        {selectedTab === "leadership" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{deptSettings.theme.displayName} Leadership</h2>
              <p className="text-gray-400">Leadership roster and chain of command coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "roster" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{deptSettings.theme.displayName} Roster</h2>
              <p className="text-gray-400">Full department roster coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "ranks" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{deptSettings.theme.displayName} Ranks</h2>
              <p className="text-gray-400">Rank structure and progression information coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "protocols" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Medical Protocols</h2>
              <p className="text-gray-400">Standard operating procedures and medical protocols coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "training" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Training Materials</h2>
              <p className="text-gray-400">Training resources and certification tracking coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "profile" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">My Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  name={session?.user?.name || "User"}
                  src={session?.user?.image || undefined}
                  className="w-20 h-20"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{session?.user?.name || "Anonymous"}</h3>
                  <p className="text-gray-400">{session?.user?.email}</p>
                  <Chip style={{ backgroundColor: deptSettings.theme.primaryColor }} variant="flat" className="mt-2">{deptSettings.theme.displayName} Personnel</Chip>
                </div>
              </div>
              <p className="text-gray-400">Profile information and statistics coming soon...</p>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
  