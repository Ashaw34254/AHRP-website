"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { MDTMessaging } from "@/components/MDTMessaging";

export default function MDTPage() {
  return (
    <DashboardLayout>
      <MDTMessaging />
    </DashboardLayout>
  );
}
