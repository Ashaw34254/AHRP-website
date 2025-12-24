"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";
import {
  FileText, Clock, User, Plus, Edit, CheckSquare, Link2,
  AlertTriangle, Shield, ArrowRight, Paperclip, Users, MapPin
} from "lucide-react";

interface TimelineEntry {
  id: string;
  eventType: string;
  description: string;
  metadata?: string;
  performedBy: string;
  performedAt: string;
}

interface Props {
  investigationId: string;
  timeline: TimelineEntry[];
}

export function CIBInvestigationTimeline({ investigationId, timeline }: Props) {
  const getEventIcon = (eventType: string) => {
    const icons: Record<string, any> = {
      CREATED: Plus,
      STATUS_CHANGE: ArrowRight,
      EVIDENCE_ADDED: Paperclip,
      PERSON_LINKED: Users,
      TASK_COMPLETED: CheckSquare,
      NOTE_ADDED: FileText,
      HANDOVER: Shield,
      LOCATION_LINKED: MapPin
    };
    const Icon = icons[eventType] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getEventColor = (eventType: string) => {
    const colors: Record<string, string> = {
      CREATED: "success",
      STATUS_CHANGE: "primary",
      EVIDENCE_ADDED: "warning",
      PERSON_LINKED: "secondary",
      TASK_COMPLETED: "success",
      NOTE_ADDED: "default",
      HANDOVER: "danger"
    };
    return colors[eventType] || "default";
  };

  const parseMetadata = (metadata?: string) => {
    if (!metadata) return null;
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  };

  if (timeline.length === 0) {
    return (
      <Card className="bg-gray-800/50 border border-gray-700">
        <CardBody className="p-8 text-center">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No timeline entries yet</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800" />

        {/* Timeline entries */}
        <div className="space-y-6">
          {timeline.map((entry, index) => {
            const metadata = parseMetadata(entry.metadata);
            
            return (
              <div key={entry.id} className="relative pl-14">
                {/* Timeline dot */}
                <div className={`absolute left-4 top-2 w-4 h-4 rounded-full bg-${getEventColor(entry.eventType)}-500 border-2 border-gray-900 z-10`}>
                  <div className="absolute inset-0 flex items-center justify-center text-white scale-75">
                    {getEventIcon(entry.eventType)}
                  </div>
                </div>

                <Card className="bg-gray-800/30 border border-gray-700 hover:border-gray-600 transition-all">
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Chip 
                            size="sm" 
                            color={getEventColor(entry.eventType) as any}
                            variant="flat"
                            startContent={getEventIcon(entry.eventType)}
                          >
                            {entry.eventType.replace(/_/g, " ")}
                          </Chip>
                          
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {entry.performedBy}
                          </span>
                        </div>

                        <p className="text-white mb-2">{entry.description}</p>

                        {metadata && (
                          <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                            <pre className="text-xs text-gray-400 overflow-x-auto">
                              {JSON.stringify(metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(entry.performedAt).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(entry.performedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
