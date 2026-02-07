"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { Users, MapPin, Clock, Radio, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface BackupRequest {
  id: string;
  requestingUnit: string;
  department: string;
  callNumber: string | null;
  location: string;
  urgency: string;
  reason: string | null;
  status: string;
  requestedAt: string;
}

export function BackupRequestSystem() {
  const [requests, setRequests] = useState<BackupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    requestingUnit: "",
    department: "POLICE",
    callNumber: "",
    location: "",
    urgency: "ROUTINE",
    reason: "",
  });

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/cad/backup");
      if (!response.ok) throw new Error("Failed to fetch backup requests");
      const data = await response.json();
      setRequests(data.requests);
    } catch (error) {
      console.error("Failed to fetch backup requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.requestingUnit || !formData.location) {
      toast.error("Unit and location are required");
      return;
    }

    try {
      const response = await fetch("/api/cad/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create backup request");

      toast.success("Backup request sent");
      onClose();
      fetchRequests();

      setFormData({
        requestingUnit: "",
        department: "POLICE",
        callNumber: "",
        location: "",
        urgency: "ROUTINE",
        reason: "",
      });
    } catch (error) {
      toast.error("Failed to create backup request");
    }
  };

  const handleRespond = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/cad/backup/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update backup request");

      toast.success(`Backup request ${status.toLowerCase()}`);
      fetchRequests();
    } catch (error) {
      toast.error("Failed to update backup request");
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "EMERGENCY":
        return "danger";
      case "URGENT":
        return "warning";
      case "ROUTINE":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACKNOWLEDGED":
        return "primary";
      case "ENROUTE":
        return "secondary";
      case "ARRIVED":
        return "success";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "POLICE":
        return "primary";
      case "FIRE":
        return "danger";
      case "EMS":
        return "warning";
      default:
        return "default";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return date.toLocaleTimeString();
  };

  const activeRequests = requests.filter(
    (r) => r.status !== "ARRIVED" && r.status !== "CANCELLED"
  );

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex justify-between items-center pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
              <Users className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Backup Requests</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  {activeRequests.length} active request{activeRequests.length !== 1 ? 's' : ''}
                </span>
                {activeRequests.filter(r => r.urgency === "EMERGENCY").length > 0 && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1.5 text-red-400 font-bold animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      {activeRequests.filter(r => r.urgency === "EMERGENCY").length} emergency
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            color="primary"
            variant="shadow"
            startContent={<Users className="w-4 h-4" />}
            onClick={onOpen}
            className="font-semibold"
          >
            Request Backup
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          {activeRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">All Clear</h4>
              <p className="text-sm text-gray-400">No active backup requests at this time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((request) => {
                const isEmergency = request.urgency === "EMERGENCY";
                const borderColor = isEmergency 
                  ? "border-red-500/50" 
                  : request.urgency === "URGENT"
                  ? "border-yellow-500/30"
                  : "border-blue-500/30";
                  
                return (
                  <Card
                    key={request.id}
                    className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 ${borderColor} hover:shadow-lg transition-all ${
                      isEmergency ? "animate-pulse shadow-red-900/30" : ""
                    }`}
                  >
                    <CardBody className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Radio className="w-5 h-5 text-blue-400" />
                            <span className="font-bold text-white text-lg">
                              {request.requestingUnit}
                            </span>
                            <Chip
                              size="sm"
                              color={getDepartmentColor(request.department) as any}
                              variant="solid"
                              className="font-bold"
                            >
                              {request.department}
                            </Chip>
                            <Chip
                              size="sm"
                              color={getUrgencyColor(request.urgency) as any}
                              variant="solid"
                              className="font-bold"
                              startContent={
                                request.urgency === "EMERGENCY" ? (
                                  <AlertTriangle className="w-3 h-3" />
                                ) : undefined
                              }
                            >
                              {request.urgency}
                            </Chip>
                          </div>

                          <div className="space-y-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-200">
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span className="font-semibold">{request.location}</span>
                            </div>

                            {request.callNumber && (
                              <div className="text-gray-300">
                                <span className="text-gray-500">Call:</span> <span className="font-mono text-blue-300">{request.callNumber}</span>
                              </div>
                            )}

                            {request.reason && (
                              <p className="text-gray-300 leading-relaxed">{request.reason}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTime(request.requestedAt)}</span>
                            <span>•</span>
                            <Chip
                              size="sm"
                              color={getStatusColor(request.status) as any}
                              variant="flat"
                              className="font-semibold"
                            >
                              {request.status}
                            </Chip>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {request.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                color="primary"
                                variant="shadow"
                                onClick={() =>
                                  handleRespond(request.id, "ACKNOWLEDGED")
                                }
                                className="font-semibold"
                              >
                                Acknowledge
                              </Button>
                              <Button
                                size="sm"
                                color="default"
                                variant="flat"
                                onClick={() =>
                                  handleRespond(request.id, "CANCELLED")
                                }
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {request.status === "ACKNOWLEDGED" && (
                            <Button
                              size="sm"
                              color="secondary"
                              variant="shadow"
                              onClick={() => handleRespond(request.id, "ENROUTE")}
                              className="font-semibold"
                            >
                              En Route
                            </Button>
                          )}
                          {request.status === "ENROUTE" && (
                            <Button
                              size="sm"
                              color="success"
                              variant="shadow"
                              onClick={() => handleRespond(request.id, "ARRIVED")}
                              className="font-semibold"
                            >
                              Arrived
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Request Backup Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>Request Backup</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Unit Callsign"
                placeholder="A-01"
                value={formData.requestingUnit}
                onChange={(e) =>
                  setFormData({ ...formData, requestingUnit: e.target.value })
                }
                isRequired
              />

              <Select
                label="Department"
                selectedKeys={[formData.department]}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
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

              <Select
                label="Urgency"
                selectedKeys={[formData.urgency]}
                onChange={(e) =>
                  setFormData({ ...formData, urgency: e.target.value })
                }
              >
                <SelectItem key="ROUTINE">
                  Routine
                </SelectItem>
                <SelectItem key="URGENT">
                  Urgent
                </SelectItem>
                <SelectItem key="EMERGENCY">
                  Emergency
                </SelectItem>
              </Select>

              <Input
                label="Location"
                placeholder="123 Main St"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                isRequired
              />

              <Input
                label="Call Number (optional)"
                placeholder="2025-001234"
                value={formData.callNumber}
                onChange={(e) =>
                  setFormData({ ...formData, callNumber: e.target.value })
                }
              />

              <Textarea
                label="Reason"
                placeholder="Describe the situation..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                minRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              Request Backup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
