"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Button, Input, Switch } from "@nextui-org/react";
import { Settings, User, Bell, Lock, Palette, Globe, Volume2, Radio, TestTube } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useVoice } from "@/lib/voice-context";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    soundEffects: true,
    darkMode: true,
    language: "en",
    timezone: "UTC",
    callsignPrefix: "",
    displayName: "",
  });
  
  const { isEnabled: voiceEnabled, toggle: toggleVoice, testVoice } = useVoice();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage your preferences and account settings</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/settings/voice">
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/50 hover:border-blue-600/50 transition-all cursor-pointer">
              <CardBody className="text-center py-6">
                <Volume2 className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                <h3 className="text-lg font-bold text-white mb-1">Voice Alerts</h3>
                <p className="text-sm text-gray-400">Configure AI voice notifications</p>
                <div className="mt-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${voiceEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {voiceEnabled ? '● Enabled' : '○ Disabled'}
                  </span>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Card 
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 hover:border-purple-600/50 transition-all cursor-pointer"
            as={Link}
            href="/dashboard/settings/test"
          >
            <CardBody className="text-center py-6">
              <TestTube className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <h3 className="text-lg font-bold text-white mb-1">Test Modules</h3>
              <p className="text-sm text-gray-400">Run system diagnostics</p>
              <div className="mt-3">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                  Available Now
                </span>
              </div>
            </CardBody>
          </Card>

          <Card 
            className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-800/50 hover:border-cyan-600/50 transition-all cursor-pointer"
            isPressable
            onPress={() => {
              toast.info("Radio settings feature coming soon!");
            }}
          >
            <CardBody className="text-center py-6">
              <Radio className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
              <h3 className="text-lg font-bold text-white mb-1">Radio System</h3>
              <p className="text-sm text-gray-400">Configure radio channels</p>
              <div className="mt-3">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-400">
                  Coming Soon
                </span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Profile Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Profile Settings</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Display Name"
              placeholder="Your display name"
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
            />
            <Input
              label="Callsign Prefix"
              placeholder="e.g., 1A-"
              value={settings.callsignPrefix}
              onChange={(e) => setSettings({ ...settings, callsignPrefix: e.target.value })}
            />
          </CardBody>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Notifications</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive email alerts for important events</p>
              </div>
              <Switch
                isSelected={settings.emailNotifications}
                onValueChange={(value) => setSettings({ ...settings, emailNotifications: value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Browser push notifications</p>
              </div>
              <Switch
                isSelected={settings.pushNotifications}
                onValueChange={(value) => setSettings({ ...settings, pushNotifications: value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Sound Effects</p>
                <p className="text-sm text-gray-400">Play sounds for alerts and notifications</p>
              </div>
              <Switch
                isSelected={settings.soundEffects}
                onValueChange={(value) => setSettings({ ...settings, soundEffects: value })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Appearance</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-sm text-gray-400">Use dark theme (managed by theme toggle)</p>
              </div>
              <Switch isSelected={settings.darkMode} isDisabled />
            </div>
          </CardBody>
        </Card>

        {/* Region Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Region & Language</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Language"
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            />
            <Input
              label="Timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            />
          </CardBody>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">Security</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Button color="danger" variant="flat">
              Change Password
            </Button>
            <Button color="warning" variant="flat">
              Two-Factor Authentication
            </Button>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button color="primary" size="lg" onPress={handleSave}>
            Save All Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
