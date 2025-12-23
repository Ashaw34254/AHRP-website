"use client";

import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { Plus, MapPin, Phone, AlertTriangle, Flame, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { useSession } from "next-auth/react";
import { VIC_CALL_TYPES } from "@/lib/victoria-police-config";
import { 
  DEPARTMENT_PRIORITIES, 
  getUnitTypesByDepartment, 
  getSuggestedUnits, 
  shouldNotifyDepartments,
  getZoneByPostcode,
  type Department
} from "@/lib/department-config";

const CALL_TYPES = VIC_CALL_TYPES;

interface CADNewCallFormProps {
  onCallCreated?: () => void;
  department?: Department;
}

export function CADNewCallForm({ onCallCreated, department = "POLICE" }: CADNewCallFormProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get department-specific priorities
  const departmentPriorities = DEPARTMENT_PRIORITIES[department];
  const defaultPriority = departmentPriorities[1]?.value || "MEDIUM"; // Use second priority as default
  
  const [formData, setFormData] = useState({
    type: "",
    priority: defaultPriority,
    location: "",
    postal: "",
    description: "",
    caller: "",
    callerPhone: "",
    // Department-specific fields
    fireSize: "", // FIRE only
    hazmat: false, // FIRE only
    patientAge: "", // EMS only
    patientGender: "", // EMS only
    consciousness: "", // EMS only
  });

  // Get call types based on department
  const departmentCallTypes = CALL_TYPES[department] || [];

  // Department-specific configuration
  const getDepartmentConfig = () => {
    switch (department) {
      case "POLICE":
        return {
          icon: AlertTriangle,
          color: "primary",
          title: "Create Police Call",
          buttonText: "New Police Call",
        };
      case "FIRE":
        return {
          icon: Flame,
          color: "danger",
          title: "Create Fire Call",
          buttonText: "New Fire Call",
        };
      case "EMS":
        return {
          icon: Heart,
          color: "success",
          title: "Create EMS Call",
          buttonText: "New EMS Call",
        };
      default:
        return {
          icon: AlertTriangle,
          color: "primary",
          title: "Create New Call",
          buttonText: "New Call",
        };
    }
  };

  const config = getDepartmentConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast.error("You must be logged in to create a call");
      return;
    }

    if (!formData.type || !formData.location || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Get suggested units and response time target
      const suggestedUnits = getSuggestedUnits(formData.type);
      const responseTarget = departmentPriorities.find(p => p.value === formData.priority)?.responseTime || 15;
      const zone = formData.postal ? getZoneByPostcode(formData.postal) : null;
      const notifyDepts = shouldNotifyDepartments(formData.type);
      
      const response = await fetch("/api/cad/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          priority: formData.priority,
          location: formData.location,
          postal: formData.postal,
          description: formData.description,
          caller: formData.caller,
          callerPhone: formData.callerPhone,
          department: department,
          zone: zone?.id,
          responseTimeTarget: responseTarget,
          requiresMutualAid: notifyDepts.length > 0,
          notifiedDepartments: notifyDepts.length > 0 ? JSON.stringify(notifyDepts) : null,
          // FIRE-specific fields
          ...(department === "FIRE" && {
            fireSize: formData.fireSize || null,
            hazmat: formData.hazmat,
          }),
          // EMS-specific fields
          ...(department === "EMS" && {
            patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
            patientGender: formData.patientGender || null,
            consciousness: formData.consciousness || null,
          }),
          createdById: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create call");
      }

      const data = await response.json();
      
      toast.success(`Call ${data.call.callNumber} created successfully`);
      
      // Notify if mutual aid is required
      if (notifyDepts.length > 0) {
        toast.info(`Mutual aid request sent to: ${notifyDepts.join(", ")}`, {
          duration: 5000,
        });
      }
      
      // Suggest units
      if (suggestedUnits.length > 0) {
        toast.info(`Suggested units: ${suggestedUnits.join(", ")}`, {
          duration: 4000,
        });
      }
      
      // Reset form
      setFormData({
        type: "",
        priority: defaultPriority,
        location: "",
        postal: "",
        description: "",
        caller: "",
        callerPhone: "",
        fireSize: "",
        hazmat: false,
        patientAge: "",
        patientGender: "",
        consciousness: "",
      });
      
      setIsOpen(false);
      
      if (onCallCreated) {
        onCallCreated();
      }
    } catch (error) {
      console.error("Error creating call:", error);
      toast.error("Failed to create call");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    const Icon = config.icon;
    return (
      <Button
        color={config.color as any}
        startContent={<Icon className="w-4 h-4" />}
        onClick={() => setIsOpen(true)}
      >
        {config.buttonText}
      </Button>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{config.title}</h3>
        <Button
          size="sm"
          variant="light"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Call Type"
              placeholder="Select type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              isRequired
            >
              {departmentCallTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Priority"
              placeholder="Select priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              isRequired
              description={`Target response: ${departmentPriorities.find(p => p.value === formData.priority)?.responseTime || 15} min`}
            >
              {departmentPriorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Input
              label="Location"
              placeholder="123 Collins Street, Melbourne"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              startContent={<MapPin className="w-4 h-4 text-gray-400" />}
              isRequired
              className="col-span-3"
            />
            <Input
              label="Postcode"
              placeholder="3000"
              value={formData.postal}
              onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
              maxLength={4}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Detailed description of the incident..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={3}
            isRequired
          />

          {/* FIRE Department Specific Fields */}
          {department === "FIRE" && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-red-900/10 border border-red-700/30 rounded-lg">
              <Select
                label="Fire Size"
                placeholder="Select size"
                value={formData.fireSize}
                onChange={(e) => setFormData({ ...formData, fireSize: e.target.value })}
              >
                <SelectItem key="SMALL" value="SMALL">Small (Single Room)</SelectItem>
                <SelectItem key="MEDIUM" value="MEDIUM">Medium (Multiple Rooms)</SelectItem>
                <SelectItem key="LARGE" value="LARGE">Large (Entire Structure)</SelectItem>
                <SelectItem key="MAJOR" value="MAJOR">Major (Multiple Structures)</SelectItem>
              </Select>
              <Select
                label="HAZMAT Involved"
                placeholder="Select"
                value={formData.hazmat ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, hazmat: e.target.value === "true" })}
              >
                <SelectItem key="false" value="false">No</SelectItem>
                <SelectItem key="true" value="true">Yes - HAZMAT Response Required</SelectItem>
              </Select>
            </div>
          )}

          {/* EMS Department Specific Fields */}
          {department === "EMS" && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-green-900/10 border border-green-700/30 rounded-lg">
              <Input
                label="Patient Age"
                placeholder="Age"
                type="number"
                value={formData.patientAge}
                onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
              />
              <Select
                label="Patient Gender"
                placeholder="Select"
                value={formData.patientGender}
                onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
              >
                <SelectItem key="MALE" value="MALE">Male</SelectItem>
                <SelectItem key="FEMALE" value="FEMALE">Female</SelectItem>
                <SelectItem key="OTHER" value="OTHER">Other</SelectItem>
                <SelectItem key="UNKNOWN" value="UNKNOWN">Unknown</SelectItem>
              </Select>
              <Select
                label="Consciousness Level"
                placeholder="Select"
                value={formData.consciousness}
                onChange={(e) => setFormData({ ...formData, consciousness: e.target.value })}
              >
                <SelectItem key="ALERT" value="ALERT">Alert & Responsive</SelectItem>
                <SelectItem key="VERBAL" value="VERBAL">Responds to Verbal</SelectItem>
                <SelectItem key="PAIN" value="PAIN">Responds to Pain</SelectItem>
                <SelectItem key="UNRESPONSIVE" value="UNRESPONSIVE">Unresponsive</SelectItem>
              </Select>
            </div>
          )}

          {/* POLICE Department Specific Fields */}
          {department === "POLICE" && (
            <div className="p-4 bg-blue-900/10 border border-blue-700/30 rounded-lg">
              <p className="text-sm text-gray-400">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Standard police response protocols apply. Use description field for suspect descriptions, vehicle details, or weapon information.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Caller Name"
              placeholder="John Doe"
              value={formData.caller}
              onChange={(e) => setFormData({ ...formData, caller: e.target.value })}
            />
            <Input
              label="Caller Phone"
              placeholder="0412 345 678"
              value={formData.callerPhone}
              onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })}
              startContent={<Phone className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="flat"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
            >
              Create Call
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
