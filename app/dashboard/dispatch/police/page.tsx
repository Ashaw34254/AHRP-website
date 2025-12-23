"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, Tab } from "@nextui-org/react";
import { Shield, Radio, Phone, Search, History, Siren, AlertTriangle, FileText, MessageSquare, Bell, Gavel } from "lucide-react";
import { CADDispatchConsole } from "@/components/CADDispatchConsole";
import { CADActiveCalls } from "@/components/CADActiveCalls";
import { CADUnitStatus } from "@/components/CADUnitStatus";
import { CADNewCallForm } from "@/components/CADNewCallForm";
import { CADCivilSearch } from "@/components/CADCivilSearch";
import { CADCallHistory } from "@/components/CADCallHistory";
import { BOLOSystem } from "@/components/BOLOSystem";
import { WarrantManagement } from "@/components/WarrantManagement";
import { IncidentReports } from "@/components/IncidentReports";
import { PanicAlertMonitor } from "@/components/PanicAlertMonitor";
import { DispatcherChatModal } from "@/components/DispatcherChatModal";
import { useState } from "react";

export default function PoliceDispatchPage() {
  const [selectedTab, setSelectedTab] = useState("console");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" />
              Victoria Police Dispatch
            </h1>
            <p className="text-gray-400 mt-1">Emergency Call & Unit Management</p>
          </div>
          <CADNewCallForm onCallCreated={() => setRefreshKey(prev => prev + 1)} />
        </div>

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
            key="bolo"
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>BOLO</span>
              </div>
            }
          >
            <div className="py-6">
              <BOLOSystem />
            </div>
          </Tab>

          <Tab
            key="warrants"
            title={
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                <span>Warrants</span>
              </div>
            }
          >
            <div className="py-6">
              <WarrantManagement />
            </div>
          </Tab>

          <Tab
            key="incidents"
            title={
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Incidents</span>
              </div>
            }
          >
            <div className="py-6">
              <IncidentReports department="POLICE" />
            </div>
          </Tab>

          <Tab
            key="panic"
            title={
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Panic Alerts</span>
              </div>
            }
          >
            <div className="py-6">
              <PanicAlertMonitor department="POLICE" />
            </div>
          </Tab>
        </Tabs>
      </div>
      
      {/* Floating Chat Button */}
      <DispatcherChatModal department="POLICE" />
    </DashboardLayout>
  );
}
