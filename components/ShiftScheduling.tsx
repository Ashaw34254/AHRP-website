"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
  Avatar,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Calendar, Plus, Clock, Users, Sun, Moon, Sunset, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface ShiftLog {
  id: string;
  officerId: string;
  officerName: string;
  officerBadge: string | null;
  shiftType: string;
  startTime: string;
  endTime: string | null;
  hoursWorked: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Officer {
  id: string;
  name: string;
  badge: string | null;
  department: string;
}

export function ShiftScheduling() {
  const [shifts, setShifts] = useState<ShiftLog[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    officerId: "",
    shiftType: "DAY",
    startTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchShifts();
    fetchOfficers();
  }, [selectedDate]);

  const fetchShifts = async () => {
    try {
      const response = await fetch(`/api/cad/shifts?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setShifts(data.shifts || []);
      }
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      toast.error("Failed to load shifts");
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
    if (!formData.officerId || !formData.startTime) {
      toast.error("Please select an officer and start time");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(formData.startTime).toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create shift");

      toast.success("Shift scheduled");
      fetchShifts();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create shift:", error);
      toast.error("Failed to schedule shift");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async (shiftId: string) => {
    try {
      const response = await fetch(`/api/cad/shifts/${shiftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endTime: new Date().toISOString(),
          status: "COMPLETED",
        }),
      });

      if (!response.ok) throw new Error("Failed to clock out");

      toast.success("Clocked out successfully");
      fetchShifts();
    } catch (error) {
      console.error("Failed to clock out:", error);
      toast.error("Failed to clock out");
    }
  };

  const resetForm = () => {
    setFormData({
      officerId: "",
      shiftType: "DAY",
      startTime: "",
      notes: "",
    });
  };

  const getShiftIcon = (shiftType: string) => {
    switch (shiftType) {
      case "DAY":
        return <Sun className="w-4 h-4" />;
      case "NIGHT":
        return <Moon className="w-4 h-4" />;
      case "SWING":
        return <Sunset className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getShiftColor = (shiftType: string) => {
    switch (shiftType) {
      case "DAY":
        return "warning";
      case "NIGHT":
        return "secondary";
      case "SWING":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    if (departmentFilter === "ALL") return true;
    const officer = officers.find((o) => o.id === shift.officerId);
    return officer?.department === departmentFilter;
  });

  const activeShifts = filteredShifts.filter((s) => s.status === "ACTIVE");
  const completedShifts = filteredShifts.filter((s) => s.status === "COMPLETED");
  const totalHours = completedShifts.reduce((sum, s) => sum + (s.hoursWorked || 0), 0);

  const shiftsByType = {
    DAY: filteredShifts.filter((s) => s.shiftType === "DAY"),
    NIGHT: filteredShifts.filter((s) => s.shiftType === "NIGHT"),
    SWING: filteredShifts.filter((s) => s.shiftType === "SWING"),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border-2 border-purple-500/30">
              <Calendar className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Shift Scheduling</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {activeShifts.length} active
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Clock className="w-4 h-4" />
                  {totalHours.toFixed(1)} hours today
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">
                  {completedShifts.length} completed
                </span>
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
            Schedule Shift
          </Button>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-64"
              classNames={{
                input: "bg-gray-800/50",
                inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
              }}
            />
            <Select
              label="Department"
              selectedKeys={[departmentFilter]}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-48"
              classNames={{
                trigger: "bg-gray-800/50 border-gray-700",
              }}
            >
              <SelectItem key="ALL">All Departments</SelectItem>
              <SelectItem key="POLICE">Police</SelectItem>
              <SelectItem key="FIRE">Fire</SelectItem>
              <SelectItem key="EMS">EMS</SelectItem>
            </Select>
            <Button
              color="primary"
              variant="flat"
              onPress={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            >
              Today
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Shift Tabs */}
      <Tabs
        color="secondary"
        variant="underlined"
        classNames={{
          tabList: "bg-gray-900/50 border border-gray-800 rounded-lg p-2",
          tab: "data-[selected=true]:text-purple-400",
        }}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>All Shifts ({filteredShifts.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {filteredShifts.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
                <CardBody className="p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">No Shifts Scheduled</h4>
                    <p className="text-sm text-gray-400 mb-4">Schedule shifts for officers on this date</p>
                    <Button color="secondary" variant="flat" startContent={<Plus />} onPress={onOpen}>
                      Schedule First Shift
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredShifts.map((shift) => (
                <Card
                  key={shift.id}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all ${
                    shift.status === "ACTIVE"
                      ? "border-green-700/50 hover:border-green-600/70"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <CardBody className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar name={shift.officerName} size="md" className="w-12 h-12" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{shift.officerName}</h3>
                            {shift.officerBadge && (
                              <Chip size="sm" variant="flat" className="font-mono">
                                #{shift.officerBadge}
                              </Chip>
                            )}
                            <Chip
                              size="sm"
                              color={getShiftColor(shift.shiftType) as any}
                              variant="solid"
                              className="font-bold"
                              startContent={getShiftIcon(shift.shiftType)}
                            >
                              {shift.shiftType}
                            </Chip>
                            <Chip size="sm" color={getStatusColor(shift.status) as any} variant="bordered">
                              {shift.status}
                            </Chip>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>Start: {new Date(shift.startTime).toLocaleTimeString()}</span>
                            </div>
                            {shift.endTime && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>End: {new Date(shift.endTime).toLocaleTimeString()}</span>
                              </div>
                            )}
                            {shift.hoursWorked && (
                              <Chip size="sm" color="primary" variant="flat" className="font-bold">
                                {shift.hoursWorked.toFixed(1)} hours
                              </Chip>
                            )}
                          </div>

                          {shift.notes && (
                            <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                              <p className="text-xs text-gray-400">{shift.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {shift.status === "ACTIVE" && (
                        <Button
                          size="sm"
                          color="success"
                          variant="shadow"
                          onPress={() => handleClockOut(shift.id)}
                          className="font-semibold"
                        >
                          Clock Out
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </Tab>

        <Tab
          key="day"
          title={
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span>Day ({shiftsByType.DAY.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {shiftsByType.DAY.map((shift) => (
              <Card
                key={shift.id}
                className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/10 border-2 border-yellow-700/30"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={shift.officerName} size="sm" />
                      <span className="font-bold text-white">{shift.officerName}</span>
                      <Chip size="sm" color={getStatusColor(shift.status) as any} variant="flat">
                        {shift.status}
                      </Chip>
                    </div>
                    <div className="text-sm text-gray-300">
                      {new Date(shift.startTime).toLocaleTimeString()}
                      {shift.endTime && ` - ${new Date(shift.endTime).toLocaleTimeString()}`}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab
          key="swing"
          title={
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4" />
              <span>Swing ({shiftsByType.SWING.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {shiftsByType.SWING.map((shift) => (
              <Card
                key={shift.id}
                className="bg-gradient-to-br from-blue-900/20 to-blue-950/10 border-2 border-blue-700/30"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={shift.officerName} size="sm" />
                      <span className="font-bold text-white">{shift.officerName}</span>
                      <Chip size="sm" color={getStatusColor(shift.status) as any} variant="flat">
                        {shift.status}
                      </Chip>
                    </div>
                    <div className="text-sm text-gray-300">
                      {new Date(shift.startTime).toLocaleTimeString()}
                      {shift.endTime && ` - ${new Date(shift.endTime).toLocaleTimeString()}`}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab
          key="night"
          title={
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span>Night ({shiftsByType.NIGHT.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {shiftsByType.NIGHT.map((shift) => (
              <Card
                key={shift.id}
                className="bg-gradient-to-br from-purple-900/20 to-purple-950/10 border-2 border-purple-700/30"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={shift.officerName} size="sm" />
                      <span className="font-bold text-white">{shift.officerName}</span>
                      <Chip size="sm" color={getStatusColor(shift.status) as any} variant="flat">
                        {shift.status}
                      </Chip>
                    </div>
                    <div className="text-sm text-gray-300">
                      {new Date(shift.startTime).toLocaleTimeString()}
                      {shift.endTime && ` - ${new Date(shift.endTime).toLocaleTimeString()}`}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>

      {/* Schedule Shift Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            Schedule Shift
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

              <Select
                label="Shift Type"
                selectedKeys={[formData.shiftType]}
                onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                variant="bordered"
              >
                <SelectItem key="DAY" startContent={<Sun className="w-4 h-4" />}>
                  Day Shift (6am - 2pm)
                </SelectItem>
                <SelectItem key="SWING" startContent={<Sunset className="w-4 h-4" />}>
                  Swing Shift (2pm - 10pm)
                </SelectItem>
                <SelectItem key="NIGHT" startContent={<Moon className="w-4 h-4" />}>
                  Night Shift (10pm - 6am)
                </SelectItem>
              </Select>

              <Input
                label="Start Time"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Input
                label="Notes (Optional)"
                placeholder="Additional shift information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                variant="bordered"
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
              Schedule Shift
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
