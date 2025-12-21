"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody, 
  Chip, 
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem
} from "@nextui-org/react";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity,
  Shield,
  Ban,
  AlertTriangle,
  Search,
  Download,
  RefreshCw,
  UserX,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

export default function AdminPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState<"ban" | "warn" | "kick" | null>(null);
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: "John Smith", 
      email: "john@example.com",
      role: "Civilian",
      status: "online",
      lastSeen: "Just now",
      warnings: 0,
      banned: false
    },
    { 
      id: 2, 
      name: "Sarah Johnson", 
      email: "sarah@example.com",
      role: "Police",
      status: "online",
      lastSeen: "5 min ago",
      warnings: 1,
      banned: false
    },
    { 
      id: 3, 
      name: "Mike Wilson", 
      email: "mike@example.com",
      role: "EMS",
      status: "offline",
      lastSeen: "2 hours ago",
      warnings: 0,
      banned: false
    },
    { 
      id: 4, 
      name: "Emily Davis", 
      email: "emily@example.com",
      role: "Fire",
      status: "online",
      lastSeen: "Just now",
      warnings: 2,
      banned: false
    },
  ]);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [banType, setBanType] = useState("temporary");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState([
    { type: "info", msg: "Server restarted successfully", time: "2 min ago", timestamp: Date.now() - 120000 },
    { type: "warning", msg: "High player count detected (64/64)", time: "5 min ago", timestamp: Date.now() - 300000 },
    { type: "error", msg: "Failed to load resource: vehicle_shop", time: "12 min ago", timestamp: Date.now() - 720000 },
    { type: "info", msg: "Backup completed", time: "1 hour ago", timestamp: Date.now() - 3600000 },
    { type: "warning", msg: "Player timeout: connection lost", time: "1 hour ago", timestamp: Date.now() - 3600000 },
    { type: "info", msg: "New application submitted", time: "2 hours ago", timestamp: Date.now() - 7200000 },
  ]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserAction = (user: any, action: "ban" | "warn" | "kick") => {
    setSelectedUser(user);
    setActionType(action);
    setReason("");
    setDuration("");
    setBanType("temporary");
    onOpen();
  };

  const submitAction = () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    if (actionType === "ban" && !duration.trim()) {
      toast.error("Please specify ban duration");
      return;
    }

    // Update user state
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === selectedUser.id) {
          if (actionType === "warn") {
            return { ...user, warnings: user.warnings + 1 };
          } else if (actionType === "ban") {
            return { ...user, banned: true, status: "offline" };
          } else if (actionType === "kick") {
            return { ...user, status: "offline" };
          }
        }
        return user;
      })
    );

    // Add log entry
    const actionMsg = actionType === "ban" 
      ? `User ${selectedUser.name} was banned: ${reason}`
      : actionType === "warn"
      ? `User ${selectedUser.name} received a warning: ${reason}`
      : `User ${selectedUser.name} was kicked: ${reason}`;

    setLogs(prev => [{
      type: actionType === "ban" ? "error" : "warning",
      msg: actionMsg,
      time: "Just now",
      timestamp: Date.now()
    }, ...prev]);

    toast.success(`${actionType?.toUpperCase()} applied to ${selectedUser?.name}`);
    onClose();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing user data...");
    
    // Simulate refresh with random status updates
    setTimeout(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        status: Math.random() > 0.3 ? "online" : "offline",
        lastSeen: user.status === "online" ? "Just now" : `${Math.floor(Math.random() * 60)} min ago`
      })));
      setIsRefreshing(false);
      toast.success("User data refreshed");
    }, 1000);
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.type.toUpperCase()}] ${new Date(log.timestamp).toLocaleString()} - ${log.msg}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora-horizon-server-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Logs exported successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your Aurora Horizon RP community</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-400" />
                <Chip color="success" variant="flat" size="sm">+12%</Chip>
              </div>
              <div className="text-3xl font-bold text-white mb-1">1,247</div>
              <p className="text-sm text-gray-400">Total Users</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-400" />
                <Chip color="warning" variant="flat" size="sm">24 new</Chip>
              </div>
              <div className="text-3xl font-bold text-white mb-1">47</div>
              <p className="text-sm text-gray-400">Pending Applications</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <Chip color="success" variant="flat" size="sm">+8%</Chip>
              </div>
              <div className="text-3xl font-bold text-white mb-1">342</div>
              <p className="text-sm text-gray-400">Active Characters</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-purple-400" />
                <Chip color="secondary" variant="flat" size="sm">Live</Chip>
              </div>
              <div className="text-3xl font-bold text-white mb-1">64</div>
              <p className="text-sm text-gray-400">Online Players</p>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Applications
              </h3>
              <div className="space-y-3">
                {[
                  { name: "John Smith", dept: "Police", time: "5 min ago" },
                  { name: "Sarah Johnson", dept: "EMS", time: "12 min ago" },
                  { name: "Mike Wilson", dept: "Fire", time: "23 min ago" },
                  { name: "Emily Davis", dept: "Civilian", time: "1 hour ago" },
                ].map((app, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{app.name}</p>
                      <p className="text-sm text-gray-400">{app.dept} Department</p>
                    </div>
                    <div className="text-right">
                      <Chip color="warning" variant="flat" size="sm">Pending</Chip>
                      <p className="text-xs text-gray-500 mt-1">{app.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Server Activity */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Server Activity
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Peak Hours</span>
                    <span className="text-white">7pm - 11pm EST</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Average Playtime</span>
                    <span className="text-white">3.4 hours</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-[68%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Server Uptime</span>
                    <span className="text-white">99.8%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-[99.8%]"></div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Department Stats */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Department Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-1">87</div>
                <p className="text-sm text-gray-400">Police Officers</p>
              </div>
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="text-2xl font-bold text-red-400 mb-1">45</div>
                <p className="text-sm text-gray-400">Fire & EMS</p>
              </div>
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-1">178</div>
                <p className="text-sm text-gray-400">Civilians</p>
              </div>
              <div className="p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-1">32</div>
                <p className="text-sm text-gray-400">Criminals</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* User Management */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Active Users
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={<Search className="w-4 h-4 text-gray-400" />}
                  className="w-64"
                  size="sm"
                />
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  startContent={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                  onPress={handleRefresh}
                  isDisabled={isRefreshing}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <Table 
              aria-label="Active users table"
              className="dark"
              removeWrapper
            >
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>WARNINGS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={user.name}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.name}</p>
                            {user.banned && (
                              <Chip size="sm" color="danger" variant="flat">BANNED</Chip>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color="primary">
                        {user.role}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-sm text-gray-400">{user.lastSeen}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.warnings > 0 ? (
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color={user.warnings >= 3 ? "danger" : "warning"}
                          startContent={<AlertTriangle className="w-3 h-3" />}
                        >
                          {user.warnings}
                        </Chip>
                      ) : (
                        <span className="text-gray-500 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="flat"
                          color="warning"
                          isIconOnly
                          onPress={() => handleUserAction(user, "warn")}
                          isDisabled={user.banned}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleUserAction(user, "kick")}
                          isDisabled={user.banned}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleUserAction(user, "ban")}
                          isDisabled={user.banned}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Server Logs & Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Logs */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Server Logs
                </h3>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Download className="w-4 h-4" />}
                  onPress={exportLogs}
                >
                  Export
                </Button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="p-3 bg-gray-800/50 rounded-lg flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      log.type === 'error' ? 'bg-red-500' : 
                      log.type === 'warning' ? 'bg-yellow-500' : 
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300">{log.msg}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Reports & Tickets */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Reports
              </h3>
              <div className="space-y-3">
                {[
                  { 
                    id: "#R-1247", 
                    reporter: "John Smith",
                    type: "Player Report",
                    status: "open",
                    priority: "high"
                  },
                  { 
                    id: "#R-1246", 
                    reporter: "Sarah Johnson",
                    type: "Bug Report",
                    status: "investigating",
                    priority: "medium"
                  },
                  { 
                    id: "#R-1245", 
                    reporter: "Mike Wilson",
                    type: "Support Ticket",
                    status: "resolved",
                    priority: "low"
                  },
                  { 
                    id: "#R-1244", 
                    reporter: "Emily Davis",
                    type: "Player Report",
                    status: "open",
                    priority: "high"
                  },
                ].map((report, i) => (
                  <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm">{report.id}</span>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            report.priority === 'high' ? 'danger' :
                            report.priority === 'medium' ? 'warning' :
                            'default'
                          }
                        >
                          {report.priority}
                        </Chip>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          report.status === 'open' ? 'warning' :
                          report.status === 'investigating' ? 'primary' :
                          'success'
                        }
                      >
                        {report.status}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-400">{report.type}</p>
                    <p className="text-xs text-gray-500 mt-1">Reporter: {report.reporter}</p>
                  </div>
                ))}
              </div>
              <Button
                color="primary"
                variant="flat"
                className="w-full mt-4"
              >
                View All Reports
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* User Action Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {actionType === "ban" && "Ban User"}
                  {actionType === "warn" && "Warn User"}
                  {actionType === "kick" && "Kick User"}
                </ModalHeader>
                <ModalBody>
                  {selectedUser && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                        <Avatar
                          name={selectedUser.name}
                          size="lg"
                        />
                        <div>
                          <p className="text-white font-medium">{selectedUser.name}</p>
                          <p className="text-sm text-gray-400">{selectedUser.email}</p>
                        </div>
                      </div>

                      <Input
                        label="Duration"
                        placeholder={actionType === "ban" ? "e.g., 7 days, permanent" : "N/A"}
                        isDisabled={actionType !== "ban"}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />

                      <Textarea
                        label="Reason"
                        placeholder={`Enter reason for ${actionType}...`}
                        minRows={4}
                        isRequired
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />

                      {actionType === "ban" && (
                        <Select
                          label="Ban Type"
                          placeholder="Select ban type"
                          selectedKeys={[banType]}
                          onChange={(e) => setBanType(e.target.value)}
                        >
                          <SelectItem key="temporary" value="temporary">
                            Temporary Ban
                          </SelectItem>
                          <SelectItem key="permanent" value="permanent">
                            Permanent Ban
                          </SelectItem>
                        </Select>
                      )}

                      <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <p className="text-sm text-gray-300">
                          This action will be logged and the user will be notified.
                        </p>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    color={actionType === "ban" ? "danger" : "warning"} 
                    onPress={submitAction}
                  >
                    Confirm {actionType}
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
