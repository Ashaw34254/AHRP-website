"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Avatar, Chip, Input, Button, Badge } from "@nextui-org/react";
import { MessageSquare, Send, Search } from "lucide-react";
import { useState } from "react";

const mockMessages = [
  { id: "1", sender: "Admin Team", content: "Welcome to Aurora Horizon! Check out the rules page.", time: "2 hours ago", isRead: true, type: "ANNOUNCEMENT" },
  { id: "2", sender: "Sergeant Miller", content: "Great work on your last patrol shift!", time: "5 hours ago", isRead: true, type: "DIRECT" },
  { id: "3", sender: "Fire Chief", content: "Training session scheduled for tomorrow at 7 PM.", time: "1 day ago", isRead: false, type: "DIRECT" },
  { id: "4", sender: "EMS Captain", content: "New medical protocols have been updated.", time: "2 days ago", isRead: false, type: "ANNOUNCEMENT" },
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const unreadCount = mockMessages.filter(m => !m.isRead).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Messages
            </h1>
            <p className="text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <Button color="primary" startContent={<Send className="w-4 h-4" />}>
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="md:col-span-1 space-y-3">
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
            />

            <div className="space-y-2">
              {mockMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMessage === message.id
                      ? 'bg-indigo-900/30 border-indigo-700'
                      : !message.isRead
                      ? 'bg-gray-900/70 border-gray-700'
                      : 'bg-gray-900/50 border-gray-800'
                  } border hover:border-gray-700`}
                  isPressable
                  onPress={() => setSelectedMessage(message.id)}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge content="" color="primary" size="sm" isInvisible={message.isRead}>
                        <Avatar
                          name={message.sender}
                          size="sm"
                          className="flex-shrink-0"
                        />
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold truncate ${!message.isRead ? 'text-white' : 'text-gray-300'}`}>
                            {message.sender}
                          </h4>
                          {message.type === "ANNOUNCEMENT" && (
                            <Chip size="sm" color="warning" variant="flat">📢</Chip>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="md:col-span-2">
            {selectedMessage ? (
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader className="border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={mockMessages.find(m => m.id === selectedMessage)?.sender}
                      size="md"
                    />
                    <div>
                      <h3 className="font-bold text-white">
                        {mockMessages.find(m => m.id === selectedMessage)?.sender}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {mockMessages.find(m => m.id === selectedMessage)?.time}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-6">
                  <p className="text-white text-lg">
                    {mockMessages.find(m => m.id === selectedMessage)?.content}
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <Input
                      placeholder="Type a reply..."
                      endContent={
                        <Button size="sm" color="primary" isIconOnly>
                          <Send className="w-4 h-4" />
                        </Button>
                      }
                    />
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardBody className="flex items-center justify-center py-20">
                  <MessageSquare className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">Select a message to read</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
