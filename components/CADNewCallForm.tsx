"use client";

import { Card, CardBody, CardHeader, Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";
import { Plus, MapPin, Phone, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { useSession } from "next-auth/react";

const CALL_TYPES = {
  POLICE: [
    "TRAFFIC_STOP",
    "SUSPICIOUS_ACTIVITY",
    "THEFT",
    "ROBBERY",
    "ASSAULT",
    "DOMESTIC",
    "SHOTS_FIRED",
    "PURSUIT",
    "WARRANT_SERVICE",
    "WELFARE_CHECK",
    "OTHER"
  ],
  FIRE: [
    "STRUCTURE_FIRE",
    "VEHICLE_FIRE",
    "WILDFIRE",
    "SMOKE_INVESTIGATION",
    "HAZMAT",
    "OTHER"
  ],
  EMS: [
    "MEDICAL_EMERGENCY",
    "VEHICLE_ACCIDENT",
    "OVERDOSE",
    "CARDIAC_ARREST",
    "TRAUMA",
    "OTHER"
  ],
  SHARED: [
    "MUTUAL_AID",
    "OTHER"
  ]
};

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface CADNewCallFormProps {
  onCallCreated?: () => void;
}

export function CADNewCallForm({ onCallCreated }: CADNewCallFormProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "",
    priority: "MEDIUM",
    location: "",
    postal: "",
    description: "",
    caller: "",
    callerPhone: "",
  });

  const allCallTypes = [
    ...CALL_TYPES.POLICE,
    ...CALL_TYPES.FIRE,
    ...CALL_TYPES.EMS,
    "MUTUAL_AID",
    "OTHER"
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

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
      const response = await fetch("/api/cad/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdById: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create call");
      }

      const data = await response.json();
      
      toast.success(`Call ${data.call.callNumber} created successfully`);
      
      // Reset form
      setFormData({
        type: "",
        priority: "MEDIUM",
        location: "",
        postal: "",
        description: "",
        caller: "",
        callerPhone: "",
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
    return (
      <Button
        color="primary"
        startContent={<Plus className="w-4 h-4" />}
        onClick={() => setIsOpen(true)}
      >
        New Call
      </Button>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-800">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Create New Call</h3>
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
              {allCallTypes.map((type) => (
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
            >
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Input
              label="Location"
              placeholder="123 Main Street"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              startContent={<MapPin className="w-4 h-4 text-gray-400" />}
              isRequired
              className="col-span-3"
            />
            <Input
              label="Postal"
              placeholder="101"
              value={formData.postal}
              onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Caller Name"
              placeholder="John Doe"
              value={formData.caller}
              onChange={(e) => setFormData({ ...formData, caller: e.target.value })}
            />
            <Input
              label="Caller Phone"
              placeholder="555-0123"
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
