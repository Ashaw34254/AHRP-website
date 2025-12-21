"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import { Radio, Phone, Search, History, Shield, Flame, Heart, AlertTriangle, MessageCircle, FileWarning, Map as MapIconTab } from "lucide-react";
import { CADDispatchConsole } from "@/components/CADDispatchConsole";
import { CADActiveCalls } from "@/components/CADActiveCalls";
import { CADUnitStatus } from "@/components/CADUnitStatus";
import { CADCivilSearch } from "@/components/CADCivilSearch";
import { CADCallHistory } from "@/components/CADCallHistory";
import { CADNewCallForm } from "@/components/CADNewCallForm";
import { PanicAlertMonitor } from "@/components/PanicAlertMonitor";
import { BOLOSystem } from "@/components/BOLOSystem";
import { BackupRequestSystem } from "@/components/BackupRequestSystem";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { WarrantManagement } from "@/components/WarrantManagement";
import { DispatcherChat } from "@/components/DispatcherChat";
import { LiveMap } from "@/components/LiveMap";
import { useState } from "react";

export default function DispatchCenterPage() {
  const [selectedTab, setSelectedTab] = useState("console");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCallCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      {/* Panic Alert Monitor - Fixed position overlay */}
      <PanicAlertMonitor />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Radio className="w-8 h-8 text-indigo-500" />
              Unified Dispatch Center
            </h1>
            <p className="text-gray-400 mt-1">Central Command - All Departments</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Police</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">Fire</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">EMS</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsPanel />
            <CADNewCallForm onCallCreated={handleCallCreated} />
          </div>
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
                <Radio className="w-4 h-4" />
                <span>Dispatch Console</span>
              </div>
            }
          >
            <div className="py-6">
              <CADDispatchConsole key={refreshKey} />
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
              <CADActiveCalls key={refreshKey} />
            </div>
          </Tab>

          <Tab
            key="units"
            title={
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                <span>All Units</span>
              </div>
            }
          >
            <div className="py-6">
              <CADUnitStatus />
            </div>
          </Tab>

          <Tab
            key="bolo"
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>BOLOs</span>
              </div>
            }
          >
            <div className="py-6">
              <BOLOSystem />
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
            key="backup"
            title={
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Backup Requests</span>
              </div>
            }
          >
            <div className="py-6">
              <BackupRequestSystem />
            </div>
          </Tab>

          <Tab
            key="warrants"
            title={
              <div className="flex items-center gap-2">
                <FileWarning className="w-4 h-4" />
                <span>Warrants & Citations</span>
              </div>
            }
          >
            <div className="py-6">
              <WarrantManagement />
            </div>
          </Tab>

          <Tab
            key="chat"
            title={
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Dispatcher Chat</span>
              </div>
            }
          >
            <div className="py-6">
              <DispatcherChat />
            </div>
          </Tab>

          <Tab
            key="map"
            title={
              <div className="flex items-center gap-2">
                <MapIconTab className="w-4 h-4" />
                <span>Live Map</span>
              </div>
            }
          >
            <div className="py-6">
              <LiveMap />
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
              <CADCallHistory />
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
