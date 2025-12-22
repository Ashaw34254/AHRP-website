"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Users, 
  FileText, 
  Bell, 
  Settings,
  LogOut,
  Shield,
  Flame,
  Heart,
  Radio,
  Car,
  GraduationCap,
  Calendar,
  AlertCircle,
  Gavel,
  Database,
  MessageSquare,
  ShieldAlert,
  Zap,
  Keyboard,
  Sun,
  Moon,
  MapPin,
  Server,
  Search,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { useTheme } from "@/lib/theme-context";
import { GlobalSearch } from "@/components/GlobalSearch";
import EnhancedVoiceWidget from "@/components/EnhancedVoiceWidget";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// User Section
const userNav = [
  { name: "Profile", href: "/dashboard", icon: User },
  { name: "Characters", href: "/dashboard/characters", icon: Users },
  { name: "Applications", href: "/dashboard/applications", icon: FileText },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

// CAD Operations
const cadNav = [
  { name: "Police CAD", href: "/dashboard/police/cad", icon: Shield },
  { name: "Fire CAD", href: "/dashboard/fire/cad", icon: Flame },
  { name: "Ambo CAD", href: "/dashboard/ems/cad", icon: Heart },
  { name: "Dispatch Center", href: "/dashboard/dispatch", icon: Radio },
  { name: "MDT Messaging", href: "/dashboard/mdt", icon: MessageSquare },
  { name: "Supervisor Alerts", href: "/dashboard/supervisor", icon: ShieldAlert },
  { name: "Call Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Quick Actions", href: "/dashboard/quick-actions", icon: Zap },
];

// Records Management
const recordsNav = [
  { name: "Incident Reports", href: "/dashboard/incidents", icon: AlertCircle },
  { name: "Court Cases", href: "/dashboard/court", icon: Gavel },
  { name: "Civil Records", href: "/dashboard/civil-records", icon: Database },
  { name: "Medical Records", href: "/dashboard/medical", icon: Heart },
];

// Fleet & Personnel
const managementNav = [
  { name: "Fleet Management", href: "/dashboard/fleet", icon: Car },
  { name: "Training Records", href: "/dashboard/training", icon: GraduationCap },
  { name: "Shift Scheduling", href: "/dashboard/shifts", icon: Calendar },
];

// Tools & Integration
const toolsNav = [
  { name: "Zone Management", href: "/dashboard/zones", icon: MapPin },
  { name: "FiveM Integration", href: "/dashboard/fivem", icon: Server },
  { name: "Keyboard Shortcuts", href: "/dashboard/shortcuts", icon: Keyboard },
];

const departmentNav = [
  { name: "Police", href: "/dashboard/police", icon: Shield },
  { name: "Fire", href: "/dashboard/fire", icon: Flame },
  { name: "EMS", href: "/dashboard/ems", icon: Heart },
];

const settingsNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              Aurora Horizon RP
            </h2>
          </Link>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`
            w-64 min-h-screen border-r border-gray-800 bg-black/50 flex flex-col
            fixed lg:sticky top-16 lg:top-0 bottom-0 left-0 z-40
            transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-6">
            <Link href="/">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                Aurora Horizon RP
              </h2>
            </Link>
          </div>

          {/* Theme Toggle and Sign Out at Top */}
          <div className="px-3 pb-4 space-y-2">
            <Button
              fullWidth
              variant="bordered"
              color="success"
              startContent={<Search className="w-4 h-4" />}
              onPress={() => setSearchOpen(true)}
            >
              Search (Ctrl+K)
            </Button>
            
            <Button
              fullWidth
              variant="bordered"
              color="primary"
              startContent={
                theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
            
            <Button
              fullWidth
              variant="bordered"
              color="danger"
              startContent={<LogOut className="w-4 h-4" />}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>

          <nav className="px-3 space-y-1 flex-1 overflow-y-auto pb-6">
            {/* User Section */}
            {userNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-indigo-600 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* CAD Operations Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                CAD Operations
              </p>
              {cadNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Records Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Records
              </p>
              {recordsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Fleet & Personnel Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Fleet & Personnel
              </p>
              {managementNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Tools Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tools
              </p>
              {toolsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Departments Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Departments
              </p>
              {departmentNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Settings Section */}
            <div className="pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Settings
              </p>
              {settingsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? "bg-indigo-600 text-white" 
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full lg:w-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Enhanced Voice Control Widget */}
      <EnhancedVoiceWidget />
    </div>
  );
}
