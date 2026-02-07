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
} from "@heroui/react";
import { 
  Skull,
  Users,
  Target,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Crown,
  Shield,
  Award,
  UserCircle,
  Siren,
  Flame
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CriminalDashboardPage() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState("home");
  const [reputation] = useState(8750);
  const [gangMembers] = useState(12);
  const [territory] = useState(4);
  const [wantedLevel] = useState(0);

  const gangMembersList = [
    { name: "Marcus \"King\" Rodriguez", rank: "Leader", status: "Online", reputation: 15420 },
    { name: "Diana \"Shadow\" Chen", rank: "Lieutenant", status: "Online", reputation: 12800 },
    { name: "Tommy \"Ghost\" Marino", rank: "Enforcer", status: "Offline", reputation: 9500 },
    { name: "Alex \"Blaze\" Thompson", rank: "Member", status: "Online", reputation: 4200 },
  ];

  const controlledTerritories = [
    { name: "Grove Street", control: 85, status: "Secure", income: "$5,000/day" },
    { name: "El Burro Heights", control: 60, status: "Contested", income: "$3,200/day" },
    { name: "Davis", control: 45, status: "At Risk", income: "$2,500/day" },
    { name: "Strawberry", control: 92, status: "Secure", income: "$6,500/day" },
  ];

  const recentActivities = [
    { action: "Territory Defense", result: "Success", reward: "+250 Rep", time: "1 hour ago" },
    { action: "Business Income", result: "Collected", reward: "+$15,000", time: "3 hours ago" },
    { action: "Gang War", result: "Victory", reward: "+500 Rep", time: "6 hours ago" },
    { action: "Turf Expansion", result: "Success", reward: "+$8,000", time: "1 day ago" },
  ];

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "secure": return "success";
      case "contested": return "warning";
      case "at risk": return "danger";
      default: return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-red-600 via-orange-600 to-red-800 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative h-full flex items-center px-6">
            <Skull className="w-16 h-16 text-white mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">Criminal Empire</h1>
              <p className="text-red-100">Rule the Streets, Build Your Legacy</p>
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
                  <Skull className="w-4 h-4" />
                  <span>Home</span>
                </div>
              } />
              <Tab key="gang" title={
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Gang</span>
                </div>
              } />
              <Tab key="territory" title={
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Territory</span>
                </div>
              } />
              <Tab key="operations" title={
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Operations</span>
                </div>
              } />
              <Tab key="reputation" title={
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Reputation</span>
                </div>
              } />
              <Tab key="wanted" title={
                <div className="flex items-center space-x-2">
                  <Siren className="w-4 h-4" />
                  <span>Wanted Status</span>
                </div>
              } />
              <Tab key="profile" title={
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-4 h-4" />
                  <span>Profile</span>
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
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to the Underworld</h2>
                <p className="text-gray-300 mb-4">
                  Build your criminal empire from the ground up. Form or join gangs, control territory, 
                  run illegal operations, and establish your reputation on the streets. Every decision matters 
                  in the dangerous world of organized crime.
                </p>
                <p className="text-gray-300">
                  Defend your turf, expand your influence, and rise through the ranks. But beware - the police 
                  are always watching, and rival gangs won't give up their territory without a fight.
                </p>
              </CardBody>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-purple-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Crown className="w-8 h-8 text-purple-400" />
                    <Chip color="secondary" variant="flat" size="sm">Status</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{reputation.toLocaleString()}</div>
                  <p className="text-sm text-gray-400">Reputation</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-red-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-red-400" />
                    <Chip color="danger" variant="flat" size="sm">Active</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{gangMembers}</div>
                  <p className="text-sm text-gray-400">Gang Members</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/30 to-gray-900/50 border border-orange-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="w-8 h-8 text-orange-400" />
                    <Chip color="warning" variant="flat" size="sm">Controlled</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{territory}</div>
                  <p className="text-sm text-gray-400">Territories</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-green-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-8 h-8 text-green-400" />
                    <Chip color="success" variant="flat" size="sm">Clear</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{wantedLevel} ⭐</div>
                  <p className="text-sm text-gray-400">Wanted Level</p>
                </CardBody>
              </Card>
            </div>

            {/* Gang Members & Territory Control */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gang Members */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Gang Members
                  </h3>
                  <div className="space-y-3">
                    {gangMembersList.map((member, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <Avatar
                          name={member.name}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">{member.name}</p>
                            {member.rank === "Leader" && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <p className="text-xs text-gray-400">{member.rank} • {member.reputation.toLocaleString()} Rep</p>
                        </div>
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color={member.status === "Online" ? "success" : "default"}
                        >
                          {member.status}
                        </Chip>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Territory Control */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Controlled Territory
                  </h3>
                  <div className="space-y-3">
                    {controlledTerritories.map((area, i) => (
                      <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">{area.name}</p>
                          <Chip size="sm" variant="flat" color={getStatusColor(area.status)}>
                            {area.status}
                          </Chip>
                        </div>
                        <Progress value={area.control} color={getStatusColor(area.status)} size="sm" className="mb-2" />
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Control: {area.control}%</span>
                          <span className="text-green-400">{area.income}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Recent Activities & Empire Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activities
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium text-sm">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip 
                              size="sm" 
                              variant="flat" 
                              color={activity.result === "Success" || activity.result === "Victory" || activity.result === "Collected" ? "success" : "danger"}
                            >
                              {activity.result}
                            </Chip>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                          </div>
                        </div>
                        <span className="font-bold text-green-400">{activity.reward}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Empire Stats */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Empire Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-white font-medium text-sm mb-1">Daily Income</p>
                      <p className="text-2xl font-bold text-green-400">$17,200</p>
                      <p className="text-xs text-gray-400 mt-1">From all territories</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-white font-medium text-sm mb-1">Gang Strength</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={75} color="danger" size="sm" className="flex-1" />
                        <span className="text-white font-bold">75%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Based on members & territory</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-white font-medium text-sm mb-1">Total Operations</p>
                      <p className="text-2xl font-bold text-purple-400">142</p>
                      <p className="text-xs text-gray-400 mt-1">Successful missions completed</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        )}

        {selectedTab === "gang" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Gang Management</h2>
              <p className="text-gray-400">Gang member management and recruitment coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "territory" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Territory Control</h2>
              <p className="text-gray-400">Territory map and control system coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "operations" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Criminal Operations</h2>
              <p className="text-gray-400">Mission planning and heist management coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "reputation" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Reputation System</h2>
              <p className="text-gray-400">Reputation levels and perks coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "wanted" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Wanted Status</h2>
              <p className="text-gray-400">Wanted level tracking and heat management coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "profile" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Criminal Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  name={session?.user?.name || "User"}
                  src={session?.user?.image || undefined}
                  className="w-20 h-20"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{session?.user?.name || "Anonymous"}</h3>
                  <p className="text-gray-400">{session?.user?.email}</p>
                  <Chip color="danger" variant="flat" className="mt-2">Criminal</Chip>
                </div>
              </div>
              <p className="text-gray-400">Criminal record and achievements coming soon...</p>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
