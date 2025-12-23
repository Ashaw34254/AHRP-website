"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Progress,
} from "@nextui-org/react";
import {
  Shield,
  Target,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Award,
  Calendar,
  Radio,
  Crosshair,
  MessageCircle,
  Bomb,
  Eye,
  Activity,
  Package,
  BookOpen,
  FileText,
  TrendingUp,
  Wrench,
  UserPlus,
  Edit,
  CheckSquare,
  Play,
  Pause,
  MoreVertical,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface TacticalOfficer {
  id: string;
  name: string;
  callsign: string;
  role: "TEAM_LEADER" | "BREACHER" | "SNIPER" | "NEGOTIATOR" | "MEDIC" | "K9_HANDLER" | "EXPLOSIVES" | "ENTRY_TEAM";
  team: "CIRT" | "SOG";
  status: "AVAILABLE" | "ON_DUTY" | "DEPLOYED" | "OFF_DUTY" | "TRAINING";
  qualifications: string[];
  lastTraining: string;
  responseTime: number; // minutes
  equipment: string[];
  phone: string;
  location: string;
}

interface TacticalCallout {
  id: string;
  calloutTime: string;
  incidentType: string;
  location: string;
  priority: "ROUTINE" | "URGENT" | "CRITICAL";
  status: "PENDING" | "RESPONDING" | "ON_SCENE" | "RESOLVED";
  team: "CIRT" | "SOG" | "BOTH";
  requestedBy: string;
  approvedBy?: string;
  officers: string[];
  briefing?: string;
  stagingArea?: string;
}

interface TacticalEquipment {
  id: string;
  name: string;
  category: "WEAPONS" | "ARMOR" | "BREACHING" | "MEDICAL" | "COMMUNICATIONS" | "SURVEILLANCE" | "VEHICLES";
  quantity: number;
  available: number;
  assignedTo?: string;
  status: "OPERATIONAL" | "MAINTENANCE" | "OUT_OF_SERVICE";
  lastMaintenance: string;
  nextMaintenance: string;
}

interface TrainingRecord {
  id: string;
  officerId: string;
  officerName: string;
  trainingType: string;
  date: string;
  instructor: string;
  passed: boolean;
  score?: number;
  certificationExpiry?: string;
  notes?: string;
}

interface DeploymentHistory {
  id: string;
  date: string;
  incidentType: string;
  location: string;
  team: "CIRT" | "SOG";
  officers: string[];
  duration: number; // minutes
  outcome: "SUCCESSFUL" | "PARTIAL" | "UNSUCCESSFUL";
  casualties: number;
  arrestsMade: number;
  notes: string;
}

export default function TacticalTeamManagement() {
  const [activeTab, setActiveTab] = useState("roster");
  const [officers, setOfficers] = useState<TacticalOfficer[]>([]);
  const [callouts, setCallouts] = useState<TacticalCallout[]>([]);
  const [equipment, setEquipment] = useState<TacticalEquipment[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<"ALL" | "CIRT" | "SOG">("ALL");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCalloutOpen,
    onOpen: onCalloutOpen,
    onClose: onCalloutClose,
  } = useDisclosure();
  const {
    isOpen: isOfficerOpen,
    onOpen: onOfficerOpen,
    onClose: onOfficerClose,
  } = useDisclosure();
  const {
    isOpen: isCalloutDetailOpen,
    onOpen: onCalloutDetailOpen,
    onClose: onCalloutDetailClose,
  } = useDisclosure();

  // Form state for new callout
  const [newCallout, setNewCallout] = useState({
    incidentType: "",
    location: "",
    priority: "URGENT",
    team: "CIRT",
    briefing: "",
    stagingArea: "",
  });

  // Callout detail state
  const [selectedCallout, setSelectedCallout] = useState<TacticalCallout | null>(null);
  const [calloutNotes, setCalloutNotes] = useState("");
  const [selectedOfficersForCallout, setSelectedOfficersForCallout] = useState<string[]>([]);

  // Form state for officer
  const [editingOfficer, setEditingOfficer] = useState<TacticalOfficer | null>(null);
  const [officerForm, setOfficerForm] = useState({
    name: "",
    callsign: "",
    role: "ENTRY_TEAM",
    team: "CIRT",
    status: "OFF_DUTY",
    qualifications: "",
    phone: "",
    location: "",
    equipment: "",
  });

  useEffect(() => {
    fetchOfficers();
    fetchCallouts();
    fetchEquipment();
    fetchTrainingRecords();
    fetchDeploymentHistory();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await fetch("/api/cad/tactical/officers");
      if (response.ok) {
        const data = await response.json();
        setOfficers(data.officers || []);
      }
    } catch (error) {
      console.error("Failed to fetch tactical officers:", error);
    }
  };

  const fetchCallouts = async () => {
    try {
      const response = await fetch("/api/cad/tactical/callouts");
      if (response.ok) {
        const data = await response.json();
        setCallouts(data.callouts || []);
      }
    } catch (error) {
      console.error("Failed to fetch callouts:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch("/api/cad/tactical/equipment");
      if (response.ok) {
        const data = await response.json();
        setEquipment(data.equipment || []);
      }
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
    }
  };

  const fetchTrainingRecords = async () => {
    try {
      const response = await fetch("/api/cad/tactical/training");
      if (response.ok) {
        const data = await response.json();
        setTrainingRecords(data.records || []);
      }
    } catch (error) {
      console.error("Failed to fetch training records:", error);
    }
  };

  const fetchDeploymentHistory = async () => {
    try {
      const response = await fetch("/api/cad/tactical/deployments");
      if (response.ok) {
        const data = await response.json();
        setDeploymentHistory(data.deployments || []);
      }
    } catch (error) {
      console.error("Failed to fetch deployment history:", error);
    }
  };

  const handleActivateCallout = async () => {
    try {
      const response = await fetch("/api/cad/tactical/callouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCallout),
      });

      if (response.ok) {
        toast.success("Tactical callout activated!");
        fetchCallouts();
        onCalloutClose();
        setNewCallout({
          incidentType: "",
          location: "",
          priority: "URGENT",
          team: "CIRT",
          briefing: "",
          stagingArea: "",
        });
      }
    } catch (error) {
      toast.error("Failed to activate callout");
    }
  };

  const handlePageOfficers = async (team: "CIRT" | "SOG") => {
    try {
      const response = await fetch("/api/cad/tactical/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team }),
      });

      if (response.ok) {
        toast.success(`${team} officers paged successfully`);
      }
    } catch (error) {
      toast.error("Failed to page officers");
    }
  };

  const handleAddOfficer = () => {
    setEditingOfficer(null);
    setOfficerForm({
      name: "",
      callsign: "",
      role: "ENTRY_TEAM",
      team: "CIRT",
      status: "OFF_DUTY",
      qualifications: "",
      phone: "",
      location: "",
      equipment: "",
    });
    onOfficerOpen();
  };

  const handleEditOfficer = (officer: TacticalOfficer) => {
    setEditingOfficer(officer);
    setOfficerForm({
      name: officer.name,
      callsign: officer.callsign,
      role: officer.role,
      team: officer.team,
      status: officer.status,
      qualifications: officer.qualifications.join(", "),
      phone: officer.phone,
      location: officer.location,
      equipment: officer.equipment.join(", "),
    });
    onOfficerOpen();
  };

  const handleSaveOfficer = async () => {
    try {
      const payload = {
        ...officerForm,
        qualifications: officerForm.qualifications.split(",").map((q) => q.trim()).filter(Boolean),
        equipment: officerForm.equipment.split(",").map((e) => e.trim()).filter(Boolean),
      };

      const url = editingOfficer
        ? `/api/cad/tactical/officers/${editingOfficer.id}`
        : "/api/cad/tactical/officers";

      const response = await fetch(url, {
        method: editingOfficer ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingOfficer ? "Officer updated" : "Officer added");
        fetchOfficers();
        onOfficerClose();
      } else {
        toast.error("Failed to save officer");
      }
    } catch (error) {
      toast.error("Failed to save officer");
    }
  };

  const handleDeleteOfficer = async (id: string) => {
    if (!confirm("Remove this officer from tactical team?")) return;

    try {
      const response = await fetch(`/api/cad/tactical/officers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Officer removed");
        fetchOfficers();
      } else {
        toast.error("Failed to remove officer");
      }
    } catch (error) {
      toast.error("Failed to remove officer");
    }
  };

  const handleQuickStatusUpdate = async (id: string, status: TacticalOfficer["status"]) => {
    try {
      const response = await fetch(`/api/cad/tactical/officers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success("Status updated");
        fetchOfficers();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleViewCallout = (callout: TacticalCallout) => {
    setSelectedCallout(callout);
    setCalloutNotes("");
    setSelectedOfficersForCallout(callout.officers || []);
    onCalloutDetailOpen();
  };

  const handleUpdateCalloutStatus = async (status: TacticalCallout["status"]) => {
    if (!selectedCallout) return;

    try {
      const response = await fetch(`/api/cad/tactical/callouts/${selectedCallout.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Callout status updated to ${status}`);
        fetchCallouts();
        onCalloutDetailClose();
      }
    } catch (error) {
      toast.error("Failed to update callout status");
    }
  };

  const handleAssignOfficers = async () => {
    if (!selectedCallout) return;

    try {
      const response = await fetch(`/api/cad/tactical/callouts/${selectedCallout.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officers: selectedOfficersForCallout }),
      });

      if (response.ok) {
        toast.success("Officers assigned to callout");
        fetchCallouts();
        setSelectedCallout({ ...selectedCallout, officers: selectedOfficersForCallout });
      }
    } catch (error) {
      toast.error("Failed to assign officers");
    }
  };

  const handleAddCalloutNote = async () => {
    if (!selectedCallout || !calloutNotes.trim()) return;

    try {
      const response = await fetch(`/api/cad/tactical/callouts/${selectedCallout.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: calloutNotes }),
      });

      if (response.ok) {
        toast.success("Note added");
        setCalloutNotes("");
        fetchCallouts();
      }
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleUpdateCalloutPriority = async (priority: TacticalCallout["priority"]) => {
    if (!selectedCallout) return;

    try {
      const response = await fetch(`/api/cad/tactical/callouts/${selectedCallout.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });

      if (response.ok) {
        toast.success(`Priority updated to ${priority}`);
        fetchCallouts();
        setSelectedCallout({ ...selectedCallout, priority });
      }
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const getElapsedTime = (calloutTime: string) => {
    const elapsed = Date.now() - new Date(calloutTime).getTime();
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const availableOfficers = officers.filter(
    (o) => o.status === "AVAILABLE" || o.status === "ON_DUTY"
  );

  const getRoleIcon = (role: TacticalOfficer["role"]) => {
    switch (role) {
      case "TEAM_LEADER": return <Shield className="w-4 h-4" />;
      case "BREACHER": return <Target className="w-4 h-4" />;
      case "SNIPER": return <Crosshair className="w-4 h-4" />;
      case "NEGOTIATOR": return <MessageCircle className="w-4 h-4" />;
      case "EXPLOSIVES": return <Bomb className="w-4 h-4" />;
      case "MEDIC": return <Activity className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: TacticalOfficer["status"]) => {
    switch (status) {
      case "AVAILABLE": return "success";
      case "ON_DUTY": return "primary";
      case "DEPLOYED": return "warning";
      case "OFF_DUTY": return "default";
      case "TRAINING": return "secondary";
      default: return "default";
    }
  };

  const filteredOfficers = officers.filter(
    (officer) => selectedTeam === "ALL" || officer.team === selectedTeam
  );

  const teamStats = {
    CIRT: {
      total: officers.filter((o) => o.team === "CIRT").length,
      available: officers.filter((o) => o.team === "CIRT" && o.status === "AVAILABLE").length,
      deployed: officers.filter((o) => o.team === "CIRT" && o.status === "DEPLOYED").length,
    },
    SOG: {
      total: officers.filter((o) => o.team === "SOG").length,
      available: officers.filter((o) => o.team === "SOG" && o.status === "AVAILABLE").length,
      deployed: officers.filter((o) => o.team === "SOG" && o.status === "DEPLOYED").length,
    },
  };

  const activeCallouts = callouts.filter((c) => c.status !== "RESOLVED");

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">CIRT Status</p>
                <p className="text-2xl font-bold">{teamStats.CIRT.available}/{teamStats.CIRT.total}</p>
                <p className="text-xs text-gray-400">Available Officers</p>
              </div>
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
            <Progress
              value={(teamStats.CIRT.available / teamStats.CIRT.total) * 100}
              color="primary"
              className="mt-2"
            />
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-700">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">SOG Status</p>
                <p className="text-2xl font-bold">{teamStats.SOG.available}/{teamStats.SOG.total}</p>
                <p className="text-xs text-gray-400">Available Officers</p>
              </div>
              <Target className="w-12 h-12 text-red-400" />
            </div>
            <Progress
              value={(teamStats.SOG.available / teamStats.SOG.total) * 100}
              color="danger"
              className="mt-2"
            />
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-700">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Callouts</p>
                <p className="text-2xl font-bold">{activeCallouts.length}</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-400" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          color="danger"
          startContent={<AlertTriangle className="w-4 h-4" />}
          onPress={onCalloutOpen}
        >
          Activate Tactical Callout
        </Button>
        <Button
          color="success"
          variant="flat"
          startContent={<Users className="w-4 h-4" />}
          onPress={handleAddOfficer}
        >
          Add Officer
        </Button>
        <Button
          color="primary"
          variant="flat"
          startContent={<Phone className="w-4 h-4" />}
          onPress={() => handlePageOfficers("CIRT")}
        >
          Page CIRT Team
        </Button>
        <Button
          color="danger"
          variant="flat"
          startContent={<Phone className="w-4 h-4" />}
          onPress={() => handlePageOfficers("SOG")}
        >
          Page SOG Team
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            color="primary"
          >
            <Tab key="roster" title={<div className="flex items-center gap-2"><Users className="w-4 h-4" />Team Roster</div>}>
              <div className="space-y-4 mt-4">
                {/* Team Filter */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color={selectedTeam === "ALL" ? "primary" : "default"}
                    variant={selectedTeam === "ALL" ? "solid" : "flat"}
                    onPress={() => setSelectedTeam("ALL")}
                  >
                    All Teams
                  </Button>
                  <Button
                    size="sm"
                    color={selectedTeam === "CIRT" ? "primary" : "default"}
                    variant={selectedTeam === "CIRT" ? "solid" : "flat"}
                    onPress={() => setSelectedTeam("CIRT")}
                  >
                    CIRT
                  </Button>
                  <Button
                    size="sm"
                    color={selectedTeam === "SOG" ? "danger" : "default"}
                    variant={selectedTeam === "SOG" ? "solid" : "flat"}
                    onPress={() => setSelectedTeam("SOG")}
                  >
                    SOG
                  </Button>
                </div>

                {/* Officer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOfficers.map((officer) => (
                    <Card key={officer.id} className="border border-gray-700">
                      <CardBody>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold">{officer.name}</p>
                            <p className="text-sm text-gray-400">{officer.callsign}</p>
                          </div>
                          <Chip
                            size="sm"
                            color={officer.team === "CIRT" ? "primary" : "danger"}
                            variant="flat"
                          >
                            {officer.team}
                          </Chip>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          {getRoleIcon(officer.role)}
                          <span className="text-sm">{officer.role.replace(/_/g, " ")}</span>
                        </div>

                        <Select
                          size="sm"
                          label="Status"
                          selectedKeys={[officer.status]}
                          onChange={(e) => handleQuickStatusUpdate(officer.id, e.target.value as any)}
                          className="mb-2"
                        >
                          <SelectItem key="AVAILABLE" value="AVAILABLE">Available</SelectItem>
                          <SelectItem key="ON_DUTY" value="ON_DUTY">On Duty</SelectItem>
                          <SelectItem key="DEPLOYED" value="DEPLOYED">Deployed</SelectItem>
                          <SelectItem key="OFF_DUTY" value="OFF_DUTY">Off Duty</SelectItem>
                          <SelectItem key="TRAINING" value="TRAINING">Training</SelectItem>
                        </Select>

                        <div className="space-y-1 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{officer.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>Response: {officer.responseTime} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-3 h-3" />
                            <span>{officer.qualifications.length} Certifications</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={() => handleEditOfficer(officer)}
                            className="flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleDeleteOfficer(officer.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>

            <Tab key="callouts" title={<div className="flex items-center gap-2"><Radio className="w-4 h-4" />Active Callouts</div>}>
              <div className="space-y-4 mt-4">
                {activeCallouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No active tactical callouts</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeCallouts.map((callout) => (
                      <Card key={callout.id} className="border border-orange-700">
                        <CardBody>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-lg">{callout.incidentType}</p>
                            <p className="text-sm text-gray-400">{callout.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <Chip
                              size="sm"
                              color={callout.priority === "CRITICAL" ? "danger" : "warning"}
                              variant="flat"
                            >
                              {callout.priority}
                            </Chip>
                            <Chip
                              size="sm"
                              color={callout.team === "CIRT" ? "primary" : "danger"}
                              variant="flat"
                            >
                              {callout.team}
                            </Chip>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Callout Time</p>
                            <p>{new Date(callout.calloutTime).toLocaleTimeString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Status</p>
                            <Chip size="sm" color="warning" variant="flat">
                              {callout.status}
                            </Chip>
                          </div>
                          <div>
                            <p className="text-gray-400">Requested By</p>
                            <p>{callout.requestedBy}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Officers Assigned</p>
                            <p>{callout.officers.length} Officers</p>
                          </div>
                        </div>

                        {callout.stagingArea && (
                          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700">
                            <p className="text-sm font-semibold mb-1">Staging Area</p>
                            <p className="text-sm">{callout.stagingArea}</p>
                          </div>
                        )}

                        {callout.briefing && (
                          <div className="mt-2 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-sm font-semibold mb-1">Briefing</p>
                            <p className="text-sm text-gray-300">{callout.briefing}</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                  </div>
                )}
              </div>
            </Tab>

            <Tab key="equipment" title={<div className="flex items-center gap-2"><Package className="w-4 h-4" />Equipment</div>}>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipment.map((item) => (
                    <Card key={item.id} className="border border-gray-700">
                      <CardBody>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.category}</p>
                          </div>
                          <Chip
                            size="sm"
                            color={item.status === "OPERATIONAL" ? "success" : item.status === "MAINTENANCE" ? "warning" : "danger"}
                            variant="flat"
                          >
                            {item.status}
                          </Chip>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Available:</span>
                            <span className="font-semibold">{item.available} / {item.quantity}</span>
                          </div>
                          <Progress
                            value={(item.available / item.quantity) * 100}
                            color={item.available > 0 ? "success" : "danger"}
                            size="sm"
                          />
                          {item.assignedTo && (
                            <div className="text-xs text-gray-400">
                              Assigned to: {item.assignedTo}
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            <div>Last Maintenance: {new Date(item.lastMaintenance).toLocaleDateString()}</div>
                            <div>Next Due: {new Date(item.nextMaintenance).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>

            <Tab key="training" title={<div className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Training</div>}>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-3">
                  {trainingRecords.map((record) => (
                    <Card key={record.id} className="border border-gray-700">
                      <CardBody>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold">{record.officerName}</p>
                              <Chip size="sm" color={record.passed ? "success" : "danger"} variant="flat">
                                {record.passed ? "PASSED" : "FAILED"}
                              </Chip>
                            </div>
                            <p className="text-sm text-gray-400">{record.trainingType}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                              <div>
                                <p className="text-gray-400">Date</p>
                                <p>{new Date(record.date).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Instructor</p>
                                <p>{record.instructor}</p>
                              </div>
                              {record.score && (
                                <div>
                                  <p className="text-gray-400">Score</p>
                                  <p className="font-semibold">{record.score}%</p>
                                </div>
                              )}
                              {record.certificationExpiry && (
                                <div>
                                  <p className="text-gray-400">Cert Expires</p>
                                  <p>{new Date(record.certificationExpiry).toLocaleDateString()}</p>
                                </div>
                              )}
                            </div>
                            {record.notes && (
                              <p className="text-xs text-gray-400 mt-2">{record.notes}</p>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>

            <Tab key="history" title={<div className="flex items-center gap-2"><FileText className="w-4 h-4" />Deployment History</div>}>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="bg-green-900/20 border border-green-700">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Successful</p>
                          <p className="text-2xl font-bold">
                            {deploymentHistory.filter(d => d.outcome === "SUCCESSFUL").length}
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-yellow-900/20 border border-yellow-700">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Partial Success</p>
                          <p className="text-2xl font-bold">
                            {deploymentHistory.filter(d => d.outcome === "PARTIAL").length}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="bg-red-900/20 border border-red-700">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Arrests</p>
                          <p className="text-2xl font-bold">
                            {deploymentHistory.reduce((sum, d) => sum + d.arrestsMade, 0)}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {deploymentHistory.map((deployment) => (
                    <Card key={deployment.id} className="border border-gray-700">
                      <CardBody>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-lg">{deployment.incidentType}</p>
                            <p className="text-sm text-gray-400">{deployment.location}</p>
                            <p className="text-xs text-gray-500">{new Date(deployment.date).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Chip
                              size="sm"
                              color={
                                deployment.outcome === "SUCCESSFUL" ? "success" :
                                deployment.outcome === "PARTIAL" ? "warning" : "danger"
                              }
                              variant="flat"
                            >
                              {deployment.outcome}
                            </Chip>
                            <Chip size="sm" color={deployment.team === "CIRT" ? "primary" : "danger"} variant="flat">
                              {deployment.team}
                            </Chip>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Duration</p>
                            <p className="font-semibold">{deployment.duration} min</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Officers</p>
                            <p className="font-semibold">{deployment.officers.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Arrests</p>
                            <p className="font-semibold">{deployment.arrestsMade}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Casualties</p>
                            <p className={deployment.casualties > 0 ? "font-semibold text-red-400" : "font-semibold"}>
                              {deployment.casualties}
                            </p>
                          </div>
                        </div>
                        {deployment.notes && (
                          <div className="mt-3 p-2 bg-gray-800/50 rounded text-sm">
                            <p className="text-gray-300">{deployment.notes}</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Officer Add/Edit Modal */}
      <Modal isOpen={isOfficerOpen} onClose={onOfficerClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            {editingOfficer ? "Edit Officer" : "Add Tactical Officer"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Officer Name"
                placeholder="Full name"
                value={officerForm.name}
                onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                isRequired
              />

              <Input
                label="Callsign"
                placeholder="e.g., CIRT-1, SOG-6"
                value={officerForm.callsign}
                onChange={(e) => setOfficerForm({ ...officerForm, callsign: e.target.value })}
                isRequired
              />

              <Select
                label="Team"
                selectedKeys={[officerForm.team]}
                onChange={(e) => setOfficerForm({ ...officerForm, team: e.target.value as any })}
                isRequired
              >
                <SelectItem key="CIRT" value="CIRT">CIRT - Critical Incident Response</SelectItem>
                <SelectItem key="SOG" value="SOG">SOG - Special Operations Group</SelectItem>
              </Select>

              <Select
                label="Role"
                selectedKeys={[officerForm.role]}
                onChange={(e) => setOfficerForm({ ...officerForm, role: e.target.value as any })}
                isRequired
              >
                <SelectItem key="TEAM_LEADER" value="TEAM_LEADER">Team Leader</SelectItem>
                <SelectItem key="BREACHER" value="BREACHER">Breacher</SelectItem>
                <SelectItem key="SNIPER" value="SNIPER">Sniper</SelectItem>
                <SelectItem key="NEGOTIATOR" value="NEGOTIATOR">Negotiator</SelectItem>
                <SelectItem key="MEDIC" value="MEDIC">Tactical Medic</SelectItem>
                <SelectItem key="K9_HANDLER" value="K9_HANDLER">K9 Handler</SelectItem>
                <SelectItem key="EXPLOSIVES" value="EXPLOSIVES">Explosives Specialist</SelectItem>
                <SelectItem key="ENTRY_TEAM" value="ENTRY_TEAM">Entry Team</SelectItem>
              </Select>

              <Select
                label="Status"
                selectedKeys={[officerForm.status]}
                onChange={(e) => setOfficerForm({ ...officerForm, status: e.target.value as any })}
              >
                <SelectItem key="AVAILABLE" value="AVAILABLE">Available</SelectItem>
                <SelectItem key="ON_DUTY" value="ON_DUTY">On Duty</SelectItem>
                <SelectItem key="DEPLOYED" value="DEPLOYED">Deployed</SelectItem>
                <SelectItem key="OFF_DUTY" value="OFF_DUTY">Off Duty</SelectItem>
                <SelectItem key="TRAINING" value="TRAINING">Training</SelectItem>
              </Select>

              <Input
                label="Location"
                placeholder="Current location or station"
                value={officerForm.location}
                onChange={(e) => setOfficerForm({ ...officerForm, location: e.target.value })}
              />

              <Input
                label="Phone"
                placeholder="Contact number"
                value={officerForm.phone}
                onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })}
              />

              <Input
                label="Qualifications"
                placeholder="Comma-separated (e.g., SWAT Certified, Hostage Rescue)"
                value={officerForm.qualifications}
                onChange={(e) => setOfficerForm({ ...officerForm, qualifications: e.target.value })}
              />

              <Input
                label="Equipment"
                placeholder="Comma-separated (e.g., M4, Ballistic Shield, Night Vision)"
                value={officerForm.equipment}
                onChange={(e) => setOfficerForm({ ...officerForm, equipment: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onOfficerClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveOfficer}>
              {editingOfficer ? "Update Officer" : "Add Officer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*               </div>

                        {callout.stagingArea && (
                          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-700">
                            <p className="text-sm font-semibold mb-1">Staging Area</p>
                            <p className="text-sm">{callout.stagingArea}</p>
                          </div>
                        )}

                        {callout.briefing && (
                          <div className="mt-2 p-3 bg-gray-800/50 rounded-lg">
                            <p className="text-sm font-semibold mb-1">Briefing</p>
                            <p className="text-sm text-gray-300">{callout.briefing}</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Callout Activation Modal */}
      <Modal isOpen={isCalloutOpen} onClose={onCalloutClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Activate Tactical Callout
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Team"
                placeholder="Select team"
                value={newCallout.team}
                onChange={(e) => setNewCallout({ ...newCallout, team: e.target.value as any })}
              >
                <SelectItem key="CIRT" value="CIRT">CIRT - Critical Incident Response</SelectItem>
                <SelectItem key="SOG" value="SOG">SOG - Special Operations Group</SelectItem>
                <SelectItem key="BOTH" value="BOTH">Both Teams</SelectItem>
              </Select>

              <Input
                label="Incident Type"
                placeholder="e.g., Hostage Situation, Active Shooter"
                value={newCallout.incidentType}
                onChange={(e) => setNewCallout({ ...newCallout, incidentType: e.target.value })}
              />

              <Input
                label="Location"
                placeholder="Full address or landmark"
                value={newCallout.location}
                onChange={(e) => setNewCallout({ ...newCallout, location: e.target.value })}
              />

              <Select
                label="Priority"
                placeholder="Select priority"
                value={newCallout.priority}
                onChange={(e) => setNewCallout({ ...newCallout, priority: e.target.value as any })}
              >
                <SelectItem key="ROUTINE" value="ROUTINE">Routine</SelectItem>
                <SelectItem key="URGENT" value="URGENT">Urgent</SelectItem>
                <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
              </Select>

              <Input
                label="Staging Area"
                placeholder="Designated staging location"
                value={newCallout.stagingArea}
                onChange={(e) => setNewCallout({ ...newCallout, stagingArea: e.target.value })}
              />

              <Input
                label="Tactical Briefing"
                placeholder="Initial situation report and instructions"
                value={newCallout.briefing}
                onChange={(e) => setNewCallout({ ...newCallout, briefing: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onCalloutClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleActivateCallout}
              startContent={<AlertTriangle className="w-4 h-4" />}
            >
              Activate Callout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
