"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Button, Chip, Avatar } from "@nextui-org/react";
import { Calendar as CalendarIcon, Clock, Users, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Police Department Training",
    description: "Weekly training session for all officers",
    type: "MEETING",
    department: "POLICE",
    startTime: "2025-12-23T18:00:00Z",
    endTime: "2025-12-23T20:00:00Z",
    location: "LSPD HQ",
    maxAttendees: 20,
    currentAttendees: 12,
    isRecurring: true,
    recurrence: "WEEKLY",
  },
  {
    id: "2",
    title: "Street Race Event",
    description: "Community street race around the city",
    type: "RACE",
    department: null,
    startTime: "2025-12-24T21:00:00Z",
    endTime: "2025-12-24T23:00:00Z",
    location: "Downtown LS",
    maxAttendees: 50,
    currentAttendees: 35,
    isRecurring: false,
  },
  {
    id: "3",
    title: "Bank Heist Event",
    description: "Organized bank robbery event",
    type: "ROBBERY",
    department: null,
    startTime: "2025-12-25T22:00:00Z",
    location: "Pacific Standard Bank",
    maxAttendees: 10,
    currentAttendees: 8,
    isRecurring: false,
  },
  {
    id: "4",
    title: "Fire Department Drill",
    description: "Practice fire rescue scenarios",
    type: "MEETING",
    department: "FIRE",
    startTime: "2025-12-26T19:00:00Z",
    endTime: "2025-12-26T21:00:00Z",
    location: "Fire Station 7",
    isRecurring: true,
    recurrence: "WEEKLY",
  },
];

const eventTypeColors: Record<string, { color: any; icon: string }> = {
  MEETING: { color: "primary", icon: "👥" },
  RACE: { color: "warning", icon: "🏁" },
  ROBBERY: { color: "danger", icon: "💰" },
  PATROL: { color: "success", icon: "🚓" },
  SERVER_EVENT: { color: "secondary", icon: "🎉" },
  OTHER: { color: "default", icon: "📅" },
};

export default function EventsPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredEvents = filter
    ? mockEvents.filter((e) => e.type === filter || e.department === filter)
    : mockEvents;

  const getEventTypeChip = (type: string) => {
    const config = eventTypeColors[type] || eventTypeColors.OTHER;
    return (
      <Chip color={config.color} variant="flat" size="sm">
        {config.icon} {type.replace(/_/g, " ")}
      </Chip>
    );
  };

  const getDepartmentChip = (dept: string | null) => {
    if (!dept) return null;
    const colors: Record<string, any> = {
      POLICE: "primary",
      FIRE: "danger",
      EMS: "success",
    };
    return <Chip color={colors[dept]} variant="flat" size="sm">{dept}</Chip>;
  };

  const formatTimeUntil = (date: string) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diff = eventDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h`;
    return "Soon";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Events & Calendar
            </h1>
            <p className="text-gray-400 mt-1">Server events, races, meetings, and more</p>
          </div>
          <Button 
            as={Link}
            href="/dashboard/events/new"
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
          >
            Create Event
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={filter === null ? "solid" : "flat"}
            color="default"
            onClick={() => setFilter(null)}
          >
            All Events
          </Button>
          <Button
            size="sm"
            variant={filter === "RACE" ? "solid" : "flat"}
            color="warning"
            onClick={() => setFilter("RACE")}
          >
            🏁 Races
          </Button>
          <Button
            size="sm"
            variant={filter === "ROBBERY" ? "solid" : "flat"}
            color="danger"
            onClick={() => setFilter("ROBBERY")}
          >
            💰 Heists
          </Button>
          <Button
            size="sm"
            variant={filter === "MEETING" ? "solid" : "flat"}
            color="primary"
            onClick={() => setFilter("MEETING")}
          >
            👥 Meetings
          </Button>
          <Button
            size="sm"
            variant={filter === "POLICE" ? "solid" : "flat"}
            color="primary"
            onClick={() => setFilter("POLICE")}
          >
            Police
          </Button>
          <Button
            size="sm"
            variant={filter === "FIRE" ? "solid" : "flat"}
            color="danger"
            onClick={() => setFilter("FIRE")}
          >
            Fire
          </Button>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
              isPressable
            >
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getEventTypeChip(event.type)}
                      {event.department && getDepartmentChip(event.department)}
                      {event.isRecurring && (
                        <Chip size="sm" variant="dot" color="secondary">
                          {event.recurrence}
                        </Chip>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(event.startTime).toLocaleString()} 
                      {event.endTime && ` - ${new Date(event.endTime).toLocaleTimeString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-indigo-400 font-semibold">
                      {formatTimeUntil(event.startTime)}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.maxAttendees && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.currentAttendees || 0} / {event.maxAttendees} attending
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button color="primary" size="sm" className="flex-1">
                    RSVP
                  </Button>
                  <Button variant="flat" size="sm">
                    Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="text-center py-12">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-gray-400">No events match your filter</p>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
