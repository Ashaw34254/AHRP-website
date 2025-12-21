"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { SupervisorAlerts } from "@/components/SupervisorAlerts";

export default function SupervisorPage() {
  return (
    <DashboardLayout>
      <SupervisorAlerts />
    </DashboardLayout>
  );
}
