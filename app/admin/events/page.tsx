"use client";

import { useState, useEffect } from "react";
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
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, MapPin, Users, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  type: string;
  maxParticipants?: number;
  participants: number;
  createdAt: string;
}

const eventTypes = [
  { key: "training", label: "Training", color: "primary" },
  { key: "patrol", label: "Patrol", color: "warning" },
  { key: "community", label: "Community", color: "success" },
  { key: "special", label: "Special Event", color: "secondary" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    location: "",
    type: "community",
    maxParticipants: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
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

  const handleCreate = () => {
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      startDate: "",
      location: "",
      type: "community",
      maxParticipants: "",
    });
    onOpen();
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      location: event.location,
      type: event.type,
      maxParticipants: event.maxParticipants?.toString() || "",
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/admin/events?eventId=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Event deleted successfully");
        loadEvents();
      } else {
        toast.error(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.startDate || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        location: formData.location,
        type: formData.type,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };

      if (selectedEvent) {
        // Update
        const res = await fetch("/api/admin/events", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            updates: payload,
          }),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Event updated successfully");
          onClose();
          loadEvents();
        } else {
          toast.error(data.message || "Failed to update event");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          toast.success("Event created successfully");
          onClose();
          loadEvents();
        } else {
          toast.error(data.message || "Failed to create event");
        }
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    }
  };

  const getTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.key === type);
    return eventType?.color || "default";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Event Management
            </h1>
            <p className="text-gray-400 mt-2">
              Schedule and manage community events
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              startContent={<RefreshCw size={18} />}
              variant="flat"
              onPress={loadEvents}
              isLoading={loading}
            >
              Refresh
            </Button>
            <Button
              startContent={<Plus size={18} />}
              color="primary"
              onPress={handleCreate}
            >
              Create Event
            </Button>
          </div>
        </div>

        {/* Events Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <Table
              aria-label="Events table"
              classNames={{
                base: "bg-transparent",
                wrapper: "bg-transparent shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>LOCATION</TableColumn>
                <TableColumn>PARTICIPANTS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={loading ? "Loading events..." : "No events found"}
                isLoading={loading}
              >
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <p className="text-gray-300 font-semibold">{event.title}</p>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getTypeColor(event.type) as any}
                      >
                        {event.type}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-400">
                        <CalendarIcon size={14} />
                        <span className="text-sm">
                          {new Date(event.startDate).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users size={14} />
                        <span className="text-sm">
                          {event.participants}
                          {event.maxParticipants && ` / ${event.maxParticipants}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          isIconOnly
                          onPress={() => handleEdit(event)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDelete(event.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Create/Edit Event Modal */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              {selectedEvent ? "Edit Event" : "Create Event"}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Event Title"
                  placeholder="e.g., Police Academy Training"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  isRequired
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />

                <Textarea
                  label="Description"
                  placeholder="Event details and information..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  minRows={3}
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />

                <Input
                  label="Date & Time"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  isRequired
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />

                <Input
                  label="Location"
                  placeholder="e.g., Central Park, Police Academy"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  isRequired
                  classNames={{
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Event Type"
                    selectedKeys={[formData.type]}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700",
                    }}
                  >
                    {eventTypes.map((type) => (
                      <SelectItem key={type.key} value={type.key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Max Participants"
                    type="number"
                    placeholder="Optional"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({ ...formData, maxParticipants: e.target.value })
                    }
                    classNames={{
                      inputWrapper: "bg-gray-800 border-gray-700",
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave}>
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
