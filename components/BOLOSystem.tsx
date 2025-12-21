"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { AlertTriangle, User, Car, Plus, X, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/lib/toast";

interface BOLO {
  id: string;
  type: string;
  title: string;
  description: string;
  personName: string | null;
  personDesc: string | null;
  vehiclePlate: string | null;
  vehicleModel: string | null;
  vehicleColor: string | null;
  imageUrl: string | null;
  priority: string;
  status: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string | null;
}

export function BOLOSystem() {
  const [bolos, setBolos] = useState<BOLO[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    type: "PERSON",
    title: "",
    description: "",
    personName: "",
    personDesc: "",
    vehiclePlate: "",
    vehicleModel: "",
    vehicleColor: "",
    imageUrl: "",
    priority: "MEDIUM",
  });

  useEffect(() => {
    fetchBOLOs();
    const interval = setInterval(fetchBOLOs, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBOLOs = async () => {
    try {
      const response = await fetch("/api/cad/bolo");
      if (!response.ok) throw new Error("Failed to fetch BOLOs");
      const data = await response.json();
      setBolos(data.bolos);
    } catch (error) {
      console.error("Failed to fetch BOLOs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const response = await fetch("/api/cad/bolo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          issuedBy: "Dispatcher", // TODO: Get from session
        }),
      });

      if (!response.ok) throw new Error("Failed to create BOLO");

      toast.success("BOLO created successfully");
      onClose();
      fetchBOLOs();
      
      // Reset form
      setFormData({
        type: "PERSON",
        title: "",
        description: "",
        personName: "",
        personDesc: "",
        vehiclePlate: "",
        vehicleModel: "",
        vehicleColor: "",
        imageUrl: "",
        priority: "MEDIUM",
      });
    } catch (error) {
      toast.error("Failed to create BOLO");
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const response = await fetch(`/api/cad/bolo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      });

      if (!response.ok) throw new Error("Failed to resolve BOLO");

      toast.success("BOLO resolved");
      fetchBOLOs();
    } catch (error) {
      toast.error("Failed to resolve BOLO");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`/api/cad/bolo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!response.ok) throw new Error("Failed to cancel BOLO");

      toast.success("BOLO cancelled");
      fetchBOLOs();
    } catch (error) {
      toast.error("Failed to cancel BOLO");
    }
  };

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PERSON":
        return <User className="w-5 h-5" />;
      case "VEHICLE":
        return <Car className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const activeBolos = bolos.filter((b) => b.status === "ACTIVE");

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex justify-between items-center pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl border-2 border-orange-500/30">
              <AlertTriangle className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Be On The Lookout</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  {activeBolos.length} active alert{activeBolos.length !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">
                  {bolos.filter(b => b.type === "PERSON").length} persons • {bolos.filter(b => b.type === "VEHICLE").length} vehicles
                </span>
              </div>
            </div>
          </div>
          <Button
            color="warning"
            variant="shadow"
            startContent={<Plus className="w-4 h-4" />}
            onClick={onOpen}
            className="font-semibold"
          >
            Create BOLO
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          {activeBolos.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">No Active BOLOs</h4>
              <p className="text-sm text-gray-400 mb-4">Create a new alert when you have a person or vehicle to look out for</p>
              <Button
                color="warning"
                variant="flat"
                startContent={<Plus className="w-4 h-4" />}
                onClick={onOpen}
              >
                Create First BOLO
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBolos.map((bolo) => (
                <Card
                  key={bolo.id}
                  className="bg-gradient-to-br from-orange-900/20 to-orange-950/20 border-2 border-orange-800/30 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-900/20 transition-all"
                >
                  <CardBody className="p-5">
                    <div className="flex gap-4">
                      {bolo.imageUrl && (
                        <Image
                          src={bolo.imageUrl}
                          alt={bolo.title}
                          width={120}
                          height={120}
                          className="rounded-xl object-cover border-2 border-orange-500/30"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(bolo.type)}
                            <h4 className="font-bold text-white text-lg">
                              {bolo.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Chip
                              size="sm"
                              color={getPriorityColor(bolo.priority) as any}
                              variant="solid"
                              className="font-bold"
                            >
                              {bolo.priority}
                            </Chip>
                            <Chip size="sm" variant="bordered" className="border-orange-500/30 text-orange-300">
                              {bolo.type}
                            </Chip>
                          </div>
                        </div>

                        <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                          {bolo.description}
                        </p>

                        <div className="space-y-1.5 text-sm mb-4">
                          {bolo.personName && (
                            <div className="text-gray-300 flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-400" />
                              <span className="font-semibold text-white">Name:</span>{" "}
                              {bolo.personName}
                            </div>
                          )}
                          {bolo.personDesc && (
                            <div className="text-gray-300 flex items-center gap-2">
                              <span className="w-4"></span>
                              <span className="font-semibold text-white">Description:</span>{" "}
                              {bolo.personDesc}
                            </div>
                          )}
                          {bolo.vehiclePlate && (
                            <div className="text-gray-300 flex items-center gap-2">
                              <Car className="w-4 h-4 text-blue-400" />
                              <span className="font-semibold text-white">Plate:</span>{" "}
                              <span className="font-mono text-blue-300">{bolo.vehiclePlate}</span>
                            </div>
                          )}
                          {bolo.vehicleModel && (
                            <div className="text-gray-300 flex items-center gap-2">
                              <span className="w-4"></span>
                              <span className="font-semibold text-white">Vehicle:</span>{" "}
                              {bolo.vehicleColor} {bolo.vehicleModel}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Issued {formatTime(bolo.issuedAt)}</span>
                            <span>• by <span className="text-gray-400">{bolo.issuedBy}</span></span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              color="success"
                              variant="shadow"
                              onClick={() => handleResolve(bolo.id)}
                              startContent={<CheckCircle className="w-4 h-4" />}
                              className="font-semibold"
                            >
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onClick={() => handleCancel(bolo.id)}
                              startContent={<X className="w-4 h-4" />}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create BOLO Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Create New BOLO</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Type"
                selectedKeys={[formData.type]}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <SelectItem key="PERSON" value="PERSON">
                  Person
                </SelectItem>
                <SelectItem key="VEHICLE" value="VEHICLE">
                  Vehicle
                </SelectItem>
                <SelectItem key="OTHER" value="OTHER">
                  Other
                </SelectItem>
              </Select>

              <Select
                label="Priority"
                selectedKeys={[formData.priority]}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <SelectItem key="LOW" value="LOW">
                  Low
                </SelectItem>
                <SelectItem key="MEDIUM" value="MEDIUM">
                  Medium
                </SelectItem>
                <SelectItem key="HIGH" value="HIGH">
                  High
                </SelectItem>
                <SelectItem key="CRITICAL" value="CRITICAL">
                  Critical
                </SelectItem>
              </Select>

              <Input
                label="Title"
                placeholder="Brief description"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                isRequired
              />

              <Textarea
                label="Description"
                placeholder="Detailed information..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                isRequired
                minRows={3}
              />

              {formData.type === "PERSON" && (
                <>
                  <Input
                    label="Name"
                    placeholder="Person's name"
                    value={formData.personName}
                    onChange={(e) =>
                      setFormData({ ...formData, personName: e.target.value })
                    }
                  />
                  <Textarea
                    label="Physical Description"
                    placeholder="Height, build, clothing, etc."
                    value={formData.personDesc}
                    onChange={(e) =>
                      setFormData({ ...formData, personDesc: e.target.value })
                    }
                    minRows={2}
                  />
                </>
              )}

              {formData.type === "VEHICLE" && (
                <>
                  <Input
                    label="License Plate"
                    placeholder="ABC 1234"
                    value={formData.vehiclePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, vehiclePlate: e.target.value })
                    }
                  />
                  <Input
                    label="Make/Model"
                    placeholder="Toyota Camry"
                    value={formData.vehicleModel}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleModel: e.target.value })
                    }
                  />
                  <Input
                    label="Color"
                    placeholder="Red"
                    value={formData.vehicleColor}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleColor: e.target.value })
                    }
                  />
                </>
              )}

              <Input
                label="Image URL (optional)"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              Create BOLO
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
