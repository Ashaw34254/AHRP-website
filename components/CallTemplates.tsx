"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
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
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Phone,
  Flame,
  Heart,
  Shield,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface CallTemplate {
  id: string;
  name: string;
  description: string | null;
  callType: string;
  priority: string;
  department: string;
  defaultLocation: string | null;
  defaultNotes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function CallTemplates() {
  const [templates, setTemplates] = useState<CallTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<CallTemplate | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isEditMode, setIsEditMode] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Template form
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    callType: "",
    priority: "MEDIUM",
    department: "POLICE",
    defaultLocation: "",
    defaultNotes: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/cad/templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.name || !templateForm.callType) {
      toast.error("Name and call type are required");
      return;
    }

    try {
      const url = isEditMode && selectedTemplate
        ? `/api/cad/templates/${selectedTemplate.id}`
        : "/api/cad/templates";
      
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateForm),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Template updated successfully" : "Template created successfully");
        resetForm();
        fetchTemplates();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save template");
      }
    } catch (error) {
      toast.error("Failed to save template");
    }
  };

  const handleEditTemplate = (template: CallTemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description || "",
      callType: template.callType,
      priority: template.priority,
      department: template.department,
      defaultLocation: template.defaultLocation || "",
      defaultNotes: template.defaultNotes || "",
      isActive: template.isActive,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/cad/templates/${selectedTemplate.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Template deleted successfully");
        fetchTemplates();
        onDeleteClose();
        setSelectedTemplate(null);
      } else {
        toast.error("Failed to delete template");
      }
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleDuplicateTemplate = (template: CallTemplate) => {
    setTemplateForm({
      name: `${template.name} (Copy)`,
      description: template.description || "",
      callType: template.callType,
      priority: template.priority,
      department: template.department,
      defaultLocation: template.defaultLocation || "",
      defaultNotes: template.defaultNotes || "",
      isActive: true,
    });
    setIsEditMode(false);
    setSelectedTemplate(null);
    onOpen();
  };

  const handleUseTemplate = (template: CallTemplate) => {
    toast.success(`Using template: ${template.name}. Create call with pre-filled data.`);
    // In a real implementation, this would navigate to call creation with pre-filled fields
  };

  const resetForm = () => {
    setTemplateForm({
      name: "",
      description: "",
      callType: "",
      priority: "MEDIUM",
      department: "POLICE",
      defaultLocation: "",
      defaultNotes: "",
      isActive: true,
    });
    setIsEditMode(false);
    setSelectedTemplate(null);
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case "POLICE":
        return <Shield className="w-4 h-4" />;
      case "FIRE":
        return <Flame className="w-4 h-4" />;
      case "EMS":
        return <Heart className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "POLICE":
        return "primary";
      case "FIRE":
        return "danger";
      case "EMS":
        return "success";
      default:
        return "default";
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
        return "default";
      default:
        return "default";
    }
  };

  const getFilteredTemplates = () => {
    let filtered = templates;

    // Filter by tab (department)
    if (selectedTab !== "all") {
      filtered = filtered.filter((t) => t.department === selectedTab.toUpperCase());
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.callType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Only show active templates
    filtered = filtered.filter((t) => t.isActive);

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const policeCount = templates.filter((t) => t.department === "POLICE" && t.isActive).length;
  const fireCount = templates.filter((t) => t.department === "FIRE" && t.isActive).length;
  const emsCount = templates.filter((t) => t.department === "EMS" && t.isActive).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 rounded-xl border-2 border-cyan-500/30">
            <FileText className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Call Templates</h1>
            <p className="text-gray-400">Pre-configured call types for quick dispatch</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => {
            resetForm();
            onOpen();
          }}
          className="font-semibold"
        >
          New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-900/80 to-cyan-800/80 border border-cyan-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-200 text-sm">Total Templates</p>
                <p className="text-3xl font-bold text-white">{templates.filter(t => t.isActive).length}</p>
              </div>
              <FileText className="w-8 h-8 text-cyan-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border border-blue-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Police</p>
                <p className="text-3xl font-bold text-white">{policeCount}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/80 to-red-800/80 border border-red-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Fire</p>
                <p className="text-3xl font-bold text-white">{fireCount}</p>
              </div>
              <Flame className="w-8 h-8 text-red-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/80 to-green-800/80 border border-green-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">EMS</p>
                <p className="text-3xl font-bold text-white">{emsCount}</p>
              </div>
              <Heart className="w-8 h-8 text-green-300" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-xs"
          classNames={{
            input: "bg-gray-900",
            inputWrapper: "bg-gray-900 border border-gray-800",
          }}
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
        >
          <Tab key="all" title="All Templates" />
          <Tab key="police" title={`Police (${policeCount})`} />
          <Tab key="fire" title={`Fire (${fireCount})`} />
          <Tab key="ems" title={`EMS (${emsCount})`} />
        </Tabs>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800">
          <CardBody className="p-12 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border-2 border-cyan-500/30">
              <FileText className="w-12 h-12 text-cyan-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Templates</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm
                  ? "No templates match your search"
                  : "Create your first call template to speed up dispatch"}
              </p>
              <Button
                color="primary"
                onPress={() => {
                  resetForm();
                  onOpen();
                }}
                startContent={<Plus />}
              >
                Create Template
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all"
            >
              <CardBody className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg border-2 ${
                      template.department === "POLICE" ? "bg-blue-500/10 border-blue-500/30" :
                      template.department === "FIRE" ? "bg-red-500/10 border-red-500/30" :
                      "bg-green-500/10 border-green-500/30"
                    }`}>
                      {getDepartmentIcon(template.department)}
                    </div>
                    <Chip
                      size="sm"
                      color={getDepartmentColor(template.department)}
                      variant="flat"
                    >
                      {template.department}
                    </Chip>
                  </div>
                  <Chip
                    size="sm"
                    color={getPriorityColor(template.priority)}
                    variant="solid"
                  >
                    {template.priority}
                  </Chip>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                
                <div className="mb-3">
                  <Chip size="sm" variant="flat" className="font-mono">
                    {template.callType}
                  </Chip>
                </div>

                {template.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>
                )}

                {template.defaultLocation && (
                  <div className="mb-3 text-xs text-gray-500">
                    <span className="font-semibold">Default Location:</span> {template.defaultLocation}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => handleUseTemplate(template)}
                    startContent={<Phone className="w-3 h-3" />}
                    className="flex-1"
                  >
                    Use
                  </Button>
                  <Button
                    size="sm"
                    color="default"
                    variant="flat"
                    isIconOnly
                    onPress={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    color="default"
                    variant="flat"
                    isIconOnly
                    onPress={() => handleEditTemplate(template)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onPress={() => {
                      setSelectedTemplate(template);
                      onDeleteOpen();
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Template Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>{isEditMode ? "Edit Template" : "New Template"}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Template Name"
                placeholder="Enter template name"
                value={templateForm.name}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, name: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Textarea
                label="Description"
                placeholder="Enter template description (optional)"
                value={templateForm.description}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, description: e.target.value })
                }
                minRows={2}
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Department"
                  placeholder="Select department"
                  selectedKeys={[templateForm.department]}
                  onChange={(e) =>
                    setTemplateForm({ ...templateForm, department: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="POLICE" value="POLICE">Police</SelectItem>
                  <SelectItem key="FIRE" value="FIRE">Fire</SelectItem>
                  <SelectItem key="EMS" value="EMS">EMS</SelectItem>
                </Select>

                <Select
                  label="Priority"
                  placeholder="Select priority"
                  selectedKeys={[templateForm.priority]}
                  onChange={(e) =>
                    setTemplateForm({ ...templateForm, priority: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="LOW" value="LOW">Low</SelectItem>
                  <SelectItem key="MEDIUM" value="MEDIUM">Medium</SelectItem>
                  <SelectItem key="HIGH" value="HIGH">High</SelectItem>
                  <SelectItem key="CRITICAL" value="CRITICAL">Critical</SelectItem>
                </Select>
              </div>

              <Input
                label="Call Type"
                placeholder="e.g., TRAFFIC_STOP, MEDICAL_EMERGENCY, STRUCTURE_FIRE"
                value={templateForm.callType}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, callType: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Input
                label="Default Location (Optional)"
                placeholder="Enter default location"
                value={templateForm.defaultLocation}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, defaultLocation: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Textarea
                label="Default Notes (Optional)"
                placeholder="Enter default notes for this call type"
                value={templateForm.defaultNotes}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, defaultNotes: e.target.value })
                }
                minRows={3}
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={templateForm.isActive}
                  onChange={(e) =>
                    setTemplateForm({ ...templateForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Template is active
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => {
              resetForm();
              onClose();
            }}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateTemplate}
              startContent={<Plus className="w-4 h-4" />}
            >
              {isEditMode ? "Update Template" : "Create Template"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>Delete Template</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">
              Are you sure you want to delete the template "{selectedTemplate?.name}"?
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteTemplate}
              startContent={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
