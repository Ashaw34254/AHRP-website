"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Shield,
  Calendar,
  Settings,
  LogOut,
  Menu,
  FileBarChart
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Application Types", href: "/admin/application-types", icon: FileText },
  { name: "Form Builder", href: "/admin/form-builder", icon: FileText },
  { name: "App Analytics", href: "/admin/application-analytics", icon: FileBarChart },
  { name: "Roles", href: "/admin/roles", icon: Shield },
  { name: "Departments", href: "/admin/departments", icon: Shield },
  { name: "CAD Analytics", href: "/admin/analytics", icon: FileBarChart },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileBarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen border-r border-gray-800 bg-black/50 transition-all duration-300 flex flex-col`}>
          <div className="p-6 flex items-center justify-between flex-shrink-0">
            <Link href="/admin">
              <h2 className={`text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text ${!sidebarOpen && 'hidden'}`}>
                Admin
              </h2>
            </Link>
            <Button
              isIconOnly
              variant="light"
              onPress={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-red-600 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 space-y-2 border-t border-gray-800 mt-auto flex-shrink-0">
            <Link
              href="/dashboard"
              className="block"
            >
              <Button
                fullWidth
                variant="bordered"
                className={!sidebarOpen ? 'px-2' : ''}
              >
                {sidebarOpen ? 'User Dashboard' : '👤'}
              </Button>
            </Link>
            <Button
              fullWidth
              variant="bordered"
              color="danger"
              startContent={sidebarOpen ? <LogOut className="w-4 h-4" /> : undefined}
              onClick={() => signOut({ callbackUrl: "/" })}
              className={!sidebarOpen ? 'px-2' : ''}
            >
              {sidebarOpen ? 'Sign Out' : '🚪'}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
