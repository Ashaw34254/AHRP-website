"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Select,
  SelectItem,
  Textarea,
  Divider,
  Avatar,
} from "@nextui-org/react";
import {
  MapPin,
  Phone,
  Clock,
  User,
  Radio,
  MessageSquare,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import { CallAttachments } from "@/components/CallAttachments";

interface Call {
  id: string;
  callNumber: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  postal: string | null;
  description: string;
  caller: string | null;
  callerPhone: string | null;
  createdAt: string;
  dispatchedAt: string | null;
  closedAt: string | null;
  units: Array<{
    id: string;
    callsign: string;
    status: string;
    officers: Array<{
      name: string;
      callsign: string;
      badge: string | null;
    }>;
  }>;
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    officer: {
      firstName: string;
      lastName: string;
      badgeNumber: string | null;
    };
  }>;
  createdBy: {
    name: string | null;
    email: string;
  };
}

interface Unit {
  id: string;
  callsign: string;
  department: string;
  status: string;
}

interface CADCallDetailsProps {
  callId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const STATUSES = ["PENDING", "DISPATCHED", "ACTIVE", "CLOSED", "CANCELLED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function CADCallDetails({ callId, isOpen, onClose, onUpdate }: CADCallDetailsProps) {
  const [call, setCall] = useState<Call | null>(null);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [selectedOfficerId] = useState("dev-officer-1"); // In real app, get from session

  const fetchCallDetails = async () => {
    try {
      const response = await fetch(`/api/cad/calls/${callId}`);
      if (!response.ok) throw new Error("Failed to fetch call");
      const data = await response.json();
      setCall(data.call);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load call details");
    }
  };

  const fetchAvailableUnits = async () => {
    try {
      const response = await fetch("/api/cad/units");
      if (!response.ok) throw new Error("Failed to fetch units");
      const data = await response.json();
      setAvailableUnits(
        data.units.filter((u: Unit) => u.status === "AVAILABLE" || u.status === "BUSY")
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen && callId) {
      fetchCallDetails();
      fetchAvailableUnits();
    }
  }, [isOpen, callId]);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Call status updated");
      fetchCallDetails();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) throw new Error("Failed to update priority");

      toast.success("Priority updated");
      fetchCallDetails();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update priority");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUnit = async (unitId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId }),
      });

      if (!response.ok) throw new Error("Failed to assign unit");

      toast.success("Unit assigned");
      fetchCallDetails();
      fetchAvailableUnits();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to assign unit");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignUnit = async (unitId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}/assign?unitId=${unitId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to unassign unit");

      toast.success("Unit unassigned");
      fetchCallDetails();
      fetchAvailableUnits();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to unassign unit");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: noteContent,
          officerId: selectedOfficerId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      toast.success("Note added");
      setNoteContent("");
      fetchCallDetails();
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCall = async () => {
    if (!window.confirm("Are you sure you want to close this call? This will move it to call history.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cad/calls/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED" }),
      });

      if (!response.ok) throw new Error("Failed to close call");

      toast.success("Call closed and moved to history");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to close call");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "danger";
      case "HIGH": return "warning";
      case "MEDIUM": return "primary";
      case "LOW": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success";
      case "DISPATCHED": return "warning";
      case "PENDING": return "default";
      case "CLOSED": return "success";
      case "CANCELLED": return "danger";
      default: return "default";
    }
  };

  if (!call) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 border border-gray-800",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white">{call.callNumber}</span>
              <Chip size="sm" color={getPriorityColor(call.priority)} variant="flat">
                {call.priority}
              </Chip>
              <Chip size="sm" color={getStatusColor(call.status)} variant="flat">
                {call.status}
              </Chip>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-normal">
            {call.type.replace(/_/g, " ")}
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Location & Caller Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Location</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white">{call.location}</p>
                    {call.postal && (
                      <p className="text-sm text-gray-400">Postal: {call.postal}</p>
                    )}
                  </div>
                </div>
              </div>

              {call.caller && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Caller</h4>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-white">{call.caller}</p>
                      {call.callerPhone && (
                        <p className="text-sm text-gray-400">{call.callerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
              <p className="text-white">{call.description}</p>
            </div>

            <Divider className="bg-gray-800" />

            {/* Status & Priority Controls */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                selectedKeys={[call.status]}
                onChange={(e) => handleStatusChange(e.target.value)}
                isDisabled={loading}
                classNames={{
                  trigger: "bg-gray-800 border-gray-700",
                }}
              >
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Priority"
                selectedKeys={[call.priority]}
                onChange={(e) => handlePriorityChange(e.target.value)}
                isDisabled={loading}
                classNames={{
                  trigger: "bg-gray-800 border-gray-700",
                }}
              >
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Divider className="bg-gray-800" />

            {/* Assigned Units */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Assigned Units</h4>
              <div className="space-y-2 mb-4">
                {call.units.length > 0 ? (
                  call.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Radio className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-semibold text-white">{unit.callsign}</p>
                          <p className="text-sm text-gray-400">{unit.status}</p>
                          {unit.officers.length > 0 && (
                            <div className="flex gap-2 mt-1">
                              {unit.officers.map((officer, idx) => (
                                <span key={idx} className="text-xs text-gray-500">
                                  {officer.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<X className="w-3 h-3" />}
                        onClick={() => handleUnassignUnit(unit.id)}
                        isDisabled={loading}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No units assigned</p>
                )}
              </div>

              {availableUnits.length > 0 && (
                <Select
                  label="Assign Unit"
                  placeholder="Select a unit to assign"
                  onChange={(e) => e.target.value && handleAssignUnit(e.target.value)}
                  isDisabled={loading}
                  classNames={{
                    trigger: "bg-gray-800 border-gray-700",
                  }}
                >
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.callsign} - {unit.department}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>

            <Divider className="bg-gray-800" />

            {/* Notes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Call Notes</h4>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {call.notes.length > 0 ? (
                  call.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Avatar
                          size="sm"
                          name={`${note.officer.firstName} ${note.officer.lastName}`}
                          className="w-6 h-6"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">
                              {note.officer.badgeNumber ? `${note.officer.badgeNumber} - ` : ""}{note.officer.firstName} {note.officer.lastName}
                            </span>
                            <span className="text-xs text-gray-500" suppressHydrationWarning>
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No notes yet</p>
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note to this call..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  minRows={2}
                  classNames={{
                    input: "bg-gray-800",
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />
                <Button
                  color="primary"
                  onClick={handleAddNote}
                  isDisabled={!noteContent.trim() || loading}
                  startContent={<MessageSquare className="w-4 h-4" />}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Call Attachments */}
            <Divider className="my-6" />
            <CallAttachments callId={call.id} callNumber={call.callNumber} />

            {/* Timestamps */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-gray-300" suppressHydrationWarning>
                  {new Date(call.createdAt).toLocaleString()}
                </p>
              </div>
              {call.dispatchedAt && (
                <div>
                  <p className="text-xs text-gray-500">Dispatched</p>
                  <p className="text-sm text-gray-300" suppressHydrationWarning>
                    {new Date(call.dispatchedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {call.closedAt && (
                <div>
                  <p className="text-xs text-gray-500">Closed</p>
                  <p className="text-sm text-gray-300" suppressHydrationWarning>
                    {new Date(call.closedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-gray-800">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {call?.status !== "CLOSED" && call?.status !== "CANCELLED" && (
                <>
                  <Button 
                    color="success" 
                    variant="solid"
                    startContent={<CheckCircle className="w-4 h-4" />}
                    onPress={handleCloseCall}
                    isDisabled={loading}
                    className="font-semibold"
                  >
                    Close Call
                  </Button>
                  <Button 
                    color="danger" 
                    variant="flat"
                    startContent={<X className="w-4 h-4" />}
                    onPress={() => handleStatusChange("CANCELLED")}
                    isDisabled={loading}
                  >
                    Cancel Call
                  </Button>
                </>
              )}
            </div>
            <Button variant="flat" onPress={onClose}>
              Close Window
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
