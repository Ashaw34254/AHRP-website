"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody, 
  Button,
  Input,
  Textarea,
  Switch,
  Select,
  SelectItem,
  Divider
} from "@nextui-org/react";
import { 
  Save,
  Server,
  MessageSquare,
  Shield,
  Bell,
  Globe,
  Database
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

export default function SettingsPage() {
  const [serverName, setServerName] = useState("Aurora Horizon Roleplay");
  const [serverDescription, setServerDescription] = useState("A premium FiveM roleplay experience");
  const [maxPlayers, setMaxPlayers] = useState("64");
  const [discordWebhook, setDiscordWebhook] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [requireWhitelist, setRequireWhitelist] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Server Settings</h1>
          <p className="text-gray-400">Configure server and application settings</p>
        </div>

        {/* Server Configuration */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server Configuration
            </h3>
            <div className="space-y-4">
              <Input
                label="Server Name"
                placeholder="Enter server name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
              />
              <Textarea
                label="Server Description"
                placeholder="Enter server description"
                value={serverDescription}
                onChange={(e) => setServerDescription(e.target.value)}
                minRows={3}
              />
              <Input
                label="Max Players"
                type="number"
                placeholder="64"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
              />
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-400">Prevent non-admin access to the server</p>
                </div>
                <Switch
                  isSelected={maintenanceMode}
                  onValueChange={setMaintenanceMode}
                  color="warning"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Discord Integration */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discord Integration
            </h3>
            <div className="space-y-4">
              <Input
                label="Webhook URL"
                placeholder="https://discord.com/api/webhooks/..."
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                description="Used for sending notifications to Discord"
              />
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable Notifications</p>
                  <p className="text-sm text-gray-400">Send events to Discord webhook</p>
                </div>
                <Switch
                  isSelected={enableNotifications}
                  onValueChange={setEnableNotifications}
                  color="success"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Application Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Application Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Auto-Approve Applications</p>
                  <p className="text-sm text-gray-400">Automatically approve all new applications</p>
                </div>
                <Switch
                  isSelected={autoApprove}
                  onValueChange={setAutoApprove}
                  color="primary"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Require Whitelist</p>
                  <p className="text-sm text-gray-400">Users must be whitelisted to join</p>
                </div>
                <Switch
                  isSelected={requireWhitelist}
                  onValueChange={setRequireWhitelist}
                  color="warning"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Department Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Department Settings
            </h3>
            <div className="space-y-4">
              <Select
                label="Police Rank Structure"
                placeholder="Select rank structure"
                defaultSelectedKeys={["default"]}
              >
                <SelectItem key="default" value="default">
                  Default (Cadet, Officer, Senior Officer, Sergeant, Lieutenant, Captain, Chief)
                </SelectItem>
                <SelectItem key="custom" value="custom">
                  Custom Ranks
                </SelectItem>
              </Select>
              <Select
                label="EMS Rank Structure"
                placeholder="Select rank structure"
                defaultSelectedKeys={["default"]}
              >
                <SelectItem key="default" value="default">
                  Default (Trainee, EMT, Paramedic, Senior Paramedic, Supervisor, Chief)
                </SelectItem>
                <SelectItem key="custom" value="custom">
                  Custom Ranks
                </SelectItem>
              </Select>
              <Select
                label="Fire Rank Structure"
                placeholder="Select rank structure"
                defaultSelectedKeys={["default"]}
              >
                <SelectItem key="default" value="default">
                  Default (Probie, Firefighter, Engineer, Captain, Battalion Chief, Fire Chief)
                </SelectItem>
                <SelectItem key="custom" value="custom">
                  Custom Ranks
                </SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Database & Backup */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database & Backup
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Database Size</p>
                  <p className="text-2xl font-bold text-white">247 MB</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Last Backup</p>
                  <p className="text-2xl font-bold text-white">2h ago</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-white">12,847</p>
                </div>
              </div>
              <Divider className="my-4" />
              <div className="flex gap-2">
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => toast.info("Creating backup...")}
                >
                  Create Backup
                </Button>
                <Button
                  color="default"
                  variant="flat"
                  onPress={() => toast.info("Optimizing database...")}
                >
                  Optimize Database
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button
            color="default"
            variant="flat"
            onPress={() => toast.info("Settings reset to defaults")}
          >
            Reset to Defaults
          </Button>
          <Button
            color="primary"
            startContent={<Save className="w-4 h-4" />}
            onPress={handleSave}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
