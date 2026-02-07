"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  AlertTriangle,
  Bell,
  Shield,
  Check,
  X,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface SupervisorAlert {
  id: string;
  title: string;
  message: string;
  alertType: string;
  priority: string;
  requiresApproval: boolean;
  isApproved: boolean | null;
  isDismissed: boolean;
  createdBy: string;
  createdAt: Date;
  dismissedAt: Date | null;
  approvedBy: string | null;
  approvedAt: Date | null;
}

export function SupervisorAlerts() {
  const [alerts, setAlerts] = useState<SupervisorAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<SupervisorAlert | null>(null);
  const [selectedTab, setSelectedTab] = useState("active");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  // New alert form
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    alertType: "GENERAL",
    priority: "MEDIUM",
    requiresApproval: false,
  });

  useEffect(() => {
    fetchAlerts();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/cad/supervisor/alerts");
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.message) {
      toast.error("Title and message are required");
      return;
    }

    try {
      const response = await fetch("/api/cad/supervisor/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlert),
      });

      if (response.ok) {
        toast.success("Alert created successfully");
        setNewAlert({
          title: "",
          message: "",
          alertType: "GENERAL",
          priority: "MEDIUM",
          requiresApproval: false,
        });
        fetchAlerts();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create alert");
      }
    } catch (error) {
      toast.error("Failed to create alert");
    }
  };

  const handleApprove = async (alertId: string) => {
    try {
      const response = await fetch(`/api/cad/supervisor/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      if (response.ok) {
        toast.success("Alert approved");
        fetchAlerts();
        if (selectedAlert?.id === alertId) {
          onViewClose();
        }
      } else {
        toast.error("Failed to approve alert");
      }
    } catch (error) {
      toast.error("Failed to approve alert");
    }
  };

  const handleReject = async (alertId: string) => {
    try {
      const response = await fetch(`/api/cad/supervisor/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      });

      if (response.ok) {
        toast.success("Alert rejected");
        fetchAlerts();
        if (selectedAlert?.id === alertId) {
          onViewClose();
        }
      } else {
        toast.error("Failed to reject alert");
      }
    } catch (error) {
      toast.error("Failed to reject alert");
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      const response = await fetch(`/api/cad/supervisor/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDismissed: true }),
      });

      if (response.ok) {
        toast.success("Alert dismissed");
        fetchAlerts();
        if (selectedAlert?.id === alertId) {
          onViewClose();
        }
      } else {
        toast.error("Failed to dismiss alert");
      }
    } catch (error) {
      toast.error("Failed to dismiss alert");
    }
  };

  const handleViewAlert = (alert: SupervisorAlert) => {
    setSelectedAlert(alert);
    onViewOpen();
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
        return "default";
      default:
        return "default";
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return "danger";
      case "OFFICER_SAFETY":
        return "warning";
      case "APPROVAL_REQUEST":
        return "primary";
      case "POLICY_VIOLATION":
        return "danger";
      case "GENERAL":
        return "default";
      default:
        return "default";
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return <AlertTriangle className="w-4 h-4" />;
      case "OFFICER_SAFETY":
        return <Shield className="w-4 h-4" />;
      case "APPROVAL_REQUEST":
        return <CheckCircle className="w-4 h-4" />;
      case "POLICY_VIOLATION":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getFilteredAlerts = () => {
    let filtered = alerts;

    // Filter by tab
    if (selectedTab === "active") {
      filtered = filtered.filter((alert) => !alert.isDismissed);
    } else if (selectedTab === "pending") {
      filtered = filtered.filter(
        (alert) => alert.requiresApproval && alert.isApproved === null && !alert.isDismissed
      );
    } else if (selectedTab === "approved") {
      filtered = filtered.filter((alert) => alert.isApproved === true);
    } else if (selectedTab === "dismissed") {
      filtered = filtered.filter((alert) => alert.isDismissed);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const activeCount = alerts.filter((a) => !a.isDismissed).length;
  const pendingCount = alerts.filter(
    (a) => a.requiresApproval && a.isApproved === null && !a.isDismissed
  ).length;
  const criticalCount = alerts.filter(
    (a) => a.priority === "CRITICAL" && !a.isDismissed
  ).length;

  const filteredAlerts = getFilteredAlerts();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/10 rounded-xl border-2 border-yellow-500/30">
            <Bell className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Supervisor Alerts</h1>
            <p className="text-gray-400">Command staff notifications and approvals</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
          className="font-semibold"
        >
          New Alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border border-yellow-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-white">{activeCount}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/80 to-orange-800/80 border border-orange-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-white">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/80 to-red-800/80 border border-red-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Critical</p>
                <p className="text-3xl font-bold text-white">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/80 to-green-800/80 border border-green-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Total Today</p>
                <p className="text-3xl font-bold text-white">
                  {
                    alerts.filter(
                      (a) =>
                        new Date(a.createdAt).toDateString() === new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-300" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Input
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-xs"
          classNames={{
            input: "bg-gray-900",
            inputWrapper: "bg-gray-900 border border-gray-800",
          }}
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="warning"
          variant="underlined"
        >
          <Tab key="active" title={`Active (${activeCount})`} />
          <Tab key="pending" title={`Pending (${pendingCount})`} />
          <Tab key="approved" title="Approved" />
          <Tab key="dismissed" title="Dismissed" />
        </Tabs>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800">
          <CardBody className="p-12 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-yellow-500/10 rounded-2xl border-2 border-yellow-500/30">
              <Bell className="w-12 h-12 text-yellow-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Alerts</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm
                  ? "No alerts match your search"
                  : selectedTab === "pending"
                  ? "No alerts pending approval"
                  : selectedTab === "active"
                  ? "All clear - no active alerts"
                  : "No alerts in this category"}
              </p>
              <Button color="primary" onPress={onOpen} startContent={<Plus />}>
                Create Alert
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isCritical = alert.priority === "CRITICAL";
            const isRecent =
              new Date().getTime() - new Date(alert.createdAt).getTime() < 3600000;

            return (
              <Card
                key={alert.id}
                isPressable
                onPress={() => handleViewAlert(alert)}
                className={`
                  transition-all hover:scale-[1.01]
                  ${
                    isCritical && !alert.isDismissed
                      ? "bg-gradient-to-r from-red-900/50 to-red-800/50 border-2 border-red-500/50 animate-pulse"
                      : alert.priority === "HIGH" && !alert.isDismissed
                      ? "bg-gradient-to-r from-orange-900/50 to-orange-800/50 border-2 border-orange-500/50"
                      : alert.requiresApproval && alert.isApproved === null
                      ? "bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 border-2 border-yellow-500/50"
                      : "bg-gray-900/50 border border-gray-800"
                  }
                `}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl border-2 flex-shrink-0 ${
                        isCritical
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-yellow-500/10 border-yellow-500/30"
                      }`}
                    >
                      {getAlertTypeIcon(alert.alertType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-white">{alert.title}</h3>
                            <Chip
                              size="sm"
                              color={getPriorityColor(alert.priority)}
                              variant="solid"
                            >
                              {alert.priority}
                            </Chip>
                            <Chip
                              size="sm"
                              color={getAlertTypeColor(alert.alertType)}
                              variant="flat"
                              startContent={getAlertTypeIcon(alert.alertType)}
                            >
                              {alert.alertType.replace("_", " ")}
                            </Chip>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="font-medium text-gray-300">
                              {alert.createdBy}
                            </span>
                            <span>•</span>
                            <span>{new Date(alert.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {alert.requiresApproval && (
                            <>
                              {alert.isApproved === true && (
                                <Chip size="sm" color="success" variant="flat">
                                  Approved
                                </Chip>
                              )}
                              {alert.isApproved === false && (
                                <Chip size="sm" color="danger" variant="flat">
                                  Rejected
                                </Chip>
                              )}
                              {alert.isApproved === null && (
                                <Chip size="sm" color="warning" variant="flat">
                                  Pending
                                </Chip>
                              )}
                            </>
                          )}
                          {alert.isDismissed && (
                            <Chip size="sm" color="default" variant="flat">
                              Dismissed
                            </Chip>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Alert Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span>New Supervisor Alert</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Enter alert title"
                value={newAlert.title}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, title: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Textarea
                label="Message"
                placeholder="Enter alert message"
                value={newAlert.message}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, message: e.target.value })
                }
                minRows={4}
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Alert Type"
                  placeholder="Select type"
                  selectedKeys={[newAlert.alertType]}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, alertType: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="GENERAL">
                    General
                  </SelectItem>
                  <SelectItem key="EMERGENCY">
                    Emergency
                  </SelectItem>
                  <SelectItem key="OFFICER_SAFETY">
                    Officer Safety
                  </SelectItem>
                  <SelectItem key="APPROVAL_REQUEST">
                    Approval Request
                  </SelectItem>
                  <SelectItem key="POLICY_VIOLATION">
                    Policy Violation
                  </SelectItem>
                </Select>

                <Select
                  label="Priority"
                  placeholder="Select priority"
                  selectedKeys={[newAlert.priority]}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, priority: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="LOW">
                    Low
                  </SelectItem>
                  <SelectItem key="MEDIUM">
                    Medium
                  </SelectItem>
                  <SelectItem key="HIGH">
                    High
                  </SelectItem>
                  <SelectItem key="CRITICAL">
                    Critical
                  </SelectItem>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresApproval"
                  checked={newAlert.requiresApproval}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, requiresApproval: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="requiresApproval" className="text-sm text-gray-300">
                  Requires supervisor approval
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateAlert}
              startContent={<Plus className="w-4 h-4" />}
            >
              Create Alert
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Alert Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={onViewClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {selectedAlert && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {getAlertTypeIcon(selectedAlert.alertType)}
                  <span>{selectedAlert.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Chip
                    size="sm"
                    color={getPriorityColor(selectedAlert.priority)}
                    variant="solid"
                  >
                    {selectedAlert.priority}
                  </Chip>
                  <Chip
                    size="sm"
                    color={getAlertTypeColor(selectedAlert.alertType)}
                    variant="flat"
                  >
                    {selectedAlert.alertType.replace("_", " ")}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created by</p>
                          <p className="font-medium text-white">
                            {selectedAlert.createdBy}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created at</p>
                          <p className="font-medium text-white">
                            {new Date(selectedAlert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {selectedAlert.isDismissed && selectedAlert.dismissedAt && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Dismissed at</p>
                            <p className="font-medium text-white">
                              {new Date(selectedAlert.dismissedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {selectedAlert.isApproved !== null && (
                          <>
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Status</p>
                              <Chip
                                color={
                                  selectedAlert.isApproved ? "success" : "danger"
                                }
                                variant="flat"
                              >
                                {selectedAlert.isApproved ? "Approved" : "Rejected"}
                              </Chip>
                            </div>
                            {selectedAlert.approvedBy && (
                              <div>
                                <p className="text-sm text-gray-400 mb-1">
                                  {selectedAlert.isApproved ? "Approved" : "Rejected"} by
                                </p>
                                <p className="font-medium text-white">
                                  {selectedAlert.approvedBy}
                                </p>
                              </div>
                            )}
                            {selectedAlert.approvedAt && (
                              <div>
                                <p className="text-sm text-gray-400 mb-1">
                                  {selectedAlert.isApproved ? "Approved" : "Rejected"} at
                                </p>
                                <p className="font-medium text-white">
                                  {new Date(selectedAlert.approvedAt).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-2">Message</h4>
                      <p className="text-white whitespace-pre-wrap">
                        {selectedAlert.message}
                      </p>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex items-center gap-2 w-full justify-between">
                  <div className="flex gap-2">
                    {selectedAlert.requiresApproval &&
                      selectedAlert.isApproved === null &&
                      !selectedAlert.isDismissed && (
                        <>
                          <Button
                            color="success"
                            variant="flat"
                            onPress={() => handleApprove(selectedAlert.id)}
                            startContent={<Check className="w-4 h-4" />}
                          >
                            Approve
                          </Button>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={() => handleReject(selectedAlert.id)}
                            startContent={<X className="w-4 h-4" />}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    {!selectedAlert.isDismissed && (
                      <Button
                        color="warning"
                        variant="flat"
                        onPress={() => handleDismiss(selectedAlert.id)}
                        startContent={<X className="w-4 h-4" />}
                      >
                        Dismiss
                      </Button>
                    )}
                  </div>
                  <Button color="primary" onPress={onViewClose}>
                    Close
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
