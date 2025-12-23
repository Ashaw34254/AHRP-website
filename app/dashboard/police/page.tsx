"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Card, 
  CardBody,
  Button,
  Tabs,
  Tab,
  Avatar,
  Chip
} from "@nextui-org/react";
import { 
  Shield,
  Users,
  Building2,
  FileText,
  Award,
  Clock,
  MapPin,
  Phone,
  Radio,
  Car,
  Target,
  AlertTriangle,
  Home,
  GraduationCap,
  User,
  Flame
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getDepartmentSettings, type DepartmentSettings } from "@/lib/department-settings";
import { useMemo, useState, useEffect } from "react";

export default function PoliceDashboardPage() {
  const { data: session } = useSession();
  const [deptSettings, setDeptSettings] = useState<DepartmentSettings | null>(null);
  const [selectedTab, setSelectedTab] = useState("home");

  // Fetch department settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/departments");
        if (response.ok) {
          const data = await response.json();
          setDeptSettings(data.POLICE);
        } else {
          // Fallback to defaults
          setDeptSettings(getDepartmentSettings("POLICE"));
        }
      } catch (error) {
        console.error("Failed to load department settings:", error);
        setDeptSettings(getDepartmentSettings("POLICE"));
      }
    }
    loadSettings();
  }, []);

  // Show loading state
  if (!deptSettings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading department settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stations = [
    {
      name: "Mission Row Station",
      address: "1200 Mission Row, Downtown",
      phone: "(555) 0100",
      staff: 45,
      status: "Active",
      image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=300&fit=crop"
    },
    {
      name: "Vespucci Police Station",
      address: "440 Vespucci Blvd",
      phone: "(555) 0101",
      staff: 28,
      status: "Active",
      image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=400&h=300&fit=crop"
    },
    {
      name: "Paleto Bay Sheriff",
      address: "101 Great Ocean Hwy",
      phone: "(555) 0102",
      staff: 15,
      status: "Active",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop"
    }
  ];

  const ranks = [
    { name: "Chief of Police", officers: 1, color: "danger" },
    { name: "Captain", officers: 3, color: "warning" },
    { name: "Lieutenant", officers: 5, color: "primary" },
    { name: "Sergeant", officers: 8, color: "secondary" },
    { name: "Senior Officer", officers: 12, color: "success" },
    { name: "Officer", officers: 35, color: "default" },
    { name: "Cadet", officers: 8, color: "default" }
  ];

  const announcements = [
    { title: "New Traffic Policy Update", date: "Dec 14, 2025", type: "Policy" },
    { title: "Promotion Ceremony - Friday 6PM", date: "Dec 13, 2025", type: "Event" },
    { title: "Equipment Maintenance Schedule", date: "Dec 12, 2025", type: "Notice" },
    { title: "Monthly Performance Review", date: "Dec 10, 2025", type: "Review" }
  ];

  const departments = [
    { name: "Patrol Division", members: 42, icon: Car },
    { name: "Traffic Division", members: 18, icon: Target },
    { name: "Detective Bureau", members: 12, icon: FileText },
    { name: "SWAT Unit", members: 8, icon: Shield },
    { name: "K9 Unit", members: 6, icon: AlertTriangle },
    { name: "Training Division", members: 5, icon: Award }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Department Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16 text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white">
                Aurora Horizon Police Department
              </h1>
              <p className="text-blue-100 text-lg mt-1">To Serve and Protect</p>
            </div>
          </div>
        </div>

        {/* Department Navigation Menu */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            variant="underlined"
            classNames={{
              base: "w-full",
              tabList: "gap-6 w-full p-4 border-b-0",
              cursor: "bg-indigo-600",
              tab: "h-10",
              tabContent: "group-data-[selected=true]:text-indigo-400 text-gray-400"
            }}
          >
            <Tab
              key="home"
              title={
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
              }
            />
            <Tab
              key="leadership"
              title={
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Leadership</span>
                </div>
              }
            />
            <Tab
              key="roster"
              title={
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Roster</span>
                </div>
              }
            />
            <Tab
              key="ranks"
              title={
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Ranks</span>
                </div>
              }
            />
            <Tab
              key="sops"
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>SOPs</span>
                </div>
              }
            />
            <Tab
              key="stations"
              title={
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Stations</span>
                </div>
              }
            />
            <Tab
              key="training"
              title={
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Training</span>
                </div>
              }
            />
            <Tab
              key="profile"
              title={
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </div>
              }
            />
          </Tabs>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === "home" && (
          <>
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 border border-indigo-700">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-12 h-12 flex-shrink-0 text-indigo-400" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Welcome to Aurora Horizon Police Department
                    </h2>
                    <p className="text-lg italic text-indigo-300 mb-4">
                      "To Serve and Protect"
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      The Aurora Horizon Police Department is dedicated to maintaining public safety, 
                      upholding the law, and serving our community with integrity and professionalism. 
                      Our officers are committed to building trust and partnerships with the citizens we protect.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">72</p>
                  <p className="text-sm text-gray-400">Total Officers</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Radio className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-sm text-gray-400">On Duty</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-sm text-gray-400">Stations</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">18</p>
                  <p className="text-sm text-gray-400">Fleet Vehicles</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Quick Access
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                color="primary" 
                variant="flat" 
                size="lg"
                className="h-24 flex flex-col gap-2"
                onPress={() => window.location.href = '/dashboard/police/cad'}
              >
                <Shield className="w-8 h-8" />
                <span className="text-sm font-semibold">CAD System</span>
              </Button>
              <Button 
                color="primary" 
                variant="flat" 
                size="lg"
                className="h-24 flex flex-col gap-2"
              >
                <FileText className="w-8 h-8" />
                <span className="text-sm font-semibold">Reports</span>
              </Button>
              <Button 
                color="primary" 
                variant="flat" 
                size="lg"
                className="h-24 flex flex-col gap-2"
              >
                <GraduationCap className="w-8 h-8" />
                <span className="text-sm font-semibold">Training</span>
              </Button>
              <Button 
                color="primary" 
                variant="flat" 
                size="lg"
                className="h-24 flex flex-col gap-2"
              >
                <User className="w-8 h-8" />
                <span className="text-sm font-semibold">My Profile</span>
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Announcements */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Recent Announcements
              </h3>
              <div className="space-y-3">
                {(deptSettings.announcements || []).slice(0, 4).map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-medium text-sm">{announcement.title}</p>
                      {announcement.urgent && (
                        <Chip size="sm" color="danger" variant="flat">Urgent</Chip>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {announcement.date}
                      <span className="text-gray-600">•</span>
                      <Chip size="sm" variant="dot" color="primary">{announcement.type}</Chip>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="light" color="primary" className="w-full">
                  View All Announcements
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {(deptSettings.events || []).slice(0, 4).map((event) => (
                  <div key={event.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-white font-medium text-sm mb-2">{event.title}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-xs text-indigo-400 mt-1">{event.time}</p>
                  </div>
                ))}
                <Button size="sm" variant="light" color="primary" className="w-full">
                  View Calendar
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Department Performance */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              This Month's Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Calls", value: "1,247", change: "+8%", positive: true },
                { label: "Response Time", value: "4.2 min", change: "-12%", positive: true },
                { label: "Arrests Made", value: "156", change: "+15%", positive: true },
                { label: "Citations Issued", value: "892", change: "+3%", positive: true }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-800/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color={stat.positive ? "success" : "danger"}
                    startContent={stat.positive ? <Target className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  >
                    {stat.change}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Active Units & Training Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Units Overview */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-400" />
                Active Units
              </h3>
              <div className="space-y-3">
                {[
                  { unit: "Patrol", active: 12, total: 18, color: "primary" },
                  { unit: "Traffic", active: 4, total: 6, color: "secondary" },
                  { unit: "K9 Unit", active: 2, total: 3, color: "warning" },
                  { unit: "SWAT", active: 0, total: 8, color: "danger" },
                  { unit: "Detectives", active: 5, total: 8, color: "success" }
                ].map((division, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${division.color}-900/30 rounded-lg flex items-center justify-center`}>
                        <Car className={`w-5 h-5 text-${division.color}-400`} />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{division.unit}</p>
                        <p className="text-xs text-gray-400">{division.active} of {division.total} on duty</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{Math.round((division.active / division.total) * 100)}%</p>
                      <p className="text-xs text-gray-400">Available</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Training Reminders */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Training Status
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Firearms Qualification", due: "Due in 45 days", progress: 100, status: "Complete" },
                  { name: "De-escalation Training", due: "Due in 30 days", progress: 75, status: "In Progress" },
                  { name: "First Aid Certification", due: "Due in 15 days", progress: 0, status: "Not Started" },
                  { name: "Legal Updates 2026", due: "Overdue", progress: 0, status: "Overdue" }
                ].map((training, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-sm text-white font-medium">{training.name}</p>
                        <p className="text-xs text-gray-400">{training.due}</p>
                      </div>
                      <Chip 
                        size="sm" 
                        variant="flat"
                        color={
                          training.status === "Complete" ? "success" :
                          training.status === "In Progress" ? "primary" :
                          training.status === "Overdue" ? "danger" : "default"
                        }
                      >
                        {training.status}
                      </Chip>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          training.progress === 100 ? 'bg-green-500' :
                          training.progress > 0 ? 'bg-blue-500' : 'bg-gray-700'
                        }`}
                        style={{ width: `${training.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="flat" color="primary" className="w-full mt-2">
                  View All Training
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Department News */}
        <Card className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border border-indigo-800/50">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Department News & Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(deptSettings.news || []).map((news) => (
                <div key={news.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-indigo-600 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3 mb-3">
                    <Shield className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">{news.title}</h4>
                      <p className="text-xs text-gray-400">{news.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{news.date}</span>
                    <Button size="sm" variant="light" color="primary">Read More</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
          </>
        )}

        {/* Leadership Tab */}
        {selectedTab === "leadership" && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-400" />
                  Command Staff
                </h3>
                
                {/* Chief of Police */}
                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-900/30 to-gray-900/30 rounded-lg border border-indigo-700">
                  <div className="flex items-start gap-6">
                    <Avatar
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=chief"
                      className="w-24 h-24"
                      isBordered
                      color="primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-bold text-white">Chief John Richardson</h4>
                        <Chip color="danger" variant="flat">Chief of Police</Chip>
                      </div>
                      <p className="text-gray-400 mb-4">
                        <strong>Badge #1001</strong> • 25 Years of Service
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        Chief Richardson has been leading the Aurora Horizon Police Department for the past 8 years. 
                        With over two decades of law enforcement experience, he is committed to community-focused policing 
                        and officer development. His leadership emphasizes transparency, accountability, and building trust 
                        within the community.
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" color="primary" variant="flat" startContent={<Phone className="w-4 h-4" />}>
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deputy Chiefs & Captains */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "Captain Sarah Martinez",
                      rank: "Captain - Patrol Division",
                      badge: "1012",
                      years: 18,
                      bio: "Oversees all patrol operations and field units. Specializes in tactical response and crisis management.",
                      seed: "captain1"
                    },
                    {
                      name: "Captain Michael Chen",
                      rank: "Captain - Investigations",
                      badge: "1015",
                      years: 20,
                      bio: "Leads the detective bureau and special investigations unit. Expert in major crimes and forensics.",
                      seed: "captain2"
                    },
                    {
                      name: "Lieutenant James Foster",
                      rank: "Lieutenant - Training",
                      badge: "1023",
                      years: 15,
                      bio: "Directs all training programs, academy operations, and officer development initiatives.",
                      seed: "lieutenant1"
                    },
                    {
                      name: "Lieutenant Rebecca Stone",
                      rank: "Lieutenant - Traffic",
                      badge: "1027",
                      years: 14,
                      bio: "Commands the traffic division and DUI enforcement. Focuses on road safety and accident prevention.",
                      seed: "lieutenant2"
                    }
                  ].map((leader, i) => (
                    <Card key={i} className="bg-gray-800/50 border border-gray-700">
                      <CardBody className="p-5">
                        <div className="flex items-start gap-4">
                          <Avatar
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.seed}`}
                            className="w-16 h-16"
                            isBordered
                          />
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-1">{leader.name}</h4>
                            <Chip size="sm" color="warning" variant="flat" className="mb-2">
                              {leader.rank}
                            </Chip>
                            <p className="text-sm text-gray-400 mb-3">
                              Badge #{leader.badge} • {leader.years} Years
                            </p>
                            <p className="text-sm text-gray-300">{leader.bio}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Roster Tab */}
        {selectedTab === "roster" && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-400" />
                    Active Roster
                  </h3>
                  <div className="flex gap-2">
                    <Chip color="success" variant="flat">24 On Duty</Chip>
                    <Chip color="default" variant="flat">72 Total</Chip>
                  </div>
                </div>

                {/* Roster by Rank */}
                {[
                  { rank: "Command Staff", officers: ["Chief Richardson", "Capt. Martinez", "Capt. Chen"], color: "danger" },
                  { rank: "Supervisors", officers: ["Lt. Foster", "Lt. Stone", "Sgt. Johnson", "Sgt. Williams", "Sgt. Davis"], color: "warning" },
                  { rank: "Senior Officers", officers: ["Off. Thompson", "Off. Anderson", "Off. Garcia", "Off. Miller", "Off. Wilson", "Off. Moore", "Off. Taylor", "Off. Brown"], color: "primary" },
                  { rank: "Patrol Officers", officers: Array(35).fill(null).map((_, i) => `Officer ${i + 1}`).slice(0, 8), color: "secondary" },
                  { rank: "Cadets", officers: ["Cadet Rodriguez", "Cadet Lee", "Cadet Martinez", "Cadet Clark"], color: "default" }
                ].map((group, i) => (
                  <div key={i} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Chip color={group.color as any} variant="flat">{group.rank}</Chip>
                      <span className="text-sm text-gray-500">({group.officers.length})</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {group.officers.map((officer, j) => (
                        <Card key={j} className="bg-gray-800/30 border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer">
                          <CardBody className="p-3">
                            <div className="flex flex-col items-center text-center gap-2">
                              <Avatar
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${officer}`}
                                size="sm"
                              />
                              <div>
                                <p className="text-sm font-medium text-white">{officer}</p>
                                <Chip size="sm" variant="dot" color={Math.random() > 0.5 ? "success" : "default"} className="mt-1">
                                  {Math.random() > 0.5 ? "On Duty" : "Off Duty"}
                                </Chip>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        )}

        {/* Ranks Tab */}
        {selectedTab === "ranks" && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-400" />
                  Department Rank Structure
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      rank: "Chief of Police",
                      badge: "Gold Shield with Eagle",
                      requirements: "Appointed by City Council",
                      salary: "$125,000 - $150,000",
                      responsibilities: "Overall command and strategic direction of the department. Reports directly to the Mayor.",
                      color: "danger",
                      icon: "⭐⭐⭐⭐"
                    },
                    {
                      rank: "Captain",
                      badge: "Gold Shield with 2 Bars",
                      requirements: "15+ years, Lieutenant exam",
                      salary: "$95,000 - $115,000",
                      responsibilities: "Command of major divisions (Patrol, Investigations, Special Operations). Oversee lieutenants and sergeants.",
                      color: "warning",
                      icon: "⭐⭐⭐"
                    },
                    {
                      rank: "Lieutenant",
                      badge: "Silver Shield with 1 Bar",
                      requirements: "10+ years, Sergeant exam",
                      salary: "$75,000 - $90,000",
                      responsibilities: "Shift command and supervision. Manage multiple units and ensure policy compliance.",
                      color: "primary",
                      icon: "⭐⭐"
                    },
                    {
                      rank: "Sergeant",
                      badge: "Silver Shield with 3 Stripes",
                      requirements: "7+ years, promotion exam",
                      salary: "$65,000 - $78,000",
                      responsibilities: "Direct supervision of patrol officers. First-line leadership and field training oversight.",
                      color: "secondary",
                      icon: "⭐"
                    },
                    {
                      rank: "Senior Officer",
                      badge: "Bronze Shield with Chevron",
                      requirements: "5+ years, exemplary service",
                      salary: "$55,000 - $68,000",
                      responsibilities: "Lead patrol units, mentor junior officers, handle complex calls independently.",
                      color: "success",
                      icon: "▲"
                    },
                    {
                      rank: "Police Officer",
                      badge: "Bronze Shield",
                      requirements: "Academy graduate, probation complete",
                      salary: "$45,000 - $58,000",
                      responsibilities: "Patrol operations, respond to calls, enforce laws, community engagement.",
                      color: "primary",
                      icon: "●"
                    },
                    {
                      rank: "Cadet",
                      badge: "Training Badge",
                      requirements: "Academy enrollment",
                      salary: "$38,000 - $42,000",
                      responsibilities: "Complete academy training, ride-alongs, supervised patrol under FTO guidance.",
                      color: "default",
                      icon: "○"
                    }
                  ].map((rankDetail, i) => (
                    <Card key={i} className="bg-gray-800/50 border border-gray-700 hover:border-indigo-500 transition-colors">
                      <CardBody className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{rankDetail.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="text-xl font-bold text-white">{rankDetail.rank}</h4>
                              <Chip color={rankDetail.color as any} variant="flat" size="sm">
                                {rankDetail.badge}
                              </Chip>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400 mb-1"><strong>Requirements:</strong></p>
                                <p className="text-gray-300">{rankDetail.requirements}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 mb-1"><strong>Salary Range:</strong></p>
                                <p className="text-green-400 font-semibold">{rankDetail.salary}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-gray-400 mb-1"><strong>Key Responsibilities:</strong></p>
                                <p className="text-gray-300">{rankDetail.responsibilities}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>

                {/* Promotion Requirements */}
                <Card className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 border border-indigo-700 mt-6">
                  <CardBody className="p-5">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-400" />
                      General Promotion Requirements
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>Minimum time in current rank must be met</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>Written examination and oral board interview</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>No disciplinary actions within 2 years</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>Recommendation from current supervisor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>Completion of required training courses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>Physical fitness and psychological evaluation</span>
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </div>
        )}

        {/* SOPs Tab */}
        {selectedTab === "sops" && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  Standard Operating Procedures
                </h3>

                {/* SOP Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      category: "Patrol Operations",
                      icon: Car,
                      count: 12,
                      updated: "Dec 15, 2025",
                      procedures: [
                        "Traffic Stop Procedures",
                        "Pursuit Guidelines",
                        "Vehicle Search Protocol",
                        "DUI Investigation",
                        "Accident Investigation"
                      ]
                    },
                    {
                      category: "Use of Force",
                      icon: Shield,
                      count: 8,
                      updated: "Dec 10, 2025",
                      procedures: [
                        "Force Continuum",
                        "Firearm Discharge",
                        "Less-Lethal Options",
                        "De-escalation Techniques",
                        "Incident Reporting"
                      ]
                    },
                    {
                      category: "Investigations",
                      icon: Target,
                      count: 15,
                      updated: "Dec 5, 2025",
                      procedures: [
                        "Crime Scene Processing",
                        "Evidence Collection",
                        "Interview Techniques",
                        "Surveillance Operations",
                        "Case Documentation"
                      ]
                    },
                    {
                      category: "Emergency Response",
                      icon: AlertTriangle,
                      count: 10,
                      updated: "Nov 28, 2025",
                      procedures: [
                        "Active Shooter Response",
                        "Hostage Situations",
                        "SWAT Activation",
                        "Emergency Notifications",
                        "Mass Casualty Events"
                      ]
                    },
                    {
                      category: "Administrative",
                      icon: FileText,
                      count: 20,
                      updated: "Nov 20, 2025",
                      procedures: [
                        "Report Writing Standards",
                        "Chain of Command",
                        "Uniform Regulations",
                        "Equipment Maintenance",
                        "Time Off Requests"
                      ]
                    },
                    {
                      category: "Community Relations",
                      icon: Users,
                      count: 7,
                      updated: "Nov 15, 2025",
                      procedures: [
                        "Public Interaction Guidelines",
                        "Media Relations",
                        "Community Events",
                        "Complaint Procedures",
                        "Transparency Standards"
                      ]
                    }
                  ].map((sop, i) => {
                    const Icon = sop.icon;
                    return (
                      <Card key={i} className="bg-gray-800/50 border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer">
                        <CardBody className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                <Icon className="w-6 h-6 text-indigo-400" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-white">{sop.category}</h4>
                                <p className="text-sm text-gray-400">{sop.count} procedures</p>
                              </div>
                            </div>
                            <Chip size="sm" variant="flat" color="success">Updated</Chip>
                          </div>
                          <div className="space-y-2 mb-3">
                            {sop.procedures.map((proc, j) => (
                              <div key={j} className="flex items-center gap-2 text-sm text-gray-300 hover:text-indigo-400 transition-colors">
                                <span className="text-indigo-500">→</span>
                                {proc}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                            <span className="text-xs text-gray-500">Last Updated: {sop.updated}</span>
                            <Button size="sm" variant="flat" color="primary">View All</Button>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>

                {/* Quick Access */}
                <Card className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 border border-indigo-700 mt-6">
                  <CardBody className="p-5">
                    <h4 className="text-lg font-bold text-white mb-3">Quick Access Documents</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Officer Safety Manual", "Radio Codes", "10-Codes Reference", "Penal Code Quick Guide"].map((doc, i) => (
                        <Button key={i} variant="flat" color="primary" size="sm" className="h-auto py-3">
                          <div className="flex flex-col items-center gap-1">
                            <FileText className="w-5 h-5" />
                            <span className="text-xs text-center">{doc}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Stations Tab */}
        {selectedTab === "stations" && (
          <div className="space-y-6">
            {stations.map((station, i) => (
              <Card key={i} className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Station Image */}
                    <div className="relative h-64 lg:h-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-gray-900 flex items-center justify-center">
                        <Building2 className="w-24 h-24 text-gray-600" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Chip color="success" variant="flat">{station.status}</Chip>
                      </div>
                    </div>

                    {/* Station Details */}
                    <div className="lg:col-span-2 p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{station.name}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Address</p>
                              <p className="text-white font-medium">{station.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-indigo-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Emergency Line</p>
                              <p className="text-white font-medium">{station.phone}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-indigo-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Personnel</p>
                              <p className="text-white font-medium">{station.staff} Officers</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-indigo-400 mt-1" />
                            <div>
                              <p className="text-sm text-gray-400">Hours</p>
                              <p className="text-white font-medium">24/7 Operations</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Station Stats */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{Math.floor(Math.random() * 50) + 20}</p>
                          <p className="text-xs text-gray-400">Vehicles</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-400">{Math.floor(Math.random() * 10) + 5}</p>
                          <p className="text-xs text-gray-400">Units Active</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">{Math.floor(Math.random() * 100) + 50}</p>
                          <p className="text-xs text-gray-400">Calls This Week</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" color="primary" variant="flat">Get Directions</Button>
                        <Button size="sm" color="default" variant="flat">View Roster</Button>
                        <Button size="sm" color="default" variant="flat">Station Reports</Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Training Tab */}
        {selectedTab === "training" && (
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
                  Training & Development
                </h3>

                {/* Upcoming Training */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-4">Upcoming Training Sessions</h4>
                  <div className="space-y-3">
                    {[
                      { title: "Active Shooter Response", date: "Dec 28, 2025", time: "08:00 - 16:00", instructor: "Sgt. Williams", seats: "5/20" },
                      { title: "De-escalation Techniques", date: "Jan 5, 2026", time: "13:00 - 17:00", instructor: "Lt. Foster", seats: "12/15" },
                      { title: "Firearms Qualification", date: "Jan 10, 2026", time: "09:00 - 15:00", instructor: "Off. Thompson", seats: "8/25" },
                      { title: "Legal Updates 2026", date: "Jan 15, 2026", time: "14:00 - 18:00", instructor: "Chief Richardson", seats: "Open" }
                    ].map((training, i) => (
                      <Card key={i} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="text-lg font-bold text-white">{training.title}</h5>
                                <Chip size="sm" color="primary" variant="flat">{training.seats}</Chip>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {training.date} • {training.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {training.instructor}
                                </span>
                              </div>
                            </div>
                            <Button size="sm" color="primary" variant="flat">Register</Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Training Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { category: "Mandatory Annual", courses: 8, hours: 40, icon: AlertTriangle, color: "danger" },
                    { category: "Professional Development", courses: 15, hours: 80, icon: Award, color: "primary" },
                    { category: "Specialized Skills", courses: 12, hours: 120, icon: Target, color: "warning" }
                  ].map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <Card key={i} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 bg-${cat.color}-900/30 rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 text-${cat.color}-400`} />
                            </div>
                            <div>
                              <h5 className="font-bold text-white">{cat.category}</h5>
                              <p className="text-sm text-gray-400">{cat.courses} courses</p>
                            </div>
                          </div>
                          <div className="text-center py-2 bg-gray-900/50 rounded">
                            <p className="text-2xl font-bold text-white">{cat.hours}</p>
                            <p className="text-xs text-gray-400">Training Hours</p>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* My Profile Tab */}
        {selectedTab === "profile" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar
                      src={session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`}
                      className="w-32 h-32 mb-4"
                      isBordered
                      color="primary"
                    />
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {session?.user?.name || "Officer Name"}
                    </h3>
                    <Chip color="primary" variant="flat" className="mb-3">Police Officer</Chip>
                    <p className="text-gray-400 text-sm mb-4">Badge #2047</p>
                    
                    <div className="w-full space-y-2 text-left">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Department:</span>
                        <span className="text-white">Patrol Division</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shift:</span>
                        <span className="text-white">Day Watch</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Years of Service:</span>
                        <span className="text-white">3 years</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <Chip size="sm" color="success" variant="dot">Active</Chip>
                      </div>
                    </div>

                    <Button color="primary" variant="flat" className="w-full mt-4">
                      Edit Profile
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Stats & Training */}
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Stats */}
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Performance Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Calls Responded", value: "487", color: "primary" },
                        { label: "Arrests Made", value: "23", color: "warning" },
                        { label: "Citations Issued", value: "156", color: "secondary" },
                        { label: "Commendations", value: "5", color: "success" }
                      ].map((stat, i) => (
                        <div key={i} className="text-center p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Training Progress */}
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-white">Training Progress</h4>
                      <Chip color="success" variant="flat">85% Complete</Chip>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Firearms Qualification", progress: 100, status: "Complete", date: "Dec 1, 2025" },
                        { name: "De-escalation Training", progress: 100, status: "Complete", date: "Nov 15, 2025" },
                        { name: "First Aid/CPR", progress: 75, status: "In Progress", date: "Due Jan 10" },
                        { name: "Legal Updates 2026", progress: 0, status: "Pending", date: "Starts Jan 15" }
                      ].map((training, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white">{training.name}</span>
                            <span className="text-xs text-gray-400">{training.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  training.progress === 100 ? 'bg-green-500' : 
                                  training.progress > 0 ? 'bg-blue-500' : 'bg-gray-700'
                                }`}
                                style={{ width: `${training.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-16 text-right">{training.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Links */}
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="flat" color="primary" className="h-20 flex flex-col gap-2">
                        <FileText className="w-6 h-6" />
                        <span className="text-xs">My Reports</span>
                      </Button>
                      <Button variant="flat" color="primary" className="h-20 flex flex-col gap-2">
                        <Clock className="w-6 h-6" />
                        <span className="text-xs">Time Sheets</span>
                      </Button>
                      <Button variant="flat" color="primary" className="h-20 flex flex-col gap-2">
                        <Award className="w-6 h-6" />
                        <span className="text-xs">Certifications</span>
                      </Button>
                      <Button variant="flat" color="primary" className="h-20 flex flex-col gap-2">
                        <User className="w-6 h-6" />
                        <span className="text-xs">Settings</span>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
