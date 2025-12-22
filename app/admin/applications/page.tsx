"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody, 
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Avatar,
  Tabs,
  Tab,
  Progress
} from "@nextui-org/react";
import { 
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Calendar,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";

interface Application {
  id: string;
  userId: string;
  applicationType: string;
  status: string;
  formData: Record<string, any>;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function ApplicationsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        toast.error("Failed to load applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error loading applications");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "PENDING").length,
    reviewing: applications.filter(a => a.status === "UNDER_REVIEW").length,
    approved: applications.filter(a => a.status === "APPROVED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.applicationType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === "all" ? true :
                      selectedTab === "PENDING" ? app.status === "PENDING" :
                      selectedTab === "UNDER_REVIEW" ? app.status === "UNDER_REVIEW" :
                      selectedTab === "APPROVED" ? app.status === "APPROVED" :
                      selectedTab === "REJECTED" ? app.status === "REJECTED" : true;

    return matchesSearch && matchesTab;
  });

  const handleViewApplication = async (app: Application) => {
    try {
      const response = await fetch(`/api/applications/${app.id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedApplication(data.application);
        setReviewNote(data.application.reviewNotes || "");
        onOpen();
      } else {
        toast.error("Failed to load application details");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Error loading details");
    }
  };

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedApplication) return;
    
    if (!reviewNote.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNote,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Application ${status === "APPROVED" ? "approved" : "rejected"}`);
        onClose();
        fetchApplications();
      } else {
        toast.error(data.message || "Failed to update application");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Error updating application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartReview = async () => {
    if (!selectedApplication) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "UNDER_REVIEW",
          reviewNotes: reviewNote || "Application is being reviewed",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.info("Application marked as reviewing");
        setSelectedApplication({ ...selectedApplication, status: "UNDER_REVIEW" });
        fetchApplications();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating status");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PENDING": return "warning";
      case "UNDER_REVIEW": return "primary";
      case "APPROVED": return "success";
      case "REJECTED": return "danger";
      default: return "default";
    }
  };

  const exportApplications = () => {
    const csv = [
      ["ID", "Applicant", "Email", "Type", "Status", "Submitted", "Reviewed At"],
      ...filteredApplications.map(a => [
        a.id, a.user?.name || "Unknown", a.user?.email || "", a.applicationType, 
        a.status, new Date(a.createdAt).toLocaleDateString(), a.reviewedAt ? new Date(a.reviewedAt).toLocaleDateString() : "N/A"
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora-horizon-applications-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Applications exported successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Application Management</h1>
            <p className="text-gray-400">Review and process all applications</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            startContent={<Download className="w-4 h-4" />}
            onPress={exportApplications}
          >
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Reviewing</p>
                  <p className="text-2xl font-bold text-white">{stats.reviewing}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Tabs 
                  selectedKey={selectedTab} 
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  color="primary"
                  variant="underlined"
                >
                  <Tab key="all" title={`All (${stats.total})`} />
                  <Tab key="PENDING" title={`Pending (${stats.pending})`} />
                  <Tab key="UNDER_REVIEW" title={`Reviewing (${stats.reviewing})`} />
                  <Tab key="APPROVED" title={`Approved (${stats.approved})`} />
                  <Tab key="REJECTED" title={`Rejected (${stats.rejected})`} />
                </Tabs>

                <div className="flex gap-2 w-full md:w-auto">
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Search className="w-4 h-4 text-gray-400" />}
                    className="w-full md:w-80"
                    size="sm"
                  />
                  <Button
                    variant="flat"
                    isIconOnly
                    size="sm"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <Table 
                aria-label="Applications table"
                className="dark"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>APPLICANT</TableColumn>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>SUBMITTED</TableColumn>
                  <TableColumn>REVIEWED BY</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No applications found" isLoading={loading}>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={app.user?.name || "Unknown"}
                            size="sm"
                          />
                          <div>
                            <p className="text-white font-medium">{app.user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{app.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                        >
                          {app.applicationType}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getStatusColor(app.status)}
                          startContent={
                            app.status === "PENDING" ? <Clock className="w-3 h-3" /> :
                            app.status === "UNDER_REVIEW" ? <Eye className="w-3 h-3" /> :
                            app.status === "APPROVED" ? <CheckCircle className="w-3 h-3" /> :
                            <XCircle className="w-3 h-3" />
                          }
                        >
                          {app.status.replace("_", " ")}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.reviewedBy ? (
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <User className="w-3 h-3" />
                            {app.reviewedBy}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          startContent={<Eye className="w-4 h-4" />}
                          onPress={() => handleViewApplication(app)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Application Review Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Application Review</ModalHeader>
                <ModalBody>
                  {selectedApplication && (
                    <div className="space-y-6">
                      {/* Applicant Info */}
                      <Card className="bg-gray-800/50">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar
                              name={selectedApplication.applicantName}
                              size="lg"
                            />
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white">{selectedApplication.applicantName}</h3>
                              <p className="text-sm text-gray-400">{selectedApplication.applicantEmail}</p>
                              <div className="flex gap-2 mt-2">
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={getDepartmentColor(selectedApplication.department)}
                                >
                                  {selectedApplication.department}
                                </Chip>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={getStatusColor(selectedApplication.status)}
                                >
                                  {selectedApplication.status.toUpperCase()}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Application Details */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 font-medium">Position Applied For</label>
                          <p className="text-white mt-1">{selectedApplication.position}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 font-medium">Experience</label>
                          <p className="text-white mt-1">{selectedApplication.experience}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 font-medium">Reason for Applying</label>
                          <p className="text-white mt-1">{selectedApplication.reason}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 font-medium">Availability</label>
                          <p className="text-white mt-1">{selectedApplication.availability}</p>
                        </div>

                        {selectedApplication.discordId && (
                          <div>
                            <label className="text-sm text-gray-400 font-medium">Discord ID</label>
                            <p className="text-white mt-1">{selectedApplication.discordId}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 font-medium">Submitted Date</label>
                            <p className="text-white mt-1">{selectedApplication.submittedDate}</p>
                          </div>
                          {selectedApplication.reviewDate && (
                            <div>
                              <label className="text-sm text-gray-400 font-medium">Review Date</label>
                              <p className="text-white mt-1">{selectedApplication.reviewDate}</p>
                            </div>
                          )}
                        </div>

                        {selectedApplication.reviewedBy && (
                          <div>
                            <label className="text-sm text-gray-400 font-medium">Reviewed By</label>
                            <p className="text-white mt-1">{selectedApplication.reviewedBy}</p>
                          </div>
                        )}
                      </div>

                      {/* Review Notes */}
                      <div>
                        <Textarea
                          label="Review Notes"
                          placeholder="Add notes about this application..."
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          minRows={4}
                          isDisabled={selectedApplication.status === "approved" || selectedApplication.status === "rejected"}
                        />
                      </div>

                      {/* Existing Notes */}
                      {selectedApplication.notes && (
                        <Card className="bg-blue-900/20 border border-blue-800">
                          <CardBody className="p-4">
                            <p className="text-sm text-gray-400 mb-2">Previous Review Notes:</p>
                            <p className="text-white">{selectedApplication.notes}</p>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  {selectedApplication && selectedApplication.status === "pending" && (
                    <Button 
                      color="primary" 
                      variant="flat"
                      onPress={handleStartReview}
                    >
                      Start Review
                    </Button>
                  )}
                  {selectedApplication && (selectedApplication.status === "pending" || selectedApplication.status === "reviewing") && (
                    <>
                      <Button 
                        color="danger" 
                        onPress={() => handleReview("rejected")}
                      >
                        Reject
                      </Button>
                      <Button 
                        color="success" 
                        onPress={() => handleReview("approved")}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
