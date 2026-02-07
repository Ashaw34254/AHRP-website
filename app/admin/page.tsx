"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody, 
  Chip, 
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
} from "@heroui/react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      const data = await res.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setRecentApplications(data.recentApplications);
      } else {
        toast.error("Failed to load overview data");
      }
    } catch (error) {
      console.error("Error loading overview:", error);
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      case "UNDER_REVIEW":
        return "warning";
      case "PENDING":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading overview...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your Aurora Horizon RP community</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/users">
            <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats?.totalUsers || 0}</div>
                <p className="text-sm text-gray-400">Total Users</p>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/applications">
            <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800 hover:border-yellow-500/50 transition-colors cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  {stats?.pendingApplications > 0 && (
                    <Chip color="warning" variant="flat" size="sm">{stats.pendingApplications}</Chip>
                  )}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats?.totalApplications || 0}</div>
                <p className="text-sm text-gray-400">Total Applications</p>
              </CardBody>
            </Card>
          </Link>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <Chip color="success" variant="flat" size="sm">Active</Chip>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.totalCharacters || 0}</div>
              <p className="text-sm text-gray-400">Total Characters</p>
            </CardBody>
          </Card>

          <Link href="/admin/events">
            <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats?.totalEvents || 0}</div>
                <p className="text-sm text-gray-400">Scheduled Events</p>
              </CardBody>
            </Card>
          </Link>
        </div>

        {/* Recent Users */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Users</h2>
              <Link href="/admin/users">
                <Button size="sm" variant="flat" color="primary">
                  View All
                </Button>
              </Link>
            </div>
            <Table
              aria-label="Recent users table"
              classNames={{
                base: "bg-transparent",
                wrapper: "bg-transparent shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>CHARACTERS</TableColumn>
                <TableColumn>JOINED</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No users found">
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={user.name || "User"}
                          src={user.image || undefined}
                          size="sm"
                        />
                        <span className="text-gray-300">{user.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={user.role === "admin" ? "danger" : "default"}
                      >
                        {user.role || "user"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-300">{user.characterCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Recent Applications */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
              <Link href="/admin/applications">
                <Button size="sm" variant="flat" color="primary">
                  View All
                </Button>
              </Link>
            </div>
            <Table
              aria-label="Recent applications table"
              classNames={{
                base: "bg-transparent",
                wrapper: "bg-transparent shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>APPLICANT</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>SUBMITTED</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No applications found">
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="text-gray-300">{app.userName}</div>
                        <div className="text-xs text-gray-500">{app.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-300 capitalize">{app.type}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getStatusColor(app.status)}
                      >
                        {app.status.replace("_", " ")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 text-sm">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/application-analytics">
            <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardBody className="p-6 flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-white">Application Analytics</h3>
                  <p className="text-sm text-gray-400">View detailed reports</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/form-builder">
            <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardBody className="p-6 flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">Form Builder</h3>
                  <p className="text-sm text-gray-400">Customize application forms</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/audit-logs">
            <Card className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardBody className="p-6 flex items-center gap-4">
                <Activity className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="font-semibold text-white">Audit Logs</h3>
                  <p className="text-sm text-gray-400">View system activity</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
