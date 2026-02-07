"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { StaffReports } from "@/components/StaffReports";
import { Tabs, Tab } from "@heroui/react";
import { FileText, Shield } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports Management</h1>
            <p className="text-gray-400 mt-2">
              Manage staff reports from FiveM server in real-time
            </p>
          </div>
        </div>

        <Tabs aria-label="Report types" color="primary" size="lg">
          <Tab
            key="staff-reports"
            title={
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Staff Reports (FiveM)</span>
              </div>
            }
          >
            <StaffReports />
          </Tab>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
