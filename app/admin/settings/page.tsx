"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Button,
  Input,
  Switch,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Divider,
} from "@nextui-org/react";
import { Settings as SettingsIcon, Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast";

interface Setting {
  id: string;
  category: string;
  key: string;
  value: string;
  parsedValue: any;
  description: string | null;
  dataType: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedSettings {
  [category: string]: Setting[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // New setting form
  const [newSetting, setNewSetting] = useState({
    category: "general",
    key: "",
    value: "",
    description: "",
    dataType: "string",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      
      if (data.success) {
        setSettings(data.settings);
        // Initialize edited values
        const initial: Record<string, any> = {};
        data.allSettings.forEach((s: Setting) => {
          initial[s.key] = s.parsedValue;
        });
        setEditedValues(initial);
      } else {
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Get all settings that have been edited
      const promises = Object.entries(editedValues).map(([key, value]) => {
        // Find the setting to get its dataType
        let dataType = "string";
        Object.values(settings).forEach(categorySettings => {
          const setting = categorySettings.find(s => s.key === key);
          if (setting) dataType = setting.dataType;
        });

        return fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value, dataType }),
        });
      });

      await Promise.all(promises);
      toast.success("Settings saved successfully");
      loadSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSetting = async () => {
    if (!newSetting.key || !newSetting.category) {
      toast.error("Key and category are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSetting),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Setting created successfully");
        onClose();
        setNewSetting({
          category: "general",
          key: "",
          value: "",
          description: "",
          dataType: "string",
        });
        loadSettings();
      } else {
        toast.error(data.message || "Failed to create setting");
      }
    } catch (error) {
      console.error("Error creating setting:", error);
      toast.error("Failed to create setting");
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    try {
      const res = await fetch(`/api/admin/settings?key=${key}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Setting deleted successfully");
        loadSettings();
      } else {
        toast.error(data.message || "Failed to delete setting");
      }
    } catch (error) {
      console.error("Error deleting setting:", error);
      toast.error("Failed to delete setting");
    }
  };

  const renderSettingInput = (setting: Setting) => {
    const value = editedValues[setting.key];

    switch (setting.dataType) {
      case "boolean":
        return (
          <Switch
            isSelected={Boolean(value)}
            onValueChange={(checked) => 
              setEditedValues(prev => ({ ...prev, [setting.key]: checked }))
            }
          >
            {value ? "Enabled" : "Disabled"}
          </Switch>
        );
      case "number":
        return (
          <Input
            type="number"
            value={String(value || "")}
            onChange={(e) => 
              setEditedValues(prev => ({ ...prev, [setting.key]: parseFloat(e.target.value) || 0 }))
            }
            classNames={{
              inputWrapper: "bg-gray-800 border-gray-700",
            }}
          />
        );
      case "json":
        return (
          <Textarea
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : String(value || "")}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setEditedValues(prev => ({ ...prev, [setting.key]: parsed }));
              } catch {
                setEditedValues(prev => ({ ...prev, [setting.key]: e.target.value }));
              }
            }}
            minRows={3}
            classNames={{
              inputWrapper: "bg-gray-800 border-gray-700",
            }}
          />
        );
      default:
        return (
          <Input
            value={String(value || "")}
            onChange={(e) => 
              setEditedValues(prev => ({ ...prev, [setting.key]: e.target.value }))
            }
            classNames={{
              inputWrapper: "bg-gray-800 border-gray-700",
            }}
          />
        );
    }
  };

  const categories = Object.keys(settings).sort();
  const hasSettings = categories.length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 text-transparent bg-clip-text">
              System Settings
            </h1>
            <p className="text-gray-400 mt-2">
              Configure application-wide settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              startContent={<RefreshCw size={18} />}
              variant="flat"
              onPress={loadSettings}
              isLoading={loading}
            >
              Refresh
            </Button>
            <Button
              startContent={<Plus size={18} />}
              color="secondary"
              onPress={onOpen}
            >
              Add Setting
            </Button>
            <Button
              startContent={<Save size={18} />}
              color="primary"
              onPress={handleSaveSettings}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        {loading ? (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="py-12">
              <p className="text-center text-gray-400">Loading settings...</p>
            </CardBody>
          </Card>
        ) : !hasSettings ? (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="py-12 text-center space-y-4">
              <SettingsIcon className="w-16 h-16 text-gray-600 mx-auto" />
              <div>
                <p className="text-gray-300 font-semibold">No settings found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Create your first setting to get started
                </p>
              </div>
              <Button
                startContent={<Plus size={18} />}
                color="primary"
                onPress={onOpen}
              >
                Create Setting
              </Button>
            </CardBody>
          </Card>
        ) : (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody>
              <Tabs
                aria-label="Settings categories"
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12",
                }}
              >
                {categories.map((category) => (
                  <Tab
                    key={category}
                    title={
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{category}</span>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                          {settings[category].length}
                        </span>
                      </div>
                    }
                  >
                    <div className="py-6 space-y-6">
                      {settings[category].map((setting) => (
                        <div key={setting.id}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white">{setting.key}</h3>
                                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                                  {setting.dataType}
                                </span>
                              </div>
                              {setting.description && (
                                <p className="text-sm text-gray-400">{setting.description}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                              onPress={() => handleDeleteSetting(setting.key)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="max-w-2xl">
                            {renderSettingInput(setting)}
                          </div>
                          <Divider className="mt-6" />
                        </div>
                      ))}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </CardBody>
          </Card>
        )}

        {/* Create Setting Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader>Create New Setting</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Select
                  label="Category"
                  selectedKeys={[newSetting.category]}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, category: e.target.value }))}
                  classNames={{
                    trigger: "bg-gray-800 border-gray-700",
                  }}
                >
                  <SelectItem key="general" value="general">General</SelectItem>
                  <SelectItem key="auth" value="auth">Authentication</SelectItem>
                  <SelectItem key="notifications" value="notifications">Notifications</SelectItem>
                  <SelectItem key="cad" value="cad">CAD System</SelectItem>
                  <SelectItem key="whitelist" value="whitelist">Whitelist</SelectItem>
                </Select>

                <Input
                  label="Key"
                  placeholder="e.g., site_name, max_upload_size"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  description="Unique identifier for this setting (use snake_case)"
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />

                <Select
                  label="Data Type"
                  selectedKeys={[newSetting.dataType]}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, dataType: e.target.value }))}
                  classNames={{
                    trigger: "bg-gray-800 border-gray-700",
                  }}
                >
                  <SelectItem key="string" value="string">String</SelectItem>
                  <SelectItem key="number" value="number">Number</SelectItem>
                  <SelectItem key="boolean" value="boolean">Boolean</SelectItem>
                  <SelectItem key="json" value="json">JSON</SelectItem>
                </Select>

                {newSetting.dataType === "boolean" ? (
                  <Switch
                    isSelected={newSetting.value === "true"}
                    onValueChange={(checked) => 
                      setNewSetting(prev => ({ ...prev, value: String(checked) }))
                    }
                  >
                    Initial Value
                  </Switch>
                ) : (
                  <Input
                    label="Initial Value"
                    value={newSetting.value}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                    classNames={{
                      inputWrapper: "bg-gray-800 border-gray-700",
                    }}
                  />
                )}

                <Textarea
                  label="Description"
                  placeholder="What does this setting control?"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  minRows={2}
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleCreateSetting}>
                Create Setting
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
