"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody, 
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Input,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab
} from "@nextui-org/react";
import { 
  Search,
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  Shield,
  Ban,
  AlertTriangle,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  status: "active" | "banned" | "suspended";
  warnings: number;
  characters: number;
  joinDate: string;
  lastActive: string;
  discordId?: string;
}

export default function UsersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const itemsPerPage = 10;

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "Officer",
      department: "Police",
      status: "active",
      warnings: 0,
      characters: 3,
      joinDate: "2024-01-15",
      lastActive: "2 min ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Paramedic",
      department: "EMS",
      status: "active",
      warnings: 1,
      characters: 2,
      joinDate: "2024-02-20",
      lastActive: "15 min ago"
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      role: "Civilian",
      department: "Civilian",
      status: "active",
      warnings: 0,
      characters: 1,
      joinDate: "2024-03-10",
      lastActive: "1 hour ago"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Firefighter",
      department: "Fire",
      status: "active",
      warnings: 2,
      characters: 2,
      joinDate: "2024-01-25",
      lastActive: "3 hours ago"
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert@example.com",
      role: "Civilian",
      department: "Civilian",
      status: "banned",
      warnings: 5,
      characters: 0,
      joinDate: "2023-12-01",
      lastActive: "2 days ago"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      role: "Detective",
      department: "Police",
      status: "active",
      warnings: 0,
      characters: 4,
      joinDate: "2023-11-15",
      lastActive: "Just now"
    },
    {
      id: 7,
      name: "David Martinez",
      email: "david@example.com",
      role: "Civilian",
      department: "Civilian",
      status: "suspended",
      warnings: 3,
      characters: 1,
      joinDate: "2024-02-05",
      lastActive: "5 days ago"
    },
    {
      id: 8,
      name: "Jennifer Taylor",
      email: "jennifer@example.com",
      role: "Chief",
      department: "Fire",
      status: "active",
      warnings: 0,
      characters: 2,
      joinDate: "2023-10-20",
      lastActive: "30 min ago"
    },
  ]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === "all" ? true :
                      selectedTab === "active" ? user.status === "active" :
                      selectedTab === "banned" ? user.status === "banned" :
                      selectedTab === "suspended" ? user.status === "suspended" : true;

    return matchesSearch && matchesTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUserAction = (user: User, action: string) => {
    switch(action) {
      case "view":
        setSelectedUser(user);
        onOpen();
        break;
      case "edit":
        toast.info(`Edit user: ${user.name}`);
        break;
      case "ban":
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: "banned" as const } : u
        ));
        toast.success(`${user.name} has been banned`);
        break;
      case "unban":
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: "active" as const } : u
        ));
        toast.success(`${user.name} has been unbanned`);
        break;
      case "suspend":
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: "suspended" as const } : u
        ));
        toast.warning(`${user.name} has been suspended`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          setUsers(prev => prev.filter(u => u.id !== user.id));
          toast.success(`${user.name} has been deleted`);
        }
        break;
      case "message":
        toast.info(`Opening message dialog for ${user.name}`);
        break;
      case "warn":
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, warnings: u.warnings + 1 } : u
        ));
        toast.warning(`Warning issued to ${user.name}`);
        break;
    }
  };

  const exportUsers = () => {
    const csv = [
      ["ID", "Name", "Email", "Role", "Department", "Status", "Warnings", "Characters", "Join Date", "Last Active"],
      ...filteredUsers.map(u => [
        u.id, u.name, u.email, u.role, u.department, u.status, u.warnings, u.characters, u.joinDate, u.lastActive
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurora-horizon-users-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Users exported successfully");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "success";
      case "banned": return "danger";
      case "suspended": return "warning";
      default: return "default";
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    banned: users.filter(u => u.status === "banned").length,
    suspended: users.filter(u => u.status === "suspended").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage community members and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="flat"
              startContent={<Download className="w-4 h-4" />}
              onPress={exportUsers}
            >
              Export
            </Button>
            <Button
              color="primary"
              startContent={<UserPlus className="w-4 h-4" />}
              onPress={() => toast.info("Add user feature coming soon")}
            >
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Banned</p>
                  <p className="text-2xl font-bold text-white">{stats.banned}</p>
                </div>
                <Ban className="w-8 h-8 text-red-400" />
              </div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Suspended</p>
                  <p className="text-2xl font-bold text-white">{stats.suspended}</p>
                </div>
                <XCircle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Tabs 
                  selectedKey={selectedTab} 
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  color="primary"
                  variant="underlined"
                >
                  <Tab key="all" title={`All (${users.length})`} />
                  <Tab key="active" title={`Active (${stats.active})`} />
                  <Tab key="banned" title={`Banned (${stats.banned})`} />
                  <Tab key="suspended" title={`Suspended (${stats.suspended})`} />
                </Tabs>

                <div className="flex gap-2 w-full md:w-auto">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Search className="w-4 h-4 text-gray-400" />}
                    className="w-full md:w-80"
                    size="sm"
                  />
                  <Button
                    variant="flat"
                    isIconOnly
                    size="sm"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <Table 
                aria-label="Users table"
                className="dark"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>USER</TableColumn>
                  <TableColumn>DEPARTMENT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>WARNINGS</TableColumn>
                  <TableColumn>CHARACTERS</TableColumn>
                  <TableColumn>LAST ACTIVE</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No users found">
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={user.name}
                            src={user.avatar}
                            size="sm"
                          />
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white text-sm">{user.department}</p>
                          <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getStatusColor(user.status)}
                        >
                          {user.status.toUpperCase()}
                        </Chip>
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
                        <span className="text-white text-sm">{user.characters}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-400 text-sm">{user.lastActive}</span>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="light"
                              size="sm"
                              isIconOnly
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="User actions">
                            <DropdownItem
                              key="view"
                              startContent={<Shield className="w-4 h-4" />}
                              onPress={() => handleUserAction(user, "view")}
                            >
                              View Details
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              startContent={<Edit className="w-4 h-4" />}
                              onPress={() => handleUserAction(user, "edit")}
                            >
                              Edit User
                            </DropdownItem>
                            <DropdownItem
                              key="message"
                              startContent={<Mail className="w-4 h-4" />}
                              onPress={() => handleUserAction(user, "message")}
                            >
                              Send Message
                            </DropdownItem>
                            <DropdownItem
                              key="warn"
                              startContent={<AlertTriangle className="w-4 h-4" />}
                              onPress={() => handleUserAction(user, "warn")}
                              className="text-warning"
                            >
                              Issue Warning
                            </DropdownItem>
                            {user.status === "active" ? (
                              <>
                                <DropdownItem
                                  key="suspend"
                                  startContent={<XCircle className="w-4 h-4" />}
                                  onPress={() => handleUserAction(user, "suspend")}
                                  className="text-warning"
                                >
                                  Suspend User
                                </DropdownItem>
                                <DropdownItem
                                  key="ban"
                                  startContent={<Ban className="w-4 h-4" />}
                                  onPress={() => handleUserAction(user, "ban")}
                                  className="text-danger"
                                  color="danger"
                                >
                                  Ban User
                                </DropdownItem>
                              </>
                            ) : user.status === "banned" ? (
                              <DropdownItem
                                key="unban"
                                startContent={<CheckCircle className="w-4 h-4" />}
                                onPress={() => handleUserAction(user, "unban")}
                                className="text-success"
                              >
                                Unban User
                              </DropdownItem>
                            ) : (
                              <DropdownItem
                                key="unban"
                                startContent={<CheckCircle className="w-4 h-4" />}
                                onPress={() => handleUserAction(user, "unban")}
                                className="text-success"
                              >
                                Unsuspend User
                              </DropdownItem>
                            )}
                            <DropdownItem
                              key="delete"
                              startContent={<Trash2 className="w-4 h-4" />}
                              onPress={() => handleUserAction(user, "delete")}
                              className="text-danger"
                              color="danger"
                            >
                              Delete User
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                    color="primary"
                    showControls
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* User Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>User Details</ModalHeader>
                <ModalBody>
                  {selectedUser && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <Avatar
                          name={selectedUser.name}
                          src={selectedUser.avatar}
                          size="lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                          <p className="text-sm text-gray-400">{selectedUser.email}</p>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={getStatusColor(selectedUser.status)}
                            className="mt-2"
                          >
                            {selectedUser.status.toUpperCase()}
                          </Chip>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400">Department</p>
                          <p className="text-white font-medium">{selectedUser.department}</p>
                        </div>
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400">Role</p>
                          <p className="text-white font-medium">{selectedUser.role}</p>
                        </div>
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400">Warnings</p>
                          <p className="text-white font-medium">{selectedUser.warnings}</p>
                        </div>
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400">Characters</p>
                          <p className="text-white font-medium">{selectedUser.characters}</p>
                        </div>
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400">Join Date</p>
                          <p className="text-white font-medium">{selectedUser.joinDate}</p>
                        </div>
                        <div className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-xs text-gray-400">Last Active</p>
                          <p className="text-white font-medium">{selectedUser.lastActive}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={() => {
                    toast.info("Edit functionality coming soon");
                    onClose();
                  }}>
                    Edit User
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
