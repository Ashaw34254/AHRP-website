"use client";

import { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Badge, Card, CardBody, Chip } from "@heroui/react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DispatcherChat } from "./DispatcherChat";
import { toast } from "@/lib/toast";

interface DispatcherChatModalProps {
  department?: string;
}

interface NewMessage {
  id: string;
  fromName: string;
  fromCallsign?: string;
  message: string;
  priority: string;
  timestamp: Date;
}

export function DispatcherChatModal({ department }: DispatcherChatModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setNotification] = useState<NewMessage | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const prevMessageCountRef = useRef(0);

  // Test message generator - sends every 2 minutes
  useEffect(() => {
    const testMessages = [
      "10-4, unit en route to location",
      "Requesting backup at scene",
      "Traffic stop in progress",
      "All clear, resuming patrol",
      "10-23, arrived on scene",
      "Code 4, situation under control",
      "Dispatch, need 10-28 on plate",
      "10-8, back in service"
    ];

    const sendTestMessage = () => {
      const randomMsg = testMessages[Math.floor(Math.random() * testMessages.length)];
      const testMsg = {
        id: `test-${Date.now()}`,
        fromName: "Test Dispatcher",
        fromCallsign: `D-${Math.floor(Math.random() * 9) + 1}`,
        message: randomMsg,
        priority: Math.random() > 0.7 ? "HIGH" : "NORMAL",
        timestamp: new Date()
      };
      
      // Simulate new message
      if (!isOpen) {
        setNotification(testMsg);
        setUnreadCount(prev => prev + 1);
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      }
    };

    // Send test message every 2 minutes
    const interval = setInterval(sendTestMessage, 120000);
    
    // Send first test message after 5 seconds
    const initialTimeout = setTimeout(sendTestMessage, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setNotification(null);
  };

  return (
    <>
      {/* Message Notification Popup */}
      <AnimatePresence>
        {notification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card 
              className="w-80 bg-gray-900 border-2 border-blue-500 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <CardBody className="p-4" onClick={handleOpenChat}>
                <div className="flex items-start gap-3 relative">
                  <div className="p-2 bg-blue-500/20 rounded-full flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {notification.fromCallsign && (
                        <Chip size="sm" color="primary" variant="solid" className="font-bold text-xs">
                          {notification.fromCallsign}
                        </Chip>
                      )}
                      <p className="text-sm font-bold text-white truncate">
                        {notification.fromName}
                      </p>
                      {notification.priority !== "NORMAL" && (
                        <Chip size="sm" color="warning" variant="flat" className="text-xs">
                          {notification.priority}
                        </Chip>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Just now • Click to view
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotification(null);
                    }}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                    aria-label="Close notification"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Badge
          content={unreadCount}
          color="danger"
          isInvisible={unreadCount === 0}
          placement="top-left"
          size="lg"
          className="font-bold"
        >
          <Button
            isIconOnly
            color="primary"
            size="lg"
            className="w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse"
            onPress={handleOpenChat}
          >
            <MessageSquare className="w-7 h-7" />
          </Button>
        </Badge>
      </div>

      {/* Chat Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="5xl"
        scrollBehavior="outside"
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-gray-900 border border-gray-800 max-h-[90vh]",
          header: "border-b border-gray-800",
          body: "p-0 overflow-hidden",
          closeButton: "hover:bg-gray-800",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Dispatcher Chat</h2>
              <p className="text-xs text-gray-400 font-normal">
                {department ? `${department} Department` : "All Departments"}
              </p>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="h-[600px] overflow-hidden">
              <DispatcherChat department={department} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
