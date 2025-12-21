"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardBody, CardHeader, Chip, Button, Select, SelectItem } from "@nextui-org/react";
import { Map as MapIcon, MapPin, Radio, Crosshair } from "lucide-react";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Import Leaflet to handle manual cleanup
let L: any;
if (typeof window !== "undefined") {
  import("leaflet").then((leaflet) => {
    L = leaflet.default;
  });
}

interface Unit {
  id: string;
  callsign: string;
  department: string;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

interface CallLocation {
  id: string;
  callNumber: string;
  type: string;
  priority: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

interface POI {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

export function LiveMap() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [calls, setCalls] = useState<CallLocation[]>([]);
  const [pois, setPOIs] = useState<POI[]>([]);
  const [showUnits, setShowUnits] = useState(true);
  const [showCalls, setShowCalls] = useState(true);
  const [showPOIs, setShowPOIs] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [mapReady, setMapReady] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default center: Los Angeles coordinates
  const defaultCenter: [number, number] = [34.0522, -118.2437];

  useEffect(() => {
    setMapReady(true);
    fetchMapData();

    const interval = setInterval(fetchMapData, 10000); // Refresh every 10s
    return () => {
      clearInterval(interval);
      // Clean up map instance if it exists
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
        mapInstanceRef.current = null;
      }
      // Also try to remove any leftover map containers
      if (containerRef.current && L) {
        const containers = containerRef.current.querySelectorAll('.leaflet-container');
        containers.forEach((container: any) => {
          if (container._leaflet_id) {
            try {
              delete container._leaflet_id;
            } catch (e) {
              // Ignore
            }
          }
        });
      }
    };
  }, []);

  const fetchMapData = async () => {
    // Fetch units with locations
    try {
      const unitsResponse = await fetch("/api/cad/units");
      if (unitsResponse.ok) {
        const data = await unitsResponse.json();
        setUnits(data.units || []);
      }
    } catch (error) {
      console.error("Failed to fetch units:", error);
    }

    // Fetch active calls with locations
    try {
      const callsResponse = await fetch("/api/cad/calls?status=PENDING,ACTIVE");
      if (callsResponse.ok) {
        const data = await callsResponse.json();
        setCalls(data.calls || []);
      }
    } catch (error) {
      console.error("Failed to fetch calls:", error);
    }

    // Fetch POIs
    try {
      const poisResponse = await fetch("/api/cad/map/pois");
      if (poisResponse.ok) {
        const data = await poisResponse.json();
        setPOIs(data.pois || []);
      }
    } catch (error) {
      console.error("Failed to fetch POIs:", error);
    }
  };

  const getUnitColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "#22c55e";
      case "BUSY":
        return "#f59e0b";
      case "ENROUTE":
        return "#3b82f6";
      case "ON_SCENE":
        return "#8b5cf6";
      case "OUT_OF_SERVICE":
        return "#6b7280";
      case "PANIC":
        return "#ef4444";
      default:
        return "#gray";
    }
  };

  const getCallColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "#dc2626";
      case "HIGH":
        return "#f59e0b";
      case "MEDIUM":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const filteredUnits = selectedDepartment === "ALL"
    ? units
    : units.filter((u) => u.department === selectedDepartment);

  if (!mapReady) {
    return (
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="h-[600px] flex items-center justify-center">
          <p className="text-gray-400">Loading map...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardHeader className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <MapIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Live Tactical Map</h2>
            <p className="text-sm text-gray-400">
              Real-time tracking • {filteredUnits.filter(u => u.latitude && u.longitude).length} units • {calls.filter(c => c.latitude && c.longitude).length} active calls
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select
            size="sm"
            placeholder="Department"
            selectedKeys={[selectedDepartment]}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-44"
            classNames={{
              trigger: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
            }}
          >
            <SelectItem key="ALL">All Departments</SelectItem>
            <SelectItem key="POLICE">Police</SelectItem>
            <SelectItem key="FIRE">Fire</SelectItem>
            <SelectItem key="EMS">EMS</SelectItem>
          </Select>
          <Button
            size="sm"
            variant={showUnits ? "solid" : "flat"}
            color={showUnits ? "primary" : "default"}
            onPress={() => setShowUnits(!showUnits)}
            startContent={<Radio className="w-4 h-4" />}
            className="font-semibold"
          >
            Units ({filteredUnits.filter(u => u.latitude && u.longitude).length})
          </Button>
          <Button
            size="sm"
            variant={showCalls ? "solid" : "flat"}
            color={showCalls ? "warning" : "default"}
            onPress={() => setShowCalls(!showCalls)}
            startContent={<MapPin className="w-4 h-4" />}
            className="font-semibold"
          >
            Calls ({calls.filter(c => c.latitude && c.longitude).length})
          </Button>
          <Button
            size="sm"
            variant={showPOIs ? "solid" : "flat"}
            color={showPOIs ? "success" : "default"}
            onPress={() => setShowPOIs(!showPOIs)}
            startContent={<Crosshair className="w-4 h-4" />}
            className="font-semibold"
          >
            POIs ({pois.length})
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <div ref={containerRef} className="h-[650px] w-full relative rounded-b-xl overflow-hidden">
          <MapContainer
            key={`live-map-${mapReady}`}
            center={defaultCenter}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
            ref={(map) => {
              if (map) {
                mapInstanceRef.current = map;
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Render Units */}
            {showUnits &&
              filteredUnits.map((unit) => {
                if (!unit.latitude || !unit.longitude) return null;
                
                return (
                  <Circle
                    key={unit.id}
                    center={[unit.latitude, unit.longitude]}
                    radius={200}
                    pathOptions={{
                      color: getUnitColor(unit.status),
                      fillColor: getUnitColor(unit.status),
                      fillOpacity: 0.3,
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-lg">{unit.callsign}</p>
                        <p className="text-sm">
                          <strong>Department:</strong> {unit.department}
                        </p>
                        <p className="text-sm">
                          <strong>Status:</strong> {unit.status}
                        </p>
                        {unit.location && (
                          <p className="text-sm">
                            <strong>Location:</strong> {unit.location}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Circle>
                );
              })}

            {/* Render Active Calls */}
            {showCalls &&
              calls.map((call) => {
                if (!call.latitude || !call.longitude) return null;

                return (
                  <Circle
                    key={call.id}
                    center={[call.latitude, call.longitude]}
                    radius={300}
                    pathOptions={{
                      color: getCallColor(call.priority),
                      fillColor: getCallColor(call.priority),
                      fillOpacity: 0.4,
                      dashArray: "5, 5",
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-lg">{call.callNumber}</p>
                        <p className="text-sm">
                          <strong>Type:</strong> {call.type}
                        </p>
                        <p className="text-sm">
                          <strong>Priority:</strong> {call.priority}
                        </p>
                        <p className="text-sm">
                          <strong>Location:</strong> {call.location}
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}

            {/* Render POIs */}
            {showPOIs &&
              pois.map((poi) => (
                <Circle
                  key={poi.id}
                  center={[poi.latitude, poi.longitude]}
                  radius={150}
                  pathOptions={{
                    color: "#10b981",
                    fillColor: "#10b981",
                    fillOpacity: 0.2,
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-bold">{poi.name}</p>
                      <p className="text-sm text-gray-600">{poi.type}</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
          </MapContainer>
        </div>

        {/* Enhanced Legend */}
        <div className="absolute bottom-6 right-6 bg-gray-900/98 border-2 border-gray-700 rounded-xl p-4 z-10 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
            <div className="p-1.5 bg-indigo-500/10 rounded">
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-sm font-bold text-white">Map Legend</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Unit Status</p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-500/30"></div>
              <span className="text-xs text-gray-300 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 ring-2 ring-yellow-500/30"></div>
              <span className="text-xs text-gray-300 font-medium">Busy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></div>
              <span className="text-xs text-gray-300 font-medium">Enroute</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500 ring-2 ring-purple-500/30"></div>
              <span className="text-xs text-gray-300 font-medium">On Scene</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-500/30 animate-pulse"></div>
              <span className="text-xs text-gray-300 font-medium">Panic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500 ring-2 ring-gray-500/30"></div>
              <span className="text-xs text-gray-300 font-medium">Off Duty</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
