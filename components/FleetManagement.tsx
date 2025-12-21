"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Car, Plus, Search, Wrench, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { toast } from "@/lib/toast";

interface FleetVehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  department: string;
  status: string;
  mileage: number;
  assignedTo: string | null;
  lastService: string | null;
  nextService: string | null;
  notes: string | null;
  createdAt: string;
  maintenanceLogs: MaintenanceLog[];
}

interface MaintenanceLog {
  id: string;
  type: string;
  description: string;
  cost: number;
  performedBy: string;
  performedAt: string;
  nextDueDate: string | null;
  nextDueMileage: number | null;
}

export function FleetManagement() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [modalType, setModalType] = useState<"vehicle" | "maintenance">("vehicle");

  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    make: "",
    model: "",
    year: "",
    vin: "",
    licensePlate: "",
    department: "POLICE",
    mileage: "",
    assignedTo: "",
    notes: "",
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    type: "OIL_CHANGE",
    description: "",
    cost: "",
    performedBy: "",
    nextDueMileage: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/cad/fleet/vehicles");
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      toast.error("Failed to load fleet vehicles");
    }
  };

  const handleCreateVehicle = async () => {
    if (!vehicleForm.vehicleNumber || !vehicleForm.make || !vehicleForm.model || !vehicleForm.year) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/fleet/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vehicleForm,
          year: parseInt(vehicleForm.year),
          mileage: parseInt(vehicleForm.mileage) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to create vehicle");

      toast.success("Vehicle added to fleet");
      fetchVehicles();
      onClose();
      resetVehicleForm();
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      toast.error("Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenance = async () => {
    if (!selectedVehicle || !maintenanceForm.type || !maintenanceForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cad/fleet/vehicles/${selectedVehicle.id}/maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...maintenanceForm,
          cost: parseFloat(maintenanceForm.cost) || 0,
          nextDueMileage: maintenanceForm.nextDueMileage ? parseInt(maintenanceForm.nextDueMileage) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to add maintenance log");

      toast.success("Maintenance log added");
      fetchVehicles();
      onClose();
      resetMaintenanceForm();
    } catch (error) {
      console.error("Failed to add maintenance:", error);
      toast.error("Failed to add maintenance log");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (vehicleId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cad/fleet/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Vehicle status updated");
      fetchVehicles();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update vehicle status");
    }
  };

  const resetVehicleForm = () => {
    setVehicleForm({
      vehicleNumber: "",
      make: "",
      model: "",
      year: "",
      vin: "",
      licensePlate: "",
      department: "POLICE",
      mileage: "",
      assignedTo: "",
      notes: "",
    });
  };

  const resetMaintenanceForm = () => {
    setMaintenanceForm({
      type: "OIL_CHANGE",
      description: "",
      cost: "",
      performedBy: "",
      nextDueMileage: "",
    });
  };

  const openVehicleModal = () => {
    setModalType("vehicle");
    resetVehicleForm();
    setSelectedVehicle(null);
    onOpen();
  };

  const openMaintenanceModal = (vehicle: FleetVehicle) => {
    setModalType("maintenance");
    setSelectedVehicle(vehicle);
    resetMaintenanceForm();
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_SERVICE":
        return "success";
      case "OUT_OF_SERVICE":
        return "danger";
      case "MAINTENANCE":
        return "warning";
      case "RESERVED":
        return "primary";
      default:
        return "default";
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
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

  const isMaintenanceDue = (vehicle: FleetVehicle) => {
    if (!vehicle.nextService) return false;
    const dueDate = new Date(vehicle.nextService);
    const now = new Date();
    const daysUntil = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7;
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "ALL" || v.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const activeVehicles = filteredVehicles.filter((v) => v.status === "IN_SERVICE").length;
  const maintenanceVehicles = filteredVehicles.filter((v) => v.status === "MAINTENANCE").length;
  const outOfService = filteredVehicles.filter((v) => v.status === "OUT_OF_SERVICE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
              <Car className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Fleet Management</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {activeVehicles} in service
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {maintenanceVehicles} in maintenance
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {outOfService} out of service
                </span>
              </div>
            </div>
          </div>
          <Button
            color="primary"
            variant="shadow"
            startContent={<Plus className="w-4 h-4" />}
            onPress={openVehicleModal}
            className="font-semibold"
          >
            Add Vehicle
          </Button>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by vehicle #, make, model, or plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-1"
              classNames={{
                input: "bg-gray-800/50",
                inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
              }}
            />
            <Select
              label="Department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-48"
              classNames={{
                trigger: "bg-gray-800/50 border-gray-700",
              }}
            >
              <SelectItem key="ALL" value="ALL">All Departments</SelectItem>
              <SelectItem key="POLICE" value="POLICE">Police</SelectItem>
              <SelectItem key="FIRE" value="FIRE">Fire</SelectItem>
              <SelectItem key="EMS" value="EMS">EMS</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVehicles.length === 0 ? (
          <Card className="col-span-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
            <CardBody className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                  <Car className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No Vehicles Found</h4>
                <p className="text-sm text-gray-400 mb-4">Add vehicles to start managing your fleet</p>
                <Button color="primary" variant="flat" startContent={<Plus />} onPress={openVehicleModal}>
                  Add First Vehicle
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
                vehicle.status === "OUT_OF_SERVICE"
                  ? "border-red-700/30 hover:border-red-600/50"
                  : vehicle.status === "MAINTENANCE"
                  ? "border-yellow-700/30 hover:border-yellow-600/50"
                  : isMaintenanceDue(vehicle)
                  ? "border-orange-700/30 hover:border-orange-600/50"
                  : "border-gray-700 hover:border-blue-500/50"
              }`}
            >
              <CardBody className="p-5">
                {/* Vehicle Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">UNIT #{vehicle.vehicleNumber}</span>
                      <Chip size="sm" color={getDepartmentColor(vehicle.department)} variant="solid" className="font-bold">
                        {vehicle.department}
                      </Chip>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">{vehicle.licensePlate}</p>
                  </div>
                  <Chip size="sm" color={getStatusColor(vehicle.status)} variant="solid" className="font-bold">
                    {vehicle.status.replace(/_/g, " ")}
                  </Chip>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Mileage:</span>
                    <span className="text-white font-semibold">{vehicle.mileage.toLocaleString()} mi</span>
                  </div>
                  {vehicle.assignedTo && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Assigned To:</span>
                      <span className="text-blue-300 font-semibold">{vehicle.assignedTo}</span>
                    </div>
                  )}
                  {vehicle.lastService && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last Service:</span>
                      <span className="text-gray-300">{new Date(vehicle.lastService).toLocaleDateString()}</span>
                    </div>
                  )}
                  {vehicle.nextService && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Next Service:</span>
                      <span className={isMaintenanceDue(vehicle) ? "text-orange-400 font-bold" : "text-gray-300"}>
                        {new Date(vehicle.nextService).toLocaleDateString()}
                        {isMaintenanceDue(vehicle) && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                      </span>
                    </div>
                  )}
                </div>

                {/* Maintenance Alert */}
                {isMaintenanceDue(vehicle) && (
                  <div className="mb-4 p-3 bg-orange-900/30 border-2 border-orange-700/50 rounded-lg">
                    <p className="text-xs text-orange-300 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Maintenance due soon
                    </p>
                  </div>
                )}

                {/* Maintenance History */}
                {vehicle.maintenanceLogs.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 font-semibold mb-2">Recent Maintenance:</p>
                    <div className="space-y-1">
                      {vehicle.maintenanceLogs.slice(0, 2).map((log) => (
                        <div key={log.id} className="text-xs text-gray-300 bg-gray-800/50 rounded p-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{log.type.replace(/_/g, " ")}</span>
                            <span className="text-green-400 font-mono">${log.cost.toFixed(2)}</span>
                          </div>
                          <p className="text-gray-500">{new Date(log.performedAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    fullWidth
                    startContent={<Wrench className="w-4 h-4" />}
                    onPress={() => openMaintenanceModal(vehicle)}
                  >
                    Add Maintenance
                  </Button>
                  <Select
                    size="sm"
                    placeholder="Status"
                    selectedKeys={[vehicle.status]}
                    onChange={(e) => handleUpdateStatus(vehicle.id, e.target.value)}
                    className="w-32"
                    classNames={{
                      trigger: "bg-gray-800/50 border-gray-700 h-8 min-h-8",
                    }}
                  >
                    <SelectItem key="IN_SERVICE">In Service</SelectItem>
                    <SelectItem key="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem key="OUT_OF_SERVICE">Out of Service</SelectItem>
                    <SelectItem key="RESERVED">Reserved</SelectItem>
                  </Select>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Add Vehicle/Maintenance Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${modalType === "vehicle" ? "bg-blue-500/10" : "bg-yellow-500/10"}`}>
              {modalType === "vehicle" ? <Car className="w-5 h-5 text-blue-500" /> : <Wrench className="w-5 h-5 text-yellow-500" />}
            </div>
            {modalType === "vehicle" ? "Add Fleet Vehicle" : `Add Maintenance - ${selectedVehicle?.vehicleNumber}`}
          </ModalHeader>
          <ModalBody>
            {modalType === "vehicle" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Number"
                    placeholder="Unit #"
                    value={vehicleForm.vehicleNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })}
                    isRequired
                    variant="bordered"
                  />
                  <Select
                    label="Department"
                    selectedKeys={[vehicleForm.department]}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, department: e.target.value })}
                    variant="bordered"
                  >
                    <SelectItem key="POLICE">Police</SelectItem>
                    <SelectItem key="FIRE">Fire</SelectItem>
                    <SelectItem key="EMS">EMS</SelectItem>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Make"
                    placeholder="Ford, Chevy..."
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                    isRequired
                    variant="bordered"
                  />
                  <Input
                    label="Model"
                    placeholder="Explorer, Tahoe..."
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    isRequired
                    variant="bordered"
                  />
                  <Input
                    label="Year"
                    placeholder="2024"
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                    isRequired
                    variant="bordered"
                  />
                </div>
                <Input
                  label="VIN"
                  placeholder="Vehicle Identification Number"
                  value={vehicleForm.vin}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
                  variant="bordered"
                  classNames={{ input: "font-mono" }}
                />
                <Input
                  label="License Plate"
                  placeholder="ABC-1234"
                  value={vehicleForm.licensePlate}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                  variant="bordered"
                  classNames={{ input: "font-mono uppercase" }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Current Mileage"
                    placeholder="0"
                    type="number"
                    value={vehicleForm.mileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                    variant="bordered"
                  />
                  <Input
                    label="Assigned To"
                    placeholder="Officer/Unit name"
                    value={vehicleForm.assignedTo}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, assignedTo: e.target.value })}
                    variant="bordered"
                  />
                </div>
                <Textarea
                  label="Notes"
                  placeholder="Additional information..."
                  value={vehicleForm.notes}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, notes: e.target.value })}
                  variant="bordered"
                  minRows={2}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  label="Maintenance Type"
                  selectedKeys={[maintenanceForm.type]}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="OIL_CHANGE">Oil Change</SelectItem>
                  <SelectItem key="TIRE_ROTATION">Tire Rotation</SelectItem>
                  <SelectItem key="BRAKE_SERVICE">Brake Service</SelectItem>
                  <SelectItem key="INSPECTION">Inspection</SelectItem>
                  <SelectItem key="REPAIR">Repair</SelectItem>
                  <SelectItem key="DETAILING">Detailing</SelectItem>
                  <SelectItem key="OTHER">Other</SelectItem>
                </Select>
                <Textarea
                  label="Description"
                  placeholder="Details of maintenance performed..."
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                  isRequired
                  variant="bordered"
                  minRows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Cost"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    startContent={<span className="text-gray-400">$</span>}
                    value={maintenanceForm.cost}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
                    variant="bordered"
                  />
                  <Input
                    label="Performed By"
                    placeholder="Shop/Mechanic name"
                    value={maintenanceForm.performedBy}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, performedBy: e.target.value })}
                    variant="bordered"
                  />
                </div>
                <Input
                  label="Next Due Mileage (Optional)"
                  placeholder="e.g., 45000"
                  type="number"
                  value={maintenanceForm.nextDueMileage}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, nextDueMileage: e.target.value })}
                  variant="bordered"
                  description="Set when this maintenance should be performed again"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color={modalType === "vehicle" ? "primary" : "warning"}
              variant="shadow"
              onPress={modalType === "vehicle" ? handleCreateVehicle : handleAddMaintenance}
              isLoading={loading}
              className="font-semibold"
              startContent={modalType === "vehicle" ? <Plus /> : <Wrench />}
            >
              {modalType === "vehicle" ? "Add Vehicle" : "Add Maintenance"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
