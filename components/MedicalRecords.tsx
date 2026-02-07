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
  Textarea,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  Heart,
  Plus,
  Search,
  Activity,
  Ambulance,
  FileText,
  Eye,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface MedicalRecord {
  id: string;
  patientName: string;
  dateOfBirth: string | null;
  bloodType: string | null;
  allergies: string | null;
  medications: string | null;
  medicalHistory: string | null;
  emergencyContact: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MedicalIncident {
  id: string;
  incidentNumber: string;
  patientName: string;
  chiefComplaint: string;
  incidentDate: string;
  location: string;
  transportedTo: string | null;
  respondingUnit: string;
  respondingEMT: string;
  vitals: string | null;
  treatment: string | null;
  disposition: string;
  notes: string | null;
  medicalRecordId: string | null;
  createdAt: string;
}

export function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [incidents, setIncidents] = useState<MedicalIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<MedicalIncident | null>(null);

  const { isOpen: isRecordOpen, onOpen: onRecordOpen, onClose: onRecordClose } = useDisclosure();
  const { isOpen: isIncidentOpen, onOpen: onIncidentOpen, onClose: onIncidentClose } = useDisclosure();
  const {
    isOpen: isRecordDetailOpen,
    onOpen: onRecordDetailOpen,
    onClose: onRecordDetailClose,
  } = useDisclosure();
  const {
    isOpen: isIncidentDetailOpen,
    onOpen: onIncidentDetailOpen,
    onClose: onIncidentDetailClose,
  } = useDisclosure();

  const [recordForm, setRecordForm] = useState({
    patientName: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    emergencyContact: "",
    notes: "",
  });

  const [incidentForm, setIncidentForm] = useState({
    patientName: "",
    chiefComplaint: "",
    incidentDate: "",
    location: "",
    transportedTo: "",
    respondingUnit: "",
    respondingEMT: "",
    vitals: "",
    treatment: "",
    disposition: "TRANSPORTED",
    notes: "",
  });

  useEffect(() => {
    fetchRecords();
    fetchIncidents();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/cad/medical/records");
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch("/api/cad/medical/incidents");
      if (response.ok) {
        const data = await response.json();
        setIncidents(data.incidents || []);
      }
    } catch (error) {
      console.error("Failed to fetch medical incidents:", error);
    }
  };

  const handleCreateRecord = async () => {
    if (!recordForm.patientName) {
      toast.error("Patient name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/medical/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recordForm,
          dateOfBirth: recordForm.dateOfBirth ? new Date(recordForm.dateOfBirth).toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create record");

      toast.success("Medical record created");
      fetchRecords();
      onRecordClose();
      resetRecordForm();
    } catch (error) {
      console.error("Failed to create record:", error);
      toast.error("Failed to create medical record");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async () => {
    if (!incidentForm.patientName || !incidentForm.chiefComplaint || !incidentForm.incidentDate || !incidentForm.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/medical/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...incidentForm,
          incidentDate: new Date(incidentForm.incidentDate).toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create incident");

      toast.success("Medical incident created");
      fetchIncidents();
      onIncidentClose();
      resetIncidentForm();
    } catch (error) {
      console.error("Failed to create incident:", error);
      toast.error("Failed to create medical incident");
    } finally {
      setLoading(false);
    }
  };

  const resetRecordForm = () => {
    setRecordForm({
      patientName: "",
      dateOfBirth: "",
      bloodType: "",
      allergies: "",
      medications: "",
      medicalHistory: "",
      emergencyContact: "",
      notes: "",
    });
  };

  const resetIncidentForm = () => {
    setIncidentForm({
      patientName: "",
      chiefComplaint: "",
      incidentDate: "",
      location: "",
      transportedTo: "",
      respondingUnit: "",
      respondingEMT: "",
      vitals: "",
      treatment: "",
      disposition: "TRANSPORTED",
      notes: "",
    });
  };

  const viewRecordDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    onRecordDetailOpen();
  };

  const viewIncidentDetails = (incident: MedicalIncident) => {
    setSelectedIncident(incident);
    onIncidentDetailOpen();
  };

  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case "TRANSPORTED":
        return "primary";
      case "TREATED_RELEASED":
        return "success";
      case "REFUSED_CARE":
        return "warning";
      case "DOA":
        return "danger";
      default:
        return "default";
    }
  };

  const filteredRecords = records.filter((record) =>
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncidents = incidents.filter((incident) =>
    incident.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentIncidents = incidents.filter((inc) => {
    const incidentDate = new Date(inc.incidentDate);
    const twentyFourHours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return incidentDate >= twentyFourHours;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl border-2 border-red-500/30">
              <Heart className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Medical Records</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-red-400">
                  <FileText className="w-4 h-4" />
                  {records.length} patient records
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Ambulance className="w-4 h-4" />
                  {incidents.length} incidents
                </span>
                {recentIncidents.length > 0 && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1.5 text-yellow-400">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      {recentIncidents.length} in last 24h
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <Input
            placeholder="Search by patient name or incident #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="w-4 h-4 text-gray-500" />}
            classNames={{
              input: "bg-gray-800/50",
              inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
            }}
          />
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs
        color="danger"
        variant="underlined"
        classNames={{
          tabList: "bg-gray-900/50 border border-gray-800 rounded-lg p-2",
          tab: "data-[selected=true]:text-red-400",
        }}
      >
        {/* Patient Records Tab */}
        <Tab
          key="records"
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Patient Records ({filteredRecords.length})</span>
            </div>
          }
        >
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button color="danger" variant="shadow" startContent={<Plus />} onPress={onRecordOpen} className="font-semibold">
                New Patient Record
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRecords.length === 0 ? (
                <Card className="col-span-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
                  <CardBody className="p-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                        <FileText className="w-8 h-8 text-red-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">No Patient Records</h4>
                      <p className="text-sm text-gray-400 mb-4">Create your first patient record to get started</p>
                      <Button color="danger" variant="flat" startContent={<Plus />} onPress={onRecordOpen}>
                        Create First Record
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                filteredRecords.map((record) => (
                  <Card
                    key={record.id}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 hover:border-gray-600 cursor-pointer hover:shadow-lg transition-all"
                    isPressable
                    onPress={() => viewRecordDetails(record)}
                  >
                    <CardBody className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <User className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{record.patientName}</h3>
                            {record.dateOfBirth && (
                              <p className="text-sm text-gray-400">
                                DOB: {new Date(record.dateOfBirth).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {record.bloodType && (
                          <Chip size="sm" color="danger" variant="solid" className="font-bold">
                            {record.bloodType}
                          </Chip>
                        )}
                      </div>

                      {record.allergies && (
                        <div className="mb-2 p-2 bg-yellow-900/20 rounded border border-yellow-700/50">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-yellow-400 font-semibold">ALLERGIES:</span>
                            <span className="text-xs text-white">{record.allergies}</span>
                          </div>
                        </div>
                      )}

                      {record.medications && (
                        <div className="mb-2">
                          <span className="text-xs text-gray-500">Medications:</span>
                          <p className="text-xs text-gray-300">{record.medications}</p>
                        </div>
                      )}

                      {record.emergencyContact && (
                        <div>
                          <span className="text-xs text-gray-500">Emergency Contact:</span>
                          <p className="text-xs text-gray-300">{record.emergencyContact}</p>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end">
                        <Button size="sm" color="danger" variant="flat" startContent={<Eye />}>
                          View Details
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Tab>

        {/* Medical Incidents Tab */}
        <Tab
          key="incidents"
          title={
            <div className="flex items-center gap-2">
              <Ambulance className="w-4 h-4" />
              <span>Medical Incidents ({filteredIncidents.length})</span>
            </div>
          }
        >
          <div className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button color="danger" variant="shadow" startContent={<Plus />} onPress={onIncidentOpen} className="font-semibold">
                New Incident
              </Button>
            </div>

            <div className="space-y-3">
              {filteredIncidents.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
                  <CardBody className="p-12">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                        <Ambulance className="w-8 h-8 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">No Medical Incidents</h4>
                      <p className="text-sm text-gray-400 mb-4">Create your first medical incident to get started</p>
                      <Button color="danger" variant="flat" startContent={<Plus />} onPress={onIncidentOpen}>
                        Create First Incident
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                filteredIncidents.map((incident) => {
                  const incidentDate = new Date(incident.incidentDate);
                  const isRecent = incidentDate >= new Date(Date.now() - 24 * 60 * 60 * 1000);

                  return (
                    <Card
                      key={incident.id}
                      className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all cursor-pointer ${
                        isRecent
                          ? "border-yellow-700/50 hover:border-yellow-600/70"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      isPressable
                      onPress={() => viewIncidentDetails(incident)}
                    >
                      <CardBody className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Ambulance className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-base font-bold text-white font-mono">{incident.incidentNumber}</h3>
                                  {isRecent && (
                                    <Chip size="sm" color="warning" variant="bordered" className="animate-pulse">
                                      RECENT
                                    </Chip>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{incident.patientName}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                              <div>
                                <span className="text-gray-500">Chief Complaint:</span>
                                <p className="text-white font-semibold">{incident.chiefComplaint}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Date/Time:</span>
                                <p className="text-white">{new Date(incident.incidentDate).toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Location:</span>
                                <p className="text-white">{incident.location}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Responding Unit:</span>
                                <p className="text-white font-mono">{incident.respondingUnit}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">EMT:</span>
                                <p className="text-white">{incident.respondingEMT}</p>
                              </div>
                              {incident.transportedTo && (
                                <div>
                                  <span className="text-gray-500">Transported To:</span>
                                  <p className="text-white">{incident.transportedTo}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Chip
                                size="sm"
                                color={getDispositionColor(incident.disposition) as any}
                                variant="solid"
                              >
                                {incident.disposition.replace("_", " ")}
                              </Chip>
                            </div>
                          </div>

                          <Button size="sm" color="danger" variant="flat" startContent={<Eye />}>
                            View
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Create Patient Record Modal */}
      <Modal isOpen={isRecordOpen} onClose={onRecordClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            Create Patient Record
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Patient Name"
                placeholder="Full name..."
                value={recordForm.patientName}
                onChange={(e) => setRecordForm({ ...recordForm, patientName: e.target.value })}
                isRequired
                variant="bordered"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={recordForm.dateOfBirth}
                  onChange={(e) => setRecordForm({ ...recordForm, dateOfBirth: e.target.value })}
                  variant="bordered"
                />

                <Select
                  label="Blood Type"
                  selectedKeys={recordForm.bloodType ? [recordForm.bloodType] : []}
                  onChange={(e) => setRecordForm({ ...recordForm, bloodType: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="A+">A+</SelectItem>
                  <SelectItem key="A-">A-</SelectItem>
                  <SelectItem key="B+">B+</SelectItem>
                  <SelectItem key="B-">B-</SelectItem>
                  <SelectItem key="AB+">AB+</SelectItem>
                  <SelectItem key="AB-">AB-</SelectItem>
                  <SelectItem key="O+">O+</SelectItem>
                  <SelectItem key="O-">O-</SelectItem>
                </Select>
              </div>

              <Textarea
                label="Allergies"
                placeholder="List any known allergies..."
                value={recordForm.allergies}
                onChange={(e) => setRecordForm({ ...recordForm, allergies: e.target.value })}
                minRows={2}
                variant="bordered"
              />

              <Textarea
                label="Current Medications"
                placeholder="List current medications..."
                value={recordForm.medications}
                onChange={(e) => setRecordForm({ ...recordForm, medications: e.target.value })}
                minRows={2}
                variant="bordered"
              />

              <Textarea
                label="Medical History"
                placeholder="Previous conditions, surgeries, etc..."
                value={recordForm.medicalHistory}
                onChange={(e) => setRecordForm({ ...recordForm, medicalHistory: e.target.value })}
                minRows={3}
                variant="bordered"
              />

              <Input
                label="Emergency Contact"
                placeholder="Name and phone number..."
                value={recordForm.emergencyContact}
                onChange={(e) => setRecordForm({ ...recordForm, emergencyContact: e.target.value })}
                variant="bordered"
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional notes..."
                value={recordForm.notes}
                onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                minRows={2}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRecordClose}>Cancel</Button>
            <Button color="danger" variant="shadow" onPress={handleCreateRecord} isLoading={loading} startContent={<Plus />} className="font-semibold">
              Create Record
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Medical Incident Modal */}
      <Modal isOpen={isIncidentOpen} onClose={onIncidentClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Ambulance className="w-5 h-5 text-blue-500" />
            </div>
            Create Medical Incident
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Patient Name"
                placeholder="Full name..."
                value={incidentForm.patientName}
                onChange={(e) => setIncidentForm({ ...incidentForm, patientName: e.target.value })}
                isRequired
                variant="bordered"
              />

              <Input
                label="Chief Complaint"
                placeholder="Primary medical issue..."
                value={incidentForm.chiefComplaint}
                onChange={(e) => setIncidentForm({ ...incidentForm, chiefComplaint: e.target.value })}
                isRequired
                variant="bordered"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Incident Date & Time"
                  type="datetime-local"
                  value={incidentForm.incidentDate}
                  onChange={(e) => setIncidentForm({ ...incidentForm, incidentDate: e.target.value })}
                  isRequired
                  variant="bordered"
                />

                <Input
                  label="Location"
                  placeholder="Address or location..."
                  value={incidentForm.location}
                  onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Responding Unit"
                  placeholder="e.g., A-1, M-3"
                  value={incidentForm.respondingUnit}
                  onChange={(e) => setIncidentForm({ ...incidentForm, respondingUnit: e.target.value })}
                  isRequired
                  variant="bordered"
                />

                <Input
                  label="Responding EMT"
                  placeholder="EMT name..."
                  value={incidentForm.respondingEMT}
                  onChange={(e) => setIncidentForm({ ...incidentForm, respondingEMT: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <Textarea
                label="Vitals (Optional)"
                placeholder="BP, HR, RR, SpO2, Temp, GCS..."
                value={incidentForm.vitals}
                onChange={(e) => setIncidentForm({ ...incidentForm, vitals: e.target.value })}
                minRows={3}
                variant="bordered"
              />

              <Textarea
                label="Treatment Provided"
                placeholder="Description of treatment..."
                value={incidentForm.treatment}
                onChange={(e) => setIncidentForm({ ...incidentForm, treatment: e.target.value })}
                minRows={3}
                variant="bordered"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Disposition"
                  selectedKeys={[incidentForm.disposition]}
                  onChange={(e) => setIncidentForm({ ...incidentForm, disposition: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="TRANSPORTED">Transported</SelectItem>
                  <SelectItem key="TREATED_RELEASED">Treated & Released</SelectItem>
                  <SelectItem key="REFUSED_CARE">Refused Care</SelectItem>
                  <SelectItem key="DOA">DOA (Dead on Arrival)</SelectItem>
                  <SelectItem key="CANCELLED">Cancelled</SelectItem>
                </Select>

                <Input
                  label="Transported To (if applicable)"
                  placeholder="Hospital name..."
                  value={incidentForm.transportedTo}
                  onChange={(e) => setIncidentForm({ ...incidentForm, transportedTo: e.target.value })}
                  variant="bordered"
                />
              </div>

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional incident notes..."
                value={incidentForm.notes}
                onChange={(e) => setIncidentForm({ ...incidentForm, notes: e.target.value })}
                minRows={2}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onIncidentClose}>Cancel</Button>
            <Button color="danger" variant="shadow" onPress={handleCreateIncident} isLoading={loading} startContent={<Plus />} className="font-semibold">
              Create Incident
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Patient Record Details Modal */}
      <Modal isOpen={isRecordDetailOpen} onClose={onRecordDetailClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {selectedRecord && (
            <>
              <ModalHeader className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <User className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedRecord.patientName}</h3>
                  <p className="text-sm text-gray-400">Patient Medical Record</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Basic Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedRecord.dateOfBirth && (
                          <div>
                            <span className="text-gray-400">Date of Birth:</span>
                            <p className="text-white font-semibold">{new Date(selectedRecord.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                        )}
                        {selectedRecord.bloodType && (
                          <div>
                            <span className="text-gray-400">Blood Type:</span>
                            <Chip color="danger" variant="solid" className="font-bold ml-2">{selectedRecord.bloodType}</Chip>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {selectedRecord.allergies && (
                    <Card className="bg-yellow-900/10 border border-yellow-700/50">
                      <CardBody className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                          <h4 className="font-bold text-yellow-400">ALLERGIES - CRITICAL</h4>
                        </div>
                        <p className="text-white">{selectedRecord.allergies}</p>
                      </CardBody>
                    </Card>
                  )}

                  {selectedRecord.medications && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-2">Current Medications</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedRecord.medications}</p>
                      </CardBody>
                    </Card>
                  )}

                  {selectedRecord.medicalHistory && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-2">Medical History</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedRecord.medicalHistory}</p>
                      </CardBody>
                    </Card>
                  )}

                  {selectedRecord.emergencyContact && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-2">Emergency Contact</h4>
                        <p className="text-gray-300 text-sm">{selectedRecord.emergencyContact}</p>
                      </CardBody>
                    </Card>
                  )}

                  {selectedRecord.notes && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-2">Additional Notes</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedRecord.notes}</p>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onRecordDetailClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Medical Incident Details Modal */}
      <Modal isOpen={isIncidentDetailOpen} onClose={onIncidentDetailClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {selectedIncident && (
            <>
              <ModalHeader className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Ambulance className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-mono">{selectedIncident.incidentNumber}</h3>
                  <p className="text-sm text-gray-400">{selectedIncident.patientName}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Incident Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Chief Complaint:</span>
                          <p className="text-white font-semibold">{selectedIncident.chiefComplaint}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Date & Time:</span>
                          <p className="text-white font-semibold">{new Date(selectedIncident.incidentDate).toLocaleString()}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Location:</span>
                          <p className="text-white">{selectedIncident.location}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Response Team</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Unit:</span>
                          <p className="text-white font-mono font-semibold">{selectedIncident.respondingUnit}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">EMT:</span>
                          <p className="text-white font-semibold">{selectedIncident.respondingEMT}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {selectedIncident.vitals && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-400" />
                          <h4 className="font-bold text-white">Patient Vitals</h4>
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedIncident.vitals}</p>
                      </CardBody>
                    </Card>
                  )}

                  {selectedIncident.treatment && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-2">Treatment Provided</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedIncident.treatment}</p>
                      </CardBody>
                    </Card>
                  )}

                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Disposition</h4>
                      <div className="flex items-center gap-3">
                        <Chip color={getDispositionColor(selectedIncident.disposition) as any} variant="solid" size="lg" className="font-bold">
                          {selectedIncident.disposition.replace("_", " ")}
                        </Chip>
                        {selectedIncident.transportedTo && (
                          <div className="text-sm">
                            <span className="text-gray-400">Transported to:</span>
                            <p className="text-white font-semibold">{selectedIncident.transportedTo}</p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {selectedIncident.notes && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-2">Additional Notes</h4>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedIncident.notes}</p>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onIncidentDetailClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
