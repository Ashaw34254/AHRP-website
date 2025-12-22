"use client";

import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Input, Textarea, Button, Avatar, Divider, Switch, Tabs, Tab } from "@nextui-org/react";
import { User, Mail, MessageSquare, Hash, Save, Link as LinkIcon, Settings, Bell, Volume2, Palette, Globe, Lock, TestTube, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useVoice } from "@/lib/voice-context";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: (user as any)?.bio || "",
    discordUsername: (user as any)?.discordUsername || "",
    discordId: (user as any)?.discordId || "",
  });
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [bannerUrl, setBannerUrl] = useState((user as any)?.bannerImage || "");
  
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      
      // Update session with new data
      await update({
        ...session,
        user: {
          ...user,
          ...updatedUser,
        },
      });

      toast("Profile updated successfully!", "success");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast(error.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpdate = async () => {
    if (!imageUrl) {
      toast("Please enter an image URL", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      const updatedUser = await response.json();
      await update({
        ...session,
        user: {
          ...user,
          ...updatedUser,
        },
      });

      toast("Avatar updated!", "success");
    } catch (error) {
      toast("Failed to update avatar", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage your profile and account settings</p>
        </div>

        <Tabs aria-label="Settings tabs" color="primary" size="lg">
          <Tab key="profile" title={
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </div>
          }>
            <div className="space-y-6 mt-6">
              {/* Profile Picture */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white">Profile Picture</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Avatar
                      src={imageUrl || user?.image || undefined}
                      name={formData.name || "User"}
                      className="w-24 h-24"
                      isBordered
                      color="primary"
                    />
                    <div className="flex-1 space-y-3">
                      <Input
                        label="Avatar URL"
                        placeholder="https://example.com/avatar.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        startContent={<LinkIcon className="w-4 h-4 text-gray-400" />}
                      />
                      <Button
                        color="primary"
                        onClick={handleImageUpdate}
                        isLoading={saving}
                      >
                        Update Avatar
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Profile Banner */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white">Profile Banner</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div 
                    className="h-32 bg-cover bg-center rounded-lg border-2 border-gray-700"
                    style={{ 
                      backgroundImage: `url(${bannerUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=300&fit=crop"})` 
                    }}
                  ></div>
                  <Input
                    label="Banner Image URL"
                    placeholder="https://example.com/banner.jpg"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    startContent={<LinkIcon className="w-4 h-4 text-gray-400" />}
                    description="Recommended size: 1200x300px"
                  />
                  <Button
                    color="primary"
                    onClick={async () => {
                      if (!bannerUrl) {
                        toast("Please enter a banner URL", "error");
                        return;
                      }
                      setSaving(true);
                      try {
                        const response = await fetch("/api/profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ bannerImage: bannerUrl }),
                        });
                        if (response.ok) {
                          const updatedUser = await response.json();
                          await update({
                            ...session,
                            user: { ...user, ...updatedUser },
                          });
                          toast("Banner updated!", "success");
                        } else {
                          toast("Failed to update banner", "error");
                        }
                      } catch (error) {
                        toast("Failed to update banner", "error");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    isLoading={saving}
                  >
                    Update Banner
                  </Button>
                </CardBody>
              </Card>

              {/* Basic Information */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <Input
                      label="Display Name"
                      placeholder="Your display name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      startContent={<User className="w-4 h-4 text-gray-400" />}
                      isRequired
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={user?.email || ""}
                      isReadOnly
                      startContent={<Mail className="w-4 h-4 text-gray-400" />}
                      description="Email cannot be changed"
                    />

                    <Textarea
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      minRows={4}
                      maxRows={8}
                      maxLength={500}
                      description={`${formData.bio.length}/500 characters`}
                      startContent={<MessageSquare className="w-4 h-4 text-gray-400 mt-2" />}
                    />

                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      isLoading={saving}
                      startContent={!saving && <Save className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Save Changes
                    </Button>
                  </form>
                </CardBody>
              </Card>

              {/* Discord Integration */}
              <Card className="bg-gradient-to-br from-indigo-900/30 to-gray-900/50 border border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Discord Account</h2>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  {formData.discordId ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-semibold">
                              {formData.discordUsername || "Discord User"}
                            </p>
                            <p className="text-sm text-gray-400">Connected</p>
                          </div>
                        </div>
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          onClick={async () => {
                            setSaving(true);
                            try {
                              await fetch("/api/profile", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ discordId: null, discordUsername: null }),
                              });
                              setFormData({ ...formData, discordId: "", discordUsername: "" });
                              toast("Discord disconnected", "success");
                            } catch (error) {
                              toast("Failed to disconnect Discord", "error");
                            } finally {
                              setSaving(false);
                            }
                          }}
                        >
                          Disconnect
                        </Button>
                      </div>

                      <Input
                        label="Discord Username"
                        placeholder="username#1234"
                        value={formData.discordUsername}
                        onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                        startContent={<Hash className="w-4 h-4 text-gray-400" />}
                      />

                      <Input
                        label="Discord ID"
                        placeholder="123456789012345678"
                        value={formData.discordId}
                        onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                        startContent={<Hash className="w-4 h-4 text-gray-400" />}
                        description="Your Discord user ID (optional)"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-400 mb-4">
                        Connect your Discord account to access exclusive features and stay updated with the community.
                      </p>
                      <div className="space-y-3">
                        <Input
                          label="Discord Username"
                          placeholder="username#1234"
                          value={formData.discordUsername}
                          onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                          startContent={<Hash className="w-4 h-4 text-gray-400" />}
                        />
                        <Input
                          label="Discord ID (Optional)"
                          placeholder="123456789012345678"
                          value={formData.discordId}
                          onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                          startContent={<Hash className="w-4 h-4 text-gray-400" />}
                          description="Find your ID by enabling Developer Mode in Discord"
                        />
                        <Button
                          color="primary"
                          size="lg"
                          onClick={async () => {
                            if (!formData.discordUsername) {
                              toast("Please enter your Discord username", "error");
                              return;
                            }
                            setSaving(true);
                            try {
                              const response = await fetch("/api/profile", {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  discordUsername: formData.discordUsername,
                                  discordId: formData.discordId || null,
                                }),
                              });
                              if (response.ok) {
                                toast("Discord account linked!", "success");
                              } else {
                                toast("Failed to link Discord", "error");
                              }
                            } catch (error) {
                              toast("Failed to link Discord", "error");
                            } finally {
                              setSaving(false);
                            }
                          }}
                          className="w-full"
                          isLoading={saving}
                        >
                          Link Discord Account
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Account Information */}
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white">Account Information</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Account ID</span>
                    <span className="text-white font-mono text-sm">{user?.id}</span>
                  </div>
                  <Divider className="bg-gray-800" />
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white" suppressHydrationWarning>
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <Divider className="bg-gray-800" />
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Account Status</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="preferences" title={
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </div>
          }>
            <div className="space-y-6 mt-6">
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
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
