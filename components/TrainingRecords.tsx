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
  Progress,
  Avatar,
} from "@nextui-org/react";
import { GraduationCap, Plus, Search, Award, Calendar, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface TrainingRecord {
  id: string;
  officerId: string;
  officerName: string;
  officerBadge: string | null;
  trainingType: string;
  title: string;
  description: string | null;
  instructor: string | null;
  hoursCompleted: number;
  status: string;
  completedAt: string | null;
  expiresAt: string | null;
  certificateUrl: string | null;
  notes: string | null;
  createdAt: string;
}

interface Officer {
  id: string;
  name: string;
  badge: string | null;
  department: string;
}

export function TrainingRecords() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    officerId: "",
    trainingType: "FIREARMS",
    title: "",
    description: "",
    instructor: "",
    hoursCompleted: "",
    expiresAt: "",
    notes: "",
  });

  useEffect(() => {
    fetchRecords();
    fetchOfficers();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/cad/training");
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error("Failed to fetch training records:", error);
      toast.error("Failed to load training records");
    }
  };

  const fetchOfficers = async () => {
    try {
      const response = await fetch("/api/cad/officers/profiles");
      if (response.ok) {
        const data = await response.json();
        setOfficers(data.profiles || []);
      }
    } catch (error) {
      console.error("Failed to fetch officers:", error);
    }
  };

  const handleCreate = async () => {
    if (!formData.officerId || !formData.title || !formData.hoursCompleted) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hoursCompleted: parseFloat(formData.hoursCompleted),
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create training record");

      toast.success("Training record created");
      fetchRecords();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create record:", error);
      toast.error("Failed to create training record");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (recordId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cad/training/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus,
          completedAt: newStatus === "COMPLETED" ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated");
      fetchRecords();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({
      officerId: "",
      trainingType: "FIREARMS",
      title: "",
      description: "",
      instructor: "",
      hoursCompleted: "",
      expiresAt: "",
      notes: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "SCHEDULED":
        return "primary";
      case "EXPIRED":
        return "danger";
      default:
        return "default";
    }
  };

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "FIREARMS":
        return "danger";
      case "DEFENSIVE_TACTICS":
        return "warning";
      case "DRIVING":
        return "primary";
      case "FIRST_AID":
        return "success";
      case "LEGAL":
        return "secondary";
      default:
        return "default";
    }
  };

  const isExpiringSoon = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    const expireDate = new Date(expiresAt);
    const now = new Date();
    const daysUntil = Math.floor((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.officerBadge && r.officerBadge.includes(searchQuery));
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalHours = records.reduce((sum, r) => sum + r.hoursCompleted, 0);
  const completedCount = records.filter((r) => r.status === "COMPLETED").length;
  const expiringCount = records.filter((r) => isExpiringSoon(r.expiresAt)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border-2 border-indigo-500/30">
              <GraduationCap className="w-7 h-7 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Training Records</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  {completedCount} completed
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Clock className="w-4 h-4" />
                  {totalHours} total hours
                </span>
                {expiringCount > 0 && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1.5 text-orange-400 animate-pulse">
                      <AlertCircle className="w-4 h-4" />
                      {expiringCount} expiring soon
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            color="secondary"
            variant="shadow"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onOpen}
            className="font-semibold"
          >
            Add Training
          </Button>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by officer name, badge, or training..."
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
              label="Status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
              classNames={{
                trigger: "bg-gray-800/50 border-gray-700",
              }}
            >
              <SelectItem key="ALL">All Statuses</SelectItem>
              <SelectItem key="COMPLETED">Completed</SelectItem>
              <SelectItem key="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem key="SCHEDULED">Scheduled</SelectItem>
              <SelectItem key="EXPIRED">Expired</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Training Records Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredRecords.length === 0 ? (
          <Card className="col-span-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
            <CardBody className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
                  <GraduationCap className="w-8 h-8 text-indigo-500" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">No Training Records</h4>
                <p className="text-sm text-gray-400 mb-4">Start tracking officer training and certifications</p>
                <Button color="secondary" variant="flat" startContent={<Plus />} onPress={onOpen}>
                  Add First Record
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const expired = isExpired(record.expiresAt);
            const expiring = isExpiringSoon(record.expiresAt);
            
            return (
              <Card
                key={record.id}
                className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
                  expired
                    ? "border-red-700/50 hover:border-red-600/70"
                    : expiring
                    ? "border-orange-700/30 hover:border-orange-600/50"
                    : "border-gray-700 hover:border-indigo-500/50"
                }`}
              >
                <CardBody className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={record.officerName}
                        size="md"
                        className="w-12 h-12"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-white">{record.officerName}</h3>
                        {record.officerBadge && (
                          <p className="text-sm text-gray-400 font-mono">Badge #{record.officerBadge}</p>
                        )}
                      </div>
                    </div>
                    <Chip size="sm" color={getStatusColor(record.status)} variant="solid" className="font-bold">
                      {record.status.replace(/_/g, " ")}
                    </Chip>
                  </div>

                  {/* Training Details */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Chip 
                          size="sm" 
                          color={getTrainingTypeColor(record.trainingType)} 
                          variant="flat"
                          className="font-semibold"
                        >
                          {record.trainingType.replace(/_/g, " ")}
                        </Chip>
                        <Award className="w-4 h-4 text-indigo-400" />
                      </div>
                      <h4 className="text-base font-bold text-white">{record.title}</h4>
                      {record.description && (
                        <p className="text-sm text-gray-400 mt-1">{record.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span><span className="font-bold text-white">{record.hoursCompleted}</span> hours</span>
                      </div>
                      {record.instructor && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4 text-green-400" />
                          <span className="truncate">{record.instructor}</span>
                        </div>
                      )}
                    </div>

                    {record.completedAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Completed: {new Date(record.completedAt).toLocaleDateString()}</span>
                      </div>
                    )}

                    {record.expiresAt && (
                      <div className={`flex items-center gap-2 text-sm ${
                        expired ? "text-red-400 font-bold" : expiring ? "text-orange-400 font-bold" : "text-gray-300"
                      }`}>
                        <Calendar className="w-4 h-4" />
                        <span>
                          {expired ? "Expired: " : "Expires: "}
                          {new Date(record.expiresAt).toLocaleDateString()}
                        </span>
                        {(expired || expiring) && <AlertCircle className="w-4 h-4 animate-pulse" />}
                      </div>
                    )}

                    {record.notes && (
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400">{record.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {record.status !== "COMPLETED" && (
                    <div className="flex gap-2">
                      {record.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          color="success"
                          variant="shadow"
                          fullWidth
                          onPress={() => handleUpdateStatus(record.id, "COMPLETED")}
                          className="font-semibold"
                        >
                          Mark Completed
                        </Button>
                      )}
                      {record.status === "SCHEDULED" && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="shadow"
                          fullWidth
                          onPress={() => handleUpdateStatus(record.id, "IN_PROGRESS")}
                          className="font-semibold"
                        >
                          Start Training
                        </Button>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Training Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
            </div>
            Add Training Record
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Officer"
                placeholder="Select officer"
                selectedKeys={formData.officerId ? [formData.officerId] : []}
                onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                isRequired
                variant="bordered"
              >
                {officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    {officer.name} {officer.badge ? `(#${officer.badge})` : ""} - {officer.department}
                  </SelectItem>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Training Type"
                  selectedKeys={[formData.trainingType]}
                  onChange={(e) => setFormData({ ...formData, trainingType: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="FIREARMS">Firearms</SelectItem>
                  <SelectItem key="DEFENSIVE_TACTICS">Defensive Tactics</SelectItem>
                  <SelectItem key="DRIVING">Driving</SelectItem>
                  <SelectItem key="FIRST_AID">First Aid / CPR</SelectItem>
                  <SelectItem key="LEGAL">Legal Training</SelectItem>
                  <SelectItem key="LEADERSHIP">Leadership</SelectItem>
                  <SelectItem key="TECHNOLOGY">Technology</SelectItem>
                  <SelectItem key="OTHER">Other</SelectItem>
                </Select>

                <Input
                  label="Hours Completed"
                  placeholder="0"
                  type="number"
                  step="0.5"
                  value={formData.hoursCompleted}
                  onChange={(e) => setFormData({ ...formData, hoursCompleted: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <Input
                label="Training Title"
                placeholder="e.g., Advanced Firearms Qualification"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Textarea
                label="Description"
                placeholder="Training details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="bordered"
                minRows={2}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Instructor"
                  placeholder="Instructor name"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  variant="bordered"
                />

                <Input
                  label="Expires On (Optional)"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  variant="bordered"
                  description="For certifications that expire"
                />
              </div>

              <Textarea
                label="Notes"
                placeholder="Additional information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                variant="bordered"
                minRows={2}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="shadow"
              onPress={handleCreate}
              isLoading={loading}
              className="font-semibold"
              startContent={<Plus />}
            >
              Add Training
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
