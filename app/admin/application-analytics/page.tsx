"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardBody, CardHeader, Select, SelectItem, Chip } from "@heroui/react";
import { toast } from "@/lib/toast";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Activity,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsData {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  averageProcessingTime: number; // in hours
  applicationsByType: Record<string, number>;
  applicationsByStatus: Record<string, number>;
  recentActivity: Array<{
    id: string;
    applicationType: string;
    status: string;
    createdAt: string;
    reviewedAt?: string;
  }>;
  submissionTrends: Array<{
    date: string;
    count: number;
  }>;
}

export default function ApplicationAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("30"); // days

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics/applications?days=${timeRange}`);
      const data = await res.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-400">No analytics data available</p>
        </div>
      </AdminLayout>
    );
  }

  const approvalRate = analytics.totalApplications > 0
    ? ((analytics.approvedApplications / analytics.totalApplications) * 100).toFixed(1)
    : "0";

  const rejectionRate = analytics.totalApplications > 0
    ? ((analytics.rejectedApplications / analytics.totalApplications) * 100).toFixed(1)
    : "0";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Application Analytics
            </h1>
            <p className="text-gray-400 mt-2">
              Insights and metrics for application management
            </p>
          </div>
          <Select
            label="Time Range"
            selectedKeys={[timeRange]}
            onChange={(e) => setTimeRange(e.target.value)}
            className="max-w-xs"
            classNames={{
              trigger: "bg-gray-800 border-gray-700",
            }}
          >
            <SelectItem key="7">Last 7 days</SelectItem>
            <SelectItem key="30">Last 30 days</SelectItem>
            <SelectItem key="90">Last 90 days</SelectItem>
            <SelectItem key="365">Last year</SelectItem>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Applications</p>
                    <p className="text-3xl font-bold text-white">{analytics.totalApplications}</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FileText size={24} className="text-blue-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Approved</p>
                    <p className="text-3xl font-bold text-white">{analytics.approvedApplications}</p>
                    <p className="text-xs text-green-400 mt-1">{approvalRate}% approval rate</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <CheckCircle size={24} className="text-green-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-white">{analytics.rejectedApplications}</p>
                    <p className="text-xs text-red-400 mt-1">{rejectionRate}% rejection rate</p>
                  </div>
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <XCircle size={24} className="text-red-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Avg. Processing Time</p>
                    <p className="text-3xl font-bold text-white">
                      {analytics.averageProcessingTime.toFixed(1)}
                    </p>
                    <p className="text-xs text-amber-400 mt-1">hours</p>
                  </div>
                  <div className="p-3 bg-amber-500/20 rounded-lg">
                    <Clock size={24} className="text-amber-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications by Type */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="border-b border-gray-800 flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-400" />
              <h2 className="text-xl font-semibold">Applications by Type</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {Object.entries(analytics.applicationsByType).length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No data available</p>
                ) : (
                  Object.entries(analytics.applicationsByType).map(([type, count]) => {
                    const percentage = analytics.totalApplications > 0 
                      ? ((count / analytics.totalApplications) * 100).toFixed(0) 
                      : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 capitalize">{type}</span>
                          <span className="text-gray-400">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardBody>
          </Card>

          {/* Applications by Status */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader className="border-b border-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-purple-400" />
              <h2 className="text-xl font-semibold">Applications by Status</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {Object.entries(analytics.applicationsByStatus).length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No data available</p>
                ) : (
                  Object.entries(analytics.applicationsByStatus).map(([status, count]) => {
                    const percentage = analytics.totalApplications > 0 
                      ? ((count / analytics.totalApplications) * 100).toFixed(0) 
                      : 0;
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Chip
                              color={getStatusColor(status)}
                              size="sm"
                              variant="flat"
                            >
                              {status.replace("_", " ")}
                            </Chip>
                          </div>
                          <span className="text-gray-400">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              status === "APPROVED" ? "bg-green-500" :
                              status === "REJECTED" ? "bg-red-500" :
                              status === "UNDER_REVIEW" ? "bg-amber-500" :
                              "bg-gray-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Submission Trends */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader className="border-b border-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" />
            <h2 className="text-xl font-semibold">Submission Trends</h2>
          </CardHeader>
          <CardBody className="p-6">
            {analytics.submissionTrends.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No submission data available</p>
            ) : (
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics.submissionTrends.map((trend, index) => {
                  const maxCount = Math.max(...analytics.submissionTrends.map(t => t.count), 1);
                  const height = (trend.count / maxCount) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center">
                        <span className="text-xs text-gray-400 mb-1">{trend.count}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: index * 0.05, duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-purple-500 to-pink-600 rounded-t-lg min-h-[4px]"
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-1 whitespace-nowrap text-center">
                        {new Date(trend.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader className="border-b border-gray-800 flex items-center gap-2">
            <Users size={20} className="text-purple-400" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-3">
              {analytics.recentActivity.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No recent activity</p>
              ) : (
                analytics.recentActivity.slice(0, 10).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Chip
                        color={getStatusColor(activity.status)}
                        size="sm"
                        variant="flat"
                      >
                        {activity.status.replace("_", " ")}
                      </Chip>
                      <span className="text-sm text-gray-300 capitalize">
                        {activity.applicationType} Application
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
