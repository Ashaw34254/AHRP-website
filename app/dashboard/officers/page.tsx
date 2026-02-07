"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { OfficerProfiles } from "@/components/OfficerProfiles";

export default function OfficersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <OfficerProfiles />
      </div>
    </DashboardLayout>
  );
}
