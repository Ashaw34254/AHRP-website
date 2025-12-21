"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Card, 
  CardBody,
  Button,
  Chip,
  Checkbox
} from "@nextui-org/react";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Trash2,
  Check
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Application Approved",
    message: "Your character 'John Doe' has been approved for the Police Department.",
    timestamp: "2024-03-15T10:30:00",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Server Maintenance",
    message: "Scheduled maintenance will occur on March 20th from 2-4 AM EST.",
    timestamp: "2024-03-14T15:00:00",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Character Under Review",
    message: "Your character transfer request is currently under review by staff.",
    timestamp: "2024-03-13T09:15:00",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Welcome to Aurora Horizon RP!",
    message: "Your account has been successfully created. Start your roleplay journey today!",
    timestamp: "2024-03-10T12:00:00",
    read: true,
  },
];

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: "success" as const,
    bgColor: "bg-green-900/20",
    borderColor: "border-green-800",
  },
  info: {
    icon: Info,
    color: "primary" as const,
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-800",
  },
  warning: {
    icon: AlertCircle,
    color: "warning" as const,
    bgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-800",
  },
  error: {
    icon: AlertCircle,
    color: "danger" as const,
    bgColor: "bg-red-900/20",
    borderColor: "border-red-800",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleDeleteSelected = () => {
    setNotifications(notifications.filter(n => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} notifications deleted`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(notifications.map(n => n.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="text-gray-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={handleDeleteSelected}
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}
            {unreadCount > 0 && (
              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={<Check className="w-4 h-4" />}
                onPress={handleMarkAllAsRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-4">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {notifications.length}
              </div>
              <p className="text-sm text-gray-400">Total</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-4">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {unreadCount}
              </div>
              <p className="text-sm text-gray-400">Unread</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-4">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {notifications.filter(n => n.type === "success").length}
              </div>
              <p className="text-sm text-gray-400">Success</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-4">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {notifications.filter(n => n.type === "info").length}
              </div>
              <p className="text-sm text-gray-400">Info</p>
            </CardBody>
          </Card>
        </div>

        {/* Bulk Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
            <Checkbox
              isSelected={selectedIds.size === notifications.length}
              onValueChange={handleSelectAll}
            >
              <span className="text-sm text-gray-400">Select All</span>
            </Checkbox>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="text-center p-12">
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500">
                  You&apos;re all caught up! Check back later for updates.
                </p>
              </CardBody>
            </Card>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;

              return (
                <Card 
                  key={notification.id}
                  className={`bg-gray-900/50 border ${config.borderColor} ${!notification.read ? 'border-l-4' : ''}`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        isSelected={selectedIds.has(notification.id)}
                        onValueChange={() => toggleSelect(notification.id)}
                      />
                      
                      <div className={`p-3 ${config.bgColor} rounded-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Chip size="sm" color="primary" variant="dot">
                                New
                              </Chip>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            <span suppressHydrationWarning>{new Date(notification.timestamp).toLocaleDateString()}</span>
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">
                          {notification.message}
                        </p>

                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="flat"
                              color="primary"
                              onPress={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            startContent={<Trash2 className="w-4 h-4" />}
                            onPress={() => handleDelete(notification.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
