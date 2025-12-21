"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { toast } from "@/lib/toast";
import { useState } from "react";

interface QuickStatusUpdateProps {
  unitId: string;
  currentStatus: string;
  onUpdate?: () => void;
  size?: "sm" | "md" | "lg";
}

const UNIT_STATUSES = [
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
  onUpdate,
  size = "sm",
}: QuickStatusUpdateProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cad/units/${unitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Unit status updated");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "BUSY":
        return "warning";
      case "ENROUTE":
        return "primary";
      case "ON_SCENE":
        return "secondary";
      case "OUT_OF_SERVICE":
        return "default";
      case "PANIC":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Select
      size={size}
      selectedKeys={[currentStatus]}
      onChange={(e) => handleStatusChange(e.target.value)}
      isDisabled={loading}
      classNames={{
        trigger: "min-w-[140px]",
      }}
      color={getStatusColor(currentStatus) as any}
      variant="flat"
    >
      {UNIT_STATUSES.map((status) => (
        <SelectItem key={status} value={status}>
          {status.replace(/_/g, " ")}
        </SelectItem>
      ))}
    </Select>
  );
}
