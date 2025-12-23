"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Badge,
  ButtonGroup,
} from "@nextui-org/react";
import {
  Radio,
  Phone,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  Users,
  Shield,
  Flame,
  Heart,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { useCADVoiceAlerts } from "@/lib/use-voice-alerts";
import { getCallTypeDisplay } from "@/lib/victoria-police-config";

interface Call {
  id: string;
  callNumber: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  postal: string | null;
  description: string;
  callerName: string | null;
  callerPhone: string | null;
  createdAt: string;
  dispatchedAt: string | null;
  closedAt: string | null;
  units: Array<{
    id: string;
    callsign: string;
    department: string;
  }>;
}

interface Unit {
  id: string;
  callsign: string;
  department: string;
  status: string;
  location: string | null;
  officers: Array<{
    name: string;
    badge: string | null;
  }>;
  call: {
    callNumber: string;
  } | null;
}

interface CADDispatchConsoleProps {
  department?: string;
  refreshInterval?: number;
}

export function CADDispatchConsole({
  department,
  refreshInterval = 10000,
}: CADDispatchConsoleProps) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [previousCallIds, setPreviousCallIds] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<"POLICE" | "FIRE" | "EMS">(
    (department as "POLICE" | "FIRE" | "EMS") || "POLICE"
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const voiceAlerts = useCADVoiceAlerts();

  // Calculate statistics based on selected department
  const stats = useMemo(() => {
    // Filter data by selected department only
    const filteredUnits = units.filter(u => u.department === selectedDepartment);
    
    // For calls, show unassigned calls + calls assigned to this department
    const filteredCalls = calls.filter(c => {
      // Show unassigned calls (pending)
      if (c.units.length === 0 && c.status === 'PENDING') return true;
      // Show calls with units from this department
      return c.units.some(u => u.department === selectedDepartment);
    });
    
    const criticalCalls = filteredCalls.filter(c => 
      c.priority === 'CRITICAL' && 
      (c.status === 'PENDING' || c.status === 'DISPATCHED')
    ).length;
    
    const avgResponseTime = filteredCalls
      .filter(c => c.dispatchedAt && c.createdAt)
      .map(c => {
        const created = new Date(c.createdAt).getTime();
        const dispatched = new Date(c.dispatchedAt!).getTime();
        return (dispatched - created) / 1000 / 60; // minutes
      })
      .reduce((sum, time, _, arr) => sum + time / arr.length, 0);

    const totalActive = filteredCalls.filter(c => 
      c.status === 'PENDING' || c.status === 'DISPATCHED' || c.status === 'ACTIVE'
    ).length;

    return {
      critical: criticalCalls,
      avgResponse: avgResponseTime || 0,
      totalActive,
      availableUnits: filteredUnits.filter(u => u.status === 'AVAILABLE' && !u.call).length,
      totalUnits: filteredUnits.length,
    };
  }, [calls, units, selectedDepartment]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [department, refreshInterval]);

  const fetchData = async () => {
    try {
      const [callsRes, unitsRes] = await Promise.all([
        fetch("/api/cad/calls"),
        fetch("/api/cad/units"),
      ]);

      if (!callsRes.ok || !unitsRes.ok) {
        throw new Error(`HTTP error! calls: ${callsRes.status}, units: ${unitsRes.status}`);
      }

      const callsData = await callsRes.json();
      const unitsData = await unitsRes.json();

      let filteredCalls = callsData.calls || [];
      let filteredUnits = unitsData.units || [];

      if (department) {
        filteredUnits = filteredUnits.filter(
          (u: Unit) => u.department === department
        );
      }

      // Sort calls by priority and time
      filteredCalls.sort((a: Call, b: Call) => {
        const priorityOrder: Record<string, number> = {
          EMERGENCY: 0,
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
        };
        const priorityDiff =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      // Check for new calls and announce them
      const currentCallIds = new Set(filteredCalls.map(c => c.id));
      const newCalls = filteredCalls.filter(c => 
        !previousCallIds.has(c.id) && 
        (c.status === 'PENDING' || c.status === 'DISPATCHED')
      );
      
      // Announce new high priority calls
      newCalls.forEach(call => {
        if (call.priority === 'HIGH' || call.priority === 'CRITICAL') {
          voiceAlerts.announceNewCall({
            callNumber: call.callNumber,
            type: call.type,
            priority: call.priority,
            location: call.location
          });
        }
      });
      
      setPreviousCallIds(currentCallIds);
      setCalls(filteredCalls);
      setUnits(filteredUnits);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch dispatch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDispatch = (call: Call) => {
    setSelectedCall(call);
    setSelectedUnits([]);
    onOpen();
  };

  const handleDispatchUnits = async () => {
    if (!selectedCall || selectedUnits.length === 0) {
      toast.error("Please select at least one unit");
      return;
    }

    try {
      // Assign all selected units to the call
      await Promise.all(
        selectedUnits.map((unitId) =>
          fetch(`/api/cad/calls/${selectedCall.id}/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ unitId }),
          })
        )
      );

      // Update call status to DISPATCHED
      await fetch(`/api/cad/calls/${selectedCall.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DISPATCHED" }),
      });

      toast.success(`Dispatched ${selectedUnits.length} unit(s) to ${selectedCall.callNumber}`);
      onClose();
      fetchData();
    } catch (error) {
      toast.error("Failed to dispatch units");
      console.error(error);
    }
  };

  const handleMarkEnRoute = async (callId: string) => {
    try {
      await fetch(`/api/cad/calls/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      toast.success("Call marked as active");
      fetchData();
    } catch (error) {
      toast.error("Failed to update call status");
    }
  };

  const handleCloseCall = async (callId: string) => {
    try {
      await fetch(`/api/cad/calls/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CLOSED" }),
      });
      toast.success("Call closed");
      fetchData();
    } catch (error) {
      toast.error("Failed to close call");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "primary";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "DISPATCHED":
        return "primary";
      case "ACTIVE":
        return "secondary";
      case "CLOSED":
        return "success";
      default:
        return "default";
    }
  };

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "BUSY":
        return "warning";
      case "ENROUTE":
        return "primary";
      case "ON_SCENE":
        return "secondary";
      case "OUT_OF_SERVICE":
        return "default";
      case "PANIC":
        return "danger";
      default:
        return "default";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`;
    return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Filter by selected department only
  const filteredUnits = units.filter(u => u.department === selectedDepartment);

  // Show unassigned calls + calls assigned to this department
  const filteredCalls = calls.filter(c => {
    if (c.units.length === 0 && c.status === 'PENDING') return true;
    return c.units.some(u => u.department === selectedDepartment);
  });

  const availableUnits = filteredUnits.filter(
    (u) => u.status === "AVAILABLE" && !u.call
  );
  const busyUnits = filteredUnits.filter((u) => u.status !== "AVAILABLE" || u.call);

  const pendingCalls = filteredCalls.filter((c) => c.status === "PENDING");
  const activeCalls = filteredCalls.filter(
    (c) => c.status === "DISPATCHED" || c.status === "ACTIVE"
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Department Selector - Only show if not locked to a specific department */}
      {!department && (
        <Card className="border border-gray-800 mb-6">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Dispatch Console</h2>
                <p className="text-sm text-gray-400">Select your department to begin dispatching</p>
              </div>
              <ButtonGroup size="lg" variant="flat">
                <Button
                  color={selectedDepartment === "POLICE" ? "primary" : "default"}
                  variant={selectedDepartment === "POLICE" ? "solid" : "flat"}
                  startContent={<Shield className="w-4 h-4" />}
                  onClick={() => setSelectedDepartment("POLICE")}
                  className="min-w-[140px]"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Police</span>
                    <span className="text-xs opacity-70">
                      {units.filter(u => u.department === 'POLICE').length} units
                    </span>
                  </div>
                </Button>
                <Button
                  color={selectedDepartment === "FIRE" ? "danger" : "default"}
                  variant={selectedDepartment === "FIRE" ? "solid" : "flat"}
                  startContent={<Flame className="w-4 h-4" />}
                  onClick={() => setSelectedDepartment("FIRE")}
                  className="min-w-[140px]"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Fire</span>
                    <span className="text-xs opacity-70">
                      {units.filter(u => u.department === 'FIRE').length} units
                    </span>
                  </div>
                </Button>
                <Button
                  color={selectedDepartment === "EMS" ? "success" : "default"}
                  variant={selectedDepartment === "EMS" ? "solid" : "flat"}
                  startContent={<Heart className="w-4 h-4" />}
                  onClick={() => setSelectedDepartment("EMS")}
                  className="min-w-[140px]"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Ambulance</span>
                    <span className="text-xs opacity-70">
                      {units.filter(u => u.department === 'EMS').length} units
                    </span>
                  </div>
                </Button>
              </ButtonGroup>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-800/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Critical Calls</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Active Calls</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{stats.totalActive}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Available Units</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{stats.availableUnits}</p>
              </div>
              <Users className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-800/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Avg Response</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">
                  {stats.avgResponse > 0 ? `${stats.avgResponse.toFixed(1)}m` : 'N/A'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-gray-800">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold">Pending Calls</h3>
                <Chip size="sm" color="danger" variant="flat">
                  {pendingCalls.length}
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="max-h-[400px] overflow-y-auto">
              {pendingCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending calls</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingCalls.map((call) => (
                    <Card
                      key={call.id}
                      className="bg-gray-900/50 border border-gray-800 hover:border-indigo-600 transition-colors"
                    >
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono font-bold text-white">
                                {call.callNumber}
                              </span>
                              <Chip
                                size="sm"
                                color={getPriorityColor(call.priority) as any}
                                variant="flat"
                                startContent={
                                  (call.priority === "EMERGENCY" || call.priority === "CRITICAL") ? (
                                    <AlertTriangle className="w-3 h-3" />
                                  ) : undefined
                                }
                              >
                                {call.priority}
                              </Chip>
                              <Chip size="sm" variant="flat">
                                {getCallTypeDisplay(call.type)}
                              </Chip>
                            </div>

                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {call.location}
                                  {call.postal && ` (${call.postal})`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                <span>
                                  {formatTimestamp(call.createdAt)} - {formatTime(call.createdAt)}
                                </span>
                              </div>
                              {call.callerName && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <User className="w-3 h-3 flex-shrink-0" />
                                  <span>
                                    {call.callerName}
                                    {call.callerPhone && ` • ${call.callerPhone}`}
                                  </span>
                                </div>
                              )}
                              <p className="text-gray-400 mt-2 line-clamp-2">
                                {call.description}
                              </p>
                            </div>
                          </div>

                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => handleQuickDispatch(call)}
                          >
                            Dispatch
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Active Calls */}
          <Card className="border border-gray-800">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-bold">Active Calls</h3>
                <Chip size="sm" color="primary" variant="flat">
                  {activeCalls.length}
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="max-h-[400px] overflow-y-auto">
              {activeCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Radio className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active calls</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeCalls.map((call) => (
                    <Card
                      key={call.id}
                      className="bg-gray-900/50 border border-gray-800"
                    >
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono font-bold text-white">
                                {call.callNumber}
                              </span>
                              <Chip
                                size="sm"
                                color={getStatusColor(call.status) as any}
                                variant="flat"
                              >
                                {call.status}
                              </Chip>
                              <Chip
                                size="sm"
                                color={getPriorityColor(call.priority) as any}
                                variant="flat"
                              >
                                {call.priority}
                              </Chip>
                            </div>

                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-300">
                                <MapPin className="w-3 h-3" />
                                <span>{call.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(call.createdAt)}</span>
                              </div>

                              {call.units.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {call.units.map((unit) => (
                                    <Chip
                                      key={unit.id}
                                      size="sm"
                                      variant="bordered"
                                      color="primary"
                                    >
                                      {unit.callsign}
                                    </Chip>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {call.status === "DISPATCHED" && (
                              <Button
                                size="sm"
                                color="secondary"
                                variant="flat"
                                onClick={() => handleMarkEnRoute(call.id)}
                              >
                                En Route
                              </Button>
                            )}
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              onClick={() => handleCloseCall(call.id)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Available Units */}
        <div className="space-y-4">
          <Card className="border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold">Available Units</h3>
                <Chip size="sm" color="success" variant="flat">
                  {availableUnits.length}
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="max-h-[350px] overflow-y-auto">
              {availableUnits.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <XCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No units available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableUnits.map((unit) => (
                    <Card
                      key={unit.id}
                      className="bg-green-900/10 border border-green-800/50"
                    >
                      <CardBody className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">
                              {unit.callsign}
                            </div>
                            {unit.officers.length > 0 && (
                              <div className="text-xs text-gray-400 mt-1">
                                {unit.officers[0].name}
                              </div>
                            )}
                            {unit.location && (
                              <div className="text-xs text-gray-500 mt-1">
                                {unit.location}
                              </div>
                            )}
                          </div>
                          <Chip
                            size="sm"
                            color="success"
                            variant="flat"
                            className="text-xs"
                          >
                            AVAILABLE
                          </Chip>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Busy Units */}
          <Card className="border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold">Busy Units</h3>
                <Chip size="sm" color="warning" variant="flat">
                  {busyUnits.length}
                </Chip>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="max-h-[300px] overflow-y-auto">
              {busyUnits.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All units available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {busyUnits.map((unit) => (
                    <Card
                      key={unit.id}
                      className="bg-yellow-900/10 border border-yellow-800/50"
                    >
                      <CardBody className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-white">
                              {unit.callsign}
                            </div>
                            {unit.call && (
                              <div className="text-xs text-yellow-400 mt-1">
                                {unit.call.callNumber}
                              </div>
                            )}
                          </div>
                          <Chip
                            size="sm"
                            color={getUnitStatusColor(unit.status) as any}
                            variant="flat"
                            className="text-xs"
                          >
                            {unit.status.replace(/_/g, " ")}
                          </Chip>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              <span>Dispatch Units to {selectedCall?.callNumber}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedCall && (
              <div className="space-y-4">
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          color={getPriorityColor(selectedCall.priority) as any}
                          variant="flat"
                        >
                          {selectedCall.priority}
                        </Chip>
                        <span className="text-sm">
                          {selectedCall.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="text-lg font-semibold">
                        {selectedCall.location}
                      </div>
                      <p className="text-sm text-gray-400">
                        {selectedCall.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Units to Dispatch
                  </label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {availableUnits.map((unit) => (
                      <Card
                        key={unit.id}
                        isPressable
                        isHoverable
                        className={`border ${
                          selectedUnits.includes(unit.id)
                            ? "border-indigo-600 bg-indigo-900/20"
                            : "border-gray-800 bg-gray-900/50"
                        }`}
                        onClick={() => {
                          setSelectedUnits((prev) =>
                            prev.includes(unit.id)
                              ? prev.filter((id) => id !== unit.id)
                              : [...prev, unit.id]
                          );
                        }}
                      >
                        <CardBody className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">
                                {unit.callsign}
                              </div>
                              {unit.officers.length > 0 && (
                                <div className="text-xs text-gray-400">
                                  {unit.officers.map((o) => o.name).join(", ")}
                                </div>
                              )}
                            </div>
                            {selectedUnits.includes(unit.id) && (
                              <CheckCircle className="w-5 h-5 text-indigo-500" />
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleDispatchUnits}
              isDisabled={selectedUnits.length === 0}
            >
              Dispatch {selectedUnits.length > 0 && `(${selectedUnits.length})`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
