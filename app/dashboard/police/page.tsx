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
  AlertTriangle
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getDepartmentSettings } from "@/lib/department-settings";
import { useMemo } from "react";

export default function PoliceDashboardPage() {
  const { data: session } = useSession();
  const deptSettings = useMemo(() => getDepartmentSettings("POLICE"), []);

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{deptSettings.theme.displayName}</h1>
            <p className="text-gray-400">Welcome back, {session?.user?.name || "Officer"}</p>
          </div>
          <Chip 
            size="lg" 
            variant="flat" 
            startContent={<Shield className="w-4 h-4" />}
            style={{ 
              backgroundColor: `${deptSettings.theme.primaryColor}20`,
              color: deptSettings.theme.primaryColor 
            }}
          >
            {deptSettings.theme.name.split(" ")[0].toUpperCase()}
          </Chip>
        </div>

        {/* Welcome Section */}
        <Card 
          className="border-2"
          style={{
            background: `${deptSettings.theme.primaryColor}10`,
            borderColor: deptSettings.theme.primaryColor,
          }}
        >
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <Shield 
                className="w-12 h-12 flex-shrink-0" 
                style={{ color: deptSettings.theme.accentColor }}
              />
              <div>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
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
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Radio className="w-6 h-6 text-green-400" />
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
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-400" />
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

        {/* Stations */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Our Stations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stations.map((station, i) => (
                <div key={i} className="group">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <Chip color="success" size="sm" variant="flat">{station.status}</Chip>
                    </div>
                    {/* Placeholder for station image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-gray-900 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-600" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{station.name}</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {station.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {station.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {station.staff} Officers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Departments & Ranks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Departments */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Divisions & Units
              </h3>
              <div className="space-y-3">
                {departments.map((dept, i) => {
                  const Icon = dept.icon;
                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-white font-medium">{dept.name}</span>
                      </div>
                      <Chip size="sm" variant="flat" color="primary">{dept.members} members</Chip>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Rank Structure */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Rank Structure
              </h3>
              <div className="space-y-3">
                {ranks.map((rank, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Chip size="sm" variant="flat" color={rank.color as any}>
                        {i + 1}
                      </Chip>
                      <span className="text-white font-medium">{rank.name}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{rank.officers} officers</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Announcements */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Latest Announcements
            </h3>
            <div className="space-y-3">
              {announcements.map((announcement, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-white font-medium">{announcement.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {announcement.date}
                        </span>
                        <Chip size="sm" variant="flat" color="primary">{announcement.type}</Chip>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="flat" color="primary">View</Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
