"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, Tab } from "@nextui-org/react";
import { Flame, Radio, Phone, History, Siren } from "lucide-react";
import { CADDispatchConsole } from "@/components/CADDispatchConsole";
import { CADActiveCalls } from "@/components/CADActiveCalls";
import { CADUnitStatus } from "@/components/CADUnitStatus";
import { CADNewCallForm } from "@/components/CADNewCallForm";
import { CADCallHistory } from "@/components/CADCallHistory";
import { useState } from "react";

export default function FireCADPage() {
  const [selectedTab, setSelectedTab] = useState("dispatch");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Flame className="w-8 h-8 text-red-500" />
              Fire CAD System
            </h1>
            <p className="text-gray-400 mt-1">Computer-Aided Dispatch</p>
          </div>
          <CADNewCallForm department="FIRE" onCallCreated={() => setRefreshKey(prev => prev + 1)} />
        </div>

        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="danger"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-800",
            cursor: "w-full bg-red-600",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-red-400"
          }}
        >
          <Tab
            key="console"
            title={
              <div className="flex items-center gap-2">
                <Siren className="w-4 h-4" />
                <span>Dispatch Console</span>
              </div>
            }
          >
            <div className="py-6">
              <CADDispatchConsole department="FIRE" />
            </div>
          </Tab>

          <Tab
            key="calls"
            title={
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Active Calls</span>
              </div>
            }
          >
            <div className="py-6">
              <CADActiveCalls department="FIRE" key={refreshKey} />
            </div>
          </Tab>

          <Tab
            key="units"
            title={
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                <span>Unit Status</span>
              </div>
            }
          >
            <div className="py-6">
              <CADUnitStatus department="FIRE" />
            </div>
          </Tab>

          <Tab
            key="history"
            title={
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span>Call History</span>
              </div>
            }
          >
            <div className="py-6">
              <CADCallHistory department="FIRE" />
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
