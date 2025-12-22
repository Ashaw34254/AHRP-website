"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Chip, Input, Button, Divider } from "@nextui-org/react";
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

const mockWhitelist = {
  status: "APPROVED",
  steamId: "76561198012345678",
  priority: 5,
  approvedAt: "2025-12-15T10:00:00Z",
  approvedBy: "Admin Smith",
  kickHistory: [],
  warnHistory: [],
};

export default function WhitelistPage() {
  const [steamId, setSteamId] = useState(mockWhitelist.steamId || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!steamId) {
      toast("Please enter a Steam ID", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/whitelist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamId }),
      });

      if (response.ok) {
        toast("Steam ID updated successfully!", "success");
      } else {
        toast("Failed to update Steam ID", "error");
      }
    } catch (error) {
      toast("Error updating Steam ID", "error");
    } finally {
      setSaving(false);
    }
  };

  const getStatusChip = (status: string) => {
    const configs: Record<string, { color: any; icon: any; label: string }> = {
      APPROVED: { color: "success", icon: CheckCircle, label: "Approved" },
      PENDING: { color: "warning", icon: Clock, label: "Pending Review" },
      DENIED: { color: "danger", icon: XCircle, label: "Denied" },
      BANNED: { color: "danger", icon: AlertTriangle, label: "Banned" },
    };
    const config = configs[status] || configs.PENDING;
    const Icon = config.icon;
    return (
      <Chip 
        color={config.color} 
        variant="flat" 
        startContent={<Icon className="w-4 h-4" />}
        size="lg"
      >
        {config.label}
      </Chip>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Whitelist Status
          </h1>
          <p className="text-gray-400 mt-1">Manage your FiveM server access</p>
        </div>

        {/* Status Card */}
        <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/50">
          <CardBody className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-12 h-12 text-indigo-400" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Server Access Status</h2>
                {getStatusChip(mockWhitelist.status)}
              </div>
            </div>

            {mockWhitelist.status === "APPROVED" && (
              <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-indigo-800/50">
                <div>
                  <p className="text-sm text-gray-400">Priority Level</p>
                  <p className="text-3xl font-bold text-white">{mockWhitelist.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Approved On</p>
                  <p className="text-lg font-semibold text-white">
                    {new Date(mockWhitelist.approvedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">By {mockWhitelist.approvedBy}</p>
                </div>
              </div>
            )}

            {mockWhitelist.status === "PENDING" && (
              <div className="mt-6 pt-6 border-t border-indigo-800/50">
                <p className="text-gray-300">
                  Your whitelist application is being reviewed by our admin team. 
                  You'll receive a notification once a decision has been made.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Steam Integration */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <h3 className="text-xl font-bold text-white">Steam Account</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Steam ID"
              placeholder="76561198xxxxxxxxx"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              description="Your Steam ID64 - Find it at steamidfinder.com"
            />
            <Button color="primary" onClick={handleSave} isLoading={saving}>
              Save Steam ID
            </Button>
          </CardBody>
        </Card>

        {/* Moderation History */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <h3 className="text-xl font-bold text-white">Moderation History</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Warnings</span>
                  <Chip color="success" variant="flat">0</Chip>
                </div>
                <Divider className="bg-gray-800" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Kicks</span>
                  <Chip color="success" variant="flat">0</Chip>
                </div>
                <Divider className="bg-gray-800" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Status</span>
                  <Chip color="success" variant="flat">Good Standing</Chip>
                </div>
              </div>
            </div>

            {mockWhitelist.kickHistory.length === 0 && mockWhitelist.warnHistory.length === 0 && (
              <div className="text-center py-6 mt-4">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <p className="text-gray-300">Clean record! Keep up the great work!</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
