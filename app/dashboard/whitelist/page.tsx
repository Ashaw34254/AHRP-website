"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Chip, Input, Button, Divider, Skeleton } from "@nextui-org/react";
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, Save } from "lucide-react";
import { toast } from "@/lib/toast";

interface WhitelistEntry {
  id: string;
  userId: string;
  status: string;
  steamId: string | null;
  discordId: string | null;
  priority: number;
  approvedAt: string | null;
  approvedBy: string | null;
  expiresAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WhitelistPage() {
  const [whitelist, setWhitelist] = useState<WhitelistEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [steamId, setSteamId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWhitelist();
  }, []);

  const loadWhitelist = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/whitelist");
      const data = await res.json();
      
      if (data.success) {
        setWhitelist(data.whitelist);
        setSteamId(data.whitelist?.steamId || "");
      } else {
        toast.error("Failed to load whitelist status");
      }
    } catch (error) {
      console.error("Error loading whitelist:", error);
      toast.error("Failed to load whitelist status");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!steamId || !/^\d{17}$/.test(steamId)) {
      toast.error("Please enter a valid Steam ID (17 digits)");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/whitelist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Steam ID updated successfully!");
        loadWhitelist();
      } else {
        toast.error(data.message || "Failed to update Steam ID");
      }
    } catch (error) {
      console.error("Error updating Steam ID:", error);
      toast.error("Error updating Steam ID");
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
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800">
          <CardHeader className="border-b border-gray-800 flex items-center gap-3">
            <Shield className="w-6 h-6 text-indigo-400" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Whitelist Status</h2>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-32 rounded-full" />
            ) : whitelist ? (
              getStatusChip(whitelist.status)
            ) : (
              <Chip color="default" variant="flat" size="lg">
                Not Submitted
              </Chip>
            )}
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
              </>
            ) : !whitelist ? (
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-300 font-semibold mb-2">No Whitelist Entry</p>
                <p className="text-gray-400 text-sm mb-4">
                  Submit your Steam ID below to request server access
                </p>
              </div>
            ) : (
              <>
                {whitelist.status === "APPROVED" && (
                  <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-300 font-semibold">Approved for Server Access</p>
                        <p className="text-sm text-gray-400 mt-1">
                          You can now connect to the Aurora Horizon FiveM server.
                        </p>
                        {whitelist.approvedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Approved on {new Date(whitelist.approvedAt).toLocaleDateString()}
                            {whitelist.approvedBy && ` by ${whitelist.approvedBy}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {whitelist.status === "PENDING" && (
                  <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-300 font-semibold">Pending Admin Review</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Your whitelist request is being reviewed. You'll be notified once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {whitelist.status === "DENIED" && (
                  <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 font-semibold">Whitelist Request Denied</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Your whitelist request was denied. Please contact staff for more information.
                        </p>
                        {whitelist.notes && (
                          <p className="text-sm text-gray-400 mt-2 italic">
                            Reason: {whitelist.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {whitelist.status === "BANNED" && (
                  <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 font-semibold">Access Banned</p>
                        <p className="text-sm text-gray-400 mt-1">
                          You have been banned from the server. Contact staff to appeal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Divider />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Priority Level</p>
                    <p className="text-white font-semibold">{whitelist.priority || 0}</p>
                  </div>
                  {whitelist.expiresAt && (
                    <div>
                      <p className="text-gray-400">Expires</p>
                      <p className="text-white font-semibold">
                        {new Date(whitelist.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Steam ID Configuration */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Steam ID Configuration</h3>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-4">
                Enter your Steam ID to link your FiveM account. This is required for server access.
              </p>
              <div className="flex gap-3">
                <Input
                  label="Steam ID (SteamID64)"
                  placeholder="76561198012345678"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  description="Find your Steam ID at steamid.io"
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                  className="flex-1"
                />
                <Button
                  color="primary"
                  startContent={<Save className="w-4 h-4" />}
                  onPress={handleSave}
                  isLoading={saving}
                  className="self-end"
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>How to find your Steam ID:</strong>
              </p>
              <ol className="text-sm text-gray-400 mt-2 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://steamid.io" target="_blank" rel="noopener" className="text-blue-400 hover:underline">steamid.io</a></li>
                <li>Enter your Steam profile URL or username</li>
                <li>Copy your SteamID64 (17-digit number)</li>
                <li>Paste it above and save</li>
              </ol>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
