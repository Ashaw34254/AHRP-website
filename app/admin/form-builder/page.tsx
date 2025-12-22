"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { toast } from "@/lib/toast";
import {
  Plus,
  Trash2,
  Edit,
  GripVertical,
  Save,
  Eye,
  Settings,
  Copy,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FieldType = "text" | "textarea" | "select" | "radio" | "checkbox" | "number" | "email";

interface ConditionalLogic {
  show: boolean; // true = show when conditions met, false = hide when conditions met
  conditions: Array<{
    field: string; // fieldName to check
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty";
    value: string;
  }>;
  operator: "AND" | "OR"; // How to combine multiple conditions
}

interface FormField {
  id?: string;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: string[]; // For select, radio, checkbox
  order: number;
  width: "full" | "half"; // Layout width
  section?: string; // Group fields into sections
  conditionalLogic?: ConditionalLogic; // Show/hide based on other fields
}

interface FormConfig {
  name: string;
  title: string;
  description?: string;
  isActive: boolean;
  fields: FormField[];
}

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
];

const fieldTemplates: Record<string, Partial<FormField>> = {
  fullName: {
    fieldName: "full_name",
    label: "Full Name",
    fieldType: "text",
    placeholder: "Enter your full name",
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    fieldName: "email",
    label: "Email Address",
    fieldType: "email",
    placeholder: "your@email.com",
    required: true,
  },
  discord: {
    fieldName: "discord_id",
    label: "Discord ID",
    fieldType: "text",
    placeholder: "username#1234",
    required: true,
    helpText: "Your Discord username with discriminator",
  },
  age: {
    fieldName: "age",
    label: "Age",
    fieldType: "number",
    placeholder: "18",
    required: true,
    minLength: 18,
  },
  experience: {
    fieldName: "experience",
    label: "Roleplay Experience",
    fieldType: "textarea",
    placeholder: "Describe your roleplay experience...",
    required: true,
    minLength: 50,
    maxLength: 1000,
  },
  reason: {
    fieldName: "reason",
    label: "Why do you want to join?",
    fieldType: "textarea",
    placeholder: "Tell us why you want to join our community...",
    required: true,
    minLength: 50,
    maxLength: 500,
  },
  availability: {
    fieldName: "availability",
    label: "Availability",
    fieldType: "select",
    options: ["Weekdays", "Weekends", "Evenings", "Flexible"],
    required: true,
  },
  agreed_rules: {
    fieldName: "agreed_to_rules",
    label: "I have read and agree to the server rules",
    fieldType: "checkbox",
    required: true,
  },
};

export default function FormBuilderPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("whitelist");
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applicationTypes, setApplicationTypes] = useState<any[]>([]);
  
  // Field editor modal
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [showConditionalModal, setShowConditionalModal] = useState(false);
  const [fieldForm, setFieldForm] = useState<FormField>({
    fieldName: "",
    label: "",
    fieldType: "text",
    placeholder: "",
    helpText: "",
    required: false,
    order: 0,
    width: "full",
    section: "",
    conditionalLogic: undefined,
  });

  // Load application types on mount
  useEffect(() => {
    loadApplicationTypes();
  }, []);

  // Load form config when tab changes
  useEffect(() => {
    loadFormConfig(activeTab);
  }, [activeTab]);

  const loadApplicationTypes = async () => {
    try {
      const res = await fetch("/api/admin/application-types");
      const data = await res.json();
      
      if (data.success) {
        setApplicationTypes(data.types);
        if (data.types.length > 0 && !activeTab) {
          setActiveTab(data.types[0].name);
        }
      }
    } catch (error) {
      console.error("Error loading application types:", error);
    }
  };

  const loadFormConfig = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/form-config?type=${type}`);
      const data = await res.json();
      
      if (data.success && data.config) {
        setFormConfig(data.config);
      } else {
        // Initialize default config if none exists
        setFormConfig({
          name: type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Application`,
          description: `Application form for ${type}`,
          isActive: true,
          fields: [],
        });
      }
    } catch (error) {
      console.error("Error loading form config:", error);
      toast.error("Failed to load form configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveFormConfig = async () => {
    if (!formConfig) return;
    
    // Validate form config before saving
    if (!formConfig.title) {
      toast.error("Form title is required");
      return;
    }
    
    // Check for duplicate field names
    const fieldNames = formConfig.fields.map(f => f.fieldName);
    const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      toast.error(`Duplicate field names found: ${duplicates.join(", ")}`);
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch("/api/admin/form-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formConfig),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Form configuration saved successfully");
        loadFormConfig(activeTab); // Reload to get updated data with IDs
      } else {
        toast.error(data.message || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving form config:", error);
      toast.error("Failed to save form configuration");
    } finally {
      setSaving(false);
    }
  };

  const openFieldEditor = (field?: FormField, index?: number) => {
    if (field) {
      setEditingField({ ...field, order: index ?? field.order });
      setFieldForm({ ...field, order: index ?? field.order });
    } else {
      const newOrder = formConfig?.fields.length || 0;
      setEditingField(null);
      setFieldForm({
        fieldName: "",
        label: "",
        fieldType: "text",
        placeholder: "",
        helpText: "",
        required: false,
        order: newOrder,
        width: "full",
        section: "",
      });
    }
    setShowFieldModal(true);
  };

  const saveField = () => {
    if (!formConfig) return;
    
    // Validate required fields
    if (!fieldForm.fieldName || !fieldForm.label) {
      toast.error("Field name and label are required");
      return;
    }
    
    // Validate field name format (alphanumeric and underscores only)
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldForm.fieldName)) {
      toast.error("Field name must start with a letter and contain only letters, numbers, and underscores");
      return;
    }
    
    // Check for duplicate field names
    const isDuplicate = formConfig.fields.some(
      (f, idx) => f.fieldName === fieldForm.fieldName && 
      (editingField ? f.order !== editingField.order : true)
    );
    
    if (isDuplicate) {
      toast.error("A field with this name already exists");
      return;
    }
    
    // Validate options for select/radio/checkbox
    if (["select", "radio", "checkbox"].includes(fieldForm.fieldType)) {
      if (!fieldForm.options || fieldForm.options.length === 0) {
        toast.error(`${fieldForm.fieldType} fields must have at least one option`);
        return;
      }
    }
    
    const updatedFields = [...formConfig.fields];
    
    if (editingField) {
      // Update existing field
      const index = updatedFields.findIndex(f => f.order === editingField.order);
      if (index !== -1) {
        updatedFields[index] = fieldForm;
      }
    } else {
      // Add new field
      updatedFields.push(fieldForm);
    }
    
    setFormConfig({ ...formConfig, fields: updatedFields });
    setShowFieldModal(false);
    toast.success(editingField ? "Field updated" : "Field added");
  };

  const deleteField = (index: number) => {
    if (!formConfig) return;
    
    const updatedFields = formConfig.fields.filter((_, i) => i !== index);
    // Reorder remaining fields
    updatedFields.forEach((field, i) => {
      field.order = i;
    });
    
    setFormConfig({ ...formConfig, fields: updatedFields });
    toast.success("Field deleted");
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (!formConfig) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formConfig.fields.length) return;
    
    const updatedFields = [...formConfig.fields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[newIndex];
    updatedFields[newIndex] = temp;
    
    // Update order values
    updatedFields.forEach((field, i) => {
      field.order = i;
    });
    
    setFormConfig({ ...formConfig, fields: updatedFields });
  };

  const cloneField = (index: number) => {
    if (!formConfig) return;
    
    const fieldToClone = { ...formConfig.fields[index] };
    const newField = {
      ...fieldToClone,
      fieldName: `${fieldToClone.fieldName}_copy`,
      label: `${fieldToClone.label} (Copy)`,
      order: formConfig.fields.length,
    };
    
    setFormConfig({ 
      ...formConfig, 
      fields: [...formConfig.fields, newField] 
    });
    toast.success("Field cloned successfully");
  };

  const applyTemplate = (templateKey: string) => {
    if (!formConfig) return;
    
    const template = fieldTemplates[templateKey];
    if (!template) return;
    
    const newField: FormField = {
      ...template,
      order: formConfig.fields.length,
      width: "full",
      section: "",
    } as FormField;
    
    setFormConfig({ 
      ...formConfig, 
      fields: [...formConfig.fields, newField] 
    });
    setShowTemplateModal(false);
    toast.success("Template applied successfully");
  };

  const exportConfig = () => {
    if (!formConfig) return;
    
    const exportData = {
      title: formConfig.title,
      description: formConfig.description,
      fields: formConfig.fields,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: "application/json" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formConfig.name}-form-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Configuration exported successfully");
  };

  const importConfig = () => {
    if (!formConfig) return;
    
    try {
      const importedData = JSON.parse(importJson);
      
      if (!importedData.fields || !Array.isArray(importedData.fields)) {
        toast.error("Invalid configuration format");
        return;
      }
      
      setFormConfig({
        ...formConfig,
        title: importedData.title || formConfig.title,
        description: importedData.description || formConfig.description,
        fields: importedData.fields.map((field: any, index: number) => ({
          ...field,
          order: index,
        })),
      });
      
      setShowImportModal(false);
      setImportJson("");
      toast.success("Configuration imported successfully");
    } catch (error) {
      toast.error("Failed to parse JSON. Please check the format.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Application Form Builder
            </h1>
            <p className="text-gray-400 mt-2">
              Customize application forms without touching code
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              startContent={<Upload size={18} />}
              variant="flat"
              onPress={() => setShowImportModal(true)}
            >
              Import
            </Button>
            <Button
              startContent={<Download size={18} />}
              variant="flat"
              onPress={exportConfig}
            >
              Export
            </Button>
            <Button
              startContent={<Eye size={18} />}
              variant="flat"
              color="secondary"
              onPress={() => window.open("/apply", "_blank")}
            >
              Preview Form
            </Button>
            <Button
              startContent={<Save size={18} />}
              color="primary"
              onPress={saveFormConfig}
              isLoading={saving}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              Save Configuration
            </Button>
          </div>
        </div>

        {/* Application Type Tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          color="secondary"
          variant="underlined"
          classNames={{
            tabList: "border-b border-gray-800",
            cursor: "bg-gradient-to-r from-purple-500 to-pink-600",
            tab: "text-gray-400",
            tabContent: "group-data-[selected=true]:text-white",
          }}
        >
          {applicationTypes.map((type) => (
            <Tab key={type.name} title={type.title} />
          ))}
        </Tabs>

        {loading ? (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody>
              <p className="text-center text-gray-400">Loading configuration...</p>
            </CardBody>
          </Card>
        ) : formConfig ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Settings */}
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader className="flex items-center gap-2 border-b border-gray-800">
                <Settings size={20} className="text-purple-400" />
                <h3 className="text-xl font-semibold">Form Settings</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Form Title"
                  value={formConfig.title}
                  onChange={(e) =>
                    setFormConfig({ ...formConfig, title: e.target.value })
                  }
                  description="Display name shown to users"
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                  isRequired
                />
                <Textarea
                  label="Description"
                  value={formConfig.description || ""}
                  onChange={(e) =>
                    setFormConfig({ ...formConfig, description: e.target.value })
                  }
                  description="Brief description of this application form"
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                  minRows={2}
                />
                <div className="space-y-2">
                  <Checkbox
                    isSelected={formConfig.isActive}
                    onValueChange={(checked) =>
                      setFormConfig({ ...formConfig, isActive: checked })
                    }
                    classNames={{
                      wrapper: formConfig.isActive ? "bg-green-500" : "",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      Form Active
                      {formConfig.isActive ? (
                        <span className="text-xs text-green-400">(Visible to users)</span>
                      ) : (
                        <span className="text-xs text-red-400">(Hidden from users)</span>
                      )}\n                    </span>
                  </Checkbox>
                  <p className="text-xs text-gray-500 pl-8">
                    When inactive, users won't see this application type in the dropdown
                  </p>
                </div>
                
                {/* Stats */}
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <p className="text-sm text-gray-400">
                    <strong>{formConfig.fields.length}</strong> fields configured
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>{formConfig.fields.filter(f => f.required).length}</strong> required fields
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>{new Set(formConfig.fields.map(f => f.section).filter(Boolean)).size}</strong> sections
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Field List */}
            <Card className="lg:col-span-2 bg-gray-900/50 border border-gray-800">
              <CardHeader className="flex items-center justify-between border-b border-gray-800">
                <h3 className="text-xl font-semibold">Form Fields</h3>
                <div className="flex gap-2">
                  <Button
                    startContent={<Sparkles size={18} />}
                    color="secondary"
                    size="sm"
                    variant="flat"
                    onPress={() => setShowTemplateModal(true)}
                  >
                    Templates
                  </Button>
                  <Button
                    startContent={<Plus size={18} />}
                    color="secondary"
                    size="sm"
                    onPress={() => openFieldEditor()}
                  >
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="space-y-3">
                {formConfig.fields.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No fields added yet</p>
                    <p className="text-sm mt-2">Click "Add Field" or use a template to get started</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {formConfig.fields.map((field, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          {/* Drag handle */}
                          <div className="flex flex-col gap-1 pt-1">
                            <button
                              onClick={() => moveField(index, "up")}
                              disabled={index === 0}
                              className="text-gray-500 hover:text-purple-400 disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <GripVertical size={16} className="text-gray-600" />
                            <button
                              onClick={() => moveField(index, "down")}
                              disabled={index === formConfig.fields.length - 1}
                              className="text-gray-500 hover:text-purple-400 disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </div>

                          {/* Field info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold">{field.label}</h4>
                              {field.required && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Required</span>
                              )}
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                                {field.fieldType}
                              </span>
                              {field.width === "half" && (
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Half Width</span>
                              )}
                              {field.conditionalLogic && (
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded flex items-center gap-1">
                                  <Settings size={12} />
                                  Conditional
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              <code className="text-purple-400">{field.fieldName}</code>
                            </p>
                            {field.section && (
                              <p className="text-xs text-gray-500 mt-1">
                                📁 Section: {field.section}
                              </p>
                            )}
                            {field.placeholder && (
                              <p className="text-xs text-gray-500 mt-1 italic">
                                Placeholder: "{field.placeholder}"
                              </p>
                            )}
                            {field.options && field.options.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {field.options.map((opt, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(field.minLength || field.maxLength) && (
                              <p className="text-xs text-gray-500 mt-1">
                                📏 Length: {field.minLength || 0} - {field.maxLength || "∞"}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() => openFieldEditor(field, index)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="secondary"
                              onPress={() => cloneField(index)}
                            >
                              <Copy size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => deleteField(index)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </CardBody>
            </Card>
          </div>
        ) : null}

        {/* Template Modal */}
        <Modal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>Field Templates</ModalHeader>
            <ModalBody>
              <p className="text-gray-400 mb-4">
                Choose a pre-configured field template to quickly add common fields
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(fieldTemplates).map(([key, template]) => (
                  <Card
                    key={key}
                    isPressable
                    onPress={() => applyTemplate(key)}
                    className="bg-gray-800/50 border border-gray-700 hover:border-purple-500 transition-colors"
                  >
                    <CardBody className="p-4">
                      <h4 className="font-semibold text-white mb-1">{template.label}</h4>
                      <p className="text-sm text-gray-400">
                        <code className="text-purple-400 text-xs">{template.fieldName}</code>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Type: {template.fieldType}
                        {template.required && " • Required"}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => setShowTemplateModal(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Import Modal */}
        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          size="3xl"
        >
          <ModalContent>
            <ModalHeader>Import Configuration</ModalHeader>
            <ModalBody>
              <p className="text-gray-400 mb-4">
                Paste exported JSON configuration to import fields
              </p>
              <Textarea
                label="Configuration JSON"
                placeholder='{"title": "...", "fields": [...]}'
                value={importJson}
                onValueChange={setImportJson}
                minRows={15}
                classNames={{
                  input: "font-mono text-sm",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={() => setShowImportModal(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={importConfig}>
                Import
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Field Editor Modal */}
        <Modal
          isOpen={showFieldModal}
          onClose={() => setShowFieldModal(false)}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              {editingField ? "Edit Field" : "Add New Field"}
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Field Name"
                  placeholder="e.g., discordUsername"
                  value={fieldForm.fieldName}
                  onChange={(e) =>
                    setFieldForm({ ...fieldForm, fieldName: e.target.value })
                  }
                  description="Internal name (no spaces, camelCase)"
                  isRequired
                />
                <Input
                  label="Label"
                  placeholder="e.g., Discord Username"
                  value={fieldForm.label}
                  onChange={(e) =>
                    setFieldForm({ ...fieldForm, label: e.target.value })
                  }
                  description="Display label for users"
                  isRequired
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Field Type"
                  selectedKeys={[fieldForm.fieldType]}
                  onChange={(e) =>
                    setFieldForm({
                      ...fieldForm,
                      fieldType: e.target.value as FieldType,
                    })
                  }
                >
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Width"
                  selectedKeys={[fieldForm.width]}
                  onChange={(e) =>
                    setFieldForm({
                      ...fieldForm,
                      width: e.target.value as "full" | "half",
                    })
                  }
                >
                  <SelectItem key="full" value="full">Full Width</SelectItem>
                  <SelectItem key="half" value="half">Half Width</SelectItem>
                </Select>
              </div>

              <Input
                label="Placeholder"
                placeholder="Optional placeholder text"
                value={fieldForm.placeholder || ""}
                onChange={(e) =>
                  setFieldForm({ ...fieldForm, placeholder: e.target.value })
                }
              />

              <Textarea
                label="Help Text"
                placeholder="Optional help text to guide users"
                value={fieldForm.helpText || ""}
                onChange={(e) =>
                  setFieldForm({ ...fieldForm, helpText: e.target.value })
                }
              />

              <Input
                label="Section"
                placeholder="Optional section grouping"
                value={fieldForm.section || ""}
                onChange={(e) =>
                  setFieldForm({ ...fieldForm, section: e.target.value })
                }
                description="Group related fields together"
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Min Length"
                  value={fieldForm.minLength?.toString() || ""}
                  onChange={(e) =>
                    setFieldForm({
                      ...fieldForm,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
                <Input
                  type="number"
                  label="Max Length"
                  value={fieldForm.maxLength?.toString() || ""}
                  onChange={(e) =>
                    setFieldForm({
                      ...fieldForm,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
                <Input
                  label="Pattern (Regex)"
                  placeholder="e.g., ^[A-Za-z]+$"
                  value={fieldForm.pattern || ""}
                  onChange={(e) =>
                    setFieldForm({ ...fieldForm, pattern: e.target.value })
                  }
                />
              </div>

              {(fieldForm.fieldType === "select" ||
                fieldForm.fieldType === "radio" ||
                fieldForm.fieldType === "checkbox") && (
                <Textarea
                  label="Options"
                  placeholder="Enter options, one per line"
                  value={fieldForm.options?.join("\n") || ""}
                  onChange={(e) =>
                    setFieldForm({
                      ...fieldForm,
                      options: e.target.value.split("\n").filter(o => o.trim()),
                    })
                  }
                  description="One option per line"
                  minRows={3}
                />
              )}

              {/* Conditional Logic Section */}
              <div className="border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Conditional Logic</h4>
                    <p className="text-xs text-gray-400">Show or hide this field based on other field values</p>
                  </div>
                  <Button
                    size="sm"
                    variant="flat"
                    color={fieldForm.conditionalLogic ? "secondary" : "default"}
                    onPress={() => {
                      if (fieldForm.conditionalLogic) {
                        setFieldForm({ ...fieldForm, conditionalLogic: undefined });
                      } else {
                        setFieldForm({
                          ...fieldForm,
                          conditionalLogic: {
                            show: true,
                            conditions: [{ field: "", operator: "equals", value: "" }],
                            operator: "AND",
                          },
                        });
                      }
                    }}
                  >
                    {fieldForm.conditionalLogic ? "Remove Logic" : "Add Logic"}
                  </Button>
                </div>

                {fieldForm.conditionalLogic && (
                  <div className="space-y-3 pt-3 border-t border-gray-700">
                    <Select
                      label="Action"
                      selectedKeys={[fieldForm.conditionalLogic.show ? "show" : "hide"]}
                      onChange={(e) =>
                        setFieldForm({
                          ...fieldForm,
                          conditionalLogic: {
                            ...fieldForm.conditionalLogic!,
                            show: e.target.value === "show",
                          },
                        })
                      }
                      description="Show or hide this field when conditions are met"
                    >
                      <SelectItem key="show" value="show">Show field</SelectItem>
                      <SelectItem key="hide" value="hide">Hide field</SelectItem>
                    </Select>

                    {fieldForm.conditionalLogic.conditions.map((condition, condIndex) => (
                      <div key={condIndex} className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-400">
                            Condition {condIndex + 1}
                          </span>
                          {fieldForm.conditionalLogic!.conditions.length > 1 && (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="danger"
                              onPress={() => {
                                const newConditions = fieldForm.conditionalLogic!.conditions.filter(
                                  (_, i) => i !== condIndex
                                );
                                setFieldForm({
                                  ...fieldForm,
                                  conditionalLogic: {
                                    ...fieldForm.conditionalLogic!,
                                    conditions: newConditions,
                                  },
                                });
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Select
                            label="Field"
                            placeholder="Select field"
                            selectedKeys={condition.field ? [condition.field] : []}
                            onChange={(e) => {
                              const newConditions = [...fieldForm.conditionalLogic!.conditions];
                              newConditions[condIndex] = {
                                ...newConditions[condIndex],
                                field: e.target.value,
                              };
                              setFieldForm({
                                ...fieldForm,
                                conditionalLogic: {
                                  ...fieldForm.conditionalLogic!,
                                  conditions: newConditions,
                                },
                              });
                            }}
                          >
                            {formConfig?.fields
                              .filter((f) => f.fieldName !== fieldForm.fieldName)
                              .map((f) => (
                                <SelectItem key={f.fieldName} value={f.fieldName}>
                                  {f.label}
                                </SelectItem>
                              )) || []}
                          </Select>

                          <Select
                            label="Operator"
                            selectedKeys={[condition.operator]}
                            onChange={(e) => {
                              const newConditions = [...fieldForm.conditionalLogic!.conditions];
                              newConditions[condIndex] = {
                                ...newConditions[condIndex],
                                operator: e.target.value as any,
                              };
                              setFieldForm({
                                ...fieldForm,
                                conditionalLogic: {
                                  ...fieldForm.conditionalLogic!,
                                  conditions: newConditions,
                                },
                              });
                            }}
                          >
                            <SelectItem key="equals" value="equals">Equals</SelectItem>
                            <SelectItem key="not_equals" value="not_equals">Not Equals</SelectItem>
                            <SelectItem key="contains" value="contains">Contains</SelectItem>
                            <SelectItem key="greater_than" value="greater_than">Greater Than</SelectItem>
                            <SelectItem key="less_than" value="less_than">Less Than</SelectItem>
                            <SelectItem key="is_empty" value="is_empty">Is Empty</SelectItem>
                            <SelectItem key="is_not_empty" value="is_not_empty">Is Not Empty</SelectItem>
                          </Select>

                          <Input
                            label="Value"
                            placeholder="Comparison value"
                            value={condition.value}
                            onChange={(e) => {
                              const newConditions = [...fieldForm.conditionalLogic!.conditions];
                              newConditions[condIndex] = {
                                ...newConditions[condIndex],
                                value: e.target.value,
                              };
                              setFieldForm({
                                ...fieldForm,
                                conditionalLogic: {
                                  ...fieldForm.conditionalLogic!,
                                  conditions: newConditions,
                                },
                              });
                            }}
                            isDisabled={
                              condition.operator === "is_empty" ||
                              condition.operator === "is_not_empty"
                            }
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Plus size={14} />}
                        onPress={() => {
                          setFieldForm({
                            ...fieldForm,
                            conditionalLogic: {
                              ...fieldForm.conditionalLogic!,
                              conditions: [
                                ...fieldForm.conditionalLogic!.conditions,
                                { field: "", operator: "equals", value: "" },
                              ],
                            },
                          });
                        }}
                      >
                        Add Condition
                      </Button>

                      {fieldForm.conditionalLogic.conditions.length > 1 && (
                        <Select
                          label="Combine with"
                          className="max-w-xs"
                          selectedKeys={[fieldForm.conditionalLogic.operator]}
                          onChange={(e) =>
                            setFieldForm({
                              ...fieldForm,
                              conditionalLogic: {
                                ...fieldForm.conditionalLogic!,
                                operator: e.target.value as "AND" | "OR",
                              },
                            })
                          }
                        >
                          <SelectItem key="AND" value="AND">AND (all must match)</SelectItem>
                          <SelectItem key="OR" value="OR">OR (any must match)</SelectItem>
                        </Select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Checkbox
                isSelected={fieldForm.required}
                onValueChange={(checked) =>
                  setFieldForm({ ...fieldForm, required: checked })
                }
              >
                Required Field
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={() => setShowFieldModal(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={saveField}>
                {editingField ? "Update Field" : "Add Field"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
