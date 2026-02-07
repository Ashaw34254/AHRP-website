"use client";

import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Chip,
  Progress,
} from "@heroui/react";
import {
  TrendingUp,
  Users,
  Activity,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  Shield,
  Flame,
  Heart,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

interface CallStats {
  total: number;
  pending: number;
  active: number;
  closed: number;
  cancelled: number;
  avgResponseTime: number;
  avgDuration: number;
}

interface UnitStats {
  total: number;
  available: number;
  busy: number;
  offline: number;
  avgResponseTime: number;
}

interface DepartmentStats {
  name: string;
  icon: any;
  color: string;
  calls: number;
  units: number;
  avgResponseTime: number;
  efficiency: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedDept, setSelectedDept] = useState("ALL");

  // Mock data - replace with API calls
  const callStats: CallStats = {
    total: 1247,
    pending: 23,
    active: 15,
    closed: 1198,
    cancelled: 11,
    avgResponseTime: 3.2,
    avgDuration: 18.5,
  };

  const unitStats: UnitStats = {
    total: 47,
    available: 28,
    busy: 15,
    offline: 4,
    avgResponseTime: 2.8,
  };

  const departments: DepartmentStats[] = [
    {
      name: "Police",
      icon: Shield,
      color: "#3B82F6",
      calls: 847,
      units: 20,
      avgResponseTime: 2.9,
      efficiency: 94,
    },
    {
      name: "Fire",
      icon: Flame,
      color: "#EF4444",
      calls: 234,
      units: 15,
      avgResponseTime: 3.1,
      efficiency: 96,
    },
    {
      name: "EMS",
      icon: Heart,
      color: "#10B981",
      calls: 166,
      units: 12,
      avgResponseTime: 3.8,
      efficiency: 91,
    },
  ];

  const peakHours = [
    { hour: "00:00", calls: 12 },
    { hour: "01:00", calls: 8 },
    { hour: "02:00", calls: 6 },
    { hour: "03:00", calls: 4 },
    { hour: "04:00", calls: 5 },
    { hour: "05:00", calls: 9 },
    { hour: "06:00", calls: 18 },
    { hour: "07:00", calls: 32 },
    { hour: "08:00", calls: 45 },
    { hour: "09:00", calls: 52 },
    { hour: "10:00", calls: 48 },
    { hour: "11:00", calls: 51 },
    { hour: "12:00", calls: 56 },
    { hour: "13:00", calls: 54 },
    { hour: "14:00", calls: 58 },
    { hour: "15:00", calls: 62 },
    { hour: "16:00", calls: 67 },
    { hour: "17:00", calls: 71 },
    { hour: "18:00", calls: 68 },
    { hour: "19:00", calls: 64 },
    { hour: "20:00", calls: 58 },
    { hour: "21:00", calls: 52 },
    { hour: "22:00", calls: 38 },
    { hour: "23:00", calls: 24 },
  ];

  const topCallTypes = [
    { type: "Traffic Stop", count: 342, color: "#3B82F6" },
    { type: "Medical Emergency", count: 186, color: "#10B981" },
    { type: "Suspicious Activity", count: 124, color: "#F59E0B" },
    { type: "Assault", count: 98, color: "#EF4444" },
    { type: "Fire", count: 87, color: "#F97316" },
    { type: "Welfare Check", count: 76, color: "#8B5CF6" },
  ];

  const handleExportReport = () => {
    toast.success("Exporting analytics report...");
    // TODO: Generate and download PDF/CSV report
  };

  const maxCalls = Math.max(...peakHours.map((h) => h.calls));

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Monitor performance metrics and system statistics
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              label="Time Range"
              selectedKeys={[timeRange]}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40"
            >
              <SelectItem key="24h">
                Last 24 Hours
              </SelectItem>
              <SelectItem key="7d">
                Last 7 Days
              </SelectItem>
              <SelectItem key="30d">
                Last 30 Days
              </SelectItem>
              <SelectItem key="90d">
                Last 90 Days
              </SelectItem>
              <SelectItem key="1y">
                Last Year
              </SelectItem>
            </Select>
            <Select
              label="Department"
              selectedKeys={[selectedDept]}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-40"
            >
              <SelectItem key="ALL">
                All Departments
              </SelectItem>
              <SelectItem key="POLICE">
                Police
              </SelectItem>
              <SelectItem key="FIRE">
                Fire
              </SelectItem>
              <SelectItem key="EMS">
                EMS
              </SelectItem>
            </Select>
            <Button
              color="primary"
              startContent={<Download className="w-4 h-4" />}
              onPress={handleExportReport}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Phone className="w-8 h-8 text-white/80" />
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-3xl font-bold text-white">{callStats.total}</h3>
              <p className="text-white/80 text-sm">Total Calls</p>
              <div className="mt-3 flex items-center gap-2">
                <Chip size="sm" className="bg-white/20 text-white">
                  +12.3%
                </Chip>
                <span className="text-xs text-white/70">vs last period</span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Radio className="w-8 h-8 text-white/80" />
                <Activity className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-3xl font-bold text-white">{unitStats.available}</h3>
              <p className="text-white/80 text-sm">Available Units</p>
              <div className="mt-3">
                <Progress
                  value={(unitStats.available / unitStats.total) * 100}
                  className="bg-white/20"
                  classNames={{
                    indicator: "bg-white",
                  }}
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-white/80" />
                <BarChart3 className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                {callStats.avgResponseTime.toFixed(1)}m
              </h3>
              <p className="text-white/80 text-sm">Avg Response Time</p>
              <div className="mt-3 flex items-center gap-2">
                <Chip size="sm" className="bg-white/20 text-white">
                  -8.2%
                </Chip>
                <span className="text-xs text-white/70">improvement</span>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-none">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-white/80" />
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <h3 className="text-3xl font-bold text-white">{unitStats.busy}</h3>
              <p className="text-white/80 text-sm">Active Units</p>
              <div className="mt-3">
                <Progress
                  value={(unitStats.busy / unitStats.total) * 100}
                  color="warning"
                  className="bg-white/20"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Department Performance */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Department Performance</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 gap-4">
              {departments.map((dept) => {
                const DeptIcon = dept.icon;
                return (
                  <Card
                    key={dept.name}
                    className="bg-gray-800/50 border-2"
                    style={{ borderColor: dept.color }}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <DeptIcon className="w-8 h-8" style={{ color: dept.color }} />
                        <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Calls</span>
                          <span className="text-white font-bold">{dept.calls}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Active Units</span>
                          <span className="text-white font-bold">{dept.units}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Avg Response</span>
                          <span className="text-white font-bold">
                            {dept.avgResponseTime.toFixed(1)}m
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Efficiency</span>
                            <span className="text-white font-bold">
                              {dept.efficiency}%
                            </span>
                          </div>
                          <Progress
                            value={dept.efficiency}
                            color={dept.efficiency >= 90 ? "success" : "warning"}
                            className="bg-gray-700"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Call Statistics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Peak Hours */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Peak Hours</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {peakHours.map((hour) => (
                  <div key={hour.hour} className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">{hour.hour}</span>
                    <div className="flex-1 relative">
                      <div
                        className="h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md"
                        style={{ width: `${(hour.calls / maxCalls) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold w-12 text-right">
                      {hour.calls}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Top Call Types */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Top Call Types</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {topCallTypes.map((callType, index) => {
                  const percentage =
                    (callType.count / callStats.total) * 100;
                  return (
                    <div key={callType.type}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-500">
                            {index + 1}
                          </span>
                          <span className="text-white">{callType.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">
                            {callType.count}
                          </span>
                          <Chip
                            size="sm"
                            style={{
                              backgroundColor: `${callType.color}20`,
                              color: callType.color,
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </Chip>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="bg-gray-800"
                        classNames={{
                          indicator: `bg-gradient-to-r`,
                        }}
                        style={{
                          // @ts-ignore
                          "--tw-gradient-from": callType.color,
                          "--tw-gradient-to": callType.color,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Call Status Breakdown */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Call Status Distribution</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white">{callStats.pending}</h3>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((callStats.pending / callStats.total) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white">{callStats.active}</h3>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((callStats.active / callStats.total) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white">{callStats.closed}</h3>
                <p className="text-gray-400 text-sm">Closed</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((callStats.closed / callStats.total) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white">{callStats.cancelled}</h3>
                <p className="text-gray-400 text-sm">Cancelled</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((callStats.cancelled / callStats.total) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white">{callStats.total}</h3>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-xs text-gray-500 mt-1">100%</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
