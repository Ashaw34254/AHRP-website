"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Tabs, Tab } from "@nextui-org/react";
import { Shield, Radio, Phone, Search, History, Siren, Target } from "lucide-react";
import { CADDispatchConsole } from "@/components/CADDispatchConsole";
import { CADActiveCalls } from "@/components/CADActiveCalls";
import { CADUnitStatus } from "@/components/CADUnitStatus";
import { CADNewCallForm } from "@/components/CADNewCallForm";
import { CADCivilSearch } from "@/components/CADCivilSearch";
import { CADCallHistory } from "@/components/CADCallHistory";
import TacticalTeamManagement from "@/components/TacticalTeamManagement";
import { useState } from "react";

export default function PoliceCADPage() {
  const [selectedTab, setSelectedTab] = useState("dispatch");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCallCreated = () => {
    // Trigger refresh of active calls
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" />
              Police CAD System
            </h1>
            <p className="text-gray-400 mt-1">Computer-Aided Dispatch</p>
          </div>
          <CADNewCallForm department="POLICE" onCallCreated={handleCallCreated} />
        </div>

        {/* Tabs */}
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-800",
            cursor: "w-full bg-indigo-600",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-indigo-400"
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
              <CADDispatchConsole department="POLICE" />
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
              <CADActiveCalls department="POLICE" key={refreshKey} />
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
              <CADUnitStatus department="POLICE" />
            </div>
          </Tab>

          <Tab
            key="civil"
            title={
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Civil Records</span>
              </div>
            }
          >
            <div className="py-6">
              <CADCivilSearch />
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
              <CADCallHistory department="POLICE" />
            </div>
          </Tab>

          <Tab
            key="tactical"
            title={
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Tactical Teams</span>
              </div>
            }
          >
            <div className="py-6">
              <TacticalTeamManagement />
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
