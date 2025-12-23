"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import {
  FileText,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  AlertTriangle,
  Users,
  Bug,
  Lightbulb,
  Shield,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface StaffReport {
  id: number;
  report_id: string;
  submitter_name: string;
  submitter_identifier?: string;
  report_type: string;
  priority: string;
  title: string;
  reported_person?: string;
  details: string;
  location?: string;
  witnesses?: string;
  evidence?: string;
  status: string;
  assigned_to?: string;
  date: string;
}

interface ReportStats {
  total: number;
  pending: number;
  resolved: number;
  critical: number;
}

const STATUS_COLORS = {
  PENDING: "warning",
  UNDER_REVIEW: "primary",
  RESOLVED: "success",
  CLOSED: "default",
} as const;

const PRIORITY_COLORS = {
  LOW: "default",
  MEDIUM: "primary",
  HIGH: "warning",
  CRITICAL: "danger",
} as const;

const REPORT_TYPE_ICONS = {
  PLAYER: Users,
  STAFF: Shield,
  BUG: Bug,
  SUGGESTION: Lightbulb,
  OTHER: AlertCircle,
};

export function StaffReports() {
  const [reports, setReports] = useState<StaffReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<StaffReport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchReports();
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchReports();
      fetchStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter, typeFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      params.append("limit", "100");

      const response = await fetch(`/api/fivem/staff-reports?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.data || []);
      } else {
        toast.error("Failed to load reports: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to connect to FiveM server");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/fivem/staff-reports/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const viewReportDetails = async (report: StaffReport) => {
    try {
      const response = await fetch(`/api/fivem/staff-reports?reportId=${report.report_id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedReport(data.data.report);
        onOpen();
      } else {
        toast.error("Failed to load report details");
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast.error("Failed to load report details");
    }
  };

  const filteredReports = reports.filter((report) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      report.report_id.toLowerCase().includes(query) ||
      report.title.toLowerCase().includes(query) ||
      report.submitter_name.toLowerCase().includes(query) ||
      (report.reported_person && report.reported_person.toLowerCase().includes(query))
    );
  });

  const getTypeIcon = (type: string) => {
    const Icon = REPORT_TYPE_ICONS[type as keyof typeof REPORT_TYPE_ICONS] || AlertCircle;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Critical</p>
                  <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
            />

            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <SelectItem key="all" value="all">All Status</SelectItem>
              <SelectItem key="PENDING" value="PENDING">Pending</SelectItem>
              <SelectItem key="UNDER_REVIEW" value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem key="RESOLVED" value="RESOLVED">Resolved</SelectItem>
              <SelectItem key="CLOSED" value="CLOSED">Closed</SelectItem>
            </Select>

            <Select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <SelectItem key="all" value="all">All Priorities</SelectItem>
              <SelectItem key="LOW" value="LOW">Low</SelectItem>
              <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
              <SelectItem key="HIGH" value="HIGH">High</SelectItem>
              <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
            </Select>

            <Select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <SelectItem key="all" value="all">All Types</SelectItem>
              <SelectItem key="PLAYER" value="PLAYER">Player Report</SelectItem>
              <SelectItem key="STAFF" value="STAFF">Staff Report</SelectItem>
              <SelectItem key="BUG" value="BUG">Bug Report</SelectItem>
              <SelectItem key="SUGGESTION" value="SUGGESTION">Suggestion</SelectItem>
              <SelectItem key="OTHER" value="OTHER">Other</SelectItem>
            </Select>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              color="primary"
              startContent={<RefreshCw className="w-4 h-4" />}
              onPress={() => {
                fetchReports();
                fetchStats();
              }}
              isLoading={loading}
            >
              Refresh
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">
            Staff Reports ({filteredReports.length})
          </h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reports found</p>
            </div>
          ) : (
            <Table aria-label="Staff reports table">
              <TableHeader>
                <TableColumn>REPORT ID</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>SUBMITTER</TableColumn>
                <TableColumn>PRIORITY</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{report.report_id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(report.report_type)}
                        <span className="text-sm">{report.report_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{report.title}</span>
                    </TableCell>
                    <TableCell>{report.submitter_name}</TableCell>
                    <TableCell>
                      <Chip
                        color={PRIORITY_COLORS[report.priority as keyof typeof PRIORITY_COLORS]}
                        size="sm"
                        variant="flat"
                      >
                        {report.priority}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={STATUS_COLORS[report.status as keyof typeof STATUS_COLORS]}
                        size="sm"
                        variant="flat"
                      >
                        {report.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {new Date(report.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        startContent={<Eye className="w-4 h-4" />}
                        onPress={() => viewReportDetails(report)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Report Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-bold">Report Details</h2>
                {selectedReport && (
                  <p className="text-sm text-gray-400 font-mono">
                    {selectedReport.report_id}
                  </p>
                )}
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedReport.report_type)}
                      <p className="font-medium">{selectedReport.report_type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Priority</p>
                    <Chip
                      color={PRIORITY_COLORS[selectedReport.priority as keyof typeof PRIORITY_COLORS]}
                      className="mt-1"
                    >
                      {selectedReport.priority}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <Chip
                      color={STATUS_COLORS[selectedReport.status as keyof typeof STATUS_COLORS]}
                      className="mt-1"
                    >
                      {selectedReport.status}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-medium mt-1">
                      {new Date(selectedReport.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Title</p>
                  <p className="font-medium text-lg mt-1">{selectedReport.title}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Submitter</p>
                  <p className="font-medium mt-1">{selectedReport.submitter_name}</p>
                  {selectedReport.submitter_identifier && (
                    <p className="text-xs text-gray-500 font-mono">
                      {selectedReport.submitter_identifier}
                    </p>
                  )}
                </div>

                {selectedReport.reported_person && selectedReport.reported_person !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400">Reported Person</p>
                    <p className="font-medium mt-1">{selectedReport.reported_person}</p>
                  </div>
                )}

                {selectedReport.location && (
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-medium mt-1">{selectedReport.location}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-400 mb-2">Details</p>
                  <Card>
                    <CardBody>
                      <p className="whitespace-pre-wrap">{selectedReport.details}</p>
                    </CardBody>
                  </Card>
                </div>

                {selectedReport.witnesses && selectedReport.witnesses !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400">Witnesses</p>
                    <p className="font-medium mt-1">{selectedReport.witnesses}</p>
                  </div>
                )}

                {selectedReport.evidence && selectedReport.evidence !== "N/A" && (
                  <div>
                    <p className="text-sm text-gray-400">Evidence</p>
                    <p className="font-medium mt-1 break-all">{selectedReport.evidence}</p>
                  </div>
                )}

                {selectedReport.assigned_to && (
                  <div>
                    <p className="text-sm text-gray-400">Assigned To</p>
                    <p className="font-medium mt-1">{selectedReport.assigned_to}</p>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
