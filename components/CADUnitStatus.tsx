"use client";

import { Card, CardBody, Chip, Avatar } from "@nextui-org/react";
import { Radio, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { QuickStatusUpdate } from "@/components/QuickStatusUpdate";
import { TenCodesDropdown } from "@/components/TenCodesDropdown";

interface Unit {
  id: string;
  callsign: string;
  department: string;
  status: string;
  location: string | null;
  officers: Array<{
    name: string;
    badge: string | null;
    rank: string | null;
  }>;
  call: {
    callNumber: string;
    type: string;
    location: string;
  } | null;
}

interface CADUnitStatusProps {
  department?: string;
  refreshInterval?: number;
}

export function CADUnitStatus({ department, refreshInterval = 10000 }: CADUnitStatusProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      const response = await fetch("/api/cad/units");
      if (!response.ok) throw new Error("Failed to fetch units");
      const data = await response.json();
      
      let filteredUnits = data.units;
      if (department) {
        filteredUnits = filteredUnits.filter((u: Unit) => u.department === department);
      }
      
      setUnits(filteredUnits);
      setError(null);
    } catch (err) {
      setError("Failed to load units");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    const interval = setInterval(fetchUnits, refreshInterval);
    return () => clearInterval(interval);
  }, [department, refreshInterval]);

  const getStatusColor = (status: string) => {
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

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
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

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
        <CardBody className="p-8">
          <div className="flex items-center justify-center gap-3">
            <Radio className="w-5 h-5 text-blue-500 animate-pulse" />
            <p className="text-gray-400">Loading units...</p>
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
            <p className="text-red-400">{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const availableUnits = units.filter(u => u.status === "AVAILABLE").length;
  const busyUnits = units.filter(u => u.status !== "AVAILABLE" && u.status !== "OUT_OF_SERVICE").length;
  const offDutyUnits = units.filter(u => u.status === "OUT_OF_SERVICE").length;

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-green-950/20 border-2 border-green-800/50 hover:border-green-700/70 transition-all">
          <CardBody className="p-4">
            <p className="text-sm text-green-300 font-semibold mb-1">Available</p>
            <p className="text-3xl font-bold text-green-400">{availableUnits}</p>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-950/20 border-2 border-yellow-800/50 hover:border-yellow-700/70 transition-all">
          <CardBody className="p-4">
            <p className="text-sm text-yellow-300 font-semibold mb-1">Busy</p>
            <p className="text-3xl font-bold text-yellow-400">{busyUnits}</p>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700/50 hover:border-gray-600/70 transition-all">
          <CardBody className="p-4">
            <p className="text-sm text-gray-300 font-semibold mb-1">Off Duty</p>
            <p className="text-3xl font-bold text-gray-400">{offDutyUnits}</p>
          </CardBody>
        </Card>
      </div>

      {/* Unit List */}
      <div className="space-y-3">
        {units.map((unit) => (
          <Card 
            key={unit.id} 
            className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 transition-all ${
              unit.status === "PANIC" 
                ? "border-red-500/50 shadow-lg shadow-red-900/30 animate-pulse" 
                : unit.status === "AVAILABLE"
                ? "border-green-700/30 hover:border-green-600/50"
                : unit.status === "BUSY" || unit.status === "ENROUTE" || unit.status === "ON_SCENE"
                ? "border-yellow-700/30 hover:border-yellow-600/50"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Radio className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-white text-lg">{unit.callsign}</span>
                      <Chip size="sm" color={getDepartmentColor(unit.department)} variant="solid" className="font-bold">
                        {unit.department}
                      </Chip>
                    </div>
                    
                    {unit.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold">{unit.location}</span>
                      </div>
                    )}

                    {unit.officers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {unit.officers.map((officer, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs bg-gray-800/50 rounded-full pl-1 pr-3 py-1 border border-gray-700">
                            <Avatar size="sm" name={officer.name} className="w-6 h-6" />
                            <span className="text-white font-semibold">{officer.name}</span>
                            {officer.badge && <span className="text-gray-400 font-mono">#{officer.badge}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {unit.call && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-900/30 to-blue-950/20 border-2 border-blue-800/50 rounded-lg">
                        <p className="text-xs text-blue-400 font-semibold mb-1">
                          📡 Assigned: <span className="font-mono">{unit.call.callNumber}</span> - {unit.call.type.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-gray-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {unit.call.location}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col gap-2">
                  <QuickStatusUpdate
                    unitId={unit.id}
                    currentStatus={unit.status}
                    onUpdate={fetchUnits}
                    size="sm"
                  />
                  <TenCodesDropdown
                    unitId={unit.id}
                    unitCallsign={unit.callsign}
                    currentStatus={unit.status}
                    callId={unit.call?.callNumber}
                    onStatusChange={fetchUnits}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {units.length === 0 && (
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
            <CardBody className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/30 mb-4">
                  <Radio className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No Units Available</h4>
                <p className="text-sm text-gray-400">No units are currently on duty{department ? ` in ${department}` : ''}.</p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
