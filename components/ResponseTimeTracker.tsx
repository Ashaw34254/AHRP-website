"use client";

import { Card, CardBody, Chip, Progress } from "@nextui-org/react";
import { Clock, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ResponseTimeData {
  callId: string;
  callNumber: string;
  type: string;
  priority: string;
  department: string;
  createdAt: string;
  dispatchedAt: string | null;
  targetTime: number; // minutes
  elapsedTime: number; // minutes
  status: string;
}

interface ResponseTimeTrackerProps {
  department?: "POLICE" | "FIRE" | "EMS";
}

export function ResponseTimeTracker({ department }: ResponseTimeTrackerProps) {
  const [activeResponses, setActiveResponses] = useState<ResponseTimeData[]>([]);
  const [stats, setStats] = useState({
    onTime: 0,
    delayed: 0,
    critical: 0,
    avgResponseTime: 0,
  });

  const fetchResponseTimes = async () => {
    try {
      const params = new URLSearchParams();
      if (department) params.set("department", department);
      params.set("status", "PENDING,DISPATCHED,ACTIVE");
      
      const response = await fetch(`/api/cad/calls?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      
      // Calculate response times
      const now = new Date();
      const responseTimes: ResponseTimeData[] = data.calls.map((call: any) => {
        const created = new Date(call.createdAt);
        const elapsed = Math.floor((now.getTime() - created.getTime()) / 1000 / 60); // minutes
        
        return {
          callId: call.id,
          callNumber: call.callNumber,
          type: call.type,
          priority: call.priority,
          department: call.department || "POLICE",
          createdAt: call.createdAt,
          dispatchedAt: call.dispatchedAt,
          targetTime: call.responseTimeTarget || 15,
          elapsedTime: elapsed,
          status: call.status,
        };
      });
      
      setActiveResponses(responseTimes);
      
      // Calculate stats
      const onTime = responseTimes.filter(r => r.elapsedTime <= r.targetTime).length;
      const delayed = responseTimes.filter(r => r.elapsedTime > r.targetTime && r.elapsedTime < r.targetTime * 1.5).length;
      const critical = responseTimes.filter(r => r.elapsedTime >= r.targetTime * 1.5).length;
      const avgTime = responseTimes.reduce((sum, r) => sum + r.elapsedTime, 0) / responseTimes.length || 0;
      
      setStats({
        onTime,
        delayed,
        critical,
        avgResponseTime: Math.round(avgTime * 10) / 10,
      });
    } catch (error) {
      console.error("Failed to fetch response times:", error);
    }
  };

  useEffect(() => {
    fetchResponseTimes();
    const interval = setInterval(fetchResponseTimes, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [department]);

  const getTimeStatus = (elapsed: number, target: number) => {
    const percentage = (elapsed / target) * 100;
    if (percentage < 75) return { color: "success", label: "On Track", icon: CheckCircle };
    if (percentage < 100) return { color: "warning", label: "Approaching", icon: Clock };
    if (percentage < 150) return { color: "danger", label: "Delayed", icon: AlertTriangle };
    return { color: "danger", label: "Critical", icon: AlertTriangle };
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-green-900/20 border border-green-700/30">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.onTime}</p>
                <p className="text-xs text-gray-400">On Time</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-yellow-900/20 border border-yellow-700/30">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-400">{stats.delayed}</p>
                <p className="text-xs text-gray-400">Delayed</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-red-900/20 border border-red-700/30">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
                <p className="text-xs text-gray-400">Critical</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-blue-900/20 border border-blue-700/30">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-400">{stats.avgResponseTime}m</p>
                <p className="text-xs text-gray-400">Avg Response</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Active Response Times */}
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Active Response Times</h3>
          
          {activeResponses.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No active calls requiring response</p>
          ) : (
            <div className="space-y-3">
              {activeResponses.map((response) => {
                const status = getTimeStatus(response.elapsedTime, response.targetTime);
                const StatusIcon = status.icon;
                const percentage = Math.min((response.elapsedTime / response.targetTime) * 100, 100);
                
                return (
                  <div key={response.callId} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-4 h-4 text-${status.color}-500`} />
                        <span className="font-mono text-white font-semibold">{response.callNumber}</span>
                        <Chip size="sm" variant="flat">{response.type.replace(/_/g, " ")}</Chip>
                        <Chip size="sm" variant="flat" color={status.color as any}>{response.priority}</Chip>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {response.elapsedTime}m / {response.targetTime}m target
                        </span>
                        <Chip size="sm" color={status.color as any} variant="flat">
                          {status.label}
                        </Chip>
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      color={status.color as any}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
