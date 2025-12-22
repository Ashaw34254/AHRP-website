"use client";

import { AdminLayout } from "@/components/AdminLayout";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Tabs,
  Tab,
  Switch,
  Slider,
  Select,
  SelectItem,
  Divider,
  Chip,
  Textarea,
} from "@nextui-org/react";
import { RichTextEditor } from "@/components/RichTextEditor";
import {
  Shield,
  Flame,
  Heart,
  Palette,
  Save,
  RotateCcw,
  Eye,
  Upload,
  Download,
  Users,
  Award,
  Settings as SettingsIcon,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

interface DepartmentTheme {
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  badgeUrl: string;
  bannerUrl: string;
  customCSS: string;
  enableGradient: boolean;
  gradientDirection: string;
  borderStyle: string;
  cardOpacity: number;
}

interface DepartmentRank {
  id: string;
  name: string;
  abbreviation: string;
  level: number;
  permissions: string[];
  payGrade?: number;
}

interface DepartmentMember {
  id: string;
  name: string;
  badgeNumber: string;
  rank: string;
  status: "active" | "loa" | "suspended" | "terminated";
  joinDate: string;
  certifications: string[];
}

interface DepartmentSettings {
  enabled: boolean;
  maxUnits: number;
  requireCertification: boolean;
  autoApprove: boolean;
  theme: DepartmentTheme;
  ranks: DepartmentRank[];
  members: DepartmentMember[];
  allowRecruitment: boolean;
  minPlaytime: number;
  discordRole: string;
  description: string;
  homepageContent: string;
  motto: string;
}

export default function DepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<"POLICE" | "FIRE" | "EMS">("POLICE");
  const [hasChanges, setHasChanges] = useState(false);

  const [departments, setDepartments] = useState<Record<string, DepartmentSettings>>({
    POLICE: {
      enabled: true,
      maxUnits: 20,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 10,
      discordRole: "Police Officer",
      description: "Serving and protecting our community with honor and integrity.",
      motto: "To Protect and Serve",
      homepageContent: "Welcome to the Aurora Horizon Police Department. We are dedicated to maintaining law and order, protecting citizens, and upholding justice. Our officers are trained professionals committed to serving the community with the highest standards of excellence.\n\n**Our Mission:**\nTo provide professional law enforcement services that promote public safety, prevent crime, and enhance the quality of life for all residents.\n\n**Join Us:**\nWe are always looking for dedicated individuals to join our ranks. If you have a passion for justice and want to make a difference, apply today!",
      theme: {
        name: "Police Department",
        displayName: "Aurora Horizon Police Department",
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
        accentColor: "#60A5FA",
        logoUrl: "",
        badgeUrl: "",
        bannerUrl: "",
        customCSS: "",
        enableGradient: true,
        gradientDirection: "to-br",
        borderStyle: "solid",
        cardOpacity: 90,
      },
      ranks: [
        { id: "1", name: "Recruit", abbreviation: "RCT", level: 1, permissions: ["basic_patrol"], payGrade: 1 },
        { id: "2", name: "Officer", abbreviation: "OFC", level: 2, permissions: ["basic_patrol", "traffic_stops"], payGrade: 2 },
        { id: "3", name: "Senior Officer", abbreviation: "SrOFC", level: 3, permissions: ["basic_patrol", "traffic_stops", "k9"], payGrade: 3 },
        { id: "4", name: "Corporal", abbreviation: "CPL", level: 4, permissions: ["basic_patrol", "traffic_stops", "k9", "training"], payGrade: 4 },
        { id: "5", name: "Sergeant", abbreviation: "SGT", level: 5, permissions: ["basic_patrol", "traffic_stops", "k9", "training", "supervision"], payGrade: 5 },
        { id: "6", name: "Lieutenant", abbreviation: "LT", level: 6, permissions: ["basic_patrol", "traffic_stops", "k9", "training", "supervision", "command"], payGrade: 6 },
        { id: "7", name: "Captain", abbreviation: "CAPT", level: 7, permissions: ["basic_patrol", "traffic_stops", "k9", "training", "supervision", "command", "admin"], payGrade: 7 },
        { id: "8", name: "Chief", abbreviation: "CHIEF", level: 8, permissions: ["all"], payGrade: 8 },
      ],
      members: [
        { id: "1", name: "John Smith", badgeNumber: "1234", rank: "Sergeant", status: "active", joinDate: "2024-01-15", certifications: ["FTO", "K9"] },
        { id: "2", name: "Sarah Johnson", badgeNumber: "1235", rank: "Officer", status: "active", joinDate: "2024-03-20", certifications: ["Traffic"] },
        { id: "3", name: "Mike Wilson", badgeNumber: "1236", rank: "Lieutenant", status: "loa", joinDate: "2023-11-10", certifications: ["FTO", "SWAT", "Supervisor"] },
      ],
    },
    FIRE: {
      enabled: true,
      maxUnits: 15,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 8,
      discordRole: "Firefighter",
      description: "First responders dedicated to fire suppression, rescue operations, and emergency medical services.",
      motto: "Courage, Honor, Sacrifice",
      homepageContent: "The Aurora Horizon Fire Department is your first line of defense against fires and emergencies. Our brave firefighters respond to a wide range of incidents including structure fires, vehicle accidents, hazardous materials incidents, and medical emergencies.\n\n**What We Do:**\n- Fire suppression and prevention\n- Emergency medical response\n- Technical rescue operations\n- Hazmat response\n\n**Recruitment:**\nBecome a hero. Join our team of dedicated firefighters and make a real difference in people's lives.",
      theme: {
        name: "Fire Department",
        displayName: "Aurora Horizon Fire & Rescue",
        primaryColor: "#EF4444",
        secondaryColor: "#991B1B",
        accentColor: "#F87171",
        logoUrl: "",
        badgeUrl: "",
        bannerUrl: "",
        customCSS: "",
        enableGradient: true,
        gradientDirection: "to-br",
        borderStyle: "solid",
        cardOpacity: 90,
      },
      ranks: [
        { id: "1", name: "Probationary Firefighter", abbreviation: "PFF", level: 1, permissions: ["basic_fire"], payGrade: 1 },
        { id: "2", name: "Firefighter", abbreviation: "FF", level: 2, permissions: ["basic_fire", "ems"], payGrade: 2 },
        { id: "3", name: "Firefighter/Paramedic", abbreviation: "FF/PM", level: 3, permissions: ["basic_fire", "ems", "advanced_ems"], payGrade: 3 },
        { id: "4", name: "Engineer", abbreviation: "ENG", level: 4, permissions: ["basic_fire", "ems", "apparatus"], payGrade: 4 },
        { id: "5", name: "Captain", abbreviation: "CAPT", level: 5, permissions: ["basic_fire", "ems", "apparatus", "command"], payGrade: 5 },
        { id: "6", name: "Battalion Chief", abbreviation: "BC", level: 6, permissions: ["basic_fire", "ems", "apparatus", "command", "admin"], payGrade: 6 },
        { id: "7", name: "Fire Chief", abbreviation: "CHIEF", level: 7, permissions: ["all"], payGrade: 7 },
      ],
      members: [
        { id: "1", name: "Emily Davis", badgeNumber: "F101", rank: "Captain", status: "active", joinDate: "2023-08-10", certifications: ["Paramedic", "Hazmat"] },
        { id: "2", name: "Robert Brown", badgeNumber: "F102", rank: "Firefighter", status: "active", joinDate: "2024-05-15", certifications: ["EMT"] },
      ],
    },
    EMS: {
      enabled: true,
      maxUnits: 12,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 8,
      discordRole: "EMS",
      description: "Providing critical pre-hospital emergency medical care and transportation.",
      motto: "Saving Lives, One Call at a Time",
      homepageContent: "Aurora Horizon EMS provides rapid response emergency medical services to the community. Our highly trained paramedics and EMTs deliver life-saving care in critical moments.\n\n**Our Services:**\n- Emergency medical response\n- Advanced life support\n- Critical care transport\n- Medical standby services\n\n**Training & Certification:**\nOur team maintains the highest levels of medical certification and undergoes continuous training to provide the best possible care.\n\n**Career Opportunities:**\nIf you're passionate about medicine and helping others in their time of need, consider joining our EMS team.",
      theme: {
        name: "Emergency Medical Services",
        displayName: "Aurora Horizon EMS",
        primaryColor: "#10B981",
        secondaryColor: "#065F46",
        accentColor: "#34D399",
        logoUrl: "",
        badgeUrl: "",
        bannerUrl: "",
        customCSS: "",
        enableGradient: true,
        gradientDirection: "to-br",
        borderStyle: "solid",
        cardOpacity: 90,
      },
      ranks: [
        { id: "1", name: "EMT-Basic", abbreviation: "EMT-B", level: 1, permissions: ["basic_ems"], payGrade: 1 },
        { id: "2", name: "EMT-Advanced", abbreviation: "EMT-A", level: 2, permissions: ["basic_ems", "advanced_ems"], payGrade: 2 },
        { id: "3", name: "Paramedic", abbreviation: "PM", level: 3, permissions: ["basic_ems", "advanced_ems", "critical_care"], payGrade: 3 },
        { id: "4", name: "Field Training Officer", abbreviation: "FTO", level: 4, permissions: ["basic_ems", "advanced_ems", "critical_care", "training"], payGrade: 4 },
        { id: "5", name: "EMS Supervisor", abbreviation: "SUP", level: 5, permissions: ["basic_ems", "advanced_ems", "critical_care", "training", "supervision"], payGrade: 5 },
        { id: "6", name: "EMS Chief", abbreviation: "CHIEF", level: 6, permissions: ["all"], payGrade: 6 },
      ],
      members: [
        { id: "1", name: "Lisa Martinez", badgeNumber: "E201", rank: "Paramedic", status: "active", joinDate: "2024-02-01", certifications: ["Paramedic", "ACLS"] },
      ],
    },
  });

  const currentSettings = departments[selectedDept];
  const currentTheme = currentSettings.theme;

  const handleThemeChange = (key: keyof DepartmentTheme, value: any) => {
    setDepartments((prev) => ({
      ...prev,
      [selectedDept]: {
        ...prev[selectedDept],
        theme: {
          ...prev[selectedDept].theme,
          [key]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSettingsChange = (key: keyof DepartmentSettings, value: any) => {
    setDepartments((prev) => ({
      ...prev,
      [selectedDept]: {
        ...prev[selectedDept],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Save to database via API
      toast.success("Department settings saved successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleReset = () => {
    // Reset to default
    toast.success("Settings reset to default");
    setHasChanges(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(departments, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "department-settings.json";
    link.click();
    toast.success("Settings exported successfully");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            setDepartments(imported);
            toast.success("Settings imported successfully");
            setHasChanges(true);
          } catch {
            toast.error("Invalid settings file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getDeptIcon = (dept: string) => {
    switch (dept) {
      case "POLICE":
        return Shield;
      case "FIRE":
        return Flame;
      case "EMS":
        return Heart;
      default:
        return Shield;
    }
  };

  const DeptIcon = getDeptIcon(selectedDept);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Department Management</h1>
            <p className="text-gray-400 mt-2">
              Configure department settings, themes, and branding
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              color="default"
              variant="flat"
              startContent={<Download className="w-4 h-4" />}
              onPress={handleExport}
            >
              Export
            </Button>
            <Button
              color="default"
              variant="flat"
              startContent={<Upload className="w-4 h-4" />}
              onPress={handleImport}
            >
              Import
            </Button>
            {hasChanges && (
              <>
                <Button
                  color="default"
                  variant="flat"
                  startContent={<RotateCcw className="w-4 h-4" />}
                  onPress={handleReset}
                >
                  Reset
                </Button>
                <Button
                  color="success"
                  startContent={<Save className="w-4 h-4" />}
                  onPress={handleSave}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Department Selector */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <div className="grid grid-cols-3 gap-4">
              {(["POLICE", "FIRE", "EMS"] as const).map((dept) => {
                const Icon = getDeptIcon(dept);
                const isSelected = selectedDept === dept;
                const settings = departments[dept];

                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`
                      p-6 rounded-lg border-2 transition-all
                      ${
                        isSelected
                          ? "border-current bg-opacity-20"
                          : "border-gray-700 hover:border-gray-600"
                      }
                    `}
                    style={{
                      borderColor: isSelected ? settings.theme.primaryColor : undefined,
                      backgroundColor: isSelected
                        ? `${settings.theme.primaryColor}20`
                        : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon
                        className="w-8 h-8"
                        style={{ color: settings.theme.primaryColor }}
                      />
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-white">{dept}</h3>
                        <p className="text-sm text-gray-400">
                          {departments[dept].theme.displayName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        color={settings.enabled ? "success" : "default"}
                        variant="flat"
                      >
                        {settings.enabled ? "Active" : "Disabled"}
                      </Chip>
                      {settings.requireCertification && (
                        <Chip size="sm" variant="flat">
                          Certified
                        </Chip>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Settings Tabs */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <Tabs aria-label="Department settings" size="lg">
              {/* General Settings */}
              <Tab
                key="general"
                title={
                  <div className="flex items-center gap-2">
                    <DeptIcon className="w-4 h-4" />
                    <span>General</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Enable Department
                      </h3>
                      <p className="text-sm text-gray-400">
                        Allow users to join and access this department
                      </p>
                    </div>
                    <Switch
                      isSelected={currentSettings.enabled}
                      onValueChange={(value) => handleSettingsChange("enabled", value)}
                      color="success"
                    />
                  </div>

                  <Divider className="bg-gray-700" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Maximum Units
                      </label>
                      <Input
                        type="number"
                        value={currentSettings.maxUnits.toString()}
                        onChange={(e) =>
                          handleSettingsChange("maxUnits", parseInt(e.target.value))
                        }
                        min={1}
                        max={100}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Minimum Playtime (hours)
                      </label>
                      <Input
                        type="number"
                        value={currentSettings.minPlaytime.toString()}
                        onChange={(e) =>
                          handleSettingsChange("minPlaytime", parseInt(e.target.value))
                        }
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Require Certification
                      </h3>
                      <p className="text-sm text-gray-400">
                        Require users to complete training before joining
                      </p>
                    </div>
                    <Switch
                      isSelected={currentSettings.requireCertification}
                      onValueChange={(value) =>
                        handleSettingsChange("requireCertification", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Auto-Approve Applications
                      </h3>
                      <p className="text-sm text-gray-400">
                        Automatically approve department applications
                      </p>
                    </div>
                    <Switch
                      isSelected={currentSettings.autoApprove}
                      onValueChange={(value) =>
                        handleSettingsChange("autoApprove", value)
                      }
                    />
                  </div>
                </div>
              </Tab>

              {/* Theme Settings */}
              <Tab
                key="theme"
                title={
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>Theme</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  {/* Department Identity */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Department Identity
                    </h3>
                    <Input
                      label="Display Name"
                      placeholder="Aurora Horizon Police Department"
                      value={currentTheme.displayName}
                      onChange={(e) => handleThemeChange("displayName", e.target.value)}
                      description="Full department name shown across the system"
                    />
                    <Input
                      label="Department Motto"
                      placeholder="To Protect and Serve"
                      value={currentSettings.motto}
                      onChange={(e) => handleSettingsChange("motto", e.target.value)}
                      description="Motto displayed on department pages"
                    />
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Short Description
                      </label>
                      <RichTextEditor
                        value={currentSettings.description}
                        onChange={(content) => handleSettingsChange("description", content)}
                        height={200}
                        placeholder="Brief description of the department..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Short description for cards and previews
                      </p>
                    </div>
                  </div>

                  <Divider className="bg-gray-700" />

                  {/* Color Palette */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Color Palette
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Primary Color
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={currentTheme.primaryColor}
                            onChange={(e) =>
                              handleThemeChange("primaryColor", e.target.value)
                            }
                            className="w-20"
                          />
                          <Input
                            type="text"
                            value={currentTheme.primaryColor}
                            onChange={(e) =>
                              handleThemeChange("primaryColor", e.target.value)
                            }
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Secondary Color
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={currentTheme.secondaryColor}
                            onChange={(e) =>
                              handleThemeChange("secondaryColor", e.target.value)
                            }
                            className="w-20"
                          />
                          <Input
                            type="text"
                            value={currentTheme.secondaryColor}
                            onChange={(e) =>
                              handleThemeChange("secondaryColor", e.target.value)
                            }
                            placeholder="#1E40AF"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Accent Color
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={currentTheme.accentColor}
                            onChange={(e) =>
                              handleThemeChange("accentColor", e.target.value)
                            }
                            className="w-20"
                          />
                          <Input
                            type="text"
                            value={currentTheme.accentColor}
                            onChange={(e) =>
                              handleThemeChange("accentColor", e.target.value)
                            }
                            placeholder="#60A5FA"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider className="bg-gray-700" />

                  {/* Gradient Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Gradient Effects
                      </h3>
                      <Switch
                        isSelected={currentTheme.enableGradient}
                        onValueChange={(value) =>
                          handleThemeChange("enableGradient", value)
                        }
                      />
                    </div>
                    {currentTheme.enableGradient && (
                      <Select
                        label="Gradient Direction"
                        selectedKeys={[currentTheme.gradientDirection]}
                        onChange={(e) =>
                          handleThemeChange("gradientDirection", e.target.value)
                        }
                      >
                        <SelectItem key="to-r" value="to-r">
                          Left to Right
                        </SelectItem>
                        <SelectItem key="to-l" value="to-l">
                          Right to Left
                        </SelectItem>
                        <SelectItem key="to-b" value="to-b">
                          Top to Bottom
                        </SelectItem>
                        <SelectItem key="to-t" value="to-t">
                          Bottom to Top
                        </SelectItem>
                        <SelectItem key="to-br" value="to-br">
                          Diagonal (Top-Left to Bottom-Right)
                        </SelectItem>
                        <SelectItem key="to-bl" value="to-bl">
                          Diagonal (Top-Right to Bottom-Left)
                        </SelectItem>
                      </Select>
                    )}
                  </div>

                  <Divider className="bg-gray-700" />

                  {/* Card Styling */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Card Styling</h3>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Border Style
                      </label>
                      <Select
                        selectedKeys={[currentTheme.borderStyle]}
                        onChange={(e) =>
                          handleThemeChange("borderStyle", e.target.value)
                        }
                      >
                        <SelectItem key="solid" value="solid">
                          Solid
                        </SelectItem>
                        <SelectItem key="dashed" value="dashed">
                          Dashed
                        </SelectItem>
                        <SelectItem key="dotted" value="dotted">
                          Dotted
                        </SelectItem>
                        <SelectItem key="none" value="none">
                          None
                        </SelectItem>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Card Opacity: {currentTheme.cardOpacity}%
                      </label>
                      <Slider
                        value={currentTheme.cardOpacity}
                        onChange={(value) =>
                          handleThemeChange("cardOpacity", value as number)
                        }
                        minValue={0}
                        maxValue={100}
                        step={5}
                        className="max-w-md"
                      />
                    </div>
                  </div>

                  <Divider className="bg-gray-700" />

                  {/* Image URLs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Branding Assets</h3>
                    <Input
                      label="Logo URL"
                      placeholder="https://example.com/logo.png"
                      value={currentTheme.logoUrl}
                      onChange={(e) => handleThemeChange("logoUrl", e.target.value)}
                    />
                    <Input
                      label="Badge URL"
                      placeholder="https://example.com/badge.png"
                      value={currentTheme.badgeUrl}
                      onChange={(e) => handleThemeChange("badgeUrl", e.target.value)}
                    />
                    <Input
                      label="Banner URL"
                      placeholder="https://example.com/banner.jpg"
                      value={currentTheme.bannerUrl}
                      onChange={(e) => handleThemeChange("bannerUrl", e.target.value)}
                    />
                  </div>
                </div>
              </Tab>

              {/* Preview */}
              <Tab
                key="preview"
                title={
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Theme Preview
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                      See how your department theme will look
                    </p>
                  </div>

                  {/* Preview Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Card with gradient */}
                    <Card
                      className={`border-2`}
                      style={{
                        borderColor: currentTheme.primaryColor,
                        borderStyle: currentTheme.borderStyle,
                        background: currentTheme.enableGradient
                          ? `linear-gradient(${currentTheme.gradientDirection}, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
                          : currentTheme.primaryColor,
                        opacity: currentTheme.cardOpacity / 100,
                      }}
                    >
                      <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <DeptIcon className="w-8 h-8 text-white" />
                          <h4 className="text-xl font-bold text-white">
                            {currentTheme.name}
                          </h4>
                        </div>
                        <p className="text-white/90 mb-4">
                          This is a preview of your department card with the selected
                          theme settings.
                        </p>
                        <Button
                          style={{ backgroundColor: currentTheme.accentColor }}
                          className="text-white"
                        >
                          Action Button
                        </Button>
                      </CardBody>
                    </Card>

                    {/* Card with solid color */}
                    <Card
                      className="border-2 bg-gray-900/50"
                      style={{
                        borderColor: currentTheme.primaryColor,
                        borderStyle: currentTheme.borderStyle,
                      }}
                    >
                      <CardHeader>
                        <h4
                          className="text-xl font-bold"
                          style={{ color: currentTheme.primaryColor }}
                        >
                          Department Header
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <p className="text-gray-300 mb-4">
                          This preview shows how text and borders will appear with your
                          color scheme.
                        </p>
                        <div className="flex gap-2">
                          <Chip
                            style={{
                              backgroundColor: currentTheme.primaryColor,
                              color: "white",
                            }}
                          >
                            Primary
                          </Chip>
                          <Chip
                            style={{
                              backgroundColor: currentTheme.secondaryColor,
                              color: "white",
                            }}
                          >
                            Secondary
                          </Chip>
                          <Chip
                            style={{
                              backgroundColor: currentTheme.accentColor,
                              color: "white",
                            }}
                          >
                            Accent
                          </Chip>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Logo/Badge Preview */}
                  {(currentTheme.logoUrl || currentTheme.badgeUrl || currentTheme.bannerUrl) && (
                    <>
                      <Divider className="bg-gray-700" />
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                          Asset Preview
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          {currentTheme.logoUrl && (
                            <div className="text-center">
                              <p className="text-sm text-gray-400 mb-2">Logo</p>
                              <img
                                src={currentTheme.logoUrl}
                                alt="Logo"
                                className="max-h-24 mx-auto"
                              />
                            </div>
                          )}
                          {currentTheme.badgeUrl && (
                            <div className="text-center">
                              <p className="text-sm text-gray-400 mb-2">Badge</p>
                              <img
                                src={currentTheme.badgeUrl}
                                alt="Badge"
                                className="max-h-24 mx-auto"
                              />
                            </div>
                          )}
                          {currentTheme.bannerUrl && (
                            <div className="text-center">
                              <p className="text-sm text-gray-400 mb-2">Banner</p>
                              <img
                                src={currentTheme.bannerUrl}
                                alt="Banner"
                                className="max-h-24 mx-auto w-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Tab>

              {/* Homepage Tab */}
              <Tab
                key="homepage"
                title={
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Homepage</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Department Homepage Content
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                      Customize the content displayed on your department's homepage
                    </p>
                  </div>

                  <Card className="bg-gray-800/50 border border-gray-700">
                    <CardBody className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Display Name
                          </label>
                          <Input
                            value={currentTheme.displayName}
                            onChange={(e) =>
                              handleThemeChange("displayName", e.target.value)
                            }
                            placeholder="Aurora Horizon Police Department"
                            size="lg"
                            classNames={{
                              input: "text-lg",
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            This name appears everywhere in the system
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Department Motto
                          </label>
                          <Input
                            value={currentSettings.motto}
                            onChange={(e) => handleSettingsChange("motto", e.target.value)}
                            placeholder="To Protect and Serve"
                            startContent={
                              <span className="text-gray-400 text-xl">✦</span>
                            }
                          />
                        </div>

                        <Divider className="bg-gray-700" />

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Short Description
                          </label>
                          <Textarea
                            value={currentSettings.description}
                            onChange={(e) =>
                              handleSettingsChange("description", e.target.value)
                            }
                            placeholder="Brief description of the department..."
                            minRows={3}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Displayed on department cards and search results
                          </p>
                        </div>

                        <Divider className="bg-gray-700" />

                        <div>
                          <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Homepage Content
                          </label>
                          <RichTextEditor
                            value={currentSettings.homepageContent}
                            onChange={(content) =>
                              handleSettingsChange("homepageContent", content)
                            }
                            placeholder="Full homepage content with rich formatting..."
                            height={400}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use the toolbar above for rich text formatting
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Homepage Preview */}
                  <Card
                    className="bg-gray-800/50 border-2"
                    style={{ borderColor: currentTheme.primaryColor }}
                  >
                    <CardHeader
                      className="pb-0"
                      style={{
                        background: currentTheme.enableGradient
                          ? `linear-gradient(${currentTheme.gradientDirection}, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
                          : currentTheme.primaryColor,
                      }}
                    >
                      <div className="w-full py-8 text-center">
                        <DeptIcon className="w-16 h-16 text-white mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {currentTheme.displayName}
                        </h2>
                        {currentSettings.motto && (
                          <p className="text-white/90 text-lg italic">
                            "{currentSettings.motto}"
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardBody className="p-8">
                      {currentSettings.description && (
                        <div className="mb-6">
                          <p
                            className="text-lg text-center"
                            style={{ color: currentTheme.accentColor }}
                          >
                            {currentSettings.description}
                          </p>
                        </div>
                      )}
                      <Divider className="my-6 bg-gray-700" />
                      <div className="prose prose-invert max-w-none">
                        {currentSettings.homepageContent
                          .split("\\n\\n")
                          .map((paragraph, i) => {
                            if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
                              return (
                                <h3
                                  key={i}
                                  className="text-xl font-bold text-white mt-6 mb-3"
                                >
                                  {paragraph.replace(/\*\*/g, "").replace(":", "")}
                                </h3>
                              );
                            }
                            return (
                              <p key={i} className="text-gray-300 mb-4 leading-relaxed">
                                {paragraph.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\\n/g, " ")}
                              </p>
                            );
                          })}
                      </div>
                      <div className="flex justify-center mt-8">
                        <Button
                          size="lg"
                          style={{
                            backgroundColor: currentTheme.accentColor,
                            color: "white",
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              {/* Ranks Tab */}
              <Tab
                key="ranks"
                title={
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Ranks</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Department Ranks
                      </h3>
                      <p className="text-sm text-gray-400">
                        Manage rank structure and permissions
                      </p>
                    </div>
                    <Button
                      color="success"
                      startContent={<Plus className="w-4 h-4" />}
                      onPress={() => {
                        const newRank: DepartmentRank = {
                          id: Date.now().toString(),
                          name: "New Rank",
                          abbreviation: "NR",
                          level: currentSettings.ranks.length + 1,
                          permissions: [],
                          payGrade: currentSettings.ranks.length + 1,
                        };
                        setDepartments((prev) => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            ranks: [...prev[selectedDept].ranks, newRank],
                          },
                        }));
                        setHasChanges(true);
                        toast.success("Rank added");
                      }}
                    >
                      Add Rank
                    </Button>
                  </div>

                  <Divider className="bg-gray-700" />

                  <div className="space-y-3">
                    {currentSettings.ranks
                      .sort((a, b) => b.level - a.level)
                      .map((rank, index) => (
                        <Card
                          key={rank.id}
                          className="bg-gray-800/50 border border-gray-700"
                        >
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center gap-2">
                                  <Star
                                    className="w-5 h-5"
                                    style={{ color: currentTheme.primaryColor }}
                                  />
                                  <span className="text-2xl font-bold text-gray-500">
                                    {rank.level}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Input
                                      value={rank.name}
                                      onChange={(e) => {
                                        const updated = [...currentSettings.ranks];
                                        updated[updated.findIndex((r) => r.id === rank.id)].name =
                                          e.target.value;
                                        setDepartments((prev) => ({
                                          ...prev,
                                          [selectedDept]: {
                                            ...prev[selectedDept],
                                            ranks: updated,
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                      placeholder="Rank Name"
                                      className="max-w-xs"
                                    />
                                    <Input
                                      value={rank.abbreviation}
                                      onChange={(e) => {
                                        const updated = [...currentSettings.ranks];
                                        updated[
                                          updated.findIndex((r) => r.id === rank.id)
                                        ].abbreviation = e.target.value;
                                        setDepartments((prev) => ({
                                          ...prev,
                                          [selectedDept]: {
                                            ...prev[selectedDept],
                                            ranks: updated,
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                      placeholder="Abbr"
                                      className="max-w-[100px]"
                                    />
                                    <Input
                                      type="number"
                                      value={rank.payGrade?.toString() || "0"}
                                      onChange={(e) => {
                                        const updated = [...currentSettings.ranks];
                                        updated[updated.findIndex((r) => r.id === rank.id)].payGrade =
                                          parseInt(e.target.value);
                                        setDepartments((prev) => ({
                                          ...prev,
                                          [selectedDept]: {
                                            ...prev[selectedDept],
                                            ranks: updated,
                                          },
                                        }));
                                        setHasChanges(true);
                                      }}
                                      placeholder="Pay Grade"
                                      className="max-w-[120px]"
                                      startContent={
                                        <span className="text-gray-400">$</span>
                                      }
                                    />
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {rank.permissions.map((perm) => (
                                      <Chip
                                        key={perm}
                                        size="sm"
                                        variant="flat"
                                        style={{
                                          backgroundColor: `${currentTheme.primaryColor}20`,
                                          color: currentTheme.primaryColor,
                                        }}
                                      >
                                        {perm.replace(/_/g, " ")}
                                      </Chip>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                isIconOnly
                                color="danger"
                                variant="flat"
                                size="sm"
                                onPress={() => {
                                  setDepartments((prev) => ({
                                    ...prev,
                                    [selectedDept]: {
                                      ...prev[selectedDept],
                                      ranks: prev[selectedDept].ranks.filter(
                                        (r) => r.id !== rank.id
                                      ),
                                    },
                                  }));
                                  setHasChanges(true);
                                  toast.success("Rank deleted");
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                  </div>
                </div>
              </Tab>

              {/* Members Tab */}
              <Tab
                key="members"
                title={
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Members ({currentSettings.members.length})</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Department Members
                      </h3>
                      <p className="text-sm text-gray-400">
                        View and manage department personnel
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Chip variant="flat" color="success">
                        {
                          currentSettings.members.filter(
                            (m) => m.status === "active"
                          ).length
                        }{" "}
                        Active
                      </Chip>
                      <Chip variant="flat" color="warning">
                        {
                          currentSettings.members.filter((m) => m.status === "loa")
                            .length
                        }{" "}
                        LOA
                      </Chip>
                    </div>
                  </div>

                  <Divider className="bg-gray-700" />

                  <div className="space-y-3">
                    {currentSettings.members.map((member) => (
                      <Card
                        key={member.id}
                        className="bg-gray-800/50 border border-gray-700"
                      >
                        <CardBody className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                                style={{
                                  backgroundColor: currentTheme.primaryColor,
                                }}
                              >
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-lg font-semibold text-white">
                                    {member.name}
                                  </h4>
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    style={{
                                      backgroundColor: `${currentTheme.primaryColor}20`,
                                      color: currentTheme.primaryColor,
                                    }}
                                  >
                                    {member.rank}
                                  </Chip>
                                  <Chip
                                    size="sm"
                                    color={
                                      member.status === "active"
                                        ? "success"
                                        : member.status === "loa"
                                        ? "warning"
                                        : "danger"
                                    }
                                    variant="flat"
                                  >
                                    {member.status.toUpperCase()}
                                  </Chip>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span>Badge: {member.badgeNumber}</span>
                                  <span>•</span>
                                  <span>
                                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                                  </span>
                                  {member.certifications.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <div className="flex gap-1">
                                        {member.certifications.map((cert) => (
                                          <Chip key={cert} size="sm" variant="dot">
                                            {cert}
                                          </Chip>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                color="primary"
                                variant="flat"
                                size="sm"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                color="danger"
                                variant="flat"
                                size="sm"
                                onPress={() => {
                                  setDepartments((prev) => ({
                                    ...prev,
                                    [selectedDept]: {
                                      ...prev[selectedDept],
                                      members: prev[selectedDept].members.filter(
                                        (m) => m.id !== member.id
                                      ),
                                    },
                                  }));
                                  setHasChanges(true);
                                  toast.success("Member removed");
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Settings Tab */}
              <Tab
                key="settings"
                title={
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4" />
                    <span>Advanced</span>
                  </div>
                }
              >
                <div className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recruitment Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">Allow Recruitment</h4>
                          <p className="text-sm text-gray-400">
                            Enable public applications for this department
                          </p>
                        </div>
                        <Switch
                          isSelected={currentSettings.allowRecruitment}
                          onValueChange={(value) =>
                            handleSettingsChange("allowRecruitment", value)
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Minimum Playtime (hours)
                        </label>
                        <Input
                          type="number"
                          value={currentSettings.minPlaytime.toString()}
                          onChange={(e) =>
                            handleSettingsChange("minPlaytime", parseInt(e.target.value))
                          }
                          min={0}
                          max={100}
                          className="max-w-xs"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Discord Role
                        </label>
                        <Input
                          value={currentSettings.discordRole}
                          onChange={(e) =>
                            handleSettingsChange("discordRole", e.target.value)
                          }
                          placeholder="Police Officer"
                          className="max-w-md"
                        />
                      </div>
                    </div>
                  </div>

                  <Divider className="bg-gray-700" />

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Department Statistics
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-gray-800/50">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-blue-400" />
                            <div>
                              <p className="text-2xl font-bold text-white">
                                {currentSettings.members.length}
                              </p>
                              <p className="text-sm text-gray-400">Total Members</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      <Card className="bg-gray-800/50">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-purple-400" />
                            <div>
                              <p className="text-2xl font-bold text-white">
                                {currentSettings.ranks.length}
                              </p>
                              <p className="text-sm text-gray-400">Rank Structure</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      <Card className="bg-gray-800/50">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                            <div>
                              <p className="text-2xl font-bold text-white">
                                {currentSettings.members.filter((m) => m.status === "active").length}
                              </p>
                              <p className="text-sm text-gray-400">Active Now</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
