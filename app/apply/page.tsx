"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Radio,
  RadioGroup,
  CheckboxGroup,
  Chip,
} from "@nextui-org/react";
import { toast } from "@/lib/toast";
import { Send, FileText, Save, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type FieldType = "text" | "textarea" | "select" | "radio" | "checkbox" | "number" | "email";

interface ConditionalLogic {
  show: boolean;
  conditions: Array<{
    field: string;
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_empty" | "is_not_empty";
    value: string;
  }>;
  operator: "AND" | "OR";
}

interface FormField {
  id: string;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: string[];
  order: number;
  width: "full" | "half";
  section?: string;
  conditionalLogic?: ConditionalLogic;
}

interface FormConfig {
  name: string;
  title: string;
  description?: string;
  isActive: boolean;
  fields: FormField[];
}

export default function ApplyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams?.get("draftId");
  
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [applicationType, setApplicationType] = useState("whitelist");
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [applicationTypes, setApplicationTypes] = useState<any[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Load application types on mount
  useEffect(() => {
    loadApplicationTypes();
  }, []);

  // Load form configuration when application type changes
  useEffect(() => {
    if (applicationType) {
      loadFormConfig(applicationType);
    }
  }, [applicationType]);

  // Load draft if draftId is provided
  useEffect(() => {
    if (draftId && session?.user) {
      loadDraft(draftId);
    }
  }, [draftId, session]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!autoSaveEnabled || !session?.user || !formConfig) return;
    
    const interval = setInterval(() => {
      const hasData = Object.values(formData).some(v => 
        v && (typeof v === "string" ? v.trim() !== "" : Array.isArray(v) ? v.length > 0 : true)
      );
      
      if (hasData) {
        saveDraft(true); // silent save
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [formData, autoSaveEnabled, session, formConfig]);
  // Evaluate conditional logic for a field
  const evaluateCondition = (condition: { field: string; operator: string; value: string }): boolean => {
    const fieldValue = formData[condition.field];
    const compareValue = condition.value;
    
    switch (condition.operator) {
      case "equals":
        return String(fieldValue || "") === compareValue;
      case "not_equals":
        return String(fieldValue || "") !== compareValue;
      case "contains":
        return String(fieldValue || "").toLowerCase().includes(compareValue.toLowerCase());
      case "greater_than":
        return Number(fieldValue || 0) > Number(compareValue);
      case "less_than":
        return Number(fieldValue || 0) < Number(compareValue);
      case "is_empty":
        return !fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === "") || 
               (Array.isArray(fieldValue) && fieldValue.length === 0);
      case "is_not_empty":
        return !!fieldValue && (typeof fieldValue !== "string" || fieldValue.trim() !== "") &&
               (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return true;
    }
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditionalLogic) return true;
    
    const { show, conditions, operator } = field.conditionalLogic;
    
    if (conditions.length === 0) return true;
    
    const results = conditions.map(evaluateCondition);
    const conditionsMet = operator === "AND" 
      ? results.every(r => r) 
      : results.some(r => r);
    
    // If show=true, show field when conditions are met
    // If show=false, hide field when conditions are met (show when NOT met)
    return show ? conditionsMet : !conditionsMet;
  };
  const loadDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      
      if (data.success && data.application) {
        setFormData(data.application.formData);
        setApplicationType(data.application.applicationType);
        setCurrentDraftId(id);
        setLastSaved(new Date(data.application.lastSavedAt));
        toast.success("Draft loaded successfully");
      }
    } catch (error) {
      console.error("Error loading draft:", error);
      toast.error("Failed to load draft");
    }
  };

  const saveDraft = async (silent = false) => {
    if (!session?.user) {
      toast.error("Please sign in to save drafts");
      return;
    }
    
    if (!formConfig) return;
    
    setSavingDraft(true);
    try {
      const url = currentDraftId ? "/api/applications" : "/api/applications";
      const method = currentDraftId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentDraftId,
          applicationType,
          formData,
          isDraft: true,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (!currentDraftId) {
          setCurrentDraftId(data.applicationId);
        }
        setLastSaved(new Date());
        if (!silent) {
          toast.success("Draft saved successfully");
        }
      } else {
        if (!silent) {
          toast.error(data.message || "Failed to save draft");
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      if (!silent) {
        toast.error("Failed to save draft");
      }
    } finally {
      setSavingDraft(false);
    }
  };

  const loadApplicationTypes = async () => {
    try {
      const res = await fetch("/api/admin/application-types");
      const data = await res.json();
      
      if (data.success) {
        setApplicationTypes(data.types.filter((t: any) => t.isActive));
        if (data.types.length > 0 && !applicationType) {
          setApplicationType(data.types[0].name);
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
        // Initialize form data with empty values
        const initialData: Record<string, any> = {};
        data.config.fields.forEach((field: FormField) => {
          if (field.fieldType === "checkbox") {
            initialData[field.fieldName] = [];
          } else {
            initialData[field.fieldName] = "";
          }
        });
        setFormData(initialData);
      } else {
        toast.error("Form configuration not found. Please contact an administrator.");
        setFormConfig(null);
      }
    } catch (error) {
      console.error("Error loading form config:", error);
      toast.error("Failed to load application form");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formConfig) return;

    // Validate required fields
    const missingFields: string[] = [];
    formConfig.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.fieldName];
        if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === "") {
          missingFields.push(field.label);
        }
      }
    });

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      const url = currentDraftId ? "/api/applications" : "/api/applications";
      const method = currentDraftId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentDraftId,
          applicationType,
          formData,
          isDraft: false, // Mark as submitted
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Application submitted successfully!");
        // Clear the draft after successful submission
        setCurrentDraftId(null);
        if (session) {
          router.push("/dashboard/applications");
        } else {
          router.push("/apply?success=true");
        }
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      description: field.helpText,
      isRequired: field.required,
      classNames: {
        inputWrapper: "bg-gray-800 border-gray-700",
        trigger: "bg-gray-800 border-gray-700",
      },
    };

    switch (field.fieldType) {
      case "text":
      case "email":
        return (
          <Input
            {...commonProps}
            type={field.fieldType}
            value={formData[field.fieldName] || ""}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            minLength={field.minLength}
            maxLength={field.maxLength}
            pattern={field.pattern}
          />
        );

      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            value={formData[field.fieldName] || ""}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            min={field.minLength}
            max={field.maxLength}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            value={formData[field.fieldName] || ""}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
            minRows={3}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            selectedKeys={formData[field.fieldName] ? [formData[field.fieldName]] : []}
            onChange={(e) => updateField(field.fieldName, e.target.value)}
          >
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        );

      case "radio":
        return (
          <RadioGroup
            label={field.label}
            description={field.helpText}
            isRequired={field.required}
            value={formData[field.fieldName] || ""}
            onValueChange={(value) => updateField(field.fieldName, value)}
          >
            {field.options?.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <CheckboxGroup
            label={field.label}
            description={field.helpText}
            isRequired={field.required}
            value={formData[field.fieldName] || []}
            onValueChange={(values) => updateField(field.fieldName, values)}
          >
            {field.options?.map((option) => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </CheckboxGroup>
        );

      default:
        return null;
    }
  };

  // Group fields by section
  // Group fields by section and filter by conditional logic
  const groupedFields = formConfig?.fields
    .filter(shouldShowField) // Only show fields that pass conditional logic
    .reduce((acc, field) => {
      const section = field.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(field);
      return acc;
    }, {} as Record<string, FormField[]>) || {};

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 text-transparent bg-clip-text mb-4">
              Join Aurora Horizon RP
            </h1>
            <p className="text-gray-400 text-lg">
              Start your journey with one of the best FiveM roleplay communities
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Draft Indicator */}
            {session?.user && (
              <div className="flex items-center justify-between gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {currentDraftId && (
                    <Chip
                      startContent={<Clock size={14} />}
                      color="warning"
                      variant="flat"
                      size="sm"
                    >
                      Draft
                    </Chip>
                  )}
                  {lastSaved && (
                    <span className="text-sm text-gray-400">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  <Checkbox
                    isSelected={autoSaveEnabled}
                    onValueChange={setAutoSaveEnabled}
                    size="sm"
                  >
                    <span className="text-sm text-gray-400">Auto-save</span>
                  </Checkbox>
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Save size={16} />}
                  onPress={() => saveDraft()}
                  isLoading={savingDraft}
                  isDisabled={!formConfig}
                >
                  Save Draft
                </Button>
              </div>
            )}

            <Card className="bg-gray-900/50 border border-gray-800">
              <CardHeader className="flex items-center gap-2 border-b border-gray-800">
                <FileText size={20} className="text-purple-400" />
                <h2 className="text-xl font-semibold">Application Type</h2>
              </CardHeader>
              <CardBody>
                <Select
                  label="Select Application Type"
                  selectedKeys={[applicationType]}
                  onChange={(e) => setApplicationType(e.target.value)}
                  classNames={{
                    trigger: "bg-gray-800 border-gray-700",
                  }}
                  isDisabled={!!currentDraftId} // Disable type change if editing draft
                >
                  {applicationTypes.map((type) => (
                    <SelectItem key={type.name} value={type.name}>
                      {type.title}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>

            {loading ? (
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody>
                  <p className="text-center text-gray-400">Loading form...</p>
                </CardBody>
              </Card>
            ) : formConfig ? (
              <>
                {Object.entries(groupedFields).map(([section, fields]) => (
                  <Card key={section} className="bg-gray-900/50 border border-gray-800">
                    <CardHeader className="flex items-center gap-2 border-b border-gray-800">
                      <FileText size={20} className="text-purple-400" />
                      <h2 className="text-xl font-semibold">{section}</h2>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field) => (
                          <div
                            key={field.id}
                            className={field.width === "full" ? "md:col-span-2" : ""}
                          >
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                ))}

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    startContent={<Send size={20} />}
                    isLoading={submitting}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 font-semibold px-12"
                  >
                    Submit Application
                  </Button>
                </div>
              </>
            ) : (
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody>
                  <p className="text-center text-gray-400">
                    Application form is not available. Please contact an administrator.
                  </p>
                </CardBody>
              </Card>
            )}
          </motion.form>
        </div>
      </div>
      <Footer />
    </>
  );
}
