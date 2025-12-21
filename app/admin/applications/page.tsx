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
import { useState } from "react";
import { toast } from "@/lib/toast";

interface Application {
  id: number;
  applicantName: string;
  applicantEmail: string;
  department: string;
  position: string;
  status: "pending" | "approved" | "rejected" | "reviewing";
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  notes?: string;
  experience: string;
  reason: string;
  availability: string;
  discordId?: string;
}

export default function ApplicationsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      applicantName: "John Smith",
      applicantEmail: "john@example.com",
      department: "Police",
      position: "Officer",
      status: "pending",
      submittedDate: "2024-12-10",
      experience: "5 years LEO experience",
      reason: "Want to serve the community",
      availability: "Weekdays 6pm-11pm EST",
      discordId: "john#1234"
    },
    {
      id: 2,
      applicantName: "Sarah Johnson",
      applicantEmail: "sarah@example.com",
      department: "EMS",
      position: "Paramedic",
      status: "reviewing",
      submittedDate: "2024-12-08",
      reviewedBy: "Admin",
      experience: "3 years medical RP",
      reason: "Passionate about medical roleplay",
      availability: "Flexible schedule",
      discordId: "sarah#5678"
    },
    {
      id: 3,
      applicantName: "Mike Wilson",
      applicantEmail: "mike@example.com",
      department: "Fire",
      position: "Firefighter",
      status: "approved",
      submittedDate: "2024-12-05",
      reviewedBy: "Admin",
      reviewDate: "2024-12-07",
      notes: "Excellent application, approved",
      experience: "New to RP but eager to learn",
      reason: "Love firefighting theme",
      availability: "Weekends",
      discordId: "mike#9012"
    },
    {
      id: 4,
      applicantName: "Emily Davis",
      applicantEmail: "emily@example.com",
      department: "Police",
      position: "Detective",
      status: "rejected",
      submittedDate: "2024-12-03",
      reviewedBy: "Admin",
      reviewDate: "2024-12-04",
      notes: "Insufficient experience for detective role",
      experience: "No prior RP experience",
      reason: "Interested in investigation work",
      availability: "Limited",
      discordId: "emily#3456"
    },
    {
      id: 5,
      applicantName: "Robert Brown",
      applicantEmail: "robert@example.com",
      department: "EMS",
      position: "EMT",
      status: "pending",
      submittedDate: "2024-12-12",
      experience: "2 years EMS RP",
      reason: "Want to help players",
      availability: "Daily 8pm-12am EST",
      discordId: "robert#7890"
    },
    {
      id: 6,
      applicantName: "Lisa Anderson",
      applicantEmail: "lisa@example.com",
      department: "Fire",
      position: "Fire Chief",
      status: "reviewing",
      submittedDate: "2024-12-11",
      reviewedBy: "Senior Admin",
      experience: "10+ years fire department RP",
      reason: "Leadership and mentorship experience",
      availability: "Very flexible",
      discordId: "lisa#2345"
    },
  ]);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    reviewing: applications.filter(a => a.status === "reviewing").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === "all" ? true :
                      selectedTab === "pending" ? app.status === "pending" :
                      selectedTab === "reviewing" ? app.status === "reviewing" :
                      selectedTab === "approved" ? app.status === "approved" :
                      selectedTab === "rejected" ? app.status === "rejected" : true;

    return matchesSearch && matchesTab;
  });

  const handleViewApplication = (app: Application) => {
    setSelectedApplication(app);
    setReviewNote(app.notes || "");
    onOpen();
  };

  const handleReview = (status: "approved" | "rejected") => {
    if (!selectedApplication) return;
    
    if (!reviewNote.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setApplications(prev => prev.map(app => 
      app.id === selectedApplication.id 
        ? { 
            ...app, 
            status, 
            reviewedBy: "Admin",
            reviewDate: new Date().toISOString().split('T')[0],
            notes: reviewNote
          }
        : app
    ));

    toast.success(`Application ${status === "approved" ? "approved" : "rejected"}`);
    onClose();
  };

  const handleStartReview = () => {
    if (!selectedApplication) return;
    
    setApplications(prev => prev.map(app => 
      app.id === selectedApplication.id 
        ? { ...app, status: "reviewing", reviewedBy: "Admin" }
        : app
    ));

    toast.info("Application marked as reviewing");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "warning";
      case "reviewing": return "primary";
      case "approved": return "success";
      case "rejected": return "danger";
      default: return "default";
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch(dept) {
      case "Police": return "primary";
      case "EMS": return "success";
      case "Fire": return "danger";
      default: return "default";
    }
  };

  const exportApplications = () => {
    const csv = [
      ["ID", "Applicant", "Email", "Department", "Position", "Status", "Submitted", "Reviewed By", "Review Date"],
      ...filteredApplications.map(a => [
        a.id, a.applicantName, a.applicantEmail, a.department, a.position, 
        a.status, a.submittedDate, a.reviewedBy || "N/A", a.reviewDate || "N/A"
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
            <p className="text-gray-400">Review and process department applications</p>
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
                  <Tab key="pending" title={`Pending (${stats.pending})`} />
                  <Tab key="reviewing" title={`Reviewing (${stats.reviewing})`} />
                  <Tab key="approved" title={`Approved (${stats.approved})`} />
                  <Tab key="rejected" title={`Rejected (${stats.rejected})`} />
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
                  <TableColumn>DEPARTMENT</TableColumn>
                  <TableColumn>POSITION</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>SUBMITTED</TableColumn>
                  <TableColumn>REVIEWED BY</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No applications found">
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={app.applicantName}
                            size="sm"
                          />
                          <div>
                            <p className="text-white font-medium">{app.applicantName}</p>
                            <p className="text-xs text-gray-400">{app.applicantEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getDepartmentColor(app.department)}
                        >
                          {app.department}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-white text-sm">{app.position}</span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getStatusColor(app.status)}
                          startContent={
                            app.status === "pending" ? <Clock className="w-3 h-3" /> :
                            app.status === "reviewing" ? <Eye className="w-3 h-3" /> :
                            app.status === "approved" ? <CheckCircle className="w-3 h-3" /> :
                            <XCircle className="w-3 h-3" />
                          }
                        >
                          {app.status.toUpperCase()}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {app.submittedDate}
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
