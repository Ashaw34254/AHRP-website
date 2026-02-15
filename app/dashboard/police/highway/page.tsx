"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { 
  Card, CardBody, CardHeader, Button, Input, Select, SelectItem,
  Chip, Tabs, Tab, Spinner, Modal, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, useDisclosure, Tooltip, Textarea,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Divider
} from "@heroui/react";
import { 
  Car, Search, Filter, Plus, Eye, AlertTriangle, Clock,
  FileText, MapPin, Shield, Hash, AlertOctagon, CheckCircle,
  XCircle, Ban, Info, Gauge, Users, Phone, Flag, Target,
  TrendingUp, Activity, Navigation, Zap, FileSignature, Settings,
  Disc, RefreshCw, Calendar, User, Wrench, DollarSign, Radio,
  PlayCircle, PauseCircle
} from "lucide-react";
import { toast } from "@/lib/toast";

// Types
interface Vehicle {
  id: string;
  plate: string;
  make?: string;
  model: string;
  color: string;
  year?: number;
  vin?: string;
  isStolen: boolean;
  isWanted: boolean;
  isImpounded: boolean;
  registrationStatus: string;
  insuranceStatus: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    licenseStatus: string;
  };
  flags?: string[];
  notes?: string;
}

interface TrafficStop {
  id: string;
  stopNumber: string;
  vehiclePlate: string;
  vehicle?: Vehicle;
  location: string;
  reason: string;
  outcome: string;
  officerCallsign: string;
  duration: number; // minutes
  occupants: number;
  timestamp: string;
  citations?: any[];
  warnings?: any[];
  notes?: string;
}

interface Pursuit {
  id: string;
  pursuitNumber: string;
  vehiclePlate: string;
  startLocation: string;
  endLocation?: string;
  reason: string;
  status: string;
  riskLevel: string;
  peakSpeed: number;
  duration: number;
  unitsInvolved: string[];
  outcome?: string;
  startedAt: string;
  endedAt?: string;
}

interface Infringement {
  id: string;
  infringementNumber: string;
  vehiclePlate: string;
  driverName: string;
  offence: string;
  location: string;
  fineAmount: number;
  demeritPoints: number;
  isPaid: boolean;
  issuedBy: string;
  issuedAt: string;
}

export default function HighwayPage() {
  const [activeTab, setActiveTab] = useState("operations");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  // Vehicle lookups
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Statistics
  const [highwayStats, setHighwayStats] = useState({
    stopsToday: 0,
    infringementsToday: 0,
    activePursuits: 0,
    vehiclesChecked: 0,
    totalFines: 0,
    avgStopDuration: 0
  });

  // Traffic stops
  const [trafficStops, setTrafficStops] = useState<TrafficStop[]>([]);
  const [recentStops, setRecentStops] = useState<TrafficStop[]>([]);

  // Pursuits
  const [pursuits, setPursuits] = useState<Pursuit[]>([]);
  const [activePursuits, setActivePursuits] = useState<Pursuit[]>([]);

  // Infringements
  const [infringements, setInfringements] = useState<Infringement[]>([]);

  // Modals
  const { isOpen: isStopOpen, onOpen: onStopOpen, onClose: onStopClose } = useDisclosure();
  const { isOpen: isInfringementOpen, onOpen: onInfringementOpen, onClose: onInfringementClose } = useDisclosure();
  const { isOpen: isPursuitOpen, onOpen: onPursuitOpen, onClose: onPursuitClose } = useDisclosure();
  const { isOpen: isVehicleDetailOpen, onOpen: onVehicleDetailOpen, onClose: onVehicleDetailClose } = useDisclosure();

  // Statistics
  const [stats, setStats] = useState({
    stopsToday: 0,
    infringementsToday: 0,
    activePursuits: 0,
    vehiclesChecked: 0,
    totalFines: 0,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            document.getElementById('vehicle-search')?.focus();
            break;
          case 's':
            e.preventDefault();
            onStopOpen();
            break;
          case 'i':
            e.preventDefault();
            onInfringementOpen();
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
    fetchTrafficStops();
    fetchPursuits();
    fetchInfringements();
    fetchStats();
    setLastUpdate(new Date());
    toast.success('Data refreshed');
  };

  useEffect(() => {
    fetchAllData();

    // Auto-refresh every 15 seconds if live
    const interval = setInterval(() => {
      if (isLive) {
        fetchTrafficStops();
        fetchPursuits();
        fetchStats();
        setLastUpdate(new Date());
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isLive]);

  const fetchTrafficStops = async () => {
    try {
      const response = await fetch("/api/cad/traffic-stops?limit=50");
      if (response.ok) {
        const data = await response.json();
        setTrafficStops(data.stops || []);
        setRecentStops((data.stops || []).slice(0, 10));
      }
    } catch (error) {
      console.error("Failed to fetch traffic stops:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPursuits = async () => {
    try {
      const response = await fetch("/api/cad/pursuits");
      if (response.ok) {
        const data = await response.json();
        setPursuits(data.pursuits || []);
        setActivePursuits((data.pursuits || []).filter((p: Pursuit) => p.status === "ACTIVE"));
      }
    } catch (error) {
      console.error("Failed to fetch pursuits:", error);
    }
  };

  const fetchInfringements = async () => {
    try {
      const response = await fetch("/api/cad/infringements?limit=50");
      if (response.ok) {
        const data = await response.json();
        setInfringements(data.infringements || []);
      }
    } catch (error) {
      console.error("Failed to fetch infringements:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/cad/highway/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const searchVehicle = async () => {
    if (!vehicleSearch.trim()) {
      toast.error("Enter a plate number");
      return;
    }

    try {
      const response = await fetch(`/api/cad/civil/vehicle?plate=${encodeURIComponent(vehicleSearch)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.vehicle) {
          setSearchResults([data.vehicle]);
          setSelectedVehicle(data.vehicle);
          onVehicleDetailOpen();
        } else {
          toast.error("Vehicle not found");
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error("Failed to search vehicle:", error);
      toast.error("Failed to search vehicle");
    }
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
                <Car className="w-8 h-8 text-blue-500" />
                Highway Patrol - Traffic Enforcement
              </h1>
              {activePursuits.length > 0 && (
                <Chip
                  color="danger"
                  variant="solid"
                  size="sm"
                  className="animate-pulse"
                >ACTIVE PURSUIT</Chip>
              )}
            </div>
            <p className="text-gray-400 mt-1">
              Vehicle-focused enforcement and compliance operations • Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip content="Click to toggle auto-refresh (updates every 15 seconds when live)">
              <Button
                color={isLive ? 'success' : 'default'}
                variant="solid"
                onPress={() => setIsLive(!isLive)}
                className={isLive ? 'animate-pulse' : ''}
              >
                {isLive ? 'LIVE' : 'PAUSED'}
              </Button>
            </Tooltip>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onStopOpen}
            >
              Traffic Stop (Ctrl+S)
            </Button>
            <Button
              color="danger"
              startContent={<AlertTriangle className="w-4 h-4" />}
              onPress={onPursuitOpen}
            >
              Log Pursuit
            </Button>
            <Button
              color="warning"
              startContent={<FileText className="w-4 h-4" />}
              onPress={onInfringementOpen}
            >
              Infringement (Ctrl+I)
            </Button>
            <Tooltip content="Refresh data (Ctrl+R)">
              <Button
                color="default"
                variant="flat"
                isIconOnly
                onPress={fetchAllData}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Active Pursuits Alert */}
        {activePursuits.length > 0 && (
          <Card className="bg-red-500/10 border-2 border-red-500">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-500">ACTIVE PURSUIT IN PROGRESS</h3>
                  <p className="text-sm text-gray-300">
                    {activePursuits.length} active pursuit{activePursuits.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button color="danger" onPress={() => setActiveTab("pursuits")}>
                  View Details
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.stopsToday}</p>
                  <p className="text-xs text-gray-400">Stops Today</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.infringementsToday}</p>
                  <p className="text-xs text-gray-400">Infringements</p>
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
                  <p className="text-2xl font-bold">{stats.activePursuits}</p>
                  <p className="text-xs text-gray-400">Active Pursuits</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Car className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.vehiclesChecked}</p>
                  <p className="text-xs text-gray-400">Vehicles Checked</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${stats.totalFines}</p>
                  <p className="text-xs text-gray-400">Total Fines</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Vehicle Lookup */}
        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              Vehicle Lookup
            </h2>
            <div className="flex gap-3">
              <Input
                id="vehicle-search"
                placeholder="Enter plate number... (Ctrl+F to focus)"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && searchVehicle()}
                startContent={<Hash className="w-4 h-4 text-gray-500" />}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
                className="flex-1"
              />
              <Button
                color="primary"
                onPress={searchVehicle}
                startContent={<Search className="w-4 h-4" />}
              >
                Search
              </Button>
            </div>
          </CardBody>
        </Card>

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
            key="operations"
            title={
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Traffic Stops
              </div>
            }
          >
            <TrafficStopsView
              stops={recentStops}
              onStopSelect={(stop: TrafficStop) => {
                setSelectedVehicle(stop.vehicle || null);
                if (stop.vehicle) onVehicleDetailOpen();
              }}
            />
          </Tab>

          <Tab
            key="pursuits"
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Pursuits
                {activePursuits.length > 0 && (
                  <Chip color="danger" size="sm">{activePursuits.length}</Chip>
                )}
              </div>
            }
          >
            <PursuitsView
              pursuits={pursuits}
              activePursuits={activePursuits}
            />
          </Tab>

          <Tab
            key="infringements"
            title={
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Infringements
              </div>
            }
          >
            <InfringementsView infringements={infringements} />
          </Tab>

          <Tab
            key="analytics"
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </div>
            }
          >
            <AnalyticsView
              stops={trafficStops}
              infringements={infringements}
              pursuits={pursuits}
            />
          </Tab>
        </Tabs>

        {/* Modals */}
        <TrafficStopModal
          isOpen={isStopOpen}
          onClose={onStopClose}
          onCreate={fetchTrafficStops}
        />

        <InfringementModal
          isOpen={isInfringementOpen}
          onClose={onInfringementClose}
          onCreate={fetchInfringements}
        />

        <PursuitModal
          isOpen={isPursuitOpen}
          onClose={onPursuitClose}
          onCreate={fetchPursuits}
        />

        {selectedVehicle && (
          <VehicleDetailModal
            isOpen={isVehicleDetailOpen}
            onClose={onVehicleDetailClose}
            vehicle={selectedVehicle}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

// Traffic Stops View Component
function TrafficStopsView({ stops, onStopSelect }: any) {
  return (
    <div className="mt-4 space-y-3">
      {stops.map((stop: TrafficStop) => (
        <Card
          key={stop.id}
          isPressable
          onPress={() => onStopSelect(stop)}
          className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <CardBody className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Chip size="sm" variant="bordered">
                    {stop.stopNumber}
                  </Chip>
                  <Chip size="sm" color="primary" variant="flat">
                    {stop.vehiclePlate}
                  </Chip>
                  <span className="text-xs text-gray-500">
                    {stop.duration} min
                  </span>
                </div>

                <h3 className="font-semibold mb-1">{stop.reason}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {stop.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {stop.officerCallsign}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(stop.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="mt-2">
                  <Chip
                    size="sm"
                    color={
                      stop.outcome === "ARREST" ? "danger" :
                      stop.outcome === "CITATION" ? "warning" :
                      stop.outcome === "WARNING" ? "primary" : "success"
                    }
                    variant="flat"
                  >
                    {stop.outcome}
                  </Chip>
                </div>
              </div>

              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<Eye className="w-4 h-4" />}
              >
                Details
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}

      {stops.length === 0 && (
        <Card className="bg-gray-800/30 border border-gray-700">
          <CardBody className="p-8 text-center">
            <Car className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No recent traffic stops</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Pursuits View Component
function PursuitsView({ pursuits, activePursuits }: any) {
  return (
    <div className="mt-4 space-y-4">
      {activePursuits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-500 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5" />
            Active Pursuits
          </h3>
          <div className="space-y-3">
            {activePursuits.map((pursuit: Pursuit) => (
              <Card
                key={pursuit.id}
                className="bg-red-500/10 border-2 border-red-500"
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Chip size="sm" color="danger" variant="solid">
                          ACTIVE
                        </Chip>
                        <Chip size="sm" variant="bordered">
                          {pursuit.pursuitNumber}
                        </Chip>
                        <Chip
                          size="sm"
                          color={
                            pursuit.riskLevel === "HIGH" ? "danger" :
                            pursuit.riskLevel === "MEDIUM" ? "warning" : "primary"
                          }
                          variant="flat"
                        >
                          {pursuit.riskLevel} Risk
                        </Chip>
                      </div>

                      <p className="font-semibold text-lg mb-2">
                        Vehicle: {pursuit.vehiclePlate}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Reason</p>
                          <p className="text-white">{pursuit.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Peak Speed</p>
                          <p className="text-white">{pursuit.peakSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="text-white">{pursuit.duration} min</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Units Involved</p>
                          <p className="text-white">{pursuit.unitsInvolved.join(", ")}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        Last seen: {pursuit.startLocation}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Divider className="my-6" />

      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Recent Pursuits
      </h3>

      <Table
        aria-label="Pursuits table"
        classNames={{
          wrapper: "bg-gray-800/50 border border-gray-700",
          th: "bg-gray-700/50 text-gray-300",
          td: "text-gray-200",
        }}
      >
        <TableHeader>
          <TableColumn>PURSUIT #</TableColumn>
          <TableColumn>VEHICLE</TableColumn>
          <TableColumn>REASON</TableColumn>
          <TableColumn>RISK</TableColumn>
          <TableColumn>DURATION</TableColumn>
          <TableColumn>OUTCOME</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {pursuits.map((pursuit: Pursuit) => (
            <TableRow key={pursuit.id}>
              <TableCell>{pursuit.pursuitNumber}</TableCell>
              <TableCell>{pursuit.vehiclePlate}</TableCell>
              <TableCell>{pursuit.reason}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={
                    pursuit.riskLevel === "HIGH" ? "danger" :
                    pursuit.riskLevel === "MEDIUM" ? "warning" : "primary"
                  }
                  variant="flat"
                >
                  {pursuit.riskLevel}
                </Chip>
              </TableCell>
              <TableCell>{pursuit.duration} min</TableCell>
              <TableCell>{pursuit.outcome || "Ongoing"}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={pursuit.status === "ACTIVE" ? "danger" : "default"}
                  variant="flat"
                >
                  {pursuit.status}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Infringements View Component
function InfringementsView({ infringements }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = infringements.filter((inf: Infringement) => {
    if (statusFilter !== "all") {
      if (statusFilter === "paid" && !inf.isPaid) return false;
      if (statusFilter === "unpaid" && inf.isPaid) return false;
    }
    if (searchQuery) {
      return (
        inf.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.driverName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search plate or driver..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-500" />}
          classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
          className="max-w-md"
        />

        <Select
          label="Payment Status"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-xs"
          classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="paid">Paid</SelectItem>
          <SelectItem key="unpaid">Unpaid</SelectItem>
        </Select>
      </div>

      <Table
        aria-label="Infringements table"
        classNames={{
          wrapper: "bg-gray-800/50 border border-gray-700",
          th: "bg-gray-700/50 text-gray-300",
          td: "text-gray-200",
        }}
      >
        <TableHeader>
          <TableColumn>INFRINGEMENT #</TableColumn>
          <TableColumn>VEHICLE</TableColumn>
          <TableColumn>DRIVER</TableColumn>
          <TableColumn>OFFENCE</TableColumn>
          <TableColumn>LOCATION</TableColumn>
          <TableColumn>FINE</TableColumn>
          <TableColumn>DEMERITS</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ISSUED</TableColumn>
        </TableHeader>
        <TableBody>
          {filtered.map((inf: Infringement) => (
            <TableRow key={inf.id}>
              <TableCell>{inf.infringementNumber}</TableCell>
              <TableCell>{inf.vehiclePlate}</TableCell>
              <TableCell>{inf.driverName}</TableCell>
              <TableCell>{inf.offence}</TableCell>
              <TableCell>{inf.location}</TableCell>
              <TableCell>${inf.fineAmount}</TableCell>
              <TableCell>{inf.demeritPoints}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={inf.isPaid ? "success" : "warning"}
                  variant="flat"
                >
                  {inf.isPaid ? "Paid" : "Unpaid"}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(inf.issuedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ stops, infringements, pursuits }: any) {
  // Calculate statistics
  const topOffences = Object.entries(
    infringements.reduce((acc: any, inf: Infringement) => {
      acc[inf.offence] = (acc[inf.offence] || 0) + 1;
      return acc;
    }, {})
  ).sort(([, a]: any, [, b]: any) => b - a).slice(0, 5);

  const totalFines = infringements.reduce(
    (sum: number, inf: Infringement) => sum + inf.fineAmount, 
    0
  );

  const paidFines = infringements
    .filter((inf: Infringement) => inf.isPaid)
    .reduce((sum: number, inf: Infringement) => sum + inf.fineAmount, 0);

  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Offences */}
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Offences</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {topOffences.map(([offence, count]: any, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{offence}</span>
                  <Chip size="sm" color="primary" variant="flat">
                    {count}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Financial Summary */}
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardHeader>
            <h3 className="text-lg font-semibold">Financial Summary</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Total Fines Issued</p>
                <p className="text-2xl font-bold text-green-500">
                  ${totalFines.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fines Collected</p>
                <p className="text-2xl font-bold text-blue-500">
                  ${paidFines.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-500">
                  ${(totalFines - paidFines).toLocaleString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Activity Overview */}
      <Card className="bg-gray-800/50 border border-gray-700">
        <CardHeader>
          <h3 className="text-lg font-semibold">Activity Overview</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-500">{stops.length}</p>
              <p className="text-gray-400 mt-1">Traffic Stops</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-500">{infringements.length}</p>
              <p className="text-gray-400 mt-1">Infringements</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-500">{pursuits.length}</p>
              <p className="text-gray-400 mt-1">Pursuits</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Traffic Stop Modal
function TrafficStopModal({ isOpen, onClose, onCreate }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    vehiclePlate: "",
    location: "",
    reason: "",
    outcome: "WARNING",
    occupants: 1,
    notes: "",
  });

  const handleCreate = async () => {
    if (!form.vehiclePlate || !form.location || !form.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/cad/traffic-stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          officerCallsign: "Current Officer",
          timestamp: new Date().toISOString(),
        })
      });

      if (response.ok) {
        toast.success("Traffic stop logged");
        onClose();
        onCreate();
        setForm({
          vehiclePlate: "",
          location: "",
          reason: "",
          outcome: "WARNING",
          occupants: 1,
          notes: "",
        });
      } else {
        throw new Error("Failed to log traffic stop");
      }
    } catch (error) {
      console.error("Failed to log traffic stop:", error);
      toast.error("Failed to log traffic stop");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Log Traffic Stop</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Vehicle Plate"
              placeholder="ABC123"
              value={form.vehiclePlate}
              onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })}
              isRequired
              startContent={<Hash className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

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
              label="Reason for Stop"
              placeholder="Select reason"
              selectedKeys={form.reason ? [form.reason] : []}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              isRequired
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="SPEEDING">Speeding</SelectItem>
              <SelectItem key="RECKLESS_DRIVING">Reckless Driving</SelectItem>
              <SelectItem key="DUI">DUI / DWI</SelectItem>
              <SelectItem key="REGISTRATION">Registration Issue</SelectItem>
              <SelectItem key="EQUIPMENT">Equipment Violation</SelectItem>
              <SelectItem key="TRAFFIC_VIOLATION">Traffic Violation</SelectItem>
              <SelectItem key="SUSPICIOUS">Suspicious Vehicle</SelectItem>
              <SelectItem key="BOLO">BOLO Hit</SelectItem>
              <SelectItem key="OTHER">Other</SelectItem>
            </Select>

            <Select
              label="Outcome"
              selectedKeys={[form.outcome]}
              onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="WARNING">Verbal Warning</SelectItem>
              <SelectItem key="CITATION">Citation Issued</SelectItem>
              <SelectItem key="ARREST">Arrest</SelectItem>
              <SelectItem key="IMPOUND">Vehicle Impounded</SelectItem>
              <SelectItem key="CLEARED">Cleared</SelectItem>
            </Select>

            <Input
              label="Number of Occupants"
              type="number"
              min="1"
              value={form.occupants.toString()}
              onChange={(e) => setForm({ ...form, occupants: parseInt(e.target.value) || 1 })}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Textarea
              label="Additional Notes"
              placeholder="Any additional details..."
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
            Log Stop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Infringement Modal
function InfringementModal({ isOpen, onClose, onCreate }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    vehiclePlate: "",
    driverName: "",
    offence: "",
    location: "",
    fineAmount: 100,
    demeritPoints: 0,
  });

  const handleCreate = async () => {
    if (!form.vehiclePlate || !form.driverName || !form.offence || !form.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/cad/infringements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          issuedBy: "Current Officer",
          issuedAt: new Date().toISOString(),
          isPaid: false,
        })
      });

      if (response.ok) {
        toast.success("Infringement issued");
        onClose();
        onCreate();
        setForm({
          vehiclePlate: "",
          driverName: "",
          offence: "",
          location: "",
          fineAmount: 100,
          demeritPoints: 0,
        });
      } else {
        throw new Error("Failed to issue infringement");
      }
    } catch (error) {
      console.error("Failed to issue infringement:", error);
      toast.error("Failed to issue infringement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Issue Infringement Notice</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Vehicle Plate"
              placeholder="ABC123"
              value={form.vehiclePlate}
              onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })}
              isRequired
              startContent={<Hash className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Input
              label="Driver Name"
              placeholder="Enter driver name..."
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
              isRequired
              startContent={<User className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Select
              label="Offence"
              placeholder="Select offence"
              selectedKeys={form.offence ? [form.offence] : []}
              onChange={(e) => setForm({ ...form, offence: e.target.value })}
              isRequired
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="SPEEDING_10_20">Speeding 10-20 km/h over</SelectItem>
              <SelectItem key="SPEEDING_20_30">Speeding 20-30 km/h over</SelectItem>
              <SelectItem key="SPEEDING_30_PLUS">Speeding 30+ km/h over</SelectItem>
              <SelectItem key="RED_LIGHT">Red Light Violation</SelectItem>
              <SelectItem key="STOP_SIGN">Stop Sign Violation</SelectItem>
              <SelectItem key="RECKLESS">Reckless Driving</SelectItem>
              <SelectItem key="NO_SEATBELT">No Seatbelt</SelectItem>
              <SelectItem key="MOBILE_PHONE">Mobile Phone Use</SelectItem>
              <SelectItem key="NO_REGISTRATION">No Registration</SelectItem>
              <SelectItem key="NO_WOF">No WOF</SelectItem>
              <SelectItem key="DEFECTIVE_VEHICLE">Defective Vehicle</SelectItem>
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fine Amount ($)"
                type="number"
                min="0"
                value={form.fineAmount.toString()}
                onChange={(e) => setForm({ ...form, fineAmount: parseInt(e.target.value) || 0 })}
                startContent={<DollarSign className="w-4 h-4 text-gray-500" />}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />

              <Input
                label="Demerit Points"
                type="number"
                min="0"
                max="20"
                value={form.demeritPoints.toString()}
                onChange={(e) => setForm({ ...form, demeritPoints: parseInt(e.target.value) || 0 })}
                startContent={<Target className="w-4 h-4 text-gray-500" />}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="warning"
            onPress={handleCreate}
            isLoading={saving}
            startContent={!saving && <FileText className="w-4 h-4" />}
          >
            Issue Infringement
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Pursuit Modal
function PursuitModal({ isOpen, onClose, onCreate }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    vehiclePlate: "",
    startLocation: "",
    reason: "",
    riskLevel: "MEDIUM",
    peakSpeed: 0,
    unitsInvolved: "",
  });

  const handleCreate = async () => {
    if (!form.vehiclePlate || !form.startLocation || !form.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/cad/pursuits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "ACTIVE",
          startedAt: new Date().toISOString(),
          unitsInvolved: form.unitsInvolved.split(",").map(u => u.trim()),
        })
      });

      if (response.ok) {
        toast.success("Pursuit logged");
        onClose();
        onCreate();
        setForm({
          vehiclePlate: "",
          startLocation: "",
          reason: "",
          riskLevel: "MEDIUM",
          peakSpeed: 0,
          unitsInvolved: "",
        });
      } else {
        throw new Error("Failed to log pursuit");
      }
    } catch (error) {
      console.error("Failed to log pursuit:", error);
      toast.error("Failed to log pursuit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="text-red-500">Log Pursuit</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Vehicle Plate"
              placeholder="ABC123"
              value={form.vehiclePlate}
              onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })}
              isRequired
              startContent={<Hash className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Input
              label="Start Location"
              placeholder="Enter start location..."
              value={form.startLocation}
              onChange={(e) => setForm({ ...form, startLocation: e.target.value })}
              isRequired
              startContent={<MapPin className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Textarea
              label="Reason for Pursuit"
              placeholder="Describe the reason..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              isRequired
              minRows={2}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Select
              label="Risk Level"
              selectedKeys={[form.riskLevel]}
              onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="LOW">Low Risk</SelectItem>
              <SelectItem key="MEDIUM">Medium Risk</SelectItem>
              <SelectItem key="HIGH">High Risk</SelectItem>
            </Select>

            <Input
              label="Peak Speed (km/h)"
              type="number"
              min="0"
              value={form.peakSpeed.toString()}
              onChange={(e) => setForm({ ...form, peakSpeed: parseInt(e.target.value) || 0 })}
              startContent={<Gauge className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Input
              label="Units Involved (comma-separated)"
              placeholder="A-12, A-15, HWY-1"
              value={form.unitsInvolved}
              onChange={(e) => setForm({ ...form, unitsInvolved: e.target.value })}
              startContent={<Radio className="w-4 h-4 text-gray-500" />}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleCreate}
            isLoading={saving}
            startContent={!saving && <AlertTriangle className="w-4 h-4" />}
          >
            Log Pursuit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Vehicle Detail Modal
function VehicleDetailModal({ isOpen, onClose, vehicle }: any) {
  if (!vehicle) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>Vehicle Details - {vehicle.plate}</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Alert Flags */}
            {(vehicle.isStolen || vehicle.isWanted || vehicle.isImpounded || vehicle.flags?.length > 0) && (
              <Card className="bg-red-500/10 border-2 border-red-500">
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertOctagon className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-red-500">ALERTS:</span>
                    {vehicle.isStolen && <Chip color="danger" size="sm">STOLEN</Chip>}
                    {vehicle.isWanted && <Chip color="danger" size="sm">WANTED</Chip>}
                    {vehicle.isImpounded && <Chip color="warning" size="sm">IMPOUNDED</Chip>}
                    {vehicle.flags?.map((flag: string, i: number) => (
                      <Chip key={i} color="warning" size="sm">{flag}</Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Vehicle Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Vehicle Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Plate</p>
                    <p className="font-semibold">{vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Make & Model</p>
                    <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Color & Year</p>
                    <p className="font-semibold">{vehicle.color} - {vehicle.year}</p>
                  </div>
                  {vehicle.vin && (
                    <div>
                      <p className="text-xs text-gray-500">VIN</p>
                      <p className="font-mono text-sm">{vehicle.vin}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Owner Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="font-semibold">
                      {vehicle.owner.firstName} {vehicle.owner.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">License Status</p>
                    <Chip
                      size="sm"
                      color={vehicle.owner.licenseStatus === "VALID" ? "success" : "danger"}
                      variant="flat"
                    >
                      {vehicle.owner.licenseStatus}
                    </Chip>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            {/* Compliance Status */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Compliance Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Registration:</span>
                  <Chip
                    size="sm"
                    color={vehicle.registrationStatus === "VALID" ? "success" : "warning"}
                    variant="flat"
                  >
                    {vehicle.registrationStatus}
                  </Chip>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Insurance:</span>
                  <Chip
                    size="sm"
                    color={vehicle.insuranceStatus === "VALID" ? "success" : "warning"}
                    variant="flat"
                  >
                    {vehicle.insuranceStatus}
                  </Chip>
                </div>
              </div>
            </div>

            {vehicle.notes && (
              <>
                <Divider />
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Notes</h3>
                  <p className="text-sm text-gray-300">{vehicle.notes}</p>
                </div>
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
