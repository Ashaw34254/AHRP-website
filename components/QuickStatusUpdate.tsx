"use client";

import { Select, SelectItem, Chip } from "@heroui/react";
import { toast } from "@/lib/toast";
import { useState } from "react";
import { getStatusCodesByDepartment, type Department } from "@/lib/department-config";

interface QuickStatusUpdateProps {
  unitId: string;
  currentStatus: string;
  department: Department;
  onUpdate?: () => void;
  size?: "sm" | "md" | "lg";
  useDepartmentCodes?: boolean; // Use department-specific status codes
}

const GENERIC_STATUSES = [
  "AVAILABLE",
  "BUSY",
  "ENROUTE",
  "ON_SCENE",
  "OUT_OF_SERVICE",
  "PANIC",
];

export function QuickStatusUpdate({
  unitId,
  currentStatus,
  department,
  onUpdate,
  size = "sm",
  useDepartmentCodes = true,
}: QuickStatusUpdateProps) {
  const [loading, setLoading] = useState(false);

  // Get department-specific status codes or use generic
  const statusOptions = useDepartmentCodes 
    ? getStatusCodesByDepartment(department)
    : GENERIC_STATUSES.map(s => ({ code: s, label: s.replace(/_/g, " "), color: "default" }));

  const handleStatusChange = async (newStatusCode: string) => {
    if (newStatusCode === currentStatus) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cad/units/${unitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          statusCode: newStatusCode,
          status: convertStatusCodeToGeneric(newStatusCode), // Also update generic status
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(`Unit status: ${newStatusCode}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Convert department status code to generic status for compatibility
  const convertStatusCodeToGeneric = (code: string): string => {
    if (code.includes("AVAILABLE") || code.includes("10-8") || code.includes("10-98")) return "AVAILABLE";
    if (code.includes("SCENE") || code.includes("10-23") || code.includes("10-97")) return "ON_SCENE";
    if (code.includes("RESPONDING") || code.includes("EN_ROUTE") || code.includes("DISPATCHED")) return "ENROUTE";
    if (code.includes("OUT_OF_SERVICE") || code.includes("10-7")) return "OUT_OF_SERVICE";
    if (code.includes("BUSY") || code.includes("10-6") || code.includes("PATIENT_CONTACT") || code.includes("TRANSPORTING")) return "BUSY";
    return "BUSY";
  };

  const getStatusColor = (statusCode: string) => {
    const status = statusOptions.find(s => s.code === statusCode);
    return status?.color || "default";
  };

  return (
    <Select
      size={size}
      selectedKeys={[currentStatus]}
      onChange={(e) => handleStatusChange(e.target.value)}
      isDisabled={loading}
      classNames={{
        trigger: "min-w-[180px]",
      }}
      color={getStatusColor(currentStatus) as any}
      variant="flat"
      renderValue={(items) => {
        const item = items[0];
        const statusData = statusOptions.find(s => s.code === item.key);
        return (
          <div className="flex items-center gap-2">
            <Chip size="sm" color={statusData?.color as any} variant="dot">
              {statusData?.label || item.textValue}
            </Chip>
          </div>
        );
      }}
    >
      {statusOptions.map((status) => (
        <SelectItem key={status.code} textValue={status.label}>
          <div className="flex items-center gap-2">
            <Chip size="sm" color={status.color as any} variant="dot">
              {status.code}
            </Chip>
            <span>{status.label}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}
