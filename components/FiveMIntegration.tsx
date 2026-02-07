"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
} from "@heroui/react";
import { Server, Radio, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "@/lib/toast";

interface FiveMStatus {
  connected: boolean;
  serverName: string;
  playerCount: number;
  maxPlayers: number;
  resources: number;
  lastSync: Date | null;
}

export function FiveMIntegration() {
  const [status, setStatus] = useState<FiveMStatus>({
    connected: false,
    serverName: "Aurora Horizon RP",
    playerCount: 0,
    maxPlayers: 64,
    resources: 0,
    lastSync: null,
  });
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    serverIp: "",
    apiKey: "",
    syncInterval: "30",
  });

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/fivem/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching FiveM status:", error);
    }
  }

  async function handleSync() {
    setLoading(true);
    try {
      const res = await fetch("/api/fivem/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      toast.success("Sync initiated successfully");
      fetchStatus();
    } catch (error) {
      console.error("Error syncing with FiveM:", error);
      toast.error("Failed to sync with FiveM server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-950/80 border-2 border-indigo-800">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white">FiveM Integration</h2>
            </div>
            <Chip
              color={status.connected ? "success" : "danger"}
              variant="flat"
              startContent={status.connected ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            >
              {status.connected ? "Connected" : "Disconnected"}
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Server Name</p>
              <p className="text-lg font-semibold text-white">{status.serverName}</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Players Online</p>
              <p className="text-lg font-semibold text-white">
                {status.playerCount} / {status.maxPlayers}
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Active Resources</p>
              <p className="text-lg font-semibold text-white">{status.resources}</p>
            </div>
          </div>

          {status.lastSync && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last synced: {new Date(status.lastSync).toLocaleString()}</span>
            </div>
          )}

          <Button
            color="primary"
            startContent={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
            onPress={handleSync}
            isLoading={loading}
          >
            Sync Now
          </Button>
        </CardBody>
      </Card>

      {/* Configuration */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Connection Settings</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Server IP"
            placeholder="127.0.0.1:30120"
            value={config.serverIp}
            onChange={(e) => setConfig({ ...config, serverIp: e.target.value })}
          />
          <Input
            label="API Key"
            type="password"
            placeholder="Enter FiveM API key..."
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          />
          <Input
            label="Sync Interval (seconds)"
            type="number"
            value={config.syncInterval}
            onChange={(e) => setConfig({ ...config, syncInterval: e.target.value })}
          />
          <Button color="success" variant="flat">
            Save Configuration
          </Button>
        </CardBody>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-800/50">
        <CardBody className="text-center py-8">
          <Server className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Full Integration Coming Soon</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time player tracking, vehicle synchronization, and advanced resource management
            features are currently in development. This interface provides basic connection
            monitoring and manual sync capabilities.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
