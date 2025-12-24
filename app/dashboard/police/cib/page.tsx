"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { CIBInvestigationDetails } from "@/components/CIBInvestigationDetails";
import { useState, useEffect } from "react";
import { 
  Card, CardBody, CardHeader, Button, Input, Select, SelectItem,
  Chip, Tabs, Tab, Spinner, Modal, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, useDisclosure, Tooltip, Textarea
} from "@nextui-org/react";
import { 
  Shield, Search, Filter, Plus, Eye, AlertTriangle, Clock,
  FileText, Users, MapPin, Car, Building, Phone, File,
  ChevronRight, Calendar, User, Briefcase, Target, Archive,
  TrendingUp, CheckCircle, XCircle, Pause, Lock, AlertOctagon
} from "lucide-react";
import { toast } from "@/lib/toast";

// Types
interface Investigation {
  id: string;
  investigationId: string;
  title: string;
  classification: string;
  status: string;
  priority: string;
  primaryInvestigator: string;
  secondaryInvestigators?: string[];
  summary: string;
  startedAt: string;
  lastActivityAt: string;
  assignedTeam?: string;
  securityLevel: string;
  timeline?: any[];
  evidence?: any[];
  notes?: any[];
  tasks?: any[];
}

export default function CIBPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [filteredInvestigations, setFilteredInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("active");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClassification, setFilterClassification] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterInvestigator, setFilterInvestigator] = useState("");
  const [filterTeam, setFilterTeam] = useState<string>("all");
  
  // Selected investigation for details
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // New investigation modal
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();

  // Fetch investigations
  useEffect(() => {
    fetchInvestigations();
  }, [selectedTab]);

  const fetchInvestigations = async () => {
    setLoading(true);
    try {
      let statusFilter = "";
      
      switch (selectedTab) {
        case "active":
          statusFilter = "ACTIVE,ESCALATED";
          break;
        case "dormant":
          statusFilter = "DORMANT";
          break;
        case "court-ready":
          statusFilter = "COURT_READY";
          break;
        case "closed":
          statusFilter = "CLOSED";
          break;
        case "archived":
          statusFilter = "ARCHIVED";
          break;
        default:
          statusFilter = "ACTIVE,ESCALATED";
      }
      
      const response = await fetch(`/api/cad/investigations?status=${statusFilter}`);
      const data = await response.json();
      
      if (data.investigations) {
        setInvestigations(data.investigations);
        setFilteredInvestigations(data.investigations);
      }
    } catch (error) {
      console.error("Failed to fetch investigations:", error);
      toast.error("Failed to load investigations");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...investigations];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(inv => 
        inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.investigationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.primaryInvestigator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Classification filter
    if (filterClassification && filterClassification !== "all") {
      filtered = filtered.filter(inv => inv.classification === filterClassification);
    }
    
    // Priority filter
    if (filterPriority && filterPriority !== "all") {
      filtered = filtered.filter(inv => inv.priority === filterPriority);
    }
    
    // Investigator filter
    if (filterInvestigator) {
      filtered = filtered.filter(inv => 
        inv.primaryInvestigator.toLowerCase().includes(filterInvestigator.toLowerCase()) ||
        inv.secondaryInvestigators?.some(si => si.toLowerCase().includes(filterInvestigator.toLowerCase()))
      );
    }
    
    // Team filter
    if (filterTeam && filterTeam !== "all") {
      filtered = filtered.filter(inv => inv.assignedTeam === filterTeam);
    }
    
    setFilteredInvestigations(filtered);
  }, [searchQuery, filterClassification, filterPriority, filterInvestigator, filterTeam, investigations]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "success",
      DORMANT: "warning",
      ESCALATED: "danger",
      COURT_READY: "primary",
      CLOSED: "default",
      ARCHIVED: "default"
    };
    return colors[status] || "default";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "default",
      MEDIUM: "primary",
      HIGH: "warning",
      CRITICAL: "danger"
    };
    return colors[priority] || "default";
  };

  const getClassificationIcon = (classification: string) => {
    const icons: Record<string, any> = {
      ASSAULT: AlertTriangle,
      HOMICIDE: AlertOctagon,
      FRAUD: FileText,
      THEFT: Target,
      DRUGS: Briefcase,
      CORRUPTION: Shield,
      ORGANISED_CRIME: Users,
      CYBERCRIME: Target,
      OTHER: File
    };
    const Icon = icons[classification] || File;
    return <Icon className="w-4 h-4" />;
  };

  const viewInvestigation = async (investigation: Investigation) => {
    try {
      const response = await fetch(`/api/cad/investigations/${investigation.id}`);
      const data = await response.json();
      
      if (data.investigation) {
        setSelectedInvestigation(data.investigation);
        onOpen();
      }
    } catch (error) {
      console.error("Failed to load investigation details:", error);
      toast.error("Failed to load investigation details");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" />
              Criminal Investigation Branch
            </h1>
            <p className="text-gray-400 mt-1">Long-term investigations & case management</p>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={onNewOpen}
          >
            New Investigation
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Cases</p>
                  <p className="text-2xl font-bold text-green-500">
                    {investigations.filter(i => i.status === "ACTIVE" || i.status === "ESCALATED").length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500/30" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Dormant Cases</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {investigations.filter(i => i.status === "DORMANT").length}
                  </p>
                </div>
                <Pause className="w-8 h-8 text-yellow-500/30" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Court Ready</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {investigations.filter(i => i.status === "COURT_READY").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500/30" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Closed Cases</p>
                  <p className="text-2xl font-bold text-gray-500">
                    {investigations.filter(i => i.status === "CLOSED").length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-gray-500/30" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">High Priority</p>
                  <p className="text-2xl font-bold text-red-500">
                    {investigations.filter(i => i.priority === "HIGH" || i.priority === "CRITICAL").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500/30" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Search investigations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                classNames={{
                  input: "bg-gray-800/50",
                  inputWrapper: "bg-gray-800/50 border border-gray-700"
                }}
              />

              <Select
                placeholder="Classification"
                selectedKeys={filterClassification ? [filterClassification] : []}
                onChange={(e) => setFilterClassification(e.target.value)}
                classNames={{
                  trigger: "bg-gray-800/50 border border-gray-700"
                }}
              >
                <SelectItem key="all" value="all">All Classifications</SelectItem>
                <SelectItem key="ASSAULT" value="ASSAULT">Assault</SelectItem>
                <SelectItem key="HOMICIDE" value="HOMICIDE">Homicide</SelectItem>
                <SelectItem key="FRAUD" value="FRAUD">Fraud</SelectItem>
                <SelectItem key="THEFT" value="THEFT">Theft</SelectItem>
                <SelectItem key="DRUGS" value="DRUGS">Drugs</SelectItem>
                <SelectItem key="CORRUPTION" value="CORRUPTION">Corruption</SelectItem>
                <SelectItem key="ORGANISED_CRIME" value="ORGANISED_CRIME">Organised Crime</SelectItem>
                <SelectItem key="CYBERCRIME" value="CYBERCRIME">Cybercrime</SelectItem>
                <SelectItem key="OTHER" value="OTHER">Other</SelectItem>
              </Select>

              <Select
                placeholder="Priority"
                selectedKeys={filterPriority ? [filterPriority] : []}
                onChange={(e) => setFilterPriority(e.target.value)}
                classNames={{
                  trigger: "bg-gray-800/50 border border-gray-700"
                }}
              >
                <SelectItem key="all" value="all">All Priorities</SelectItem>
                <SelectItem key="LOW" value="LOW">Low</SelectItem>
                <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
                <SelectItem key="HIGH" value="HIGH">High</SelectItem>
                <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
              </Select>

              <Input
                placeholder="Filter by investigator..."
                value={filterInvestigator}
                onChange={(e) => setFilterInvestigator(e.target.value)}
                startContent={<User className="w-4 h-4 text-gray-400" />}
                classNames={{
                  input: "bg-gray-800/50",
                  inputWrapper: "bg-gray-800/50 border border-gray-700"
                }}
              />

              <Select
                placeholder="Team"
                selectedKeys={filterTeam ? [filterTeam] : []}
                onChange={(e) => setFilterTeam(e.target.value)}
                classNames={{
                  trigger: "bg-gray-800/50 border border-gray-700"
                }}
              >
                <SelectItem key="all" value="all">All Teams</SelectItem>
                <SelectItem key="CIB" value="CIB">CIB</SelectItem>
                <SelectItem key="DETECTIVE" value="DETECTIVE">Detective</SelectItem>
                <SelectItem key="MAJOR_CRIME" value="MAJOR_CRIME">Major Crime</SelectItem>
                <SelectItem key="SPECIAL_OPS" value="SPECIAL_OPS">Special Operations</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Tabs */}
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-800",
            cursor: "w-full bg-indigo-600",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-indigo-400"
          }}
        >
          <Tab key="active" title="Active Cases" />
          <Tab key="dormant" title="Dormant" />
          <Tab key="court-ready" title="Court Ready" />
          <Tab key="closed" title="Closed" />
          <Tab key="archived" title="Archived" />
        </Tabs>

        {/* Investigations List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : filteredInvestigations.length === 0 ? (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No investigations found</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvestigations.map((investigation) => (
              <Card 
                key={investigation.id}
                className="bg-gray-900/50 border border-gray-800 hover:border-indigo-600/50 transition-all cursor-pointer"
                isPressable
                onPress={() => viewInvestigation(investigation)}
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header Row */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-indigo-400">
                          {getClassificationIcon(investigation.classification)}
                          <span className="font-mono text-sm">{investigation.investigationId}</span>
                        </div>
                        
                        <Chip 
                          size="sm" 
                          color={getStatusColor(investigation.status) as any}
                          variant="flat"
                        >
                          {investigation.status.replace("_", " ")}
                        </Chip>
                        
                        <Chip 
                          size="sm" 
                          color={getPriorityColor(investigation.priority) as any}
                          variant="flat"
                        >
                          {investigation.priority}
                        </Chip>

                        {investigation.securityLevel !== "STANDARD" && (
                          <Chip 
                            size="sm" 
                            startContent={<Lock className="w-3 h-3" />}
                            color="warning"
                            variant="flat"
                          >
                            {investigation.securityLevel}
                          </Chip>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {investigation.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {investigation.summary}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Primary: {investigation.primaryInvestigator}</span>
                        </div>

                        {investigation.secondaryInvestigators && investigation.secondaryInvestigators.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>+{investigation.secondaryInvestigators.length} secondary</span>
                          </div>
                        )}

                        {investigation.assignedTeam && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{investigation.assignedTeam}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Last activity: {new Date(investigation.lastActivityAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-col gap-2 text-right">
                      {investigation.evidence && investigation.evidence.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Evidence: </span>
                          <span className="text-white font-semibold">{investigation.evidence.length}</span>
                        </div>
                      )}
                      
                      {investigation.tasks && investigation.tasks.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Open Tasks: </span>
                          <span className="text-yellow-500 font-semibold">{investigation.tasks.length}</span>
                        </div>
                      )}

                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        endContent={<ChevronRight className="w-4 h-4" />}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Investigation Details Modal */}
      {selectedInvestigation && (
        <CIBInvestigationDetails
          investigation={selectedInvestigation}
          isOpen={isOpen}
          onClose={onClose}
          onUpdate={fetchInvestigations}
        />
      )}

      {/* New Investigation Modal */}
      <NewInvestigationModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        onCreate={fetchInvestigations}
      />
    </DashboardLayout>
  );
}

// New Investigation Modal Component
function NewInvestigationModal({ isOpen, onClose, onCreate }: any) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    classification: "OTHER",
    priority: "MEDIUM",
    summary: "",
    backgroundInfo: "",
    primaryInvestigator: "Current User",
    secondaryInvestigators: [] as string[],
    assignedTeam: "CIB",
    securityLevel: "STANDARD"
  });

  const handleCreate = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cad/investigations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          createdBy: "Current User"
        })
      });

      if (response.ok) {
        toast.success("Investigation created successfully");
        onClose();
        onCreate();
        // Reset form
        setForm({
          title: "",
          classification: "OTHER",
          priority: "MEDIUM",
          summary: "",
          backgroundInfo: "",
          primaryInvestigator: "Current User",
          secondaryInvestigators: [],
          assignedTeam: "CIB",
          securityLevel: "STANDARD"
        });
      } else {
        throw new Error("Failed to create investigation");
      }
    } catch (error) {
      console.error("Failed to create investigation:", error);
      toast.error("Failed to create investigation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>Create New Investigation</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Investigation Title"
              placeholder="Brief description of the investigation..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Classification"
                selectedKeys={[form.classification]}
                onChange={(e) => setForm({ ...form, classification: e.target.value })}
                classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
              >
                <SelectItem key="ASSAULT" value="ASSAULT">Assault</SelectItem>
                <SelectItem key="HOMICIDE" value="HOMICIDE">Homicide</SelectItem>
                <SelectItem key="FRAUD" value="FRAUD">Fraud</SelectItem>
                <SelectItem key="THEFT" value="THEFT">Theft</SelectItem>
                <SelectItem key="DRUGS" value="DRUGS">Drugs</SelectItem>
                <SelectItem key="CORRUPTION" value="CORRUPTION">Corruption</SelectItem>
                <SelectItem key="ORGANISED_CRIME" value="ORGANISED_CRIME">Organised Crime</SelectItem>
                <SelectItem key="CYBERCRIME" value="CYBERCRIME">Cybercrime</SelectItem>
                <SelectItem key="OTHER" value="OTHER">Other</SelectItem>
              </Select>

              <Select
                label="Priority"
                selectedKeys={[form.priority]}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
              >
                <SelectItem key="LOW" value="LOW">Low</SelectItem>
                <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
                <SelectItem key="HIGH" value="HIGH">High</SelectItem>
                <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
              </Select>
            </div>

            <Textarea
              label="Summary"
              placeholder="Overview of the investigation..."
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              minRows={3}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <Textarea
              label="Background Information"
              placeholder="Additional context, known facts, prior incidents..."
              value={form.backgroundInfo}
              onChange={(e) => setForm({ ...form, backgroundInfo: e.target.value })}
              minRows={4}
              classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Primary Investigator"
                value={form.primaryInvestigator}
                onChange={(e) => setForm({ ...form, primaryInvestigator: e.target.value })}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />

              <Select
                label="Assigned Team"
                selectedKeys={[form.assignedTeam]}
                onChange={(e) => setForm({ ...form, assignedTeam: e.target.value })}
                classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
              >
                <SelectItem key="CIB" value="CIB">CIB</SelectItem>
                <SelectItem key="DETECTIVE" value="DETECTIVE">Detective</SelectItem>
                <SelectItem key="MAJOR_CRIME" value="MAJOR_CRIME">Major Crime</SelectItem>
                <SelectItem key="SPECIAL_OPS" value="SPECIAL_OPS">Special Operations</SelectItem>
              </Select>
            </div>

            <Select
              label="Security Level"
              selectedKeys={[form.securityLevel]}
              onChange={(e) => setForm({ ...form, securityLevel: e.target.value })}
              classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
            >
              <SelectItem key="STANDARD" value="STANDARD">Standard</SelectItem>
              <SelectItem key="CONFIDENTIAL" value="CONFIDENTIAL">Confidential</SelectItem>
              <SelectItem key="RESTRICTED" value="RESTRICTED">Restricted</SelectItem>
              <SelectItem key="SECRET" value="SECRET">Secret</SelectItem>
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button 
            color="primary" 
            onPress={handleCreate}
            isLoading={saving}
            isDisabled={!form.title.trim() || !form.summary.trim()}
          >
            Create Investigation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
