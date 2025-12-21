"use client";

import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, Avatar, Chip } from "@nextui-org/react";
import { Calendar, MapPin, Shield } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name || "Player"}!</p>
        </div>

        {/* User Profile Card */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-start gap-6">
              <Avatar
                src={user?.image || undefined}
                name={user?.name || "User"}
                className="w-24 h-24"
                isBordered
                color="primary"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.name || "Anonymous Player"}
                  </h2>
                  <Chip color="success" variant="flat">Active</Chip>
                </div>
                
                <p className="text-gray-400 mb-4">{user?.email}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span suppressHydrationWarning>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Aurora Horizon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Civilian</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-indigo-400 mb-2">3</div>
              <p className="text-gray-400">Active Characters</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">2</div>
              <p className="text-gray-400">Applications Approved</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">47</div>
              <p className="text-gray-400">Hours Played</p>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white">Character &quot;John Doe&quot; approved</p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white">Application submitted</p>
                  <p className="text-sm text-gray-400">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white">Profile updated</p>
                  <p className="text-sm text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
