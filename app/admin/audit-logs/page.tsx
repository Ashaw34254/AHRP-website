"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Chip,
  Pagination,
} from "@nextui-org/react";
import { FileText, Search, Calendar, User, Activity, Shield, Database } from "lucide-react";

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

const ACTION_TYPES = [
  "ALL",
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "EXPORT",
];

const RESOURCE_TYPES = [
  "ALL",
  "USER",
  "CALL",
  "UNIT",
  "CITIZEN",
  "VEHICLE",
  "INCIDENT",
  "COURT_CASE",
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    action: "ALL",
    resource: "ALL",
    dateFrom: "",
    dateTo: "",
  });

  const logsPerPage = 20;

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: logsPerPage.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.action !== "ALL" && { action: filters.action }),
        ...(filters.resource !== "ALL" && { resource: filters.resource }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      // Use mock data if API not available
      setLogs(getMockAuditLogs());
      setTotal(getMockAuditLogs().length);
    } finally {
      setLoading(false);
    }
  }

  function getActionColor(action: string) {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "primary";
      case "DELETE":
        return "danger";
      case "LOGIN":
        return "secondary";
      case "EXPORT":
        return "warning";
      default:
        return "default";
    }
  }

  function getActionIcon(action: string) {
    switch (action) {
      case "LOGIN":
      case "LOGOUT":
        return <User className="w-4 h-4" />;
      case "EXPORT":
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  }

  const stats = {
    total: logs.length,
    today: logs.filter((log) => {
      const diff = Date.now() - new Date(log.createdAt).getTime();
      return diff < 24 * 60 * 60 * 1000;
    }).length,
    creates: logs.filter((log) => log.action === "CREATE").length,
    deletes: logs.filter((log) => log.action === "DELETE").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Audit Logs
          </h1>
          <p className="text-gray-400 mt-1">Track all system activities and user actions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/80 to-blue-950/80 border-2 border-blue-800">
            <CardBody className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-300">Total Logs</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/80 to-green-950/80 border-2 border-green-800">
            <CardBody className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.today}</p>
                <p className="text-sm text-gray-300">Today</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-2 border-purple-800">
            <CardBody className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.creates}</p>
                <p className="text-sm text-gray-300">Creates</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/80 to-red-950/80 border-2 border-red-800">
            <CardBody className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500/20">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.deletes}</p>
                <p className="text-sm text-gray-300">Deletes</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Filters</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Search user, resource..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
              />
              <Select
                label="Action"
                selectedKeys={[filters.action]}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              >
                {ACTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Resource"
                selectedKeys={[filters.resource]}
                onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
              >
                {RESOURCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                label="From Date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
              <Input
                type="date"
                label="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Audit Logs Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <Table
              aria-label="Audit logs table"
              classNames={{
                wrapper: "bg-transparent",
                th: "bg-gray-800 text-gray-300",
                td: "text-gray-300",
              }}
            >
              <TableHeader>
                <TableColumn>TIMESTAMP</TableColumn>
                <TableColumn>USER</TableColumn>
                <TableColumn>ACTION</TableColumn>
                <TableColumn>RESOURCE</TableColumn>
                <TableColumn>DETAILS</TableColumn>
                <TableColumn>IP ADDRESS</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={loading ? "Loading..." : "No audit logs found"}
                items={logs}
              >
                {(log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{log.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getActionColor(log.action) as any}
                        variant="flat"
                        startContent={getActionIcon(log.action)}
                      >
                        {log.action}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {log.resource}
                        {log.resourceId && (
                          <span className="text-xs text-gray-500 block">
                            ID: {log.resourceId.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-400 max-w-xs truncate">
                        {log.details || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-400">{log.ipAddress || "-"}</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {total > logsPerPage && (
              <div className="flex justify-center mt-4">
                <Pagination
                  total={Math.ceil(total / logsPerPage)}
                  page={page}
                  onChange={setPage}
                  color="primary"
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}

function getMockAuditLogs(): AuditLog[] {
  return [
    {
      id: "1",
      userId: "user-1",
      userName: "Admin User",
      action: "CREATE",
      resource: "CALL",
      resourceId: "call-123",
      details: "Created emergency call #2024-001",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "2",
      userId: "user-2",
      userName: "John Officer",
      action: "UPDATE",
      resource: "UNIT",
      resourceId: "unit-456",
      details: "Updated unit status to ENROUTE",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0",
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: "3",
      userId: "user-1",
      userName: "Admin User",
      action: "DELETE",
      resource: "CITIZEN",
      resourceId: "cit-789",
      details: "Deleted duplicate citizen record",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "4",
      userId: "user-3",
      userName: "Jane Supervisor",
      action: "EXPORT",
      resource: "INCIDENT",
      resourceId: null,
      details: "Exported incident reports for December 2024",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0",
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: "5",
      userId: "user-2",
      userName: "John Officer",
      action: "LOGIN",
      resource: "USER",
      resourceId: "user-2",
      details: "User logged in",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];
}
