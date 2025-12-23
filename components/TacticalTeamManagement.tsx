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

export default function TacticalTeamManagement() {
  const [activeTab, setActiveTab] = useState("roster");
  const [officers, setOfficers] = useState<TacticalOfficer[]>([]);
  const [callouts, setCallouts] = useState<TacticalCallout[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<"ALL" | "CIRT" | "SOG">("ALL");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCalloutOpen,
    onOpen: onCalloutOpen,
    onClose: onCalloutClose,
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

  useEffect(() => {
    fetchOfficers();
    fetchCallouts();
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

                        <Chip
                          size="sm"
                          color={getStatusColor(officer.status)}
                          variant="flat"
                          className="mb-2"
                        >
                          {officer.status.replace(/_/g, " ")}
                        </Chip>

                        <div className="space-y-1 text-sm text-gray-400">
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
                  activeCallouts.map((callout) => (
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
