"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
} from "@heroui/react";
import { toast } from "@/lib/toast";
import { Send, FileText } from "lucide-react";
import { motion } from "framer-motion";

type FieldType = "text" | "textarea" | "select" | "radio" | "checkbox" | "number" | "email";

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
}

interface FormConfig {
  name: string;
  title: string;
  description?: string;
  isActive: boolean;
  fields: FormField[];
}

interface DynamicApplicationFormProps {
  initialType?: string;
}

export default function DynamicApplicationForm({ initialType = "whitelist" }: DynamicApplicationFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [applicationType, setApplicationType] = useState(initialType);
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Load form configuration when application type changes
  useEffect(() => {
    loadFormConfig(applicationType);
  }, [applicationType]);

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
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationType,
          formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Application submitted successfully!");
        if (session) {
          router.push("/dashboard");
        } else {
          // Reload to show success message for non-logged-in users
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
              <SelectItem key={option}>
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
  const groupedFields = formConfig?.fields.reduce((acc, field) => {
    const section = field.section || "General";
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, FormField[]>) || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Application Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Application Type */}
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
              >
                <SelectItem key="whitelist">
                  Whitelist Application
                </SelectItem>
                <SelectItem key="police">
                  Police Department
                </SelectItem>
                <SelectItem key="ems">
                  EMS/Medical
                </SelectItem>
                <SelectItem key="fire">
                  Fire Department
                </SelectItem>
              </Select>
            </CardBody>
          </Card>

          {/* Dynamic Form Fields */}
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

              {/* Submit Button */}
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
  );
}
