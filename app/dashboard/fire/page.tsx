"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
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
  Flame,
  Activity,
  Users,
  Radio,
  AlertTriangle,
  CheckCircle,
  Droplet,
  TrendingUp,
  Truck,
  Shield,
  Wind,
  FileText,
  Award,
  BookOpen,
  UserCircle
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FireDashboardPage() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState("home");
  const [totalFirefighters] = useState(22);
  const [onDuty] = useState(11);
  const [responsesToday] = useState(19);

  const activeIncidentsData = [
    { id: "FIRE-389", type: "Structure Fire", location: "Vinewood Hills", priority: "critical" as const, status: "on scene", unit: "Engine 12" },
    { id: "FIRE-390", type: "Vehicle Fire", location: "Legion Square", priority: "high" as const, status: "responding", unit: "Engine 5" },
    { id: "FIRE-391", type: "Rescue - Height", location: "Construction Site", priority: "medium" as const, status: "en route", unit: "Ladder 3" },
  ];

  const onDutyFirefighters = [
    { name: "Jennifer Taylor", unit: "E-12", rank: "Fire Chief", status: "On Scene", station: "Station 1" },
    { name: "David Martinez", unit: "E-5", rank: "Captain", status: "Responding", station: "Station 2" },
    { name: "Robert Johnson", unit: "L-3", rank: "Lieutenant", status: "En Route", station: "Station 1" },
    { name: "Amanda Wilson", unit: "E-8", rank: "Firefighter", status: "Available", station: "Station 3" },
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "critical": return "danger";
      case "high": return "warning";
      case "medium": return "primary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "responding": case "en route": return "warning";
      case "on scene": return "danger";
      case "available": return "success";
      default: return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex items-center px-6">
            <Flame className="w-16 h-16 text-white mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">Fire & Rescue Department</h1>
              <p className="text-orange-100">Fighting Fires, Saving Lives</p>
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
              color="danger"
              classNames={{
                tabList: "w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-red-500",
                tab: "max-w-fit px-6 h-12",
                tabContent: "group-data-[selected=true]:text-red-400"
              }}
            >
              <Tab key="home" title={
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4" />
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
              <Tab key="sops" title={
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>SOPs</span>
                </div>
              } />
              <Tab key="stations" title={
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4" />
                  <span>Stations</span>
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
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to BeehiveRP - Fire & Rescue</h2>
                <p className="text-gray-300 mb-4">
                  Kia ora! At BeehiveRP Fire & Rescue, we provide realistic firefighting and rescue operations. From structure 
                  fires to vehicle extrications, our VMenu system lets you quickly gear up and respond to emergencies across 
                  the city.
                </p>
                <p className="text-gray-300">
                  Whether you're battling a blaze in Vinewood Hills or performing a high-angle rescue downtown, 
                  you have the tools and training to handle any emergency - just remember to work as a team and follow 
                  safety protocols.
                </p>
              </CardBody>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-red-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-red-400" />
                    <Chip color="danger" variant="flat" size="sm">Active</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{totalFirefighters}</div>
                  <p className="text-sm text-gray-400">Total Firefighters</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/30 to-gray-900/50 border border-orange-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-orange-400" />
                    <Chip color="warning" variant="flat" size="sm">Online</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{onDuty}</div>
                  <p className="text-sm text-gray-400">On Duty Now</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-yellow-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="w-8 h-8 text-yellow-400" />
                    <Chip color="warning" variant="flat" size="sm">Active</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{activeIncidentsData.length}</div>
                  <p className="text-sm text-gray-400">Active Incidents</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-green-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <Chip color="success" variant="flat" size="sm">Today</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{responsesToday}</div>
                  <p className="text-sm text-gray-400">Responses</p>
                </CardBody>
              </Card>
            </div>

            {/* Active Incidents & On Duty Crew */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Incidents */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Active Incidents
                  </h3>
                  <div className="space-y-3">
                    {activeIncidentsData.map((incident, i) => (
                      <div key={i} className="p-3 bg-gray-800/50 rounded-lg border-l-4" style={{
                        borderLeftColor: incident.priority === 'critical' ? '#dc2626' : incident.priority === 'high' ? '#f59e0b' : '#3b82f6'
                      }}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono font-bold">{incident.id}</span>
                            <Chip size="sm" variant="flat" color={getPriorityColor(incident.priority)}>
                              {incident.priority.toUpperCase()}
                            </Chip>
                          </div>
                          <Chip size="sm" variant="flat" color={getStatusColor(incident.status)}>
                            {incident.status}
                          </Chip>
                        </div>
                        <p className="text-white font-medium mb-1">{incident.type}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">📍 {incident.location}</span>
                          <span className="text-gray-500">{incident.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* On Duty Firefighters */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    On Duty Crew
                  </h3>
                  <div className="space-y-3">
                    {onDutyFirefighters.map((firefighter, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Avatar
                          name={firefighter.name}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{firefighter.name}</p>
                            <Chip size="sm" variant="flat" color="danger">{firefighter.unit}</Chip>
                          </div>
                          <p className="text-xs text-gray-400">{firefighter.rank} - {firefighter.station}</p>
                        </div>
                        <Chip size="sm" variant="flat" color={getStatusColor(firefighter.status.toLowerCase())}>
                          {firefighter.status}
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
                        <span className="text-white font-medium">4.1 min</span>
                      </div>
                      <Progress value={88} color="success" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Fire Containment Rate</span>
                        <span className="text-white font-medium">92%</span>
                      </div>
                      <Progress value={92} color="primary" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Equipment Readiness</span>
                        <span className="text-white font-medium">95%</span>
                      </div>
                      <Progress value={95} color="warning" size="sm" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Department Activity</span>
                        <span className="text-white font-medium">Moderate</span>
                      </div>
                      <Progress value={65} color="secondary" size="sm" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Apparatus & Equipment */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Apparatus Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Fire Engines</p>
                          <p className="text-xs text-gray-400">Available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">4/6</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Ladder Trucks</p>
                          <p className="text-xs text-gray-400">Operational</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">2/3</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Droplet className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Water Capacity</p>
                          <p className="text-xs text-gray-400">Per Unit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">500gal</p>
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
              <h2 className="text-2xl font-bold text-white mb-4">Fire Department Leadership</h2>
              <p className="text-gray-400">Leadership roster and chain of command coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "roster" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Fire Department Roster</h2>
              <p className="text-gray-400">Full department roster coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "ranks" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Fire Department Ranks</h2>
              <p className="text-gray-400">Rank structure and progression information coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "sops" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Standard Operating Procedures</h2>
              <p className="text-gray-400">Department SOPs and guidelines coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "stations" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Fire Stations</h2>
              <p className="text-gray-400">Station locations and information coming soon...</p>
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
                  <Chip color="danger" variant="flat" className="mt-2">Fire Department</Chip>
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
