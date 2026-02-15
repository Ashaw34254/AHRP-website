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
  Avatar,
  Tabs,
  Tab,
  Badge,
} from "@heroui/react";
import {
  FileText,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  FileCheck,
  Eye,
  Edit,
  Paperclip,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface IncidentReport {
  id: string;
  reportNumber: string;
  title: string;
  reportedBy: string;
  occurredAt: string;
  location: string;
  type: string;
  status: string;
  narrative: string;
  suspects?: string | null;
  victims?: string | null;
  witnesses?: string | null;
  evidence?: string | null;
  priority?: string | null;
  approvedBy?: string | null;
  callId?: string | null;
  witnessCount?: number;
  suspectCount?: number;
  victimCount?: number;
  evidenceNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Officer {
  id: string;
  name: string;
  badge: string | null;
  department: string;
}

interface IncidentReportsProps {
  department?: string;
}

export function IncidentReports({ department }: IncidentReportsProps = { department: undefined }) {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    title: "",
    reportingOfficerId: "",
    incidentDate: "",
    incidentLocation: "",
    incidentType: "ASSAULT",
    priority: "MEDIUM",
    narrative: "",
    evidenceNotes: "",
    witnessCount: 0,
    suspectCount: 0,
    victimCount: 0,
  });

  useEffect(() => {
    fetchReports();
    fetchOfficers();
  }, []);

  const fetchReports = async () => {
    try {
      const url = department 
        ? `/api/cad/incidents?department=${department}`
        : "/api/cad/incidents";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load incident reports");
    }
  };

  const fetchOfficers = async () => {
    try {
      const response = await fetch("/api/cad/officers/profiles");
      if (response.ok) {
        const data = await response.json();
        setOfficers(data.profiles || []);
      }
    } catch (error) {
      console.error("Failed to fetch officers:", error);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.reportingOfficerId || !formData.incidentDate || !formData.incidentLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const officer = officers.find(o => o.id === formData.reportingOfficerId);
      
      const response = await fetch("/api/cad/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          reportedBy: officer ? `${officer.badge || officer.name} - ${officer.name}` : 'Unknown',
          occurredAt: new Date(formData.incidentDate).toISOString(),
          location: formData.incidentLocation,
          type: formData.incidentType,
          narrative: formData.narrative,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create report");
      }

      toast.success("Incident report created");
      fetchReports();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create incident report");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cad/incidents/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated");
      fetchReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      reportingOfficerId: "",
      incidentDate: "",
      incidentLocation: "",
      incidentType: "ASSAULT",
      priority: "MEDIUM",
      narrative: "",
      evidenceNotes: "",
      witnessCount: 0,
      suspectCount: 0,
      victimCount: 0,
    });
  };

  const viewReportDetails = (report: IncidentReport) => {
    setSelectedReport(report);
    onDetailOpen();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "primary";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "default";
      case "SUBMITTED":
        return "primary";
      case "UNDER_REVIEW":
        return "warning";
      case "APPROVED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Edit className="w-4 h-4" />;
      case "SUBMITTED":
        return <Clock className="w-4 h-4" />;
      case "UNDER_REVIEW":
        return <AlertCircle className="w-4 h-4" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "CLOSED":
        return <FileCheck className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.reportNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (report.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (report.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const reportsByStatus = {
    DRAFT: filteredReports.filter((r) => r.status === "DRAFT"),
    SUBMITTED: filteredReports.filter((r) => r.status === "SUBMITTED"),
    UNDER_REVIEW: filteredReports.filter((r) => r.status === "UNDER_REVIEW"),
    APPROVED: filteredReports.filter((r) => r.status === "APPROVED"),
    CLOSED: filteredReports.filter((r) => r.status === "CLOSED"),
  };

  const totalReports = reports.length;
  const draftCount = reports.filter((r) => r.status === "DRAFT").length;
  const pendingCount = reports.filter((r) => r.status === "SUBMITTED" || r.status === "UNDER_REVIEW").length;
  const criticalCount = reports.filter((r) => r.priority === "CRITICAL" && r.status !== "CLOSED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
              <FileText className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Incident Reports</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <FileText className="w-4 h-4" />
                  {totalReports} total
                </span>
                <span className="text-gray-600">•</span>
                {draftCount > 0 && (
                  <>
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Edit className="w-4 h-4" />
                      {draftCount} drafts
                    </span>
                    <span className="text-gray-600">•</span>
                  </>
                )}
                {pendingCount > 0 && (
                  <>
                    <span className="flex items-center gap-1.5 text-yellow-400">
                      <Clock className="w-4 h-4" />
                      {pendingCount} pending
                    </span>
                    <span className="text-gray-600">•</span>
                  </>
                )}
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1.5 text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    {criticalCount} critical
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            color="primary"
            variant="shadow"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onOpen}
            className="font-semibold"
          >
            New Report
          </Button>
        </CardHeader>
      </Card>

      {/* Search & Filters */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by case #, title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-500" />}
              className="flex-1"
              classNames={{
                input: "bg-gray-800/50",
                inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
              }}
            />
            <Select
              label="Status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-56"
              classNames={{
                trigger: "bg-gray-800/50 border-gray-700",
              }}
            >
              <SelectItem key="ALL">All Statuses</SelectItem>
              <SelectItem key="DRAFT">Draft</SelectItem>
              <SelectItem key="SUBMITTED">Submitted</SelectItem>
              <SelectItem key="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem key="APPROVED">Approved</SelectItem>
              <SelectItem key="CLOSED">Closed</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Tabs by Status */}
      <Tabs
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "bg-gray-900/50 border border-gray-800 rounded-lg p-2",
          tab: "data-[selected=true]:text-blue-400",
        }}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>All Reports ({filteredReports.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {filteredReports.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
                <CardBody className="p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                      <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">No Incident Reports</h4>
                    <p className="text-sm text-gray-400 mb-4">Create your first incident report to get started</p>
                    <Button color="primary" variant="flat" startContent={<Plus />} onPress={onOpen}>
                      Create First Report
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
                    report.priority === "CRITICAL"
                      ? "border-red-700/50 hover:border-red-600/70 animate-pulse"
                      : report.priority === "HIGH"
                      ? "border-yellow-700/50 hover:border-yellow-600/70"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <CardBody className="p-5 cursor-pointer" onClick={() => viewReportDetails(report)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white font-mono">{report.reportNumber}</h3>
                          <Chip
                            size="sm"
                            color={getPriorityColor(report.priority || "NORMAL") as any}
                            variant="solid"
                            className="font-bold"
                          >
                            {report.priority || "NORMAL"}
                          </Chip>
                          <Chip
                            size="sm"
                            color={getStatusColor(report.status) as any}
                            variant="bordered"
                            startContent={getStatusIcon(report.status)}
                          >
                            {report.status.replace("_", " ")}
                          </Chip>
                          <Chip size="sm" variant="flat" className="uppercase">
                            {(report.type || 'INCIDENT').replace("_", " ")}
                          </Chip>
                        </div>

                        <h4 className="text-base font-semibold text-white mb-2">{report.title}</h4>

                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={report.reportedBy} size="sm" className="w-6 h-6" />
                            <span>{report.reportedBy}</span>
                          </div>
                          <span className="text-gray-600">•</span>
                          <span>{report.location}</span>
                          <span className="text-gray-600">•</span>
                          <span>{new Date(report.occurredAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {(report.witnessCount ?? 0) > 0 && (
                            <Badge content={report.witnessCount} color="primary" size="sm">
                              <Chip size="sm" variant="flat">Witnesses</Chip>
                            </Badge>
                          )}
                          {(report.suspectCount ?? 0) > 0 && (
                            <Badge content={report.suspectCount} color="warning" size="sm">
                              <Chip size="sm" variant="flat">Suspects</Chip>
                            </Badge>
                          )}
                          {(report.victimCount ?? 0) > 0 && (
                            <Badge content={report.victimCount} color="danger" size="sm">
                              <Chip size="sm" variant="flat">Victims</Chip>
                            </Badge>
                          )}
                          {report.evidenceNotes && (
                            <Chip size="sm" variant="flat" startContent={<Paperclip className="w-3 h-3" />}>
                              Evidence
                            </Chip>
                          )}
                        </div>
                      </div>

                      <button
                        className="z-10 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 hover:border-blue-500/50 transition-all flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewReportDetails(report);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </Tab>

        <Tab
          key="draft"
          title={
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              <span>Drafts ({reportsByStatus.DRAFT.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {reportsByStatus.DRAFT.map((report) => (
              <Card
                key={report.id}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 hover:border-gray-600 cursor-pointer"
                isPressable
                onPress={() => viewReportDetails(report)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white">{report.reportNumber}</span>
                      <span className="text-white">{report.title}</span>
                      <Chip size="sm" variant="flat">{(report.type || 'INCIDENT').replace("_", " ")}</Chip>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{new Date(report.updatedAt).toLocaleString()}</span>
                      <Button size="sm" color="primary" variant="flat" startContent={<Edit />}>
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab
          key="pending"
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Pending ({reportsByStatus.SUBMITTED.length + reportsByStatus.UNDER_REVIEW.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {[...reportsByStatus.SUBMITTED, ...reportsByStatus.UNDER_REVIEW].map((report) => (
              <Card
                key={report.id}
                className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/10 border-2 border-yellow-700/30 cursor-pointer"
                isPressable
                onPress={() => viewReportDetails(report)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white">{report.reportNumber}</span>
                      <span className="text-white">{report.title}</span>
                      <Chip size="sm" color={getStatusColor(report.status) as any} variant="bordered">
                        {report.status.replace("_", " ")}
                      </Chip>
                    </div>
                    <Button size="sm" color="primary" variant="flat" startContent={<Eye />}>
                      Review
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab
          key="approved"
          title={
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Approved ({reportsByStatus.APPROVED.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {reportsByStatus.APPROVED.map((report) => (
              <Card
                key={report.id}
                className="bg-gradient-to-br from-green-900/20 to-green-950/10 border-2 border-green-700/30 cursor-pointer"
                isPressable
                onPress={() => viewReportDetails(report)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-mono font-bold text-white">{report.reportNumber}</span>
                      <span className="text-white">{report.title}</span>
                    </div>
                    <span className="text-sm text-gray-400">{new Date(report.occurredAt).toLocaleDateString()}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>

      {/* Create Report Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            Create Incident Report
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Report Title"
                placeholder="Brief description of incident..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isRequired
                variant="bordered"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Reporting Officer"
                  placeholder="Select officer"
                  selectedKeys={formData.reportingOfficerId ? [formData.reportingOfficerId] : []}
                  onChange={(e) => setFormData({ ...formData, reportingOfficerId: e.target.value })}
                  isRequired
                  variant="bordered"
                >
                  {officers.map((officer) => (
                    <SelectItem key={officer.id}>
                      {officer.name} {officer.badge ? `(#${officer.badge})` : ""}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Incident Date & Time"
                  type="datetime-local"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <Input
                label="Incident Location"
                placeholder="Address or location description..."
                value={formData.incidentLocation}
                onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                isRequired
                variant="bordered"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Incident Type"
                  selectedKeys={[formData.incidentType]}
                  onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="ASSAULT">Assault</SelectItem>
                  <SelectItem key="THEFT">Theft</SelectItem>
                  <SelectItem key="BURGLARY">Burglary</SelectItem>
                  <SelectItem key="ROBBERY">Robbery</SelectItem>
                  <SelectItem key="VEHICLE_THEFT">Vehicle Theft</SelectItem>
                  <SelectItem key="VANDALISM">Vandalism</SelectItem>
                  <SelectItem key="DRUG_OFFENSE">Drug Offense</SelectItem>
                  <SelectItem key="DUI">DUI</SelectItem>
                  <SelectItem key="DOMESTIC">Domestic Violence</SelectItem>
                  <SelectItem key="TRAFFIC_COLLISION">Traffic Collision</SelectItem>
                  <SelectItem key="WEAPONS_OFFENSE">Weapons Offense</SelectItem>
                  <SelectItem key="OTHER">Other</SelectItem>
                </Select>

                <Select
                  label="Priority"
                  selectedKeys={[formData.priority]}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="LOW">Low</SelectItem>
                  <SelectItem key="MEDIUM">Medium</SelectItem>
                  <SelectItem key="HIGH">High</SelectItem>
                  <SelectItem key="CRITICAL">Critical</SelectItem>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Witnesses"
                  type="number"
                  min="0"
                  value={formData.witnessCount.toString()}
                  onChange={(e) => setFormData({ ...formData, witnessCount: parseInt(e.target.value) || 0 })}
                  variant="bordered"
                />
                <Input
                  label="Suspects"
                  type="number"
                  min="0"
                  value={formData.suspectCount.toString()}
                  onChange={(e) => setFormData({ ...formData, suspectCount: parseInt(e.target.value) || 0 })}
                  variant="bordered"
                />
                <Input
                  label="Victims"
                  type="number"
                  min="0"
                  value={formData.victimCount.toString()}
                  onChange={(e) => setFormData({ ...formData, victimCount: parseInt(e.target.value) || 0 })}
                  variant="bordered"
                />
              </div>

              <Textarea
                label="Narrative"
                placeholder="Detailed description of the incident..."
                value={formData.narrative}
                onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                minRows={4}
                variant="bordered"
              />

              <Textarea
                label="Evidence Notes (Optional)"
                placeholder="Description of collected evidence..."
                value={formData.evidenceNotes}
                onChange={(e) => setFormData({ ...formData, evidenceNotes: e.target.value })}
                minRows={3}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="shadow"
              onPress={handleCreate}
              isLoading={loading}
              className="font-semibold"
              startContent={<Plus />}
            >
              Create Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Report Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          {selectedReport && (
            <>
              <ModalHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg">{selectedReport.reportNumber}</span>
                      <Chip size="sm" color={getStatusColor(selectedReport.status) as any} variant="bordered">
                        {selectedReport.status.replace("_", " ")}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{selectedReport.title}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Incident Details */}
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4 space-y-3">
                      <h4 className="font-bold text-white">Incident Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <p className="text-white font-semibold">{(selectedReport.type || 'INCIDENT').replace("_", " ")}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Date & Time:</span>
                          <p className="text-white font-semibold">{new Date(selectedReport.occurredAt).toLocaleString()}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Location:</span>
                          <p className="text-white font-semibold">{selectedReport.location}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Officer Info */}
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Reporting Officer</h4>
                      <div className="flex items-center gap-3">
                        <Avatar name={selectedReport.reportedBy} size="md" />
                        <div>
                          <p className="font-semibold text-white">{selectedReport.reportedBy}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Parties Involved */}
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Parties Involved</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Chip color="primary" variant="flat">{selectedReport.witnessCount}</Chip>
                          <span className="text-sm text-gray-300">Witnesses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip color="warning" variant="flat">{selectedReport.suspectCount}</Chip>
                          <span className="text-sm text-gray-300">Suspects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip color="danger" variant="flat">{selectedReport.victimCount}</Chip>
                          <span className="text-sm text-gray-300">Victims</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Narrative */}
                  {selectedReport.narrative && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-3">Officer Narrative</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedReport.narrative}</p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Evidence */}
                  {selectedReport.evidenceNotes && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          Evidence Notes
                        </h4>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedReport.evidenceNotes}</p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Status Actions */}
                  {selectedReport.status !== "CLOSED" && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-3">Status Actions</h4>
                        <div className="flex items-center gap-2">
                          {selectedReport.status === "DRAFT" && (
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => handleUpdateStatus(selectedReport.id, "SUBMITTED")}
                            >
                              Submit Report
                            </Button>
                          )}
                          {selectedReport.status === "SUBMITTED" && (
                            <Button
                              size="sm"
                              color="warning"
                              onPress={() => handleUpdateStatus(selectedReport.id, "UNDER_REVIEW")}
                            >
                              Move to Review
                            </Button>
                          )}
                          {selectedReport.status === "UNDER_REVIEW" && (
                            <>
                              <Button
                                size="sm"
                                color="success"
                                onPress={() => handleUpdateStatus(selectedReport.id, "APPROVED")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={() => handleUpdateStatus(selectedReport.id, "DRAFT")}
                              >
                                Return to Draft
                              </Button>
                            </>
                          )}
                          {selectedReport.status === "APPROVED" && (
                            <Button
                              size="sm"
                              color="default"
                              onPress={() => handleUpdateStatus(selectedReport.id, "CLOSED")}
                            >
                              Close Report
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onDetailClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
