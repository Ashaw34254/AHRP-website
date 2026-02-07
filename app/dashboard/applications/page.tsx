"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Card, 
  CardBody,
  Chip,
  Button,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
}

const statusConfig = {
  PENDING: {
    color: "warning" as const,
    icon: Clock,
    label: "Pending",
    description: "Your application is waiting to be reviewed by staff",
  },
  UNDER_REVIEW: {
    color: "primary" as const,
    icon: Eye,
    label: "Under Review",
    description: "A staff member is currently reviewing your application",
  },
  APPROVED: {
    color: "success" as const,
    icon: CheckCircle,
    label: "Approved",
    description: "Your application has been approved! Welcome to the community",
  },
  REJECTED: {
    color: "danger" as const,
    icon: XCircle,
    label: "Rejected",
    description: "Your application was not approved. Please read the feedback below",
  },
};

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [drafts, setDrafts] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchApplications();
      fetchDrafts();
    }
  }, [session]);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      const data = await response.json();
      if (data.success) {
        // Filter to only show current user's applications (excluding drafts)
        const userApps = data.applications.filter(
          (app: Application) => app.userId === session?.user?.id && !app.isDraft
        );
        setApplications(userApps);
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

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/applications?includeDrafts=true");
      const data = await response.json();
      if (data.success) {
        // Filter to only show current user's drafts
        const userDrafts = data.applications.filter(
          (app: Application) => app.userId === session?.user?.id && app.isDraft
        );
        setDrafts(userDrafts);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    }
  };

  const deleteDraft = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return;
    
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toast.success("Draft deleted");
        fetchDrafts();
      } else {
        toast.error("Failed to delete draft");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Error deleting draft");
    }
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app);
    onOpen();
  };

  const pendingCount = applications.filter(
    (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW"
  ).length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const totalCount = applications.length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400">Loading applications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-gray-400">Track your application status</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">{totalCount}</div>
              <p className="text-gray-400">Total Applications</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{pendingCount}</div>
              <p className="text-gray-400">Pending Review</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">{approvedCount}</div>
              <p className="text-gray-400">Approved</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">{drafts.length}</div>
              <p className="text-gray-400">Drafts</p>
            </CardBody>
          </Card>
        </div>

        {/* Drafts Section */}
        {drafts.length > 0 && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Draft Applications</h3>
                <Chip color="warning" variant="flat">
                  {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
                </Chip>
              </div>
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold capitalize">
                        {draft.applicationType} Application
                      </p>
                      <p className="text-sm text-gray-400">
                        Last saved: {new Date(draft.lastSavedAt || draft.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        as="a"
                        href={`/apply?draftId=${draft.id}`}
                      >
                        Continue
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => deleteDraft(draft.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Application Progress */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Approval Rate</h3>
              <span className="text-sm text-gray-400">{Math.round((approvedCount / totalCount) * 100)}%</span>
            </div>
            <Progress 
              value={(approvedCount / totalCount) * 100}
              color="success"
              className="mb-2"
            />
            <p className="text-sm text-gray-400">
              {approvedCount} of {totalCount} applications approved
            </p>
          </CardBody>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">All Applications</h2>
            <Button color="primary" as="a" href="/apply">
              Submit New Application
            </Button>
          </div>

          {applications.length === 0 ? (
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">You haven't submitted any applications yet</p>
                <Button color="primary" as="a" href="/apply">
                  Submit Your First Application
                </Button>
              </CardBody>
            </Card>
          ) : (
            applications.map((application) => {
              const statusKey = application.status as keyof typeof statusConfig;
              const status = statusConfig[statusKey] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <Card
                  key={application.id}
                  className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500 transition-colors"
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-indigo-600/20 rounded-lg">
                          <FileText className="w-6 h-6 text-indigo-400" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white capitalize">
                              {application.applicationType} Application
                            </h3>
                            <Chip
                              color={status.color}
                              variant="flat"
                              size="sm"
                              startContent={<StatusIcon className="w-3 h-3" />}
                            >
                              {status.label}
                            </Chip>
                          </div>

                          <div className="space-y-1 text-sm text-gray-400">
                            <p>
                              <strong className="text-gray-300">Submitted:</strong>{" "}
                              <span suppressHydrationWarning>
                                {new Date(application.createdAt).toLocaleDateString()}
                              </span>
                            </p>
                            {application.reviewedAt && (
                              <p>
                                <strong className="text-gray-300">Reviewed:</strong>{" "}
                                <span suppressHydrationWarning>
                                  {new Date(application.reviewedAt).toLocaleDateString()}
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-400">{status.description}</p>
                          </div>

                          {application.reviewNotes && (
                            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                              <p className="text-sm font-semibold text-gray-300 mb-1">
                                Staff Feedback:
                              </p>
                              <p className="text-sm text-gray-400">{application.reviewNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="bordered"
                        size="sm"
                        startContent={<Eye className="w-4 h-4" />}
                        onPress={() => handleViewDetails(application)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>

        {/* Application Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
          <ModalContent>
            <ModalHeader>Application Details</ModalHeader>
            <ModalBody>
              {selectedApp && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold capitalize mb-2">
                      {selectedApp.applicationType} Application
                    </h3>
                    <Chip
                      color={statusConfig[selectedApp.status as keyof typeof statusConfig]?.color || "warning"}
                      variant="flat"
                    >
                      {statusConfig[selectedApp.status as keyof typeof statusConfig]?.label || selectedApp.status}
                    </Chip>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Submitted</p>
                      <p suppressHydrationWarning>
                        {new Date(selectedApp.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedApp.reviewedAt && (
                      <div>
                        <p className="text-sm text-gray-400">Reviewed</p>
                        <p suppressHydrationWarning>
                          {new Date(selectedApp.reviewedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <Divider />

                  <div>
                    <h4 className="font-semibold mb-3">Submitted Information</h4>
                    <Accordion variant="bordered">
                      <AccordionItem key="formData" title="View All Details">
                        <div className="space-y-3">
                          {Object.entries(selectedApp.formData).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-sm text-gray-400 mb-1">{key}</p>
                              <p className="text-sm font-mono bg-gray-900/50 p-2 rounded">
                                {typeof value === "object"
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {selectedApp.reviewNotes && (
                    <>
                      <Divider />
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Review Notes</p>
                        <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg">
                          <p>{selectedApp.reviewNotes}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedApp.status === "REJECTED" && (
                    <>
                      <Divider />
                      <div className="text-center">
                        <Button color="primary" as="a" href="/apply">
                          Submit New Application
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
