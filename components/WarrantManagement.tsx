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
  Tabs,
  Tab,
} from "@heroui/react";
import { Shield, Plus, Search, AlertTriangle, FileText } from "lucide-react";
import { toast } from "@/lib/toast";

interface Warrant {
  id: string;
  citizenId: string;
  citizenName: string;
  charge: string;
  description: string;
  issuedBy: string;
  isActive: boolean;
  createdAt: string;
  resolvedAt?: string;
}

interface Citation {
  id: string;
  citizenId: string;
  citizenName: string;
  violation: string;
  fineAmount: number;
  location: string;
  isPaid: boolean;
  issuedBy: string;
  createdAt: string;
}

export function WarrantManagement() {
  const [warrants, setWarrants] = useState<Warrant[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("warrants");
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<"warrant" | "citation">("warrant");
  
  // Form state for warrant
  const [warrantForm, setWarrantForm] = useState({
    citizenName: "",
    charge: "",
    description: "",
    issuedBy: "System",
  });

  // Form state for citation
  const [citationForm, setCitationForm] = useState({
    citizenName: "",
    violation: "",
    fineAmount: "",
    location: "",
    issuedBy: "System",
  });

  useEffect(() => {
    fetchWarrants();
    fetchCitations();
  }, []);

  const fetchWarrants = async () => {
    try {
      const response = await fetch("/api/cad/warrants");
      if (response.ok) {
        const data = await response.json();
        setWarrants(data.warrants || []);
      }
    } catch (error) {
      console.error("Failed to fetch warrants:", error);
    }
  };

  const fetchCitations = async () => {
    try {
      const response = await fetch("/api/cad/citations");
      if (response.ok) {
        const data = await response.json();
        setCitations(data.citations || []);
      }
    } catch (error) {
      console.error("Failed to fetch citations:", error);
    }
  };

  const handleCreateWarrant = async () => {
    if (!warrantForm.citizenName || !warrantForm.charge) {
      toast.error("Name and charge are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/warrants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warrantForm),
      });

      if (response.ok) {
        toast.success("Warrant issued successfully");
        fetchWarrants();
        onClose();
        setWarrantForm({
          citizenName: "",
          charge: "",
          description: "",
          issuedBy: "System",
        });
      } else {
        toast.error("Failed to issue warrant");
      }
    } catch (error) {
      toast.error("Failed to issue warrant");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCitation = async () => {
    if (!citationForm.citizenName || !citationForm.violation || !citationForm.fineAmount) {
      toast.error("Name, violation, and fine amount are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/citations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...citationForm,
          fineAmount: parseFloat(citationForm.fineAmount),
        }),
      });

      if (response.ok) {
        toast.success("Citation issued successfully");
        fetchCitations();
        onClose();
        setCitationForm({
          citizenName: "",
          violation: "",
          fineAmount: "",
          location: "",
          issuedBy: "System",
        });
      } else {
        toast.error("Failed to issue citation");
      }
    } catch (error) {
      toast.error("Failed to issue citation");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveWarrant = async (warrantId: string) => {
    try {
      const response = await fetch(`/api/cad/warrants/${warrantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });

      if (response.ok) {
        toast.success("Warrant resolved");
        fetchWarrants();
      }
    } catch (error) {
      toast.error("Failed to resolve warrant");
    }
  };

  const handlePayCitation = async (citationId: string) => {
    try {
      const response = await fetch(`/api/cad/citations/${citationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: true }),
      });

      if (response.ok) {
        toast.success("Citation marked as paid");
        fetchCitations();
      }
    } catch (error) {
      toast.error("Failed to update citation");
    }
  };

  const openWarrantModal = () => {
    setModalType("warrant");
    onOpen();
  };

  const openCitationModal = () => {
    setModalType("citation");
    onOpen();
  };

  const filteredWarrants = warrants.filter(
    (w) =>
      (w.citizenName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (w.charge?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const filteredCitations = citations.filter(
    (c) =>
      (c.citizenName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.violation?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl border-2 border-red-500/30">
              <Shield className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Warrants & Citations</h2>
              <p className="text-sm text-gray-400">Issue and manage warrants and citations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by name or charge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="w-80"
              size="lg"
              classNames={{
                input: "bg-gray-800/50",
                inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
              }}
            />
            {selectedTab === "warrants" ? (
              <Button
                color="danger"
                variant="shadow"
                startContent={<Plus className="w-4 h-4" />}
                onPress={openWarrantModal}
                className="font-semibold"
              >
                Issue Warrant
              </Button>
            ) : (
              <Button
                color="warning"
                variant="shadow"
                startContent={<Plus className="w-4 h-4" />}
                onPress={openCitationModal}
                className="font-semibold"
              >
                Issue Citation
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            color="primary"
            variant="underlined"
          >
            <Tab
              key="warrants"
              title={
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Active Warrants ({filteredWarrants.filter((w) => w.isActive).length})</span>
                </div>
              }
            >
              <div className="space-y-3 mt-4">
                {filteredWarrants.filter((w) => w.isActive).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">No Active Warrants</h4>
                    <p className="text-sm text-gray-400">All warrants have been resolved or no warrants have been issued yet</p>
                  </div>
                ) : (
                  filteredWarrants
                    .filter((w) => w.isActive)
                    .map((warrant) => (
                      <Card key={warrant.id} className="bg-gradient-to-br from-red-900/20 to-red-950/20 border-2 border-red-800/30 hover:border-red-600/50 hover:shadow-lg hover:shadow-red-900/20 transition-all">
                        <CardBody>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-bold text-white">{warrant.citizenName}</h3>
                                <Chip size="sm" color="danger" variant="solid" className="animate-pulse font-bold">
                                  ACTIVE WARRANT
                                </Chip>
                              </div>
                              <p className="text-sm text-red-400 font-semibold mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Charge: {warrant.charge}
                              </p>
                              {warrant.description && (
                                <p className="text-sm text-gray-300 mb-3 leading-relaxed">{warrant.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                                  Issued by: <span className="text-gray-400">{warrant.issuedBy}</span>
                                </span>
                                <span>•</span>
                                <span>{new Date(warrant.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              color="success"
                              variant="shadow"
                              onPress={() => handleResolveWarrant(warrant.id)}
                              className="font-semibold"
                            >
                              Resolve
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))
                )}
              </div>
            </Tab>

            <Tab
              key="citations"
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Unpaid Citations ({filteredCitations.filter((c) => !c.isPaid).length})</span>
                </div>
              }
            >
              <div className="space-y-3 mt-4">
                {filteredCitations.filter((c) => !c.isPaid).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-4">
                      <FileText className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">No Unpaid Citations</h4>
                    <p className="text-sm text-gray-400">All citations have been paid or no citations have been issued yet</p>
                  </div>
                ) : (
                  filteredCitations
                    .filter((c) => !c.isPaid)
                    .map((citation) => (
                      <Card key={citation.id} className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border-2 border-yellow-800/30 hover:border-yellow-600/50 hover:shadow-lg hover:shadow-yellow-900/20 transition-all">
                        <CardBody>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-bold text-white">{citation.citizenName}</h3>
                                <Chip size="sm" color="warning" variant="solid" className="font-bold">
                                  UNPAID
                                </Chip>
                              </div>
                              <p className="text-sm text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Violation: {citation.violation}
                              </p>
                              <p className="text-sm text-green-400 font-bold mb-2 flex items-center gap-2">
                                <span className="text-lg">$</span>
                                {citation.fineAmount.toFixed(2)}
                              </p>
                              {citation.location && (
                                <p className="text-sm text-gray-300 mb-3">📍 {citation.location}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                                  Issued by: <span className="text-gray-400">{citation.issuedBy}</span>
                                </span>
                                <span>•</span>
                                <span>{new Date(citation.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              color="success"
                              variant="shadow"
                              onPress={() => handlePayCitation(citation.id)}
                              className="font-semibold"
                            >
                              Mark Paid
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Create Warrant/Citation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {modalType === "warrant" ? "Issue Warrant" : "Issue Citation"}
          </ModalHeader>
          <ModalBody>
            {modalType === "warrant" ? (
              <div className="space-y-4">
                <Input
                  label="Citizen Name"
                  placeholder="Enter citizen name"
                  value={warrantForm.citizenName}
                  onChange={(e) =>
                    setWarrantForm({ ...warrantForm, citizenName: e.target.value })
                  }
                  isRequired
                />
                <Input
                  label="Charge"
                  placeholder="e.g., Armed Robbery, Grand Theft Auto"
                  value={warrantForm.charge}
                  onChange={(e) =>
                    setWarrantForm({ ...warrantForm, charge: e.target.value })
                  }
                  isRequired
                />
                <Textarea
                  label="Description"
                  placeholder="Additional details about the warrant"
                  value={warrantForm.description}
                  onChange={(e) =>
                    setWarrantForm({ ...warrantForm, description: e.target.value })
                  }
                  minRows={3}
                />
                <Input
                  label="Issued By"
                  placeholder="Officer name/callsign"
                  value={warrantForm.issuedBy}
                  onChange={(e) =>
                    setWarrantForm({ ...warrantForm, issuedBy: e.target.value })
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Citizen Name"
                  placeholder="Enter citizen name"
                  value={citationForm.citizenName}
                  onChange={(e) =>
                    setCitationForm({ ...citationForm, citizenName: e.target.value })
                  }
                  isRequired
                />
                <Input
                  label="Violation"
                  placeholder="e.g., Speeding, Parking Violation"
                  value={citationForm.violation}
                  onChange={(e) =>
                    setCitationForm({ ...citationForm, violation: e.target.value })
                  }
                  isRequired
                />
                <Input
                  label="Fine Amount"
                  placeholder="0.00"
                  type="number"
                  startContent={<span className="text-gray-400">$</span>}
                  value={citationForm.fineAmount}
                  onChange={(e) =>
                    setCitationForm({ ...citationForm, fineAmount: e.target.value })
                  }
                  isRequired
                />
                <Input
                  label="Location"
                  placeholder="e.g., Main Street & 5th Ave"
                  value={citationForm.location}
                  onChange={(e) =>
                    setCitationForm({ ...citationForm, location: e.target.value })
                  }
                />
                <Input
                  label="Issued By"
                  placeholder="Officer name/callsign"
                  value={citationForm.issuedBy}
                  onChange={(e) =>
                    setCitationForm({ ...citationForm, issuedBy: e.target.value })
                  }
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color={modalType === "warrant" ? "danger" : "warning"}
              onPress={modalType === "warrant" ? handleCreateWarrant : handleCreateCitation}
              isLoading={loading}
            >
              {modalType === "warrant" ? "Issue Warrant" : "Issue Citation"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
