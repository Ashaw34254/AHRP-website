"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Avatar,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import {
  MessageSquare,
  Send,
  Mail,
  MailOpen,
  User,
  Radio,
  Search,
  Plus,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface MDTMessage {
  id: string;
  subject: string;
  content: string;
  senderName: string;
  senderUnit: string | null;
  recipientName: string | null;
  recipientUnit: string | null;
  messageType: string;
  isRead: boolean;
  sentAt: Date;
  readAt: Date | null;
  createdAt: Date;
}

interface Officer {
  id: string;
  name: string;
  badge: string;
  rank: string;
}

interface Unit {
  id: string;
  callsign: string;
  department: string;
}

export function MDTMessaging() {
  const [messages, setMessages] = useState<MDTMessage[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MDTMessage | null>(null);
  const [selectedTab, setSelectedTab] = useState("inbox");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  // New message form
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    recipientName: "",
    recipientUnit: "",
    messageType: "UNIT_TO_UNIT",
  });

  useEffect(() => {
    fetchMessages();
    fetchOfficers();
    fetchUnits();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/cad/mdt/messages");
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficers = async () => {
    try {
      const response = await fetch("/api/cad/officers");
      const data = await response.json();
      setOfficers(data.officers || []);
    } catch (error) {
      console.error("Failed to fetch officers:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch("/api/cad/units");
      const data = await response.json();
      setUnits(data.units || []);
    } catch (error) {
      console.error("Failed to fetch units:", error);
    }
  };

  const handleCreateMessage = async () => {
    if (!newMessage.subject || !newMessage.content) {
      toast.error("Subject and content are required");
      return;
    }

    if (
      newMessage.messageType === "UNIT_TO_UNIT" &&
      !newMessage.recipientUnit
    ) {
      toast.error("Recipient unit is required for unit-to-unit messages");
      return;
    }

    if (
      newMessage.messageType === "OFFICER_TO_OFFICER" &&
      !newMessage.recipientName
    ) {
      toast.error("Recipient officer is required for officer-to-officer messages");
      return;
    }

    try {
      const response = await fetch("/api/cad/mdt/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        toast.success("Message sent successfully");
        setNewMessage({
          subject: "",
          content: "",
          recipientName: "",
          recipientUnit: "",
          messageType: "UNIT_TO_UNIT",
        });
        fetchMessages();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/cad/mdt/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const handleViewMessage = (message: MDTMessage) => {
    setSelectedMessage(message);
    onViewOpen();
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "DISPATCH":
        return <Radio className="w-4 h-4" />;
      case "UNIT_TO_UNIT":
        return <MessageSquare className="w-4 h-4" />;
      case "OFFICER_TO_OFFICER":
        return <User className="w-4 h-4" />;
      case "BROADCAST":
        return <Radio className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "DISPATCH":
        return "primary";
      case "UNIT_TO_UNIT":
        return "secondary";
      case "OFFICER_TO_OFFICER":
        return "success";
      case "BROADCAST":
        return "warning";
      default:
        return "default";
    }
  };

  const getFilteredMessages = () => {
    let filtered = messages;

    // Filter by tab
    if (selectedTab === "unread") {
      filtered = filtered.filter((msg) => !msg.isRead);
    } else if (selectedTab === "read") {
      filtered = filtered.filter((msg) => msg.isRead);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.senderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;
  const filteredMessages = getFilteredMessages();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">MDT Messaging</h1>
            <p className="text-gray-400">In-vehicle terminal communications</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
          className="font-semibold"
        >
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border border-blue-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-white">{messages.length}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/80 to-orange-800/80 border border-orange-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Unread</p>
                <p className="text-3xl font-bold text-white">{unreadCount}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/80 to-green-800/80 border border-green-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Read</p>
                <p className="text-3xl font-bold text-white">
                  {messages.length - unreadCount}
                </p>
              </div>
              <MailOpen className="w-8 h-8 text-green-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/80 to-purple-800/80 border border-purple-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Today</p>
                <p className="text-3xl font-bold text-white">
                  {
                    messages.filter(
                      (msg) =>
                        new Date(msg.sentAt).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-300" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-xs"
          classNames={{
            input: "bg-gray-900",
            inputWrapper: "bg-gray-900 border border-gray-800",
          }}
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="underlined"
        >
          <Tab key="inbox" title="All Messages" />
          <Tab key="unread" title={`Unread (${unreadCount})`} />
          <Tab key="read" title="Read" />
        </Tabs>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800">
          <CardBody className="p-12 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-2xl border-2 border-blue-500/30">
              <MessageSquare className="w-12 h-12 text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Messages</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm
                  ? "No messages match your search"
                  : selectedTab === "unread"
                  ? "You're all caught up!"
                  : "Start a conversation with dispatch or other units"}
              </p>
              <Button color="primary" onPress={onOpen} startContent={<Plus />}>
                Send New Message
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((message) => {
            const isRecent =
              new Date().getTime() - new Date(message.sentAt).getTime() <
              3600000; // 1 hour

            return (
              <Card
                key={message.id}
                isPressable
                onPress={() => handleViewMessage(message)}
                className={`
                  transition-all hover:scale-[1.01]
                  ${
                    !message.isRead
                      ? "bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-2 border-blue-500/50"
                      : "bg-gray-900/50 border border-gray-800"
                  }
                  ${isRecent && !message.isRead ? "animate-pulse" : ""}
                `}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar
                      name={message.senderName}
                      size="md"
                      className="flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-bold ${
                                !message.isRead ? "text-white" : "text-gray-300"
                              }`}
                            >
                              {message.subject}
                            </h3>
                            {!message.isRead && (
                              <Chip size="sm" color="primary" variant="flat">
                                NEW
                              </Chip>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="font-medium text-gray-300">
                              {message.senderName}
                            </span>
                            {message.senderUnit && (
                              <>
                                <span>•</span>
                                <span>{message.senderUnit}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>
                              {new Date(message.sentAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            color={getMessageTypeColor(message.messageType)}
                            variant="flat"
                            startContent={getMessageIcon(message.messageType)}
                          >
                            {message.messageType.replace("_", " ")}
                          </Chip>
                          {message.isRead ? (
                            <CheckCheck className="w-5 h-5 text-green-500" />
                          ) : (
                            <Check className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2">
                        {message.content}
                      </p>

                      {message.recipientName && (
                        <div className="mt-2 text-xs text-gray-500">
                          To: {message.recipientName}
                          {message.recipientUnit && ` (${message.recipientUnit})`}
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Message Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              <span>New Message</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Message Type"
                placeholder="Select message type"
                selectedKeys={[newMessage.messageType]}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, messageType: e.target.value })
                }
                classNames={{
                  trigger: "bg-gray-900 border-gray-800",
                }}
              >
                <SelectItem key="UNIT_TO_UNIT" value="UNIT_TO_UNIT">
                  Unit to Unit
                </SelectItem>
                <SelectItem key="OFFICER_TO_OFFICER" value="OFFICER_TO_OFFICER">
                  Officer to Officer
                </SelectItem>
                <SelectItem key="DISPATCH" value="DISPATCH">
                  Dispatch Message
                </SelectItem>
                <SelectItem key="BROADCAST" value="BROADCAST">
                  Broadcast (All Units)
                </SelectItem>
              </Select>

              {newMessage.messageType === "UNIT_TO_UNIT" && (
                <Select
                  label="Recipient Unit"
                  placeholder="Select unit"
                  selectedKeys={newMessage.recipientUnit ? [newMessage.recipientUnit] : []}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, recipientUnit: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  {units.map((unit) => (
                    <SelectItem key={unit.callsign} value={unit.callsign}>
                      {unit.callsign} - {unit.department}
                    </SelectItem>
                  ))}
                </Select>
              )}

              {newMessage.messageType === "OFFICER_TO_OFFICER" && (
                <Select
                  label="Recipient Officer"
                  placeholder="Select officer"
                  selectedKeys={newMessage.recipientName ? [newMessage.recipientName] : []}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, recipientName: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  {officers.map((officer) => (
                    <SelectItem key={officer.name} value={officer.name}>
                      {officer.name} - {officer.rank} (Badge {officer.badge})
                    </SelectItem>
                  ))}
                </Select>
              )}

              <Input
                label="Subject"
                placeholder="Enter message subject"
                value={newMessage.subject}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, subject: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Textarea
                label="Message"
                placeholder="Enter your message"
                value={newMessage.content}
                onChange={(e) =>
                  setNewMessage({ ...newMessage, content: e.target.value })
                }
                minRows={6}
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateMessage}
              startContent={<Send className="w-4 h-4" />}
            >
              Send Message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Message Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={onViewClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {selectedMessage && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MailOpen className="w-5 h-5 text-blue-400" />
                  <span>{selectedMessage.subject}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Chip
                    size="sm"
                    color={getMessageTypeColor(selectedMessage.messageType)}
                    variant="flat"
                    startContent={getMessageIcon(selectedMessage.messageType)}
                  >
                    {selectedMessage.messageType.replace("_", " ")}
                  </Chip>
                  {selectedMessage.isRead && (
                    <Chip size="sm" color="success" variant="flat">
                      Read
                    </Chip>
                  )}
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">From</p>
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={selectedMessage.senderName}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-white">
                                {selectedMessage.senderName}
                              </p>
                              {selectedMessage.senderUnit && (
                                <p className="text-xs text-gray-400">
                                  {selectedMessage.senderUnit}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedMessage.recipientName && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">To</p>
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={selectedMessage.recipientName}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-white">
                                  {selectedMessage.recipientName}
                                </p>
                                {selectedMessage.recipientUnit && (
                                  <p className="text-xs text-gray-400">
                                    {selectedMessage.recipientUnit}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-gray-400">Sent: </span>
                            <span className="text-white">
                              {new Date(selectedMessage.sentAt).toLocaleString()}
                            </span>
                          </div>
                          {selectedMessage.readAt && (
                            <div>
                              <span className="text-gray-400">Read: </span>
                              <span className="text-white">
                                {new Date(selectedMessage.readAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <p className="text-white whitespace-pre-wrap">
                        {selectedMessage.content}
                      </p>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onViewClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
