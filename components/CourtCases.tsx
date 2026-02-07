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
  Scale,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  AlertCircle,
  Gavel,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface CourtCase {
  id: string;
  docketNumber: string;
  title: string;
  caseType: string;
  filingDate: string;
  hearingDate: string | null;
  courtLocation: string;
  prosecutorName: string | null;
  defendantName: string;
  charges: string;
  status: string;
  verdict: string | null;
  sentence: string | null;
  notes: string | null;
  incidentReportId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function CourtCases() {
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedCase, setSelectedCase] = useState<CourtCase | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    title: "",
    caseType: "CRIMINAL",
    filingDate: "",
    hearingDate: "",
    courtLocation: "",
    prosecutorName: "",
    defendantName: "",
    charges: "",
    notes: "",
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/cad/court");
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error("Failed to fetch court cases:", error);
      toast.error("Failed to load court cases");
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.defendantName || !formData.charges || !formData.filingDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/court", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          filingDate: new Date(formData.filingDate).toISOString(),
          hearingDate: formData.hearingDate ? new Date(formData.hearingDate).toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create case");

      toast.success("Court case created");
      fetchCases();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create case:", error);
      toast.error("Failed to create court case");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (caseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cad/court/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated");
      fetchCases();
      if (selectedCase?.id === caseId) {
        setSelectedCase({ ...selectedCase, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSetVerdict = async (caseId: string, verdict: string, sentence?: string) => {
    try {
      const response = await fetch(`/api/cad/court/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verdict,
          sentence: sentence || null,
          status: "SENTENCED",
        }),
      });

      if (!response.ok) throw new Error("Failed to set verdict");

      toast.success("Verdict recorded");
      fetchCases();
    } catch (error) {
      console.error("Failed to set verdict:", error);
      toast.error("Failed to set verdict");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      caseType: "CRIMINAL",
      filingDate: "",
      hearingDate: "",
      courtLocation: "",
      prosecutorName: "",
      defendantName: "",
      charges: "",
      notes: "",
    });
  };

  const viewCaseDetails = (courtCase: CourtCase) => {
    setSelectedCase(courtCase);
    onDetailOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FILED":
        return "default";
      case "PENDING":
        return "warning";
      case "IN_TRIAL":
        return "primary";
      case "VERDICT":
        return "secondary";
      case "SENTENCED":
        return "success";
      case "DISMISSED":
        return "default";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "FILED":
        return <FileText className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "IN_TRIAL":
        return <Gavel className="w-4 h-4" />;
      case "VERDICT":
        return <AlertCircle className="w-4 h-4" />;
      case "SENTENCED":
        return <CheckCircle className="w-4 h-4" />;
      case "DISMISSED":
        return <XCircle className="w-4 h-4" />;
      case "CLOSED":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Scale className="w-4 h-4" />;
    }
  };

  const filteredCases = cases.filter((courtCase) => {
    const matchesSearch =
      courtCase.docketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courtCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courtCase.defendantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || courtCase.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const casesByStatus = {
    FILED: filteredCases.filter((c) => c.status === "FILED"),
    PENDING: filteredCases.filter((c) => c.status === "PENDING"),
    IN_TRIAL: filteredCases.filter((c) => c.status === "IN_TRIAL"),
    VERDICT: filteredCases.filter((c) => c.status === "VERDICT"),
    SENTENCED: filteredCases.filter((c) => c.status === "SENTENCED"),
    DISMISSED: filteredCases.filter((c) => c.status === "DISMISSED"),
  };

  const totalCases = cases.length;
  const activeCases = cases.filter((c) => ["PENDING", "IN_TRIAL", "VERDICT"].includes(c.status)).length;
  const upcomingHearings = cases.filter((c) => {
    if (!c.hearingDate) return false;
    const hearingDate = new Date(c.hearingDate);
    const now = new Date();
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return hearingDate >= now && hearingDate <= sevenDays;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50 shadow-xl">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border-2 border-purple-500/30">
              <Scale className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Court Cases</h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Scale className="w-4 h-4" />
                  {totalCases} total
                </span>
                <span className="text-gray-600">•</span>
                {activeCases > 0 && (
                  <>
                    <span className="flex items-center gap-1.5 text-yellow-400">
                      <Clock className="w-4 h-4" />
                      {activeCases} active
                    </span>
                    <span className="text-gray-600">•</span>
                  </>
                )}
                {upcomingHearings > 0 && (
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    {upcomingHearings} hearings this week
                  </span>
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
            New Case
          </Button>
        </CardHeader>
      </Card>

      {/* Search & Filters */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by docket #, title, or defendant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-500" />}
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
              className="w-56"
              classNames={{
                trigger: "bg-gray-800/50 border-gray-700",
              }}
            >
              <SelectItem key="ALL">All Statuses</SelectItem>
              <SelectItem key="FILED">Filed</SelectItem>
              <SelectItem key="PENDING">Pending</SelectItem>
              <SelectItem key="IN_TRIAL">In Trial</SelectItem>
              <SelectItem key="VERDICT">Verdict</SelectItem>
              <SelectItem key="SENTENCED">Sentenced</SelectItem>
              <SelectItem key="DISMISSED">Dismissed</SelectItem>
              <SelectItem key="CLOSED">Closed</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Tabs by Status */}
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
              <Scale className="w-4 h-4" />
              <span>All Cases ({filteredCases.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {filteredCases.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-800/50">
                <CardBody className="p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
                      <Scale className="w-8 h-8 text-purple-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">No Court Cases</h4>
                    <p className="text-sm text-gray-400 mb-4">Create your first court case to get started</p>
                    <Button color="secondary" variant="flat" startContent={<Plus />} onPress={onOpen}>
                      Create First Case
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              filteredCases.map((courtCase) => (
                <Card
                  key={courtCase.id}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 hover:shadow-lg transition-all cursor-pointer ${
                    courtCase.status === "IN_TRIAL"
                      ? "border-blue-700/50 hover:border-blue-600/70"
                      : courtCase.status === "PENDING"
                      ? "border-yellow-700/50 hover:border-yellow-600/70"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  isPressable
                  onPress={() => viewCaseDetails(courtCase)}
                >
                  <CardBody className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white font-mono">{courtCase.docketNumber}</h3>
                          <Chip
                            size="sm"
                            color={getStatusColor(courtCase.status) as any}
                            variant="bordered"
                            startContent={getStatusIcon(courtCase.status)}
                          >
                            {courtCase.status.replace("_", " ")}
                          </Chip>
                          <Chip size="sm" variant="flat" className="uppercase">
                            {courtCase.caseType}
                          </Chip>
                        </div>

                        <h4 className="text-base font-semibold text-white mb-2">{courtCase.title}</h4>

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                          <div>
                            <span className="text-gray-500">Defendant:</span>{" "}
                            <span className="font-semibold">{courtCase.defendantName}</span>
                          </div>
                          {courtCase.prosecutorName && (
                            <div>
                              <span className="text-gray-500">Prosecutor:</span>{" "}
                              <span className="font-semibold">{courtCase.prosecutorName}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Filed:</span>{" "}
                            <span>{new Date(courtCase.filingDate).toLocaleDateString()}</span>
                          </div>
                          {courtCase.hearingDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="text-gray-500">Hearing:</span>{" "}
                              <span className="text-blue-400 font-semibold">
                                {new Date(courtCase.hearingDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                          <p className="text-xs text-gray-400">
                            <span className="font-semibold text-gray-300">Charges:</span> {courtCase.charges}
                          </p>
                        </div>

                        {courtCase.verdict && (
                          <div className="mt-2">
                            <Chip
                              size="sm"
                              color={courtCase.verdict === "GUILTY" ? "danger" : "success"}
                              variant="solid"
                              className="font-bold"
                            >
                              {courtCase.verdict}
                            </Chip>
                            {courtCase.sentence && (
                              <span className="ml-2 text-sm text-gray-400">{courtCase.sentence}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        color="secondary"
                        variant="flat"
                        startContent={<Eye className="w-4 h-4" />}
                        onPress={() => viewCaseDetails(courtCase)}
                      >
                        View
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </Tab>

        <Tab
          key="pending"
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Pending ({casesByStatus.PENDING.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {casesByStatus.PENDING.map((courtCase) => (
              <Card
                key={courtCase.id}
                className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/10 border-2 border-yellow-700/30 cursor-pointer"
                isPressable
                onPress={() => viewCaseDetails(courtCase)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white">{courtCase.docketNumber}</span>
                      <span className="text-white">{courtCase.title}</span>
                      {courtCase.hearingDate && (
                        <Chip size="sm" color="primary" variant="flat" startContent={<Calendar />}>
                          {new Date(courtCase.hearingDate).toLocaleDateString()}
                        </Chip>
                      )}
                    </div>
                    <Button size="sm" color="secondary" variant="flat" startContent={<Eye />}>
                      View
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab
          key="trial"
          title={
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              <span>In Trial ({casesByStatus.IN_TRIAL.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {casesByStatus.IN_TRIAL.map((courtCase) => (
              <Card
                key={courtCase.id}
                className="bg-gradient-to-br from-blue-900/20 to-blue-950/10 border-2 border-blue-700/30 cursor-pointer"
                isPressable
                onPress={() => viewCaseDetails(courtCase)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gavel className="w-4 h-4 text-blue-400" />
                      <span className="font-mono font-bold text-white">{courtCase.docketNumber}</span>
                      <span className="text-white">{courtCase.title}</span>
                    </div>
                    <span className="text-sm text-gray-400">{courtCase.defendantName}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        <Tab
          key="sentenced"
          title={
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Sentenced ({casesByStatus.SENTENCED.length})</span>
            </div>
          }
        >
          <div className="space-y-3 mt-4">
            {casesByStatus.SENTENCED.map((courtCase) => (
              <Card
                key={courtCase.id}
                className="bg-gradient-to-br from-green-900/20 to-green-950/10 border-2 border-green-700/30 cursor-pointer"
                isPressable
                onPress={() => viewCaseDetails(courtCase)}
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="font-mono font-bold text-white">{courtCase.docketNumber}</span>
                      <span className="text-white">{courtCase.title}</span>
                      {courtCase.verdict && (
                        <Chip
                          size="sm"
                          color={courtCase.verdict === "GUILTY" ? "danger" : "success"}
                          variant="flat"
                        >
                          {courtCase.verdict}
                        </Chip>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">{courtCase.sentence}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>

      {/* Create Case Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Scale className="w-5 h-5 text-purple-500" />
            </div>
            Create Court Case
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Case Title"
                placeholder="Brief description of the case..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                isRequired
                variant="bordered"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Case Type"
                  selectedKeys={[formData.caseType]}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  variant="bordered"
                >
                  <SelectItem key="CRIMINAL">Criminal</SelectItem>
                  <SelectItem key="CIVIL">Civil</SelectItem>
                  <SelectItem key="TRAFFIC">Traffic</SelectItem>
                  <SelectItem key="ADMINISTRATIVE">Administrative</SelectItem>
                </Select>

                <Input
                  label="Filing Date"
                  type="date"
                  value={formData.filingDate}
                  onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                  isRequired
                  variant="bordered"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Hearing Date (Optional)"
                  type="datetime-local"
                  value={formData.hearingDate}
                  onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
                  variant="bordered"
                />

                <Input
                  label="Court Location"
                  placeholder="e.g., District Court A"
                  value={formData.courtLocation}
                  onChange={(e) => setFormData({ ...formData, courtLocation: e.target.value })}
                  variant="bordered"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Defendant Name"
                  placeholder="Full name..."
                  value={formData.defendantName}
                  onChange={(e) => setFormData({ ...formData, defendantName: e.target.value })}
                  isRequired
                  variant="bordered"
                />

                <Input
                  label="Prosecutor Name (Optional)"
                  placeholder="Full name..."
                  value={formData.prosecutorName}
                  onChange={(e) => setFormData({ ...formData, prosecutorName: e.target.value })}
                  variant="bordered"
                />
              </div>

              <Textarea
                label="Charges"
                placeholder="List all charges..."
                value={formData.charges}
                onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                minRows={3}
                isRequired
                variant="bordered"
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Additional case information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                minRows={3}
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
              Create Case
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Case Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          {selectedCase && (
            <>
              <ModalHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Scale className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg">{selectedCase.docketNumber}</span>
                      <Chip size="sm" color={getStatusColor(selectedCase.status) as any} variant="bordered">
                        {selectedCase.status.replace("_", " ")}
                      </Chip>
                      <Chip size="sm" variant="flat">{selectedCase.caseType}</Chip>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{selectedCase.title}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Case Details */}
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4 space-y-3">
                      <h4 className="font-bold text-white">Case Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Case Type:</span>
                          <p className="text-white font-semibold">{selectedCase.caseType}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Filing Date:</span>
                          <p className="text-white font-semibold">
                            {new Date(selectedCase.filingDate).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedCase.hearingDate && (
                          <div>
                            <span className="text-gray-400">Hearing Date:</span>
                            <p className="text-white font-semibold flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              {new Date(selectedCase.hearingDate).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {selectedCase.courtLocation && (
                          <div>
                            <span className="text-gray-400">Court Location:</span>
                            <p className="text-white font-semibold">{selectedCase.courtLocation}</p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Parties */}
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Parties Involved</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Defendant:</span>
                          <p className="text-white font-semibold">{selectedCase.defendantName}</p>
                        </div>
                        {selectedCase.prosecutorName && (
                          <div>
                            <span className="text-gray-400">Prosecutor:</span>
                            <p className="text-white font-semibold">{selectedCase.prosecutorName}</p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Charges */}
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <h4 className="font-bold text-white mb-3">Charges</h4>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedCase.charges}</p>
                    </CardBody>
                  </Card>

                  {/* Verdict & Sentence */}
                  {selectedCase.verdict && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-3">Verdict & Sentence</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-400 text-sm">Verdict:</span>
                            <Chip
                              size="md"
                              color={selectedCase.verdict === "GUILTY" ? "danger" : "success"}
                              variant="solid"
                              className="font-bold ml-3"
                            >
                              {selectedCase.verdict}
                            </Chip>
                          </div>
                          {selectedCase.sentence && (
                            <div>
                              <span className="text-gray-400 text-sm">Sentence:</span>
                              <p className="text-white font-semibold mt-1">{selectedCase.sentence}</p>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Notes */}
                  {selectedCase.notes && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-3">Case Notes</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedCase.notes}</p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Status Actions */}
                  {selectedCase.status !== "CLOSED" && (
                    <Card className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-4">
                        <h4 className="font-bold text-white mb-3">Case Actions</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedCase.status === "FILED" && (
                            <Button
                              size="sm"
                              color="warning"
                              onPress={() => handleUpdateStatus(selectedCase.id, "PENDING")}
                            >
                              Move to Pending
                            </Button>
                          )}
                          {selectedCase.status === "PENDING" && (
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => handleUpdateStatus(selectedCase.id, "IN_TRIAL")}
                            >
                              Start Trial
                            </Button>
                          )}
                          {selectedCase.status === "IN_TRIAL" && (
                            <>
                              <Button
                                size="sm"
                                color="danger"
                                onPress={() => handleSetVerdict(selectedCase.id, "GUILTY", "Pending sentencing")}
                              >
                                Guilty Verdict
                              </Button>
                              <Button
                                size="sm"
                                color="success"
                                onPress={() => handleSetVerdict(selectedCase.id, "NOT_GUILTY")}
                              >
                                Not Guilty
                              </Button>
                              <Button
                                size="sm"
                                color="default"
                                variant="flat"
                                onPress={() => handleUpdateStatus(selectedCase.id, "DISMISSED")}
                              >
                                Dismiss Case
                              </Button>
                            </>
                          )}
                          {["VERDICT", "SENTENCED", "DISMISSED"].includes(selectedCase.status) && (
                            <Button
                              size="sm"
                              color="default"
                              onPress={() => handleUpdateStatus(selectedCase.id, "CLOSED")}
                            >
                              Close Case
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onDetailClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
