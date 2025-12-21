"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { TrainingRecords } from "@/components/TrainingRecords";

export default function TrainingPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <TrainingRecords />
      </div>
    </DashboardLayout>
  );
}
