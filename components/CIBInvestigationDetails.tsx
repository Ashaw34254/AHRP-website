"use client";

import { useState, useEffect } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Tabs, Tab, Card, CardBody, CardHeader, Input, Textarea,
  Select, SelectItem, Chip, Spinner, Tooltip, Badge
} from "@heroui/react";
import {
  FileText, Clock, Paperclip, CheckSquare, User, Users, Shield,
  MapPin, Car, Phone, Building, File, Calendar, AlertTriangle,
  Lock, Edit, Save, X, Plus, ChevronDown, ChevronUp, Eye, Link2
} from "lucide-react";
import { toast } from "@/lib/toast";
import { CIBInvestigationTimeline } from "@/components/CIBInvestigationTimeline";
import { CIBEvidenceManager } from "@/components/CIBEvidenceManager";
import { CIBTaskManager } from "@/components/CIBTaskManager";

interface Investigation {
  id: string;
  investigationId: string;
  title: string;
  classification: string;
  status: string;
  priority: string;
  primaryInvestigator: string;
  secondaryInvestigators?: string[];
  summary: string;
  backgroundInfo?: string;
  linkedPersons?: string[];
  linkedVehicles?: string[];
  linkedLocations?: string[];
  linkedIncidents?: string[];
  linkedReports?: string[];
  linkedCalls?: string[];
  courtCaseId?: string;
  handoverNotes?: string;
  prosecutionBrief?: string;
  evidenceSummary?: string;
  chargeRecommendations?: any[];
  investigatorHistory?: any[];
  securityLevel: string;
  assignedTeam?: string;
  startedAt: string;
  lastActivityAt: string;
  closedAt?: string;
  timeline?: any[];
  evidence?: any[];
  notes?: any[];
  tasks?: any[];
}

interface Props {
  investigation: Investigation;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function CIBInvestigationDetails({ investigation, isOpen, onClose, onUpdate }: Props) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: investigation.title,
    classification: investigation.classification,
    priority: investigation.priority,
    status: investigation.status,
    summary: investigation.summary,
    backgroundInfo: investigation.backgroundInfo || "",
    handoverNotes: investigation.handoverNotes || "",
    prosecutionBrief: investigation.prosecutionBrief || "",
    evidenceSummary: investigation.evidenceSummary || "",
    securityLevel: investigation.securityLevel,
    assignedTeam: investigation.assignedTeam || ""
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/cad/investigations/${investigation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          updatedBy: "Current User", // TODO: Get from session
          oldStatus: investigation.status
        })
      });

      if (response.ok) {
        toast.success("Investigation updated successfully");
        setIsEditing(false);
        onUpdate();
        onClose();
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Failed to save investigation:", error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "success",
      DORMANT: "warning",
      ESCALATED: "danger",
      COURT_READY: "primary",
      CLOSED: "default",
      ARCHIVED: "default"
    };
    return colors[status] || "default";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "default",
      MEDIUM: "primary",
      HIGH: "warning",
      CRITICAL: "danger"
    };
    return colors[priority] || "default";
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 border border-gray-800",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              <h2 className="text-2xl font-bold text-white">{investigation.title}</h2>
              <p className="text-sm text-gray-400 font-mono mt-1">{investigation.investigationId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Chip 
                size="sm" 
                color={getStatusColor(investigation.status) as any}
                variant="flat"
              >
                {investigation.status.replace("_", " ")}
              </Chip>
              <Chip 
                size="sm" 
                color={getPriorityColor(investigation.priority) as any}
                variant="flat"
              >
                {investigation.priority}
              </Chip>
              {investigation.securityLevel !== "STANDARD" && (
                <Chip 
                  size="sm" 
                  startContent={<Lock className="w-3 h-3" />}
                  color="warning"
                  variant="flat"
                >
                  {investigation.securityLevel}
                </Chip>
              )}
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-4 w-full relative rounded-none p-0 border-b border-gray-800",
              cursor: "w-full bg-indigo-600",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-indigo-400"
            }}
          >
            <Tab
              key="overview"
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              }
            >
              <div className="space-y-6 py-4">
                {/* Edit Mode Toggle */}
                <div className="flex justify-end">
                  {!isEditing ? (
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<Edit className="w-4 h-4" />}
                      onPress={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        startContent={<X className="w-4 h-4" />}
                        onPress={() => {
                          setIsEditing(false);
                          setEditForm({
                            title: investigation.title,
                            classification: investigation.classification,
                            priority: investigation.priority,
                            status: investigation.status,
                            summary: investigation.summary,
                            backgroundInfo: investigation.backgroundInfo || "",
                            handoverNotes: investigation.handoverNotes || "",
                            prosecutionBrief: investigation.prosecutionBrief || "",
                            evidenceSummary: investigation.evidenceSummary || "",
                            securityLevel: investigation.securityLevel,
                            assignedTeam: investigation.assignedTeam || ""
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        startContent={<Save className="w-4 h-4" />}
                        onPress={handleSave}
                        isLoading={saving}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                {/* Basic Information */}
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardHeader className="font-semibold text-white">Basic Information</CardHeader>
                  <CardBody className="space-y-4">
                    {isEditing ? (
                      <>
                        <Input
                          label="Title"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          classNames={{ inputWrapper: "bg-gray-900 border border-gray-700" }}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            label="Classification"
                            selectedKeys={[editForm.classification]}
                            onChange={(e) => setEditForm({ ...editForm, classification: e.target.value })}
                            classNames={{ trigger: "bg-gray-900 border border-gray-700" }}
                          >
                            <SelectItem key="ASSAULT">Assault</SelectItem>
                            <SelectItem key="HOMICIDE">Homicide</SelectItem>
                            <SelectItem key="FRAUD">Fraud</SelectItem>
                            <SelectItem key="THEFT">Theft</SelectItem>
                            <SelectItem key="DRUGS">Drugs</SelectItem>
                            <SelectItem key="CORRUPTION">Corruption</SelectItem>
                            <SelectItem key="ORGANISED_CRIME">Organised Crime</SelectItem>
                            <SelectItem key="CYBERCRIME">Cybercrime</SelectItem>
                            <SelectItem key="OTHER">Other</SelectItem>
                          </Select>

                          <Select
                            label="Priority"
                            selectedKeys={[editForm.priority]}
                            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                            classNames={{ trigger: "bg-gray-900 border border-gray-700" }}
                          >
                            <SelectItem key="LOW">Low</SelectItem>
                            <SelectItem key="MEDIUM">Medium</SelectItem>
                            <SelectItem key="HIGH">High</SelectItem>
                            <SelectItem key="CRITICAL">Critical</SelectItem>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            label="Status"
                            selectedKeys={[editForm.status]}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            classNames={{ trigger: "bg-gray-900 border border-gray-700" }}
                          >
                            <SelectItem key="ACTIVE">Active</SelectItem>
                            <SelectItem key="DORMANT">Dormant</SelectItem>
                            <SelectItem key="ESCALATED">Escalated</SelectItem>
                            <SelectItem key="COURT_READY">Court Ready</SelectItem>
                            <SelectItem key="CLOSED">Closed</SelectItem>
                            <SelectItem key="ARCHIVED">Archived</SelectItem>
                          </Select>

                          <Select
                            label="Security Level"
                            selectedKeys={[editForm.securityLevel]}
                            onChange={(e) => setEditForm({ ...editForm, securityLevel: e.target.value })}
                            classNames={{ trigger: "bg-gray-900 border border-gray-700" }}
                          >
                            <SelectItem key="STANDARD">Standard</SelectItem>
                            <SelectItem key="CONFIDENTIAL">Confidential</SelectItem>
                            <SelectItem key="RESTRICTED">Restricted</SelectItem>
                            <SelectItem key="SECRET">Secret</SelectItem>
                          </Select>
                        </div>

                        <Textarea
                          label="Summary"
                          value={editForm.summary}
                          onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                          minRows={3}
                          classNames={{ inputWrapper: "bg-gray-900 border border-gray-700" }}
                        />

                        <Textarea
                          label="Background Information"
                          value={editForm.backgroundInfo}
                          onChange={(e) => setEditForm({ ...editForm, backgroundInfo: e.target.value })}
                          minRows={4}
                          classNames={{ inputWrapper: "bg-gray-900 border border-gray-700" }}
                        />
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 mb-1">Classification</p>
                            <p className="text-white">{investigation.classification.replace("_", " ")}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Primary Investigator</p>
                            <p className="text-white flex items-center gap-2">
                              <User className="w-4 h-4 text-indigo-400" />
                              {investigation.primaryInvestigator}
                            </p>
                          </div>
                          {investigation.secondaryInvestigators && investigation.secondaryInvestigators.length > 0 && (
                            <div>
                              <p className="text-gray-400 mb-1">Secondary Investigators</p>
                              <p className="text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-400" />
                                {investigation.secondaryInvestigators.length} assigned
                              </p>
                            </div>
                          )}
                          {investigation.assignedTeam && (
                            <div>
                              <p className="text-gray-400 mb-1">Assigned Team</p>
                              <p className="text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-indigo-400" />
                                {investigation.assignedTeam}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-400 mb-1">Started</p>
                            <p className="text-white flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(investigation.startedAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Last Activity</p>
                            <p className="text-white flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {new Date(investigation.lastActivityAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-400 mb-2 text-sm">Summary</p>
                          <p className="text-white">{investigation.summary}</p>
                        </div>

                        {investigation.backgroundInfo && (
                          <div>
                            <p className="text-gray-400 mb-2 text-sm">Background Information</p>
                            <p className="text-white whitespace-pre-wrap">{investigation.backgroundInfo}</p>
                          </div>
                        )}
                      </>
                    )}
                  </CardBody>
                </Card>

                {/* Linked Entities */}
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardHeader className="font-semibold text-white">Linked Entities</CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Linked Persons
                        </p>
                        <p className="text-white">
                          {investigation.linkedPersons && investigation.linkedPersons.length > 0
                            ? `${investigation.linkedPersons.length} linked`
                            : "None"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2 flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Linked Vehicles
                        </p>
                        <p className="text-white">
                          {investigation.linkedVehicles && investigation.linkedVehicles.length > 0
                            ? `${investigation.linkedVehicles.length} linked`
                            : "None"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Linked Locations
                        </p>
                        <p className="text-white">
                          {investigation.linkedLocations && investigation.linkedLocations.length > 0
                            ? `${investigation.linkedLocations.length} linked`
                            : "None"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2 flex items-center gap-2">
                          <File className="w-4 h-4" />
                          Linked Reports
                        </p>
                        <p className="text-white">
                          {investigation.linkedReports && investigation.linkedReports.length > 0
                            ? `${investigation.linkedReports.length} linked`
                            : "None"}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Court & Prosecution */}
                {(investigation.prosecutionBrief || investigation.evidenceSummary || investigation.courtCaseId) && (
                  <Card className="bg-gray-800/50 border border-gray-700">
                    <CardHeader className="font-semibold text-white">Court & Prosecution</CardHeader>
                    <CardBody className="space-y-4">
                      {investigation.courtCaseId && (
                        <div>
                          <p className="text-gray-400 mb-2 text-sm">Linked Court Case</p>
                          <p className="text-indigo-400 flex items-center gap-2">
                            <Link2 className="w-4 h-4" />
                            {investigation.courtCaseId}
                          </p>
                        </div>
                      )}

                      {investigation.prosecutionBrief && (
                        <div>
                          <p className="text-gray-400 mb-2 text-sm">Prosecution Brief</p>
                          <p className="text-white whitespace-pre-wrap">{investigation.prosecutionBrief}</p>
                        </div>
                      )}

                      {investigation.evidenceSummary && (
                        <div>
                          <p className="text-gray-400 mb-2 text-sm">Evidence Summary</p>
                          <p className="text-white whitespace-pre-wrap">{investigation.evidenceSummary}</p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            <Tab
              key="timeline"
              title={
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Timeline</span>
                  {investigation.timeline && <Badge content={investigation.timeline.length} color="primary" />}
                </div>
              }
            >
              <div className="py-4">
                <CIBInvestigationTimeline 
                  investigationId={investigation.id}
                  timeline={investigation.timeline || []}
                />
              </div>
            </Tab>

            <Tab
              key="evidence"
              title={
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  <span>Evidence</span>
                  {investigation.evidence && <Badge content={investigation.evidence.length} color="primary" />}
                </div>
              }
            >
              <div className="py-4">
                <CIBEvidenceManager
                  investigationId={investigation.id}
                  evidence={investigation.evidence || []}
                  onUpdate={onUpdate}
                />
              </div>
            </Tab>

            <Tab
              key="tasks"
              title={
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Tasks</span>
                  {investigation.tasks && <Badge content={investigation.tasks.length} color="warning" />}
                </div>
              }
            >
              <div className="py-4">
                <CIBTaskManager
                  investigationId={investigation.id}
                  tasks={investigation.tasks || []}
                  onUpdate={onUpdate}
                />
              </div>
            </Tab>

            <Tab
              key="notes"
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Notes</span>
                  {investigation.notes && <Badge content={investigation.notes.length} color="primary" />}
                </div>
              }
            >
              <div className="py-4">
                <CIBNotesSection
                  investigationId={investigation.id}
                  notes={investigation.notes || []}
                  onUpdate={onUpdate}
                />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Placeholder for notes section - will be in separate component
function CIBNotesSection({ investigationId, notes, onUpdate }: any) {
  return (
    <div className="space-y-4">
      <div className="text-center text-gray-400 py-8">
        Notes component - Implementation follows same pattern as evidence/tasks
      </div>
    </div>
  );
}
