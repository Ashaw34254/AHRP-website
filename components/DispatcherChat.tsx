"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
  ScrollShadow,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { MessageCircle, Send, Users, AlertCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface DispatcherSession {
  id: string;
  userId: string;
  name: string;
  status: string;
  startedAt: string;
}

interface Message {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId?: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export function DispatcherChat() {
  const [sessions, setSessions] = useState<DispatcherSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("NORMAL");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUserId = "system"; // TODO: Get from session

  useEffect(() => {
    fetchSessions();
    fetchMessages();
    
    const interval = setInterval(() => {
      fetchMessages();
      fetchSessions();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/cad/dispatcher/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch dispatcher sessions:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/cad/dispatcher/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/cad/dispatcher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUserId,
          fromName: "Dispatcher", // TODO: Get from session
          toUserId: selectedRecipient,
          message: messageText,
          priority: selectedPriority,
        }),
      });

      if (response.ok) {
        setMessageText("");
        fetchMessages();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/cad/dispatcher/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "BREAK":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "danger";
      case "HIGH":
        return "warning";
      default:
        return "default";
    }
  };

  const activeSessions = sessions.filter((s) => s.status === "ACTIVE");
  const unreadCount = messages.filter((m) => !m.isRead && m.toUserId === currentUserId).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Online Dispatchers */}
      <Card className="lg:col-span-1 bg-gray-900/50 border border-gray-800">
        <CardHeader className="flex items-center gap-2 pb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Online</h3>
            <p className="text-xs text-gray-400">{activeSessions.length} dispatcher{activeSessions.length !== 1 ? 's' : ''}</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-3">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-500">No active dispatchers</p>
              </div>
            ) : (
              activeSessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedRecipient === session.userId
                      ? "bg-indigo-500/20 border-2 border-indigo-500/50"
                      : "bg-gray-800/50 border-2 border-transparent hover:bg-gray-800 hover:border-gray-700"
                  }`}
                  onClick={() =>
                    setSelectedRecipient(
                      selectedRecipient === session.userId ? null : session.userId
                    )
                  }
                >
                  <div className="relative">
                    <Avatar
                      name={session.name}
                      size="sm"
                      className="w-10 h-10"
                      color={getStatusColor(session.status)}
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      session.status === "ACTIVE" ? "bg-green-500" : "bg-yellow-500"
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{session.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(session.startedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {selectedRecipient === session.userId && (
                    <Chip size="sm" color="primary" variant="flat" className="font-semibold">
                      DM
                    </Chip>
                  )}
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-3 bg-gray-900/50 border border-gray-800">
        <CardHeader className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dispatcher Chat</h3>
              <p className="text-xs text-gray-400">
                {selectedRecipient ? (
                  <span className="flex items-center gap-1">
                    Direct Message • {sessions.find((s) => s.userId === selectedRecipient)?.name}
                  </span>
                ) : (
                  "Broadcasting to all dispatchers"
                )}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Chip size="sm" color="danger" variant="solid" className="animate-pulse font-bold">
              {unreadCount} unread
            </Chip>
          )}
        </CardHeader>
        <CardBody className="flex flex-col">
          {/* Messages Area */}
          <ScrollShadow className="flex-1 h-[450px] mb-4">
            <div className="space-y-3 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">No messages yet</h4>
                  <p className="text-sm text-gray-400">Start the conversation by sending a message below</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.fromUserId === currentUserId;
                  const isBroadcast = !msg.toUserId;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] ${
                          isOwn
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500"
                            : "bg-gray-800/80 border-gray-700"
                        } border rounded-xl p-3 shadow-lg`}
                        onClick={() => !isOwn && !msg.isRead && markAsRead(msg.id)}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-sm font-bold text-white">{msg.fromName}</p>
                          {msg.priority !== "NORMAL" && (
                            <Chip size="sm" color={getPriorityColor(msg.priority)} variant="flat" className="font-semibold">
                              {msg.priority}
                            </Chip>
                          )}
                          {isBroadcast && (
                            <Chip size="sm" color="warning" variant="flat" className="font-semibold">
                              BROADCAST
                            </Chip>
                          )}
                          {!isOwn && !msg.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-white mb-1.5 leading-relaxed">{msg.message}</p>
                        <p className="text-xs text-gray-300 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollShadow>

          {/* Message Input */}
          <div className="space-y-2">
            {selectedRecipient && (
              <div className="flex items-center justify-between p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                <p className="text-xs text-indigo-300">
                  📨 Sending to: <span className="font-bold">{sessions.find((s) => s.userId === selectedRecipient)?.name}</span>
                </p>
                <Button
                  size="sm"
                  variant="light"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                  onPress={() => setSelectedRecipient(null)}
                >
                  Clear
                </Button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  placeholder={
                    selectedRecipient
                      ? "Type your direct message..."
                      : "Type to broadcast to all dispatchers..."
                  }
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  size="lg"
                  classNames={{
                    input: "bg-gray-800/50",
                    inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
                  }}
                  endContent={
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          size="sm"
                          variant="flat"
                          color={getPriorityColor(selectedPriority)}
                          className="font-semibold"
                        >
                          {selectedPriority}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        selectedKeys={[selectedPriority]}
                        onSelectionChange={(keys) =>
                          setSelectedPriority(Array.from(keys)[0] as string)
                        }
                      >
                        <DropdownItem key="NORMAL">NORMAL</DropdownItem>
                        <DropdownItem key="HIGH">HIGH</DropdownItem>
                        <DropdownItem key="URGENT">URGENT</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  }
                />
              </div>
              <Button 
                color="primary" 
                onPress={sendMessage} 
                isIconOnly 
                size="lg"
                className="font-bold"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
