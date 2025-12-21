"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Badge,
} from "@nextui-org/react";
import { Bell, X, AlertTriangle, Radio, Users, Shield, FileText } from "lucide-react";
import { toast } from "@/lib/toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  referenceId: string | null;
  referenceType: string | null;
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/cad/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/cad/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) throw new Error("Failed to mark as read");

      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      const response = await fetch(`/api/cad/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to dismiss notification");

      fetchNotifications();
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch("/api/cad/notifications/mark-all-read", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to mark all as read");

      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PANIC":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "BACKUP":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "BOLO":
        return <Shield className="w-4 h-4 text-orange-500" />;
      case "CALL":
        return <Radio className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "warning";
      case "NORMAL":
        return "primary";
      case "LOW":
        return "default";
      default:
        return "default";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <Badge content={unreadCount > 0 ? unreadCount : null} color="danger">
        <Button
          isIconOnly
          variant="flat"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="w-5 h-5" />
        </Button>
      </Badge>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-[600px] overflow-hidden border border-gray-800 z-50 shadow-xl">
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <Chip size="sm" color="danger" variant="flat">
                  {unreadCount}
                </Chip>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="light"
                  onClick={handleMarkAllRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0 overflow-y-auto max-h-[500px]">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-900/50 transition-colors ${
                      !notification.isRead ? "bg-indigo-900/10" : ""
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-white truncate">
                            {notification.title}
                          </h4>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDismiss(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Chip
                            size="sm"
                            color={getPriorityColor(notification.priority) as any}
                            variant="flat"
                          >
                            {notification.type}
                          </Chip>
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
