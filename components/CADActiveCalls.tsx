"use client";

import { Card, CardBody, CardHeader, Chip, Button, Select, SelectItem, Badge } from "@nextui-org/react";
import { Phone, MapPin, Clock, AlertTriangle, Filter, Radio, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { CADCallDetails } from "./CADCallDetails";

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
  updatedAt: string;
  units: Array<{
    callsign: string;
    status: string;
    department: string;
  }>;
}

interface CADActiveCallsProps {
  department?: string;
  refreshInterval?: number;
}

export function CADActiveCalls({ department, refreshInterval = 10000 }: CADActiveCallsProps) {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchCalls = async () => {
    try {
      const response = await fetch("/api/cad/calls?status=PENDING,DISPATCHED,ACTIVE");
      if (!response.ok) throw new Error("Failed to fetch calls");
      const data = await response.json();
      
      // Filter by department if specified
      let filteredCalls = data.calls;
      if (department && department !== "ALL") {
        filteredCalls = data.calls.filter((call: Call) => {
          // Show unassigned calls or calls with units from this department
          if (call.units.length === 0) return true;
          return call.units.some(u => u.department === department);
        });
      }
      
      setCalls(filteredCalls);
      setError(null);
    } catch (err) {
      setError("Failed to load active calls");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, department]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
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
      case "ACTIVE":
        return "success";
      case "DISPATCHED":
        return "warning";
      case "PENDING":
        return "default";
      default:
        return "default";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredCalls = calls.filter((call) => {
    if (departmentFilter !== "ALL") {
      const hasDepartment = call.units.some((u) => u.department === departmentFilter);
      if (!hasDepartment) return false;
    }
    if (priorityFilter !== "ALL" && call.priority !== priorityFilter) return false;
    if (statusFilter !== "ALL" && call.status !== statusFilter) return false;
    return true;
  });

  const getDepartmentCounts = () => {
    const counts: Record<string, number> = { ALL: calls.length };
    calls.forEach((call) => {
      call.units.forEach((unit) => {
        counts[unit.department] = (counts[unit.department] || 0) + 1;
      });
    });
    return counts;
  };

  const departmentCounts = getDepartmentCounts();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
        <CardBody className="p-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            <p className="text-gray-400 ml-2">Loading active calls...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-900/20 to-red-950/20 border-2 border-red-800/50">
        <CardBody className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-red-400 mb-4">{error}</p>
            <Button size="sm" color="danger" variant="shadow" onPress={fetchCalls} className="font-semibold">
              Retry
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700">
        <CardBody className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>
            
            <Select
              size="sm"
              label="Department"
              selectedKeys={[departmentFilter]}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-48"
              startContent={<Radio className="w-4 h-4" />}
            >
              <SelectItem key="ALL" value="ALL">All Departments ({departmentCounts.ALL || 0})</SelectItem>
              <SelectItem key="POLICE" value="POLICE">Police ({departmentCounts.POLICE || 0})</SelectItem>
              <SelectItem key="FIRE" value="FIRE">Fire ({departmentCounts.FIRE || 0})</SelectItem>
              <SelectItem key="EMS" value="EMS">EMS ({departmentCounts.EMS || 0})</SelectItem>
            </Select>

            <Select
              size="sm"
              label="Priority"
              selectedKeys={[priorityFilter]}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-44"
              startContent={<AlertTriangle className="w-4 h-4" />}
            >
              <SelectItem key="ALL" value="ALL">All Priorities</SelectItem>
              <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
              <SelectItem key="HIGH" value="HIGH">High</SelectItem>
              <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
              <SelectItem key="LOW" value="LOW">Low</SelectItem>
            </Select>

            <Select
              size="sm"
              label="Status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-44"
            >
              <SelectItem key="ALL" value="ALL">All Statuses</SelectItem>
              <SelectItem key="PENDING" value="PENDING">Pending</SelectItem>
              <SelectItem key="DISPATCHED" value="DISPATCHED">Dispatched</SelectItem>
              <SelectItem key="ACTIVE" value="ACTIVE">Active</SelectItem>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Badge content={filteredCalls.length} color="primary" shape="rectangle">
                <Chip size="sm" variant="flat" color="primary" startContent={<Phone className="w-3 h-3" />}>
                  Active Calls
                </Chip>
              </Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      {filteredCalls.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
          <CardBody className="p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                <Phone className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">No Active Calls</h4>
              <p className="text-sm text-gray-400">
                {calls.length === 0 
                  ? "All calls have been cleared or resolved" 
                  : "No calls match the current filters"}
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        filteredCalls.map((call) => {
          const isPriority = call.priority === "CRITICAL" || call.priority === "HIGH";
          return (
          <Card 
            key={call.id} 
            className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
              call.priority === "CRITICAL" 
                ? "border-red-500/50 hover:border-red-500 shadow-red-900/20 animate-pulse" 
                : call.priority === "HIGH"
                ? "border-yellow-500/30 hover:border-yellow-500/50"
                : "border-gray-700 hover:border-blue-500/50"
            }`}
          >
            <CardBody className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-gray-500">CALL #{call.callNumber}</span>
                    <span className="text-xl font-bold text-white">{call.type.replace(/_/g, " ")}</span>
                  </div>
                  <Chip size="sm" color={getPriorityColor(call.priority)} variant="solid" className="font-bold">
                    {call.priority === "CRITICAL" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {call.priority}
                  </Chip>
                  <Chip size="sm" color={getStatusColor(call.status)} variant="bordered" className="font-semibold">
                    {call.status}
                  </Chip>
                  <Chip size="sm" variant="flat" color="default" startContent={<Clock className="w-3 h-3" />}>
                    {getTimeAgo(call.createdAt)}
                  </Chip>
                </div>
                <Button 
                  size="sm" 
                  color="primary" 
                  variant="shadow" 
                  onClick={() => setSelectedCallId(call.id)}
                  className="font-semibold"
                >
                  View Details
                </Button>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-200">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">{call.location}</span>
                  {call.postal && (
                    <Chip size="sm" variant="flat" color="primary" className="ml-2 font-mono">
                      Postal {call.postal}
                    </Chip>
                  )}
                </div>

                {call.caller && (
                  <div className="flex items-center gap-2 text-sm text-gray-200">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span>{call.caller}</span>
                    {call.callerPhone && <span className="text-gray-400">• <span className="font-mono">{call.callerPhone}</span></span>}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span suppressHydrationWarning>
                    Created: {new Date(call.createdAt).toLocaleString()}
                  </span>
                  {call.updatedAt !== call.createdAt && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span suppressHydrationWarning>
                        Updated: {new Date(call.updatedAt).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">{call.description}</p>

              {call.units.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Assigned Units:
                  </span>
                  {call.units.map((unit, idx) => (
                    <Chip 
                      key={idx} 
                      size="sm" 
                      variant="solid" 
                      color={
                        unit.department === "POLICE" ? "primary" :
                        unit.department === "FIRE" ? "danger" :
                        unit.department === "EMS" ? "warning" :
                        "default"
                      }
                      className="font-mono font-semibold"
                    >
                      {unit.callsign} • {unit.status}
                    </Chip>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        );
        })
      )}

      {selectedCallId && (
        <CADCallDetails
          callId={selectedCallId}
          isOpen={!!selectedCallId}
          onClose={() => setSelectedCallId(null)}
          onUpdate={fetchCalls}
        />
      )}
    </div>
  );
}
