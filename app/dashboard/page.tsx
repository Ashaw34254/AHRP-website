"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, Avatar, Chip, Button, Badge, Skeleton } from "@nextui-org/react";
import { Calendar, MapPin, Clock, Plus, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "@/lib/toast";

interface DashboardData {
  characters: any[];
  applications: any[];
  events: any[];
  stats: {
    totalCharacters: number;
    activeCharacters: number;
    pendingApplications: number;
    upcomingEvents: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/overview");
      const result = await res.json();
      
      if (result.success) {
        setData(result);
      } else {
        toast.error("Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const bannerImage = (user as any)?.bannerImage || "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=300&fit=crop";

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "POLICE": return "border-blue-500 bg-blue-900/20";
      case "FIRE": return "border-red-500 bg-red-900/20";
      case "EMS": return "border-green-500 bg-green-900/20";
      default: return "border-gray-500 bg-gray-900/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Banner Card */}
        <Card className="bg-gray-900/50 border border-gray-800 overflow-hidden">
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bannerImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
            <Link href="/dashboard/settings">
              <Button
                size="sm"
                variant="flat"
                className="absolute top-4 right-4"
                startContent={<Edit className="w-4 h-4" />}
              >
                Edit Profile
              </Button>
            </Link>
          </div>
          <CardBody className="p-6 -mt-16 relative">
            <div className="flex items-start gap-6">
              <Avatar
                src={user?.image || undefined}
                name={user?.name || "User"}
                className="w-32 h-32 border-4 border-gray-900"
                isBordered
                color="primary"
              />
              
              <div className="flex-1 mt-12">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-3xl font-bold text-white">
                    {user?.name || "Anonymous Player"}
                  </h2>
                  <Chip color="success" variant="flat">Active</Chip>
                </div>
                
                <p className="text-gray-400 mb-2">{user?.email}</p>
                {(user as any)?.bio && (
                  <p className="text-gray-300 text-sm mb-4 max-w-2xl">
                    {(user as any).bio}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span suppressHydrationWarning>
                      Joined {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Aurora Horizon</span>
                  </div>
                  {(user as any)?.discordUsername && (
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span>{(user as any).discordUsername}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-gray-900/50 border border-gray-800">
                <CardBody className="text-center p-6">
                  <Skeleton className="h-10 w-16 mx-auto mb-2 rounded-lg" />
                  <Skeleton className="h-4 w-32 mx-auto rounded-lg" />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-indigo-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <div className="text-4xl font-bold text-indigo-400 mb-2">
                  {data?.stats.totalCharacters || 0}
                </div>
                <p className="text-gray-400">Characters</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {data?.stats.activeCharacters || 0}
                </div>
                <p className="text-gray-400">Active</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {data?.stats.pendingApplications || 0}
                </div>
                <p className="text-gray-400">Pending Apps</p>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {data?.stats.upcomingEvents || 0}
                </div>
                <p className="text-gray-400">Upcoming Events</p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Character Quick Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">My Characters</h3>
            <div className="flex gap-2">
              <Button
                as={Link}
                href="/dashboard/characters/new"
                color="success"
                startContent={<Plus className="w-4 h-4" />}
              >
                Create Character
              </Button>
              <Button
                as={Link}
                href="/dashboard/characters"
                color="primary"
                variant="flat"
              >
                View All
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32 rounded-lg" />
                        <Skeleton className="h-4 w-24 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : data?.characters && data.characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.characters.slice(0, 3).map((character) => (
                <Link key={character.id} href={`/dashboard/characters/${character.id}`}>
                  <Card 
                    className={`border-2 ${getDepartmentColor(character.officer?.department || "CIVILIAN")} hover:scale-105 transition-transform cursor-pointer`}
                    isPressable
                  >
                    <CardBody className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar
                            src={character.image || undefined}
                            name={`${character.firstName} ${character.lastName}`}
                            className="w-16 h-16"
                            isBordered
                          />
                          {character.officer?.dutyStatus === "AVAILABLE" && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-white truncate">
                            {character.firstName} {character.lastName}
                          </h4>
                          <p className="text-sm text-gray-400 mb-2">
                            {character.officer?.rank || character.occupation || "Civilian"}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs">
                            <Chip size="sm" variant="flat" color={
                              character.officer?.department === "POLICE" ? "primary" :
                              character.officer?.department === "FIRE" ? "danger" :
                              character.officer?.department === "EMS" ? "success" : "default"
                            }>
                              {character.officer?.department || character.department || "CIVILIAN"}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="text-center py-12">
                <p className="text-gray-400 mb-4">No characters yet</p>
                <Button
                  as={Link}
                  href="/dashboard/characters"
                  color="primary"
                  startContent={<Plus className="w-4 h-4" />}
                >
                  Create Your First Character
                </Button>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Recent Applications */}
        {data?.applications && data.applications.length > 0 && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Applications</h3>
              <div className="space-y-3">
                {data.applications.map((app) => (
                  <Link key={app.id} href={`/dashboard/applications/${app.id}`}>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 rounded-full ${
                        app.status === 'approved' ? 'bg-green-400' :
                        app.status === 'rejected' ? 'bg-red-400' :
                        app.status === 'in_review' ? 'bg-blue-400' :
                        'bg-amber-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white">{app.formConfig?.title || 'Application'}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Chip size="sm" variant="flat" color={
                        app.status === 'approved' ? 'success' :
                        app.status === 'rejected' ? 'danger' :
                        app.status === 'in_review' ? 'primary' : 'warning'
                      }>
                        {app.status}
                      </Chip>
                    </div>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
