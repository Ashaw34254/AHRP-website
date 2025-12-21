"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { FleetManagement } from "@/components/FleetManagement";

export default function FleetPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <FleetManagement />
      </div>
    </DashboardLayout>
  );
}
