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
} from "@heroui/react";
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
  FileText,
  Clock,
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "Policy" | "Event" | "Notice" | "Training" | "Alert";
  urgent: boolean;
  date: string;
}

interface DepartmentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees?: number;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  author?: string;
  image?: string;
}

interface QuickStat {
  id: string;
  label: string;
  value: string;
  icon: string; // Icon name
  color: string;
}

interface LeadershipProfile {
  id: string;
  name: string;
  rank: string;
  role: string;
  bio: string;
  image?: string;
  contact?: string;
}

interface RosterEntry {
  id: string;
  name: string;
  badgeNumber: string;
  rank: string;
  division: string;
  status: "active" | "loa" | "suspended";
  joinDate: string;
}

interface SOPDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  version: string;
  lastUpdated: string;
}

interface Station {
  id: string;
  name: string;
  address: string;
  phone: string;
  staff: number;
  status: "Active" | "Inactive";
  image?: string;
}

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  requirements: string[];
  certificationLevel?: string;
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
  announcements: Announcement[];
  events: DepartmentEvent[];
  news: NewsArticle[];
  quickStats: QuickStat[];
  leadership: LeadershipProfile[];
  roster: RosterEntry[];
  sops: SOPDocument[];
  stations: Station[];
  training: TrainingProgram[];
}

export default function DepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<"POLICE" | "FIRE" | "EMS">("POLICE");
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const defaultDepartments: Record<string, DepartmentSettings> = {
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
      announcements: [
        { id: "1", title: "New Traffic Policy Update", message: "Review new traffic enforcement procedures", type: "Policy", urgent: false, date: "Dec 14, 2025" },
        { id: "2", title: "Promotion Ceremony - Friday 6PM", message: "Join us to congratulate promoted officers", type: "Event", urgent: false, date: "Dec 13, 2025" },
      ],
      events: [
        { id: "1", title: "Active Shooter Training", description: "Mandatory training for all patrol officers", date: "Dec 28, 2025", time: "08:00 - 16:00", location: "Training Facility" },
        { id: "2", title: "Department Awards Ceremony", description: "Annual recognition event", date: "Jan 5, 2026", time: "18:00 - 21:00", location: "City Hall" },
      ],
      news: [
        { id: "1", title: "Officer Martinez Receives Medal of Valor", description: "Recognized for heroic actions during armed robbery response", date: "Dec 20, 2025" },
        { id: "2", title: "New Crime Prevention Initiative Launched", description: "Community partnership program reduces crime by 15%", date: "Dec 18, 2025" },
      ],
      quickStats: [
        { id: "1", label: "Active Officers", value: "64", icon: "Users", color: "blue" },
        { id: "2", label: "Units on Duty", value: "12", icon: "Radio", color: "green" },
        { id: "3", label: "Active Calls", value: "8", icon: "Phone", color: "yellow" },
        { id: "4", label: "Response Time", value: "4.2min", icon: "Clock", color: "purple" },
      ],
      leadership: [
        { id: "1", name: "Chief James Anderson", rank: "Chief of Police", role: "Department Head", bio: "Leading the department with 25 years of experience in law enforcement." },
        { id: "2", name: "Deputy Chief Sarah Williams", rank: "Deputy Chief", role: "Operations Commander", bio: "Oversees daily operations and special units." },
      ],
      roster: [],
      sops: [
        { id: "1", title: "Traffic Stop Procedures", category: "Patrol", content: "Standard procedures for conducting traffic stops safely and effectively.", version: "2.1", lastUpdated: "Dec 2025" },
        { id: "2", title: "Use of Force Policy", category: "General", content: "Guidelines for appropriate use of force in various situations.", version: "3.0", lastUpdated: "Nov 2025" },
      ],
      stations: [
        { id: "1", name: "Mission Row Station", address: "1200 Mission Row, Downtown", phone: "(555) 0100", staff: 45, status: "Active" },
        { id: "2", name: "Vespucci Police Station", address: "440 Vespucci Blvd", phone: "(555) 0101", staff: 28, status: "Active" },
      ],
      training: [
        { id: "1", title: "Basic Police Academy", description: "Foundational training for new recruits", duration: "6 months", instructor: "Sgt. Johnson", requirements: ["High school diploma", "Clean record"] },
        { id: "2", title: "Field Training Officer Program", description: "Advanced training for FTO certification", duration: "3 months", instructor: "Lt. Davis", requirements: ["2 years experience", "Senior Officer rank"], certificationLevel: "FTO" },
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
      announcements: [
        { id: "1", title: "Equipment Inspection Due", message: "All apparatus require monthly inspection", type: "Notice", urgent: false, date: "Dec 15, 2025" },
      ],
      events: [
        { id: "1", title: "Fire Safety Awareness Week", description: "Community outreach program", date: "Jan 10, 2026", time: "All Week", location: "Various Locations" },
      ],
      news: [
        { id: "1", title: "Station 2 Renovation Complete", description: "Modernized facilities now operational", date: "Dec 22, 2025" },
      ],
      quickStats: [
        { id: "1", label: "Active Firefighters", value: "42", icon: "Users", color: "red" },
        { id: "2", label: "Units Available", value: "8", icon: "Flame", color: "orange" },
        { id: "3", label: "Active Calls", value: "3", icon: "Phone", color: "yellow" },
        { id: "4", label: "Response Time", value: "5.8min", icon: "Clock", color: "red" },
      ],
      leadership: [
        { id: "1", name: "Fire Chief Michael Roberts", rank: "Fire Chief", role: "Department Head", bio: "Leading fire operations with 30 years of firefighting experience." },
      ],
      roster: [],
      sops: [
        { id: "1", title: "Structure Fire Response", category: "Operations", content: "Standard procedures for responding to structure fires.", version: "1.5", lastUpdated: "Dec 2025" },
      ],
      stations: [
        { id: "1", name: "Fire Station 1", address: "100 Fire Department Ave", phone: "(555) 0200", staff: 25, status: "Active" },
      ],
      training: [
        { id: "1", title: "Firefighter I Academy", description: "Basic firefighter training and certification", duration: "4 months", instructor: "Capt. Thompson", requirements: ["Physical fitness test", "EMT-B"] },
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
      announcements: [
        { id: "1", title: "New ALS Protocols", message: "Updated advanced life support procedures effective immediately", type: "Policy", urgent: true, date: "Dec 20, 2025" },
      ],
      events: [
        { id: "1", title: "CPR Recertification", description: "Annual CPR and AED training", date: "Dec 30, 2025", time: "09:00 - 17:00", location: "EMS Training Center" },
      ],
      news: [
        { id: "1", title: "EMS Response Times Improved", description: "Average response time reduced to 4.5 minutes", date: "Dec 19, 2025" },
      ],
      quickStats: [
        { id: "1", label: "Active Medics", value: "28", icon: "Users", color: "green" },
        { id: "2", label: "Ambulances Ready", value: "6", icon: "Heart", color: "emerald" },
        { id: "3", label: "Active Calls", value: "5", icon: "Phone", color: "yellow" },
        { id: "4", label: "Response Time", value: "4.5min", icon: "Clock", color: "green" },
      ],
      leadership: [
        { id: "1", name: "EMS Director Lisa Chen", rank: "EMS Chief", role: "Department Head", bio: "20 years in emergency medicine and paramedicine." },
      ],
      roster: [],
      sops: [
        { id: "1", title: "Advanced Life Support Protocols", category: "Medical", content: "ALS procedures and medication administration guidelines.", version: "4.2", lastUpdated: "Dec 2025" },
      ],
      stations: [
        { id: "1", name: "EMS Base 1", address: "200 Medical Plaza", phone: "(555) 0300", staff: 18, status: "Active" },
      ],
      training: [
        { id: "1", title: "Paramedic Program", description: "Advanced paramedic certification course", duration: "12 months", instructor: "Dr. Martinez", requirements: ["EMT-B certification", "College prerequisites"], certificationLevel: "Paramedic" },
      ],
    },
  };

  const [departments, setDepartments] = useState<Record<string, DepartmentSettings>>(defaultDepartments);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  // Check scroll position
  const checkScroll = () => {
    const wrapper = tabsScrollRef.current;
    if (wrapper) {
      // Try multiple selectors to find the scrollable element
      const element = 
        wrapper.querySelector('[role="tablist"]') as HTMLElement ||
        wrapper.querySelector('.tabs-scroll') as HTMLElement ||
        wrapper.querySelector('[class*="tabList"]') as HTMLElement;
      
      if (element) {
        const hasScroll = element.scrollWidth > element.clientWidth;
        setCanScrollLeft(element.scrollLeft > 5);
        setCanScrollRight(hasScroll && element.scrollLeft < element.scrollWidth - element.clientWidth - 5);
        
        // Debug log
        console.log('Scroll check:', {
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          scrollLeft: element.scrollLeft,
          hasScroll,
          canScrollLeft: element.scrollLeft > 5,
          canScrollRight: hasScroll && element.scrollLeft < element.scrollWidth - element.clientWidth - 5
        });
      }
    }
  };

  // Scroll tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    const wrapper = tabsScrollRef.current;
    if (wrapper) {
      const element = 
        wrapper.querySelector('[role="tablist"]') as HTMLElement ||
        wrapper.querySelector('.tabs-scroll') as HTMLElement ||
        wrapper.querySelector('[class*="tabList"]') as HTMLElement;
      
      if (element) {
        const scrollAmount = 300;
        element.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
        setTimeout(checkScroll, 100);
      }
    }
  };

  // Load department settings from database on mount
  useEffect(() => {
    const loadDepartmentSettings = async () => {
      try {
        const response = await fetch("/api/admin/departments");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error loading department settings:", error);
        toast.error("Failed to load department settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartmentSettings();
  }, []);

  // Check scroll on mount and resize
  useEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
      // Force another check after a longer delay
      setTimeout(checkScroll, 1000);
    }, 300);
    
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    
    // Set up mutation observer to detect when tabs are rendered
    const wrapper = tabsScrollRef.current;
    if (wrapper) {
      const observer = new MutationObserver(() => {
        checkScroll();
      });
      observer.observe(wrapper, { childList: true, subtree: true });
      
      const element = 
        wrapper.querySelector('[role="tablist"]') as HTMLElement ||
        wrapper.querySelector('.tabs-scroll') as HTMLElement ||
        wrapper.querySelector('[class*="tabList"]') as HTMLElement;
      
      if (element) {
        element.addEventListener('scroll', checkScroll);
        // Initial check on the element
        setTimeout(checkScroll, 100);
      }
      
      return () => {
        clearTimeout(timer);
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        const el = 
          wrapper.querySelector('[role="tablist"]') as HTMLElement ||
          wrapper.querySelector('.tabs-scroll') as HTMLElement ||
          wrapper.querySelector('[class*="tabList"]') as HTMLElement;
        if (el) {
          el.removeEventListener('scroll', checkScroll);
        }
      };
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      const response = await fetch("/api/admin/departments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departments),
      });
      
      if (response.ok) {
        toast.success("Department settings saved successfully!");
        setHasChanges(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving department settings:", error);
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin">
              <SettingsIcon className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-gray-400 text-lg">Loading department settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
          <CardBody className="p-0">
            <div className="relative">
              {/* Left scroll button */}
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className={`absolute left-2 top-[32px] -translate-y-1/2 z-50 bg-gray-800/95 hover:bg-gray-700 backdrop-blur-sm shadow-lg transition-opacity ${
                  canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onPress={() => scrollTabs('left')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Right scroll button */}
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className={`absolute right-2 top-[32px] -translate-y-1/2 z-50 bg-gray-800/95 hover:bg-gray-700 backdrop-blur-sm shadow-lg transition-opacity ${
                  canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onPress={() => scrollTabs('right')}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Debug info - remove after testing */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white text-xs px-2 py-1 rounded">
                L: {canScrollLeft ? '✓' : '✗'} | R: {canScrollRight ? '✓' : '✗'}
              </div>

            <style jsx global>{`
              .tabs-scroll::-webkit-scrollbar {
                height: 6px;
              }
              .tabs-scroll::-webkit-scrollbar-track {
                background: rgba(31, 41, 55, 0.5);
                border-radius: 3px;
              }
              .tabs-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(to right, #6366f1, #a855f7);
                border-radius: 3px;
              }
              .tabs-scroll::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to right, #4f46e5, #9333ea);
              }
            `}</style>
            <div 
              ref={tabsScrollRef}
            >
            <Tabs 
              aria-label="Department settings" 
              size="lg"
              variant="underlined"
              classNames={{
                base: "w-full",
                tabList: "tabs-scroll gap-6 w-full relative rounded-none p-4 border-b border-gray-800 bg-gray-900/30 overflow-x-auto scroll-smooth",
                cursor: "w-full bg-gradient-to-r from-indigo-500 to-purple-500",
                tab: "max-w-fit px-4 h-12 flex-shrink-0",
                tabContent: "group-data-[selected=true]:text-white text-gray-400 font-medium whitespace-nowrap"
              }}
            >
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
                <div className="space-y-6 p-6">
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
                <div className="space-y-6 p-6">
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
                        <SelectItem key="to-r">
                          Left to Right
                        </SelectItem>
                        <SelectItem key="to-l">
                          Right to Left
                        </SelectItem>
                        <SelectItem key="to-b">
                          Top to Bottom
                        </SelectItem>
                        <SelectItem key="to-t">
                          Bottom to Top
                        </SelectItem>
                        <SelectItem key="to-br">
                          Diagonal (Top-Left to Bottom-Right)
                        </SelectItem>
                        <SelectItem key="to-bl">
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
                        <SelectItem key="solid">
                          Solid
                        </SelectItem>
                        <SelectItem key="dashed">
                          Dashed
                        </SelectItem>
                        <SelectItem key="dotted">
                          Dotted
                        </SelectItem>
                        <SelectItem key="none">
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
                <div className="space-y-6 p-6">
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
                <div className="space-y-6 p-6">
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
                <div className="space-y-6 p-6">
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
                <div className="space-y-6 p-6">
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
                <div className="space-y-6 p-6">
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

              {/* Announcements Tab */}
              <Tab
                key="announcements"
                title={
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Announcements</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Department Announcements</h3>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newAnnouncement: Announcement = {
                          id: Date.now().toString(),
                          title: "New Announcement",
                          message: "Enter announcement details",
                          type: "Notice",
                          urgent: false,
                          date: new Date().toLocaleDateString()
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            announcements: [...prev[selectedDept].announcements, newAnnouncement]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Announcement
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentSettings.announcements.map((announcement, index) => (
                      <Card key={announcement.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 grid grid-cols-2 gap-4">
                                <Input
                                  label="Title"
                                  value={announcement.title}
                                  onChange={(e) => {
                                    const updated = [...currentSettings.announcements];
                                    updated[index].title = e.target.value;
                                    handleSettingsChange("announcements", updated);
                                  }}
                                />
                                <Select
                                  label="Type"
                                  selectedKeys={[announcement.type]}
                                  onChange={(e) => {
                                    const updated = [...currentSettings.announcements];
                                    updated[index].type = e.target.value as any;
                                    handleSettingsChange("announcements", updated);
                                  }}
                                >
                                  <SelectItem key="Policy">Policy</SelectItem>
                                  <SelectItem key="Event">Event</SelectItem>
                                  <SelectItem key="Notice">Notice</SelectItem>
                                  <SelectItem key="Training">Training</SelectItem>
                                  <SelectItem key="Alert">Alert</SelectItem>
                                </Select>
                              </div>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = currentSettings.announcements.filter((_, i) => i !== index);
                                  handleSettingsChange("announcements", updated);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Textarea
                              label="Message"
                              value={announcement.message}
                              onChange={(e) => {
                                const updated = [...currentSettings.announcements];
                                updated[index].message = e.target.value;
                                handleSettingsChange("announcements", updated);
                              }}
                              minRows={2}
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Switch
                                  size="sm"
                                  isSelected={announcement.urgent}
                                  onValueChange={(value) => {
                                    const updated = [...currentSettings.announcements];
                                    updated[index].urgent = value;
                                    handleSettingsChange("announcements", updated);
                                  }}
                                >
                                  <span className="text-sm">Urgent</span>
                                </Switch>
                              </div>
                              <span className="text-sm text-gray-400">{announcement.date}</span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Events Tab */}
              <Tab
                key="events"
                title={
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Events</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Department Events</h3>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newEvent: DepartmentEvent = {
                          id: Date.now().toString(),
                          title: "New Event",
                          description: "Event description",
                          date: new Date().toLocaleDateString(),
                          time: "00:00",
                          location: "TBD"
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            events: [...prev[selectedDept].events, newEvent]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Event
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentSettings.events.map((event, index) => (
                      <Card key={event.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <Input
                                label="Event Title"
                                value={event.title}
                                onChange={(e) => {
                                  const updated = [...currentSettings.events];
                                  updated[index].title = e.target.value;
                                  handleSettingsChange("events", updated);
                                }}
                                className="flex-1"
                              />
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = currentSettings.events.filter((_, i) => i !== index);
                                  handleSettingsChange("events", updated);
                                }}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Textarea
                              label="Description"
                              value={event.description}
                              onChange={(e) => {
                                const updated = [...currentSettings.events];
                                updated[index].description = e.target.value;
                                handleSettingsChange("events", updated);
                              }}
                              minRows={2}
                            />
                            <div className="grid grid-cols-3 gap-4">
                              <Input
                                label="Date"
                                value={event.date}
                                onChange={(e) => {
                                  const updated = [...currentSettings.events];
                                  updated[index].date = e.target.value;
                                  handleSettingsChange("events", updated);
                                }}
                              />
                              <Input
                                label="Time"
                                value={event.time}
                                onChange={(e) => {
                                  const updated = [...currentSettings.events];
                                  updated[index].time = e.target.value;
                                  handleSettingsChange("events", updated);
                                }}
                              />
                              <Input
                                label="Location"
                                value={event.location}
                                onChange={(e) => {
                                  const updated = [...currentSettings.events];
                                  updated[index].location = e.target.value;
                                  handleSettingsChange("events", updated);
                                }}
                              />
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* News Tab */}
              <Tab
                key="news"
                title={
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>News</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Department News</h3>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newArticle: NewsArticle = {
                          id: Date.now().toString(),
                          title: "New Article",
                          description: "Article description",
                          date: new Date().toLocaleDateString()
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            news: [...prev[selectedDept].news, newArticle]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add News Article
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentSettings.news.map((article, index) => (
                      <Card key={article.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <Input
                                label="Article Title"
                                value={article.title}
                                onChange={(e) => {
                                  const updated = [...currentSettings.news];
                                  updated[index].title = e.target.value;
                                  handleSettingsChange("news", updated);
                                }}
                                className="flex-1"
                              />
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = currentSettings.news.filter((_, i) => i !== index);
                                  handleSettingsChange("news", updated);
                                }}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Textarea
                              label="Description"
                              value={article.description}
                              onChange={(e) => {
                                const updated = [...currentSettings.news];
                                updated[index].description = e.target.value;
                                handleSettingsChange("news", updated);
                              }}
                              minRows={2}
                            />
                            <Input
                              label="Publish Date"
                              value={article.date}
                              onChange={(e) => {
                                const updated = [...currentSettings.news];
                                updated[index].date = e.target.value;
                                handleSettingsChange("news", updated);
                              }}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Quick Stats Tab */}
              <Tab
                key="quickstats"
                title={
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Quick Stats</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Dashboard Quick Stats</h3>
                      <p className="text-sm text-gray-400">Statistics shown on the department homepage</p>
                    </div>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newStat: QuickStat = {
                          id: Date.now().toString(),
                          label: "New Stat",
                          value: "0",
                          icon: "Users",
                          color: "blue"
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            quickStats: [...prev[selectedDept].quickStats, newStat]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Stat
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {currentSettings.quickStats.map((stat, index) => (
                      <Card key={stat.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-semibold text-white">Stat #{index + 1}</h4>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = currentSettings.quickStats.filter((_, i) => i !== index);
                                  handleSettingsChange("quickStats", updated);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Input
                              label="Label"
                              value={stat.label}
                              onChange={(e) => {
                                const updated = [...currentSettings.quickStats];
                                updated[index].label = e.target.value;
                                handleSettingsChange("quickStats", updated);
                              }}
                              size="sm"
                            />
                            <Input
                              label="Value"
                              value={stat.value}
                              onChange={(e) => {
                                const updated = [...currentSettings.quickStats];
                                updated[index].value = e.target.value;
                                handleSettingsChange("quickStats", updated);
                              }}
                              size="sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                label="Icon Name"
                                value={stat.icon}
                                onChange={(e) => {
                                  const updated = [...currentSettings.quickStats];
                                  updated[index].icon = e.target.value;
                                  handleSettingsChange("quickStats", updated);
                                }}
                                size="sm"
                              />
                              <Select
                                label="Color"
                                selectedKeys={[stat.color]}
                                onChange={(e) => {
                                  const updated = [...currentSettings.quickStats];
                                  updated[index].color = e.target.value;
                                  handleSettingsChange("quickStats", updated);
                                }}
                                size="sm"
                              >
                                <SelectItem key="blue">Blue</SelectItem>
                                <SelectItem key="green">Green</SelectItem>
                                <SelectItem key="red">Red</SelectItem>
                                <SelectItem key="yellow">Yellow</SelectItem>
                                <SelectItem key="purple">Purple</SelectItem>
                                <SelectItem key="orange">Orange</SelectItem>
                              </Select>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Leadership Tab */}
              <Tab
                key="leadership"
                title={
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Leadership</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Leadership Team</h3>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newLeader: LeadershipProfile = {
                          id: Date.now().toString(),
                          name: "New Leader",
                          rank: "Rank",
                          role: "Role",
                          bio: "Biography",
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            leadership: [...prev[selectedDept].leadership, newLeader]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Leader
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(currentSettings.leadership || []).map((leader, index) => (
                      <Card key={leader.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-semibold text-white">Profile #{index + 1}</h4>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = (currentSettings.leadership || []).filter((_, i) => i !== index);
                                  handleSettingsChange("leadership", updated);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Name"
                                value={leader.name}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.leadership || [])];
                                  updated[index].name = e.target.value;
                                  handleSettingsChange("leadership", updated);
                                }}
                                size="sm"
                              />
                              <Input
                                label="Rank"
                                value={leader.rank}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.leadership || [])];
                                  updated[index].rank = e.target.value;
                                  handleSettingsChange("leadership", updated);
                                }}
                                size="sm"
                              />
                            </div>
                            <Input
                              label="Role"
                              value={leader.role}
                              onChange={(e) => {
                                const updated = [...(currentSettings.leadership || [])];
                                updated[index].role = e.target.value;
                                handleSettingsChange("leadership", updated);
                              }}
                              size="sm"
                            />
                            <Textarea
                              label="Biography"
                              value={leader.bio}
                              onChange={(e) => {
                                const updated = [...(currentSettings.leadership || [])];
                                updated[index].bio = e.target.value;
                                handleSettingsChange("leadership", updated);
                              }}
                              minRows={3}
                              size="sm"
                            />
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Roster Tab */}
              <Tab
                key="roster"
                title={
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Roster</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Department Roster</h3>
                      <p className="text-sm text-gray-400">Manage department personnel roster</p>
                    </div>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newRosterEntry: RosterEntry = {
                          id: Date.now().toString(),
                          name: "New Member",
                          badgeNumber: "000",
                          rank: "Officer",
                          division: "Patrol",
                          status: "active",
                          joinDate: new Date().toLocaleDateString(),
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            roster: [...(prev[selectedDept].roster || []), newRosterEntry],
                          },
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Roster Entry
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(currentSettings.roster || []).map((entry, index) => (
                      <Card key={entry.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {entry.badgeNumber}
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-white">{entry.name}</h4>
                                  <p className="text-xs text-gray-400">{entry.rank} - {entry.division}</p>
                                </div>
                              </div>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = (currentSettings.roster || []).filter((_, i) => i !== index);
                                  handleSettingsChange("roster", updated);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Name"
                                value={entry.name}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.roster || [])];
                                  updated[index].name = e.target.value;
                                  handleSettingsChange("roster", updated);
                                }}
                                size="sm"
                              />
                              <Input
                                label="Badge Number"
                                value={entry.badgeNumber}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.roster || [])];
                                  updated[index].badgeNumber = e.target.value;
                                  handleSettingsChange("roster", updated);
                                }}
                                size="sm"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                label="Rank"
                                value={entry.rank}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.roster || [])];
                                  updated[index].rank = e.target.value;
                                  handleSettingsChange("roster", updated);
                                }}
                                size="sm"
                              />
                              <Input
                                label="Division"
                                value={entry.division}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.roster || [])];
                                  updated[index].division = e.target.value;
                                  handleSettingsChange("roster", updated);
                                }}
                                size="sm"
                              />
                              <Select
                                label="Status"
                                selectedKeys={[entry.status]}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.roster || [])];
                                  updated[index].status = e.target.value as "active" | "loa" | "suspended";
                                  handleSettingsChange("roster", updated);
                                }}
                                size="sm"
                              >
                                <SelectItem key="active">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Active</span>
                                  </div>
                                </SelectItem>
                                <SelectItem key="loa">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span>Leave of Absence</span>
                                  </div>
                                </SelectItem>
                                <SelectItem key="suspended">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span>Suspended</span>
                                  </div>
                                </SelectItem>
                              </Select>
                            </div>
                            <div>
                              <Input
                                label="Join Date"
                                type="date"
                                value={entry.joinDate}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.roster || [])];
                                  updated[index].joinDate = e.target.value;
                                  handleSettingsChange("roster", updated);
                                }}
                                size="sm"
                                className="max-w-xs"
                              />
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* SOPs Tab */}
              <Tab
                key="sops"
                title={
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>SOPs</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Standard Operating Procedures</h3>
                      <p className="text-sm text-gray-400">Department policies and procedures</p>
                    </div>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newSOP: SOPDocument = {
                          id: Date.now().toString(),
                          title: "New SOP",
                          category: "General",
                          content: "SOP content goes here...",
                          version: "1.0",
                          lastUpdated: new Date().toLocaleDateString(),
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            sops: [...prev[selectedDept].sops, newSOP]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add SOP
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(currentSettings.sops || []).map((sop, index) => (
                      <Card key={sop.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 grid grid-cols-3 gap-3">
                                <Input
                                  label="Title"
                                  value={sop.title}
                                  onChange={(e) => {
                                    const updated = [...(currentSettings.sops || [])];
                                    updated[index].title = e.target.value;
                                    handleSettingsChange("sops", updated);
                                  }}
                                  size="sm"
                                />
                                <Input
                                  label="Category"
                                  value={sop.category}
                                  onChange={(e) => {
                                    const updated = [...(currentSettings.sops || [])];
                                    updated[index].category = e.target.value;
                                    handleSettingsChange("sops", updated);
                                  }}
                                  size="sm"
                                />
                                <Input
                                  label="Version"
                                  value={sop.version}
                                  onChange={(e) => {
                                    const updated = [...(currentSettings.sops || [])];
                                    updated[index].version = e.target.value;
                                    handleSettingsChange("sops", updated);
                                  }}
                                  size="sm"
                                />
                              </div>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = (currentSettings.sops || []).filter((_, i) => i !== index);
                                  handleSettingsChange("sops", updated);
                                }}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Textarea
                              label="Content"
                              value={sop.content}
                              onChange={(e) => {
                                const updated = [...(currentSettings.sops || [])];
                                updated[index].content = e.target.value;
                                handleSettingsChange("sops", updated);
                              }}
                              minRows={4}
                              size="sm"
                            />
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Stations Tab */}
              <Tab
                key="stations"
                title={
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Stations</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Department Stations</h3>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newStation: Station = {
                          id: Date.now().toString(),
                          name: "New Station",
                          address: "Address",
                          phone: "(555) 0000",
                          staff: 0,
                          status: "Active",
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            stations: [...prev[selectedDept].stations, newStation]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Station
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(currentSettings.stations || []).map((station, index) => (
                      <Card key={station.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-semibold text-white">{station.name}</h4>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = (currentSettings.stations || []).filter((_, i) => i !== index);
                                  handleSettingsChange("stations", updated);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Input
                              label="Station Name"
                              value={station.name}
                              onChange={(e) => {
                                const updated = [...(currentSettings.stations || [])];
                                updated[index].name = e.target.value;
                                handleSettingsChange("stations", updated);
                              }}
                              size="sm"
                            />
                            <Textarea
                              label="Address"
                              value={station.address}
                              onChange={(e) => {
                                const updated = [...(currentSettings.stations || [])];
                                updated[index].address = e.target.value;
                                handleSettingsChange("stations", updated);
                              }}
                              minRows={2}
                              size="sm"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Phone"
                                value={station.phone}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.stations || [])];
                                  updated[index].phone = e.target.value;
                                  handleSettingsChange("stations", updated);
                                }}
                                size="sm"
                              />
                              <Input
                                label="Staff Count"
                                type="number"
                                value={station.staff.toString()}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.stations || [])];
                                  updated[index].staff = parseInt(e.target.value) || 0;
                                  handleSettingsChange("stations", updated);
                                }}
                                size="sm"
                              />
                            </div>
                            <Select
                              label="Status"
                              selectedKeys={[station.status]}
                              onChange={(e) => {
                                const updated = [...(currentSettings.stations || [])];
                                updated[index].status = e.target.value as any;
                                handleSettingsChange("stations", updated);
                              }}
                              size="sm"
                            >
                              <SelectItem key="Active">Active</SelectItem>
                              <SelectItem key="Inactive">Inactive</SelectItem>
                            </Select>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              {/* Training Tab */}
              <Tab
                key="training"
                title={
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Training</span>
                  </div>
                }
              >
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Training Programs</h3>
                    <Button
                      color="primary"
                      startContent={<Plus className="w-4 h-4" />}
                      size="sm"
                      onPress={() => {
                        const newTraining: TrainingProgram = {
                          id: Date.now().toString(),
                          title: "New Training",
                          description: "Training description",
                          duration: "TBD",
                          instructor: "Instructor Name",
                          requirements: [],
                        };
                        setDepartments(prev => ({
                          ...prev,
                          [selectedDept]: {
                            ...prev[selectedDept],
                            training: [...prev[selectedDept].training, newTraining]
                          }
                        }));
                        setHasChanges(true);
                      }}
                    >
                      Add Training
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(currentSettings.training || []).map((training, index) => (
                      <Card key={training.id} className="bg-gray-800/50 border border-gray-700">
                        <CardBody className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <Input
                                label="Training Title"
                                value={training.title}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.training || [])];
                                  updated[index].title = e.target.value;
                                  handleSettingsChange("training", updated);
                                }}
                                className="flex-1"
                                size="sm"
                              />
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                  const updated = (currentSettings.training || []).filter((_, i) => i !== index);
                                  handleSettingsChange("training", updated);
                                }}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <Textarea
                              label="Description"
                              value={training.description}
                              onChange={(e) => {
                                const updated = [...(currentSettings.training || [])];
                                updated[index].description = e.target.value;
                                handleSettingsChange("training", updated);
                              }}
                              minRows={2}
                              size="sm"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Duration"
                                value={training.duration}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.training || [])];
                                  updated[index].duration = e.target.value;
                                  handleSettingsChange("training", updated);
                                }}
                                size="sm"
                              />
                              <Input
                                label="Instructor"
                                value={training.instructor}
                                onChange={(e) => {
                                  const updated = [...(currentSettings.training || [])];
                                  updated[index].instructor = e.target.value;
                                  handleSettingsChange("training", updated);
                                }}
                                size="sm"
                              />
                            </div>
                            <Textarea
                              label="Requirements (comma-separated)"
                              value={training.requirements.join(", ")}
                              onChange={(e) => {
                                const updated = [...(currentSettings.training || [])];
                                updated[index].requirements = e.target.value.split(",").map(r => r.trim()).filter(r => r);
                                handleSettingsChange("training", updated);
                              }}
                              minRows={2}
                              size="sm"
                            />
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>
            </Tabs>
            </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}



