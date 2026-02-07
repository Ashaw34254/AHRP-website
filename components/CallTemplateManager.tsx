"use client";

import { Card, CardBody, Button, Input, Textarea, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from "@heroui/react";
import { Plus, FileText, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import { useSession } from "next-auth/react";
import { VIC_CALL_TYPES } from "@/lib/victoria-police-config";
import { DEPARTMENT_PRIORITIES, type Department } from "@/lib/department-config";

interface CallTemplate {
  id: string;
  name: string;
  description: string;
  callType: string;
  priority: string;
  department: string;
  descriptionTemplate: string;
  usageCount: number;
  isPublic: boolean;
  createdBy: {
    name: string;
  };
}

interface CallTemplateManagerProps {
  department: Department;
  onUseTemplate?: (template: CallTemplate) => void;
}

export function CallTemplateManager({ department, onUseTemplate }: CallTemplateManagerProps) {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<CallTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    callType: "",
    priority: DEPARTMENT_PRIORITIES[department][1]?.value || "MEDIUM",
    descriptionTemplate: "",
    isPublic: false,
  });

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/cad/templates?department=${department}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [department]);

  const handleCreate = async () => {
    if (!formData.name || !formData.callType || !formData.descriptionTemplate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          department,
          createdById: session.user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create");

      toast.success("Template created successfully");
      setFormData({
        name: "",
        description: "",
        callType: "",
        priority: DEPARTMENT_PRIORITIES[department][1]?.value || "MEDIUM",
        descriptionTemplate: "",
        isPublic: false,
      });
      onClose();
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cad/templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Template deleted");
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleUse = (template: CallTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template);
      toast.success(`Using template: ${template.name}`);
    }
  };

  const departmentCallTypes = VIC_CALL_TYPES[department] || [];

  return (
    <>
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Call Templates</h3>
            <Button
              color="primary"
              size="sm"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onOpen}
            >
              Create Template
            </Button>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No templates available</p>
              <p className="text-sm text-gray-500 mt-1">Create your first template to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{template.name}</h4>
                        {template.isPublic && (
                          <Chip size="sm" color="primary" variant="flat">Public</Chip>
                        )}
                        <Chip size="sm" variant="flat">{template.usageCount} uses</Chip>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                      <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat">{template.callType.replace(/_/g, " ")}</Chip>
                        <Chip size="sm" color="warning" variant="flat">{template.priority}</Chip>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<Eye className="w-3 h-3" />}
                        onPress={() => handleUse(template)}
                      >
                        Use
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        isIconOnly
                        onPress={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Create Call Template</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Template Name"
                placeholder="e.g., Domestic Violence - Standard"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
              />

              <Textarea
                label="Description"
                placeholder="Brief description of when to use this template"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                minRows={2}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Call Type"
                  placeholder="Select type"
                  selectedKeys={formData.callType ? [formData.callType] : []}
                  onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                  isRequired
                >
                  {departmentCallTypes.map((type) => (
                    <SelectItem key={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Default Priority"
                  placeholder="Select priority"
                  selectedKeys={[formData.priority]}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  isRequired
                >
                  {DEPARTMENT_PRIORITIES[department].map((priority) => (
                    <SelectItem key={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <Textarea
                label="Description Template"
                placeholder="Enter template text with placeholders like {LOCATION}, {SUSPECT_DESC}, etc."
                value={formData.descriptionTemplate}
                onChange={(e) => setFormData({ ...formData, descriptionTemplate: e.target.value })}
                minRows={5}
                isRequired
                description="Use placeholders that can be filled in later"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-300">
                  Make this template available to all users in {department}
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={handleCreate} isLoading={loading}>
              Create Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
