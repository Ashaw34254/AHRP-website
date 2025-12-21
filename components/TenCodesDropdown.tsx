"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { toast } from "@/lib/toast";
import { Radio } from "lucide-react";

interface StatusCode {
  id: string;
  code: string;
  meaning: string;
  department: string | null;
  category: string | null;
}

interface TenCodesDropdownProps {
  unitId: string;
  unitCallsign: string;
  currentStatus: string;
  callId?: string;
  onStatusChange?: () => void;
}

export function TenCodesDropdown({
  unitId,
  unitCallsign,
  currentStatus,
  callId,
  onStatusChange,
}: TenCodesDropdownProps) {
  const [codes, setCodes] = useState<StatusCode[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [notes, setNotes] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchStatusCodes();
  }, []);

  const fetchStatusCodes = async () => {
    try {
      const response = await fetch("/api/cad/status-codes");
      if (!response.ok) throw new Error("Failed to fetch status codes");
      const data = await response.json();
      setCodes(data.codes);
    } catch (error) {
      console.error("Failed to fetch status codes:", error);
    }
  };

  const handleCodeSelect = (code: string) => {
    setSelectedCode(code);
    const selectedCodeObj = codes.find((c) => c.code === code);
    
    // For emergency codes, open modal for notes
    if (selectedCodeObj?.category === "emergency") {
      onOpen();
    } else {
      submitStatusCode(code, "");
    }
  };

  const submitStatusCode = async (code: string, additionalNotes: string) => {
    try {
      const response = await fetch("/api/cad/status-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          unitCallsign,
          code,
          callId,
          notes: additionalNotes,
        }),
      });

      if (!response.ok) throw new Error("Failed to log status code");

      const codeObj = codes.find((c) => c.code === code);
      toast.success(`${code} - ${codeObj?.meaning || "Status logged"}`);

      // Update unit status based on code
      if (code === "10-8") {
        await updateUnitStatus("AVAILABLE");
      } else if (code === "10-7") {
        await updateUnitStatus("OUT_OF_SERVICE");
      } else if (code === "10-23" || code === "10-97") {
        await updateUnitStatus("ON_SCENE");
      } else if (["10-33", "10-78", "10-99"].includes(code)) {
        // Emergency codes - trigger panic
        await triggerPanic(codeObj?.meaning || "Emergency");
      }

      if (onStatusChange) onStatusChange();
      onClose();
      setNotes("");
    } catch (error) {
      toast.error("Failed to log status code");
    }
  };

  const updateUnitStatus = async (status: string) => {
    try {
      await fetch(`/api/cad/units/${unitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Failed to update unit status:", error);
    }
  };

  const triggerPanic = async (reason: string) => {
    try {
      await fetch("/api/cad/panic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          unitCallsign,
          department: "POLICE", // TODO: Get from unit
          reason,
        }),
      });
    } catch (error) {
      console.error("Failed to trigger panic:", error);
    }
  };

  const handleModalSubmit = () => {
    if (selectedCode) {
      submitStatusCode(selectedCode, notes);
    }
  };

  // Group codes by category
  const codesByCategory = codes.reduce((acc, code) => {
    const category = code.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(code);
    return acc;
  }, {} as Record<string, StatusCode[]>);

  return (
    <>
      <Select
        label="10-Code"
        placeholder="Select code..."
        size="sm"
        className="max-w-[200px]"
        startContent={<Radio className="w-4 h-4" />}
        onChange={(e) => handleCodeSelect(e.target.value)}
      >
        {Object.entries(codesByCategory).flatMap(([category, categoryCodes]) => [
          <SelectItem
            key={`category-${category}`}
            value=""
            className="font-semibold text-gray-500"
            isDisabled
          >
            {category.toUpperCase()}
          </SelectItem>,
          ...categoryCodes.map((code) => (
            <SelectItem key={code.code} value={code.code}>
              {code.code} - {code.meaning}
            </SelectItem>
          ))
        ])}
      </Select>

      {/* Emergency Code Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              <span>Emergency Code - Additional Information</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-400 mb-3">
              {codes.find((c) => c.code === selectedCode)?.meaning}
            </p>
            <Textarea
              label="Additional Notes"
              placeholder="Provide any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleModalSubmit}>
              Submit Code
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
