"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { MedicalRecords } from "@/components/MedicalRecords";

export default function MedicalPage() {
  return (
    <DashboardLayout>
      <MedicalRecords />
    </DashboardLayout>
  );
}
