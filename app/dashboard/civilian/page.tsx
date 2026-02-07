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
  Briefcase,
  Users,
  Home,
  Car,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  MapPin,
  FileText,
  Award,
  UserCircle,
  Building2,
  Wallet
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CivilianDashboardPage() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState("home");
  const [bankBalance] = useState(45250);
  const [properties] = useState(2);
  const [vehicles] = useState(3);
  const [jobLevel] = useState(7);

  const ownedProperties = [
    { name: "Downtown Apartment", location: "Mirror Park", value: "$125,000", type: "Residential" },
    { name: "Auto Repair Shop", location: "La Mesa", value: "$250,000", type: "Business" },
  ];

  const ownedVehicles = [
    { name: "Benefactor Schafter", plate: "CIV-001", condition: "Excellent", location: "Home Garage" },
    { name: "Declasse Burrito", plate: "BUS-042", condition: "Good", location: "Business" },
    { name: "Pegassi Faggio", plate: "FUN-420", condition: "Fair", location: "Street" },
  ];

  const recentActivities = [
    { action: "Received Paycheck", amount: "+$2,500", time: "2 hours ago" },
    { action: "Purchased Vehicle Insurance", amount: "-$450", time: "5 hours ago" },
    { action: "Property Tax Payment", amount: "-$1,200", time: "1 day ago" },
    { action: "Business Revenue", amount: "+$3,750", time: "2 days ago" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex items-center px-6">
            <Briefcase className="w-16 h-16 text-white mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-white">Civilian Life</h1>
              <p className="text-cyan-100">Build Your Story, Live Your Life</p>
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
              color="primary"
              classNames={{
                tabList: "w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-blue-500",
                tab: "max-w-fit px-6 h-12",
                tabContent: "group-data-[selected=true]:text-blue-400"
              }}
            >
              <Tab key="home" title={
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Home</span>
                </div>
              } />
              <Tab key="properties" title={
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Properties</span>
                </div>
              } />
              <Tab key="vehicles" title={
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Vehicles</span>
                </div>
              } />
              <Tab key="business" title={
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Business</span>
                </div>
              } />
              <Tab key="finances" title={
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span>Finances</span>
                </div>
              } />
              <Tab key="licenses" title={
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Licenses</span>
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
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Civilian Life</h2>
                <p className="text-gray-300 mb-4">
                  Live your dream life in Los Santos! Own businesses, purchase properties, collect vehicles, 
                  and build your career. Work legal jobs, run your own enterprises, or simply enjoy the city's 
                  many activities and social opportunities.
                </p>
                <p className="text-gray-300">
                  Your choices shape your story. Will you become a successful entrepreneur, a dedicated employee, 
                  or something in between? The possibilities are endless!
                </p>
              </CardBody>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-green-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    <Chip color="success" variant="flat" size="sm">Balance</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">${bankBalance.toLocaleString()}</div>
                  <p className="text-sm text-gray-400">Bank Account</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-blue-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Home className="w-8 h-8 text-blue-400" />
                    <Chip color="primary" variant="flat" size="sm">Owned</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{properties}</div>
                  <p className="text-sm text-gray-400">Properties</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-purple-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Car className="w-8 h-8 text-purple-400" />
                    <Chip color="secondary" variant="flat" size="sm">Garage</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{vehicles}</div>
                  <p className="text-sm text-gray-400">Vehicles</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/30 to-gray-900/50 border border-orange-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-8 h-8 text-orange-400" />
                    <Chip color="warning" variant="flat" size="sm">Career</Chip>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">Level {jobLevel}</div>
                  <p className="text-sm text-gray-400">Mechanic</p>
                </CardBody>
              </Card>
            </div>

            {/* Properties & Vehicles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Properties */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    My Properties
                  </h3>
                  <div className="space-y-3">
                    {ownedProperties.map((property, i) => (
                      <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{property.name}</p>
                            <p className="text-xs text-gray-400">📍 {property.location}</p>
                          </div>
                          <Chip size="sm" variant="flat" color="primary">{property.type}</Chip>
                        </div>
                        <p className="text-sm text-green-400 font-semibold">{property.value}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Vehicles */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    My Vehicles
                  </h3>
                  <div className="space-y-3">
                    {ownedVehicles.map((vehicle, i) => (
                      <div key={i} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{vehicle.name}</p>
                            <p className="text-xs text-gray-400">Plate: {vehicle.plate}</p>
                          </div>
                          <Chip 
                            size="sm" 
                            variant="flat" 
                            color={vehicle.condition === "Excellent" ? "success" : vehicle.condition === "Good" ? "primary" : "warning"}
                          >
                            {vehicle.condition}
                          </Chip>
                        </div>
                        <p className="text-sm text-gray-400">📍 {vehicle.location}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Recent Activity & Career Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                        <span className={`font-bold ${activity.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {activity.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Career Progress */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Career Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Current Job</span>
                        <span className="text-white font-medium">Mechanic - Level {jobLevel}</span>
                      </div>
                      <Progress value={70} color="primary" size="sm" />
                      <p className="text-xs text-gray-500 mt-1">1,050 / 1,500 XP to Level 8</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-white font-medium text-sm mb-1">Pay Rate</p>
                      <p className="text-2xl font-bold text-green-400">$250/hour</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-white font-medium text-sm mb-1">Total Earnings</p>
                      <p className="text-2xl font-bold text-blue-400">$127,500</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        )}

        {selectedTab === "properties" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Property Management</h2>
              <p className="text-gray-400">Detailed property management coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "vehicles" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Vehicle Garage</h2>
              <p className="text-gray-400">Vehicle management and customization coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "business" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Business Management</h2>
              <p className="text-gray-400">Business operations and analytics coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "finances" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Financial Overview</h2>
              <p className="text-gray-400">Banking and transaction history coming soon...</p>
            </CardBody>
          </Card>
        )}

        {selectedTab === "licenses" && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Licenses & Permits</h2>
              <p className="text-gray-400">License management coming soon...</p>
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
                  <Chip color="primary" variant="flat" className="mt-2">Civilian</Chip>
                </div>
              </div>
              <p className="text-gray-400">Profile statistics and achievements coming soon...</p>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
