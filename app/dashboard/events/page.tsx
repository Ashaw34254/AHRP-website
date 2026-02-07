"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Button, Chip, Skeleton } from "@heroui/react";
import { Calendar as CalendarIcon, Clock, Users, MapPin, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface Event {
  id: string;
  title: string;
  description: string | null;
  type: string;
  department: string | null;
  startTime: string;
  endTime: string | null;
  location: string | null;
  maxAttendees: number | null;
  rsvps: { status: string; createdAt: string }[];
  _count: { rsvps: number };
}

const eventTypeColors: Record<string, { color: any; icon: string }> = {
  TRAINING: { color: "primary", icon: "📚" },
  PATROL: { color: "success", icon: "🚓" },
  MEETING: { color: "warning", icon: "👥" },
  COMMUNITY: { color: "secondary", icon: "🎉" },
  SPECIAL: { color: "danger", icon: "⭐" },
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("upcoming");

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/events?filter=${filter}`);
      const data = await res.json();
      
      if (data.success) {
        setEvents(data.events);
      } else {
        toast.error("Failed to load events");
      }
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: string) => {
    try {
      const res = await fetch("/api/dashboard/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(status === "ATTENDING" ? "RSVP confirmed!" : "RSVP declined");
        loadEvents();
      } else {
        toast.error(data.message || "Failed to RSVP");
      }
    } catch (error) {
      console.error("Error RSVPing:", error);
      toast.error("Failed to RSVP");
    }
  };

  const getEventTypeChip = (type: string) => {
    const config = eventTypeColors[type] || eventTypeColors.SPECIAL;
    return (
      <Chip size="sm" variant="flat" color={config.color}>
        {config.icon} {type}
      </Chip>
    );
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const isEventFull = (event: Event) => {
    return event.maxAttendees ? event._count.rsvps >= event.maxAttendees : false;
  };

  const getUserRSVP = (event: Event) => {
    return event.rsvps.length > 0 ? event.rsvps[0].status : null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
          <p className="text-gray-400">Browse and RSVP to community events</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "upcoming" ? "solid" : "bordered"}
            color="primary"
            onPress={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === "past" ? "solid" : "bordered"}
            color="default"
            onPress={() => setFilter("past")}
          >
            Past Events
          </Button>
          <Button
            variant={filter === "my-rsvps" ? "solid" : "bordered"}
            color="secondary"
            onPress={() => setFilter("my-rsvps")}
          >
            My RSVPs
          </Button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900/50 border border-gray-800">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/3 rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-2/3 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-300 font-semibold mb-2">No events found</p>
              <p className="text-gray-400 text-sm">
                {filter === "upcoming" && "No upcoming events at this time"}
                {filter === "past" && "No past events to display"}
                {filter === "my-rsvps" && "You haven't RSVP'd to any events yet"}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const { date, time } = formatDateTime(event.startTime);
              const userRSVP = getUserRSVP(event);
              const isFull = isEventFull(event);

              return (
                <Card key={event.id} className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
                  <CardBody className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Date Box */}
                      <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 text-center shrink-0 w-20">
                        <div className="text-2xl font-bold text-primary">
                          {new Date(event.startTime).getDate()}
                        </div>
                        <div className="text-xs text-gray-400 uppercase">
                          {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              {getEventTypeChip(event.type)}
                              {event.department && (
                                <Chip size="sm" variant="flat" color="default">
                                  {event.department}
                                </Chip>
                              )}
                              {isFull && (
                                <Chip size="sm" variant="flat" color="danger">
                                  FULL
                                </Chip>
                              )}
                            </div>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>
                              {event._count.rsvps}
                              {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} attending
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RSVP Buttons */}
                      {filter !== "past" && (
                        <div className="flex flex-col gap-2 shrink-0">
                          {userRSVP === "ATTENDING" ? (
                            <Chip color="success" variant="flat" startContent={<CheckCircle size={16} />}>
                              Attending
                            </Chip>
                          ) : userRSVP === "DECLINED" ? (
                            <Chip color="danger" variant="flat" startContent={<XCircle size={16} />}>
                              Declined
                            </Chip>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                startContent={<CheckCircle size={16} />}
                                onPress={() => handleRSVP(event.id, "ATTENDING")}
                                isDisabled={isFull}
                              >
                                Attend
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                startContent={<XCircle size={16} />}
                                onPress={() => handleRSVP(event.id, "DECLINED")}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
