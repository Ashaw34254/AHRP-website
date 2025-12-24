"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { 
  Card, CardBody, CardHeader, Button, Input, Select, SelectItem,
  Chip, Tabs, Tab, Spinner, Modal, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, useDisclosure, Tooltip, Badge, Textarea,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from "@nextui-org/react";
import { 
  Shield, Search, Filter, Plus, Eye, AlertTriangle, Clock,
  FileText, Users, MapPin, Car, Phone, Radio, AlertOctagon,
  CheckCircle, XCircle, UserCheck, Activity, Bell, Flag,
  PlayCircle, PauseCircle, StopCircle, UserPlus, Navigation,
  ClipboardList, FileSignature, UserX, Handshake, ArrowRight,
  Zap, Target, RefreshCw, Hash, Briefcase, Home
} from "lucide-react";
import { toast } from "@/lib/toast";

// Types
interface Unit {
  id: string;
  callsign: string;
  status: string;
  statusCode?: string;
  location?: string;
  officers: Officer[];
  currentCall?: {
    id: string;
    callNumber: string;
    type: string;
    location: string;
  };
}

interface Officer {
  id: string;
  name: string;
  badgeNumber: string;
  rank: string;
}

interface Incident {
  id: string;
  callNumber: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  description: string;
  createdAt: string;
  assignedUnits: string[];
  caller?: string;
}

interface FieldInteraction {
  id: string;
  type: "PERSON_STOP" | "VEHICLE_STOP" | "WELFARE_CHECK";
  location: string;
  officerCallsign: string;
  persons?: any[];
  vehicles?: any[];
  outcome: string;
  notes?: string;
  timestamp: string;
}

export default function GeneralDutiesPage() {
  const [activeTab, setActiveTab] = useState("patrol");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);
  
  // Patrol data
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  // Incident queue
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Field interactions
  const [interactions, setInteractions] = useState<FieldInteraction[]>([]);
  
  // Modals
  const { isOpen: isIncidentOpen, onOpen: onIncidentOpen, onClose: onIncidentClose } = useDisclosure();
  const { isOpen: isStopOpen, onOpen: onStopOpen, onClose: onStopClose } = useDisclosure();
  const { isOpen: isQuickActionOpen, onOpen: onQuickActionOpen, onClose: onQuickActionClose } = useDisclosure();
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            onIncidentOpen();
            break;
          case 's':
            e.preventDefault();
            onStopOpen();
            break;
          case 'r':
            e.preventDefault();
            fetchAllData();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  const fetchAllData = () => {
    fetchPatrolData();
    fetchIncidents();
    fetchInteractions();
    setLastUpdate(new Date());
    toast.success('Data refreshed');
  };
  
  // Fetch data
  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 10 seconds if live
    const interval = setInterval(() => {
      if (isLive) {
        fetchPatrolData();
        fetchIncidents();
        fetchInteractions();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  const fetchPatrolData = async () => {
    try {
      const response = await fetch("/api/cad/units?department=POLICE");
      if (response.ok) {
        const data = await response.json();
        setUnits(data.units || []);
      }
    } catch (error) {
      console.error("Failed to fetch patrol data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch("/api/cad/calls?department=POLICE&status=PENDING,DISPATCHED,ACTIVE");
      if (response.ok) {
        const data = await response.json();
        setIncidents(data.calls || []);
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  const fetchInteractions = async () => {
    try {
      const response = await fetch("/api/cad/field-interactions?limit=20");
      if (response.ok) {
        const data = await response.json();
        setInteractions(data.interactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch interactions:", error);
    }
  };

  const updateUnitStatus = async (unitId: string, status: string, statusCode?: string) => {
    try {
      const response = await fetch(`/api/cad/units/${unitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, statusCode })
      });

      if (response.ok) {
        toast.success("Unit status updated");
        fetchPatrolData();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update unit status:", error);
      toast.error("Failed to update unit status");
    }
  };

  const assignToIncident = async (incidentId: string, unitId: string) => {
    try {
      const response = await fetch(`/api/cad/calls/${incidentId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId })
      });

      if (response.ok) {
        toast.success("Unit assigned to incident");
        fetchIncidents();
        fetchPatrolData();
      } else {
        throw new Error("Failed to assign unit");
      }
    } catch (error) {
      console.error("Failed to assign unit:", error);
      toast.error("Failed to assign unit");
    }
  };

  // Status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "success";
      case "BUSY": return "warning";
      case "ENROUTE": return "primary";
      case "ON_SCENE": return "secondary";
      case "OUT_OF_SERVICE": return "default";
      case "PANIC": return "danger";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "danger";
      case "HIGH": return "warning";
      case "MEDIUM": return "primary";
      case "LOW": return "default";
      default: return "default";
    }
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    if (statusFilter !== "all" && inc.status !== statusFilter) return false;
    if (priorityFilter !== "all" && inc.priority !== priorityFilter) return false;
    return true;
  });

  // Statistics (computed from current data)
  const stats = {
    onDuty: units.filter(u => u.status !== "OUT_OF_SERVICE").length,
    available: units.filter(u => u.status === "AVAILABLE").length,
    busy: units.filter(u => u.status === "BUSY" || u.status === "ENROUTE" || u.status === "ON_SCENE").length,
    activeIncidents: incidents.filter(i => i.status === "ACTIVE").length,
    pendingIncidents: incidents.filter(i => i.status === "PENDING").length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8 text-blue-500" />
                General Duties - Patrol Operations
              </h1>
              <Badge
                content={isLive ? 'LIVE' : 'PAUSED'}
                color={isLive ? 'success' : 'warning'}
                variant="flat"
                size="sm"
                className={isLive ? 'animate-pulse' : ''}
              />
            </div>
            <p className="text-gray-400 mt-1">
              Frontline response and patrol management • Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Tooltip content="Toggle auto-refresh">
              <Button
                isIconOnly
                variant="flat"
                color={isLive ? 'success' : 'default'}
                onPress={() => setIsLive(!isLive)}
              >
                {isLive ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              </Button>
            </Tooltip>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onIncidentOpen}
            >
              New Incident (Ctrl+N)
            </Button>
            <Button
              color="secondary"
              startContent={<UserPlus className="w-4 h-4" />}
              onPress={onStopOpen}
            >
              Log Field Stop (Ctrl+S)
            </Button>
            <Tooltip content="Refresh data (Ctrl+R)">
              <Button
                color="default"
                variant="flat"
                isIconOnly
                onPress={() => {
                  fetchPatrolData();
                  fetchIncidents();
                  fetchInteractions();
                  setLastUpdate(new Date());
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">On Duty</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.onDuty}</p>
                </div>
                <Radio className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Available</p>
                  <p className="text-2xl font-bold text-green-400">{stats.available}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border border-yellow-700/30">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Busy</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.busy}</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-700/30">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Active Jobs</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.activeIncidents}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pending Jobs</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.pendingIncidents}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-700/30">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Stops Today</p>
                  <p className="text-2xl font-bold text-indigo-400">{interactions.length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-indigo-500 opacity-50" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Original Statistics (Keep for compatibility) */}
        <div className="hidden grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Radio className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.onDuty}</p>
                  <p className="text-xs text-gray-400">On Duty</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.available}</p>
                  <p className="text-xs text-gray-400">Available</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.busy}</p>
                  <p className="text-xs text-gray-400">Busy</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeIncidents}</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingIncidents}</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          classNames={{
            tabList: "bg-gray-800/50 border border-gray-700",
            cursor: "bg-blue-600",
            tab: "text-gray-400 data-[selected=true]:text-white",
          }}
        >
          <Tab
            key="patrol"
            title={
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Patrol Status
              </div>
            }
          >
            <PatrolStatusView 
              units={units}
              onStatusUpdate={updateUnitStatus}
              onUnitSelect={setSelectedUnit}
            />
          </Tab>

          <Tab
            key="incidents"
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Incident Queue
                {incidents.length > 0 && (
                  <Badge content={incidents.length} color="danger" size="sm" />
                )}
              </div>
            }
          >
            <IncidentQueueView
              incidents={filteredIncidents}
              units={units}
              onIncidentSelect={setSelectedIncident}
              onAssignUnit={assignToIncident}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
          </Tab>

          <Tab
            key="interactions"
            title={
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Field Interactions
              </div>
            }
          >
            <FieldInteractionsView
              interactions={interactions}
              onRefresh={fetchInteractions}
            />
          </Tab>

          <Tab
            key="actions"
            title={
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Actions
              </div>
            }
          >
            <QuickActionsView />
          </Tab>
        </Tabs>

        {/* Modals */}
        <NewIncidentModal
          isOpen={isIncidentOpen}
          onClose={onIncidentClose}
          onCreate={fetchIncidents}
        />

        <FieldStopModal
          isOpen={isStopOpen}
          onClose={onStopClose}
          onCreate={fetchInteractions}
        />
      </div>
    </DashboardLayout>
  );
}

// Patrol Status View Component
function PatrolStatusView({ units, onStatusUpdate, onUnitSelect }: any) {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {units.map((unit: Unit) => (
          <Card
            key={unit.id}
            isPressable
            onPress={() => onUnitSelect(unit)}
            className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold">{unit.callsign}</h3>
                  <p className="text-sm text-gray-400">
                    {unit.officers.length} officer{unit.officers.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Chip
                  size="sm"
                  color={getStatusColor(unit.status) as any}
                  variant="flat"
                >
                  {unit.status.replace(/_/g, " ")}
                </Chip>
              </div>

              {unit.officers.map((officer) => (
                <div key={officer.id} className="flex items-center gap-2 text-sm mb-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300">{officer.rank} {officer.name}</span>
                  <span className="text-gray-500">#{officer.badgeNumber}</span>
                </div>
              ))}

              {unit.location && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                  <MapPin className="w-4 h-4" />
                  {unit.location}
                </div>
              )}

              {unit.currentCall && (
                <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs font-semibold text-blue-400">
                    {unit.currentCall.callNumber}
                  </p>
                  <p className="text-xs text-gray-300">{unit.currentCall.type}</p>
                  <p className="text-xs text-gray-400">{unit.currentCall.location}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  fullWidth
                  onPress={() => onStatusUpdate(unit.id, "AVAILABLE", "10-8")}
                >
                  10-8
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  fullWidth
                  onPress={() => onStatusUpdate(unit.id, "BUSY", "10-6")}
                >
                  10-6
                </Button>
                <Button
                  size="sm"
                  color="default"
                  variant="flat"
                  fullWidth
                  onPress={() => onStatusUpdate(unit.id, "OUT_OF_SERVICE", "10-7")}
                >
                  10-7
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {units.length === 0 && (
        <Card className="bg-gray-800/30 border border-gray-700">
          <CardBody className="p-8 text-center">
            <Radio className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No units on duty</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Incident Queue View Component
function IncidentQueueView({ 
  incidents = [], 
  units, 
  onIncidentSelect, 
  onAssignUnit,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter
}: any) {
  return (
    <div className="mt-4 space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Select
          label="Status"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-xs"
          classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
        >
          <SelectItem key="all" value="all">All Status</SelectItem>
          <SelectItem key="PENDING" value="PENDING">Pending</SelectItem>
          <SelectItem key="DISPATCHED" value="DISPATCHED">Dispatched</SelectItem>
          <SelectItem key="ACTIVE" value="ACTIVE">Active</SelectItem>
        </Select>

        <Select
          label="Priority"
          selectedKeys={[priorityFilter]}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="max-w-xs"
          classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
        >
          <SelectItem key="all" value="all">All Priorities</SelectItem>
          <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
          <SelectItem key="HIGH" value="HIGH">High</SelectItem>
          <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
          <SelectItem key="LOW" value="LOW">Low</SelectItem>
        </Select>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {incidents.map((incident: Incident) => (
          <Card
            key={incident.id}
            isPressable
            onPress={() => onIncidentSelect(incident)}
            className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <CardBody className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      size="sm"
                      color={getPriorityColor(incident.priority) as any}
                      variant="flat"
                    >
                      {incident.priority}
                    </Chip>
                    <Chip size="sm" variant="bordered">
                      {incident.status}
                    </Chip>
                    <span className="text-sm font-mono text-gray-400">
                      {incident.callNumber}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{incident.type}</h3>
                  <p className="text-sm text-gray-400 mb-2">{incident.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {incident.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(incident.createdAt).toLocaleTimeString()}
                    </div>
                    {incident.caller && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {incident.caller}
                      </div>
                    )}
                  </div>

                  {incident.assignedUnits && incident.assignedUnits.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-400">
                        Assigned: {incident.assignedUnits.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Eye className="w-4 h-4" />}
                    onPress={() => onIncidentSelect(incident)}
                  >
                    View
                  </Button>
                  {incident.status === "PENDING" && (
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      startContent={<UserCheck className="w-4 h-4" />}
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {incidents.length === 0 && (
        <Card className="bg-gray-800/30 border border-gray-700">
          <CardBody className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-gray-400">No active incidents</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Field Interactions View Component
function FieldInteractionsView({ interactions, onRefresh }: any) {
  return (
    <div className="mt-4 space-y-4">
      <Table
        aria-label="Field interactions"
        classNames={{
          wrapper: "bg-gray-800/50 border border-gray-700",
          th: "bg-gray-700/50 text-gray-300",
          td: "text-gray-200",
        }}
      >
        <TableHeader>
          <TableColumn>TIME</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>LOCATION</TableColumn>
          <TableColumn>OFFICER</TableColumn>
          <TableColumn>OUTCOME</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {interactions.map((interaction: FieldInteraction) => (
            <TableRow key={interaction.id}>
              <TableCell>
                {new Date(interaction.timestamp).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {interaction.type.replace(/_/g, " ")}
                </Chip>
              </TableCell>
              <TableCell>{interaction.location}</TableCell>
              <TableCell>{interaction.officerCallsign}</TableCell>
              <TableCell>{interaction.outcome}</TableCell>
              <TableCell>
                <Button size="sm" variant="light">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {interactions.length === 0 && (
        <Card className="bg-gray-800/30 border border-gray-700">
          <CardBody className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No recent field interactions</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Quick Actions View Component
function QuickActionsView() {
  const quickActions = [
    { icon: FileSignature, label: "Create Report", color: "primary", action: () => {} },
    { icon: UserCheck, label: "Check Person", color: "secondary", action: () => {} },
    { icon: Car, label: "Check Vehicle", color: "success", action: () => {} },
    { icon: Flag, label: "Issue Warning", color: "warning", action: () => {} },
    { icon: FileText, label: "Issue Citation", color: "danger", action: () => {} },
    { icon: UserX, label: "Arrest", color: "danger", action: () => {} },
    { icon: Home, label: "Welfare Check", color: "default", action: () => {} },
    { icon: Handshake, label: "Assist Civilian", color: "default", action: () => {} },
  ];

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            isPressable
            onPress={action.action}
            className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <CardBody className="p-6 flex flex-col items-center text-center gap-2">
              <action.icon className="w-8 h-8 text-blue-500" />
              <p className="font-semibold">{action.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

// New Incident Modal
function NewIncidentModal({ isOpen, onClose, onCreate }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "",
    priority: "MEDIUM",
    location: "",
    description: "",
    caller: "",
  });

  const handleCreate = async () => {
    if (!form.type || !form.location || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/cad/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          department: "POLICE",
          status: "PENDING"
        })
      });

      if (response.ok) {
        toast.success("Incident created successfully");
        onClose();
        onCreate();
        setForm({
          type: "",
          priority: "MEDIUM",
          location: "",
          description: "",
          caller: "",
        });
      } else {
        throw new Error("Failed to create incident");
      }
    } catch (error) {
      console.error("Failed to create incident:", error);
      toast.error("Failed to create incident");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Create New Incident</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Select
              label="Incident Type"
              placeholder="Select incident type"
              selectedKeys={form.type ? [form.type] : []}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              isRequired
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="TRAFFIC_STOP" value="TRAFFIC_STOP">Traffic Stop</SelectItem>
              <SelectItem key="SUSPICIOUS_ACTIVITY" value="SUSPICIOUS_ACTIVITY">Suspicious Activity</SelectItem>
              <SelectItem key="THEFT" value="THEFT">Theft</SelectItem>
              <SelectItem key="ASSAULT" value="ASSAULT">Assault</SelectItem>
              <SelectItem key="BURGLARY" value="BURGLARY">Burglary</SelectItem>
              <SelectItem key="DOMESTIC" value="DOMESTIC">Domestic Disturbance</SelectItem>
              <SelectItem key="PUBLIC_ORDER" value="PUBLIC_ORDER">Public Order</SelectItem>
              <SelectItem key="WELFARE_CHECK" value="WELFARE_CHECK">Welfare Check</SelectItem>
              <SelectItem key="OTHER" value="OTHER">Other</SelectItem>
            </Select>

            <Select
              label="Priority"
              selectedKeys={[form.priority]}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="LOW" value="LOW">Low</SelectItem>
              <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
              <SelectItem key="HIGH" value="HIGH">High</SelectItem>
              <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
            </Select>

            <Input
              label="Location"
              placeholder="Enter location..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              isRequired
              startContent={<MapPin className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Textarea
              label="Description"
              placeholder="Describe the incident..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              isRequired
              minRows={3}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Input
              label="Caller (Optional)"
              placeholder="Name or phone number..."
              value={form.caller}
              onChange={(e) => setForm({ ...form, caller: e.target.value })}
              startContent={<Phone className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleCreate}
            isLoading={saving}
            startContent={!saving && <Plus className="w-4 h-4" />}
          >
            Create Incident
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Field Stop Modal
function FieldStopModal({ isOpen, onClose, onCreate }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "PERSON_STOP",
    location: "",
    notes: "",
    outcome: "VERBAL_WARNING",
  });

  const handleCreate = async () => {
    if (!form.location) {
      toast.error("Location is required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/cad/field-interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          officerCallsign: "Current Officer",
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success("Field interaction logged");
        onClose();
        onCreate();
        setForm({
          type: "PERSON_STOP",
          location: "",
          notes: "",
          outcome: "VERBAL_WARNING",
        });
      } else {
        throw new Error("Failed to log interaction");
      }
    } catch (error) {
      console.error("Failed to log interaction:", error);
      toast.error("Failed to log interaction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Log Field Interaction</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Select
              label="Interaction Type"
              selectedKeys={[form.type]}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="PERSON_STOP" value="PERSON_STOP">Person Stop</SelectItem>
              <SelectItem key="VEHICLE_STOP" value="VEHICLE_STOP">Vehicle Stop</SelectItem>
              <SelectItem key="WELFARE_CHECK" value="WELFARE_CHECK">Welfare Check</SelectItem>
            </Select>

            <Input
              label="Location"
              placeholder="Enter location..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              isRequired
              startContent={<MapPin className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Select
              label="Outcome"
              selectedKeys={[form.outcome]}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="VERBAL_WARNING" value="VERBAL_WARNING">Verbal Warning</SelectItem>
              <SelectItem key="CITATION_ISSUED" value="CITATION_ISSUED">Citation Issued</SelectItem>
              <SelectItem key="ARREST" value="ARREST">Arrest</SelectItem>
              <SelectItem key="NO_ACTION" value="NO_ACTION">No Action Required</SelectItem>
              <SelectItem key="ESCALATED" value="ESCALATED">Escalated to CIB</SelectItem>
            </Select>

            <Textarea
              label="Notes"
              placeholder="Additional details..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              minRows={3}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleCreate}
            isLoading={saving}
            startContent={!saving && <Plus className="w-4 h-4" />}
          >
            Log Interaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Helper function
function getStatusColor(status: string): string {
  switch (status) {
    case "AVAILABLE": return "success";
    case "BUSY": return "warning";
    case "ENROUTE": return "primary";
    case "ON_SCENE": return "secondary";
    case "OUT_OF_SERVICE": return "default";
    case "PANIC": return "danger";
    default: return "default";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "CRITICAL": return "danger";
    case "HIGH": return "warning";
    case "MEDIUM": return "primary";
    case "LOW": return "default";
    default: return "default";
  }
}
