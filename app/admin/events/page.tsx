"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure,
  Chip
} from "@nextui-org/react";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, MapPin, Users } from "lucide-react";
import { toast } from "@/lib/toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "training" | "patrol" | "community" | "special";
  maxParticipants?: number;
  participants: number;
  host: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Police Academy Training",
    description: "Basic training for new recruits covering traffic stops, arrests, and radio procedures.",
    date: "2024-03-20",
    time: "18:00",
    location: "Police Academy",
    type: "training",
    maxParticipants: 20,
    participants: 15,
    host: "Chief Williams",
  },
  {
    id: "2",
    title: "Community BBQ Event",
    description: "Join us for a community gathering at the park. Food, games, and fun for everyone!",
    date: "2024-03-22",
    time: "15:00",
    location: "Central Park",
    type: "community",
    participants: 47,
    host: "Mayor Johnson",
  },
  {
    id: "3",
    title: "Joint Emergency Response Drill",
    description: "Combined PD/EMS/Fire training drill for major incident response.",
    date: "2024-03-25",
    time: "19:00",
    location: "Downtown Area",
    type: "training",
    maxParticipants: 30,
    participants: 22,
    host: "Emergency Services",
  },
];

const eventTypes = [
  { key: "training", label: "Training", color: "primary" },
  { key: "patrol", label: "Patrol", color: "warning" },
  { key: "community", label: "Community", color: "success" },
  { key: "special", label: "Special Event", color: "secondary" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "training" as Event["type"],
    maxParticipants: "",
    host: "",
  });

  const handleCreate = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "training",
      maxParticipants: "",
      host: "",
    });
    onOpen();
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      maxParticipants: event.maxParticipants?.toString() || "",
      host: event.host,
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success("Event deleted successfully");
  };

  const handleSave = () => {
    if (selectedEvent) {
      setEvents(events.map(e => 
        e.id === selectedEvent.id 
          ? { 
              ...e, 
              ...formData,
              maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
            }
          : e
      ));
      toast.success("Event updated successfully");
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        participants: 0,
      };
      setEvents([...events, newEvent]);
      toast.success("Event created successfully");
    }
    onOpenChange();
  };

  const getTypeColor = (type: string) => {
    return eventTypes.find(t => t.key === type)?.color || "default";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Event Calendar</h1>
              <p className="text-gray-400">Manage community events and training sessions</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-5 h-5" />}
            onPress={handleCreate}
          >
            Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">{events.length}</div>
              <p className="text-gray-400">Total Events</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {events.filter(e => e.type === "training").length}
              </div>
              <p className="text-gray-400">Training Sessions</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {events.filter(e => e.type === "community").length}
              </div>
              <p className="text-gray-400">Community Events</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {events.reduce((sum, e) => sum + e.participants, 0)}
              </div>
              <p className="text-gray-400">Total Participants</p>
            </CardBody>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
            <Card key={event.id} className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500 transition-colors">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Chip color={getTypeColor(event.type) as any} variant="flat" size="sm">
                      {eventTypes.find(t => t.key === event.type)?.label}
                    </Chip>
                    {event.maxParticipants && (
                      <Chip 
                        color={event.participants >= event.maxParticipants ? "danger" : "success"} 
                        variant="flat" 
                        size="sm"
                      >
                        {event.participants}/{event.maxParticipants}
                      </Chip>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      isIconOnly
                      onPress={() => handleEdit(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      isIconOnly
                      onPress={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.participants} participants • Hosted by {event.host}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Create/Edit Modal */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          size="2xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-gray-900 border border-gray-800",
            header: "border-b border-gray-800",
            footer: "border-t border-gray-800",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-white">
                  {selectedEvent ? "Edit Event" : "Create New Event"}
                </ModalHeader>
                <ModalBody className="py-6">
                  <div className="space-y-4">
                    <Input
                      label="Event Title"
                      placeholder="Enter event title"
                      value={formData.title}
                      onValueChange={(value) => setFormData({ ...formData, title: value })}
                      variant="bordered"
                    />
                    
                    <Textarea
                      label="Description"
                      placeholder="Describe the event"
                      value={formData.description}
                      onValueChange={(value) => setFormData({ ...formData, description: value })}
                      minRows={3}
                      variant="bordered"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Date"
                        type="date"
                        value={formData.date}
                        onValueChange={(value) => setFormData({ ...formData, date: value })}
                        variant="bordered"
                      />
                      <Input
                        label="Time"
                        type="time"
                        value={formData.time}
                        onValueChange={(value) => setFormData({ ...formData, time: value })}
                        variant="bordered"
                      />
                    </div>

                    <Input
                      label="Location"
                      placeholder="Event location"
                      value={formData.location}
                      onValueChange={(value) => setFormData({ ...formData, location: value })}
                      variant="bordered"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Event Type"
                        placeholder="Select type"
                        selectedKeys={[formData.type]}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Event["type"] })}
                        variant="bordered"
                      >
                        {eventTypes.map((type) => (
                          <SelectItem key={type.key} value={type.key}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="Max Participants (Optional)"
                        type="number"
                        placeholder="No limit"
                        value={formData.maxParticipants}
                        onValueChange={(value) => setFormData({ ...formData, maxParticipants: value })}
                        variant="bordered"
                      />
                    </div>

                    <Input
                      label="Host"
                      placeholder="Event host name"
                      value={formData.host}
                      onValueChange={(value) => setFormData({ ...formData, host: value })}
                      variant="bordered"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSave}>
                    {selectedEvent ? "Update" : "Create"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
