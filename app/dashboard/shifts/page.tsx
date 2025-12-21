"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { ShiftScheduling } from "@/components/ShiftScheduling";

export default function ShiftsPage() {
  return (
    <DashboardLayout>
      <ShiftScheduling />
    </DashboardLayout>
  );
}
