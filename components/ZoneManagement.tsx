"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Textarea,
} from "@heroui/react";
import { MapPin, Plus, Edit2, Trash2, Users, Activity, AlertCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface Zone {
  id: string;
  name: string;
  code: string;
  description: string | null;
  boundaries: string;
  status: string;
  priority: string;
  assignedOfficers: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ZoneForm {
  name: string;
  code: string;
  description: string;
  boundaries: string;
  status: string;
  priority: string;
}

const STATUSES = [
  { value: "ACTIVE", label: "Active", color: "success" as const },
  { value: "INACTIVE", label: "Inactive", color: "default" as const },
  { value: "ALERT", label: "High Alert", color: "danger" as const },
  { value: "REDUCED", label: "Reduced Patrol", color: "warning" as const },
];

const PRIORITIES = [
  { value: "LOW", label: "Low", color: "default" as const },
  { value: "MEDIUM", label: "Medium", color: "primary" as const },
  { value: "HIGH", label: "High", color: "warning" as const },
  { value: "CRITICAL", label: "Critical", color: "danger" as const },
];

export function ZoneManagement() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<ZoneForm>({
    name: "",
    code: "",
    description: "",
    boundaries: "",
    status: "ACTIVE",
    priority: "MEDIUM",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchZones() {
    try {
      const res = await fetch("/api/cad/zones");
      if (!res.ok) throw new Error("Failed to fetch zones");
      const data = await res.json();
      setZones(data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingZone(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      boundaries: "",
      status: "ACTIVE",
      priority: "MEDIUM",
    });
    onOpen();
  }

  function handleOpenEdit(zone: Zone) {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      code: zone.code,
      description: zone.description || "",
      boundaries: zone.boundaries,
      status: zone.status,
      priority: zone.priority,
    });
    onOpen();
  }

  async function handleSubmit() {
    try {
      if (!formData.name || !formData.code) {
        toast.error("Name and code are required");
        return;
      }

      const url = editingZone ? `/api/cad/zones/${editingZone.id}` : "/api/cad/zones";
      const method = editingZone ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save zone");

      toast.success(editingZone ? "Zone updated successfully" : "Zone created successfully");
      onClose();
      fetchZones();
    } catch (error) {
      console.error("Error saving zone:", error);
      toast.error("Failed to save zone");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this zone?")) return;

    try {
      const res = await fetch(`/api/cad/zones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete zone");
      toast.success("Zone deleted successfully");
      fetchZones();
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast.error("Failed to delete zone");
    }
  }

  const activeZones = zones.filter((z) => z.status === "ACTIVE").length;
  const alertZones = zones.filter((z) => z.status === "ALERT").length;
  const totalOfficers = zones.reduce((sum, z) => sum + z.assignedOfficers.length, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/80 to-blue-950/80 border-2 border-blue-800">
          <CardBody className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{zones.length}</p>
              <p className="text-sm text-gray-300">Total Zones</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/80 to-green-950/80 border-2 border-green-800">
          <CardBody className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeZones}</p>
              <p className="text-sm text-gray-300">Active Zones</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/80 to-red-950/80 border-2 border-red-800">
          <CardBody className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{alertZones}</p>
              <p className="text-sm text-gray-300">High Alert</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/80 to-purple-950/80 border-2 border-purple-800">
          <CardBody className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalOfficers}</p>
              <p className="text-sm text-gray-300">Assigned Officers</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
            Zone Management
          </h2>
          <p className="text-gray-400 mt-1">Manage patrol zones and beat assignments</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleOpenCreate}
        >
          Create Zone
        </Button>
      </div>

      {/* Zones Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading zones...</div>
      ) : zones.length === 0 ? (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No zones configured</p>
            <p className="text-sm text-gray-500 mt-1">Create your first patrol zone to get started</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const statusInfo = STATUSES.find((s) => s.value === zone.status);
            const priorityInfo = PRIORITIES.find((p) => p.value === zone.priority);

            return (
              <Card
                key={zone.id}
                className={`bg-gradient-to-br from-gray-900/80 to-black/80 border-2 ${
                  zone.status === "ALERT"
                    ? "border-red-800 animate-pulse"
                    : "border-gray-800"
                }`}
              >
                <CardHeader className="flex justify-between items-start pb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 font-mono">{zone.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleOpenEdit(zone)}
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(zone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardBody className="pt-0 space-y-3">
                  {zone.description && (
                    <p className="text-sm text-gray-400">{zone.description}</p>
                  )}

                  <div className="flex gap-2">
                    <Chip size="sm" color={statusInfo?.color} variant="flat">
                      {statusInfo?.label}
                    </Chip>
                    <Chip size="sm" color={priorityInfo?.color} variant="flat">
                      {priorityInfo?.label}
                    </Chip>
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{zone.assignedOfficers.length} Officers Assigned</span>
                    </div>
                  </div>

                  {zone.boundaries && (
                    <div className="text-xs text-gray-500 font-mono bg-black/30 p-2 rounded">
                      {zone.boundaries.length > 60
                        ? `${zone.boundaries.substring(0, 60)}...`
                        : zone.boundaries}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">
              {editingZone ? "Edit Zone" : "Create Zone"}
            </h3>
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Zone Name"
                placeholder="Downtown District"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
              />
              <Input
                label="Zone Code"
                placeholder="DT-01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                isRequired
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Optional zone description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Textarea
              label="Boundaries (GeoJSON or Coordinates)"
              placeholder='{"type": "Polygon", "coordinates": [...]}'
              value={formData.boundaries}
              onChange={(e) => setFormData({ ...formData, boundaries: e.target.value })}
              minRows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                selectedKeys={[formData.status]}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUSES.map((status) => (
                  <SelectItem key={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Priority"
                selectedKeys={[formData.priority]}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {editingZone ? "Update Zone" : "Create Zone"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
