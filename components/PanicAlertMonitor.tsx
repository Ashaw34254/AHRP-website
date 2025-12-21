"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
} from "@nextui-org/react";
import { AlertTriangle, MapPin, Clock, Radio, X, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface PanicAlert {
  id: string;
  unitCallsign: string;
  department: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  reason: string | null;
  status: string;
  createdAt: string;
}

interface PanicAlertMonitorProps {
  onClose?: () => void;
}

export function PanicAlertMonitor({ onClose }: PanicAlertMonitorProps) {
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Check every 5 seconds for panic alerts
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/cad/panic");
      if (!response.ok) throw new Error("Failed to fetch panic alerts");
      const data = await response.json();
      
      // Play alert sound if new panic (check if alerts increased)
      if (data.alerts.length > alerts.length) {
        playAlertSound();
      }
      
      setAlerts(data.alerts);
    } catch (error) {
      console.error("Failed to fetch panic alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const playAlertSound = () => {
    // Create audio context for alert sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // High-pitched alert
    gainNode.gain.value = 0.3;
    oscillator.type = "sine";

    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  };

  const handleRespond = async (alertId: string) => {
    try {
      const response = await fetch(`/api/cad/panic/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESPONDED" }),
      });

      if (!response.ok) throw new Error("Failed to respond to panic");

      toast.success("Marked as responded");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to respond to panic");
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      const response = await fetch(`/api/cad/panic/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      });

      if (!response.ok) throw new Error("Failed to resolve panic");

      toast.success("Panic alert resolved");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to resolve panic");
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "POLICE":
        return "primary";
      case "FIRE":
        return "danger";
      case "EMS":
        return "warning";
      default:
        return "default";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className="mb-2 border-2 border-red-600 bg-red-950/95 shadow-xl shadow-red-500/50 animate-pulse"
        >
          <CardBody className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                  <span className="font-bold text-red-400 text-lg">PANIC ALERT</span>
                  <Chip size="sm" color="danger" variant="solid">
                    EMERGENCY
                  </Chip>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-white">{alert.unitCallsign}</span>
                    <Chip
                      size="sm"
                      color={getDepartmentColor(alert.department) as any}
                      variant="flat"
                    >
                      {alert.department}
                    </Chip>
                  </div>

                  {alert.location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </div>
                  )}

                  {alert.reason && (
                    <div className="text-gray-300 pl-6">
                      {alert.reason}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(alert.createdAt)}</span>
                  </div>

                  <Chip
                    size="sm"
                    color={alert.status === "ACTIVE" ? "danger" : "success"}
                    variant="flat"
                  >
                    {alert.status}
                  </Chip>
                </div>

                {alert.status === "ACTIVE" && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      color="warning"
                      variant="flat"
                      onClick={() => handleRespond(alert.id)}
                      startContent={<Radio className="w-4 h-4" />}
                    >
                      Respond
                    </Button>
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      onClick={() => handleResolve(alert.id)}
                      startContent={<CheckCircle className="w-4 h-4" />}
                    >
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
