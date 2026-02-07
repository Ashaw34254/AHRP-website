"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { 
  Card, 
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Shield, Users, Search, RefreshCw, Edit } from "lucide-react";
import { toast } from "@/lib/toast";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  characterCount: number;
  createdAt: string;
}

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users?page=1&search=");
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    setStats({
      total: users.length,
      admins: users.filter(u => u.role === "admin").length,
      users: users.filter(u => u.role !== "admin").length,
    });
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role || "user");
    onOpen();
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          updates: { role: newRole },
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        onClose();
        loadUsers();
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Role Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage user roles and permissions
            </p>
          </div>
          <Button
            startContent={<RefreshCw size={18} />}
            variant="flat"
            onPress={loadUsers}
            isLoading={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Administrators</p>
                  <p className="text-3xl font-bold text-white">{stats.admins}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Regular Users</p>
                  <p className="text-3xl font-bold text-white">{stats.users}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by name or email..."
                startContent={<Search size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                classNames={{
                  inputWrapper: "bg-gray-800 border-gray-700",
                }}
              />
              <Select
                label="Filter by Role"
                selectedKeys={[selectedRole]}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full md:w-64"
                classNames={{
                  trigger: "bg-gray-800 border-gray-700",
                }}
              >
                <SelectItem key="all">All Roles</SelectItem>
                <SelectItem key="admin">Administrators</SelectItem>
                <SelectItem key="user">Regular Users</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <h2 className="text-xl font-semibold">Users by Role</h2>
          </CardHeader>
          <CardBody>
            <Table
              aria-label="Users table"
              classNames={{
                base: "bg-transparent",
                wrapper: "bg-transparent shadow-none",
              }}
            >
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>CURRENT ROLE</TableColumn>
                <TableColumn>CHARACTERS</TableColumn>
                <TableColumn>JOINED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={loading ? "Loading users..." : "No users found"}
                isLoading={loading}
              >
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={user.name || "User"}
                          src={user.image || undefined}
                          size="sm"
                        />
                        <span className="text-gray-300">{user.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 text-sm">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={user.role === "admin" ? "danger" : "default"}
                        startContent={user.role === "admin" ? <Shield size={14} /> : undefined}
                      >
                        {user.role || "user"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-300">{user.characterCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<Edit size={14} />}
                        onPress={() => handleEditRole(user)}
                      >
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Role Description Card */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <h2 className="text-xl font-semibold">Role Descriptions</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-white">Administrator</h3>
              </div>
              <p className="text-sm text-gray-400">
                Full system access. Can manage users, applications, events, settings, and all admin functions.
              </p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">User</h3>
              </div>
              <p className="text-sm text-gray-400">
                Standard community member. Can submit applications, create characters, and participate in events.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Edit Role Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Change User Role</ModalHeader>
            <ModalBody>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    <Avatar
                      name={selectedUser.name || "User"}
                      src={selectedUser.image || undefined}
                      size="lg"
                    />
                    <div>
                      <p className="font-semibold text-white">{selectedUser.name}</p>
                      <p className="text-sm text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>

                  <Select
                    label="New Role"
                    selectedKeys={[newRole]}
                    onChange={(e) => setNewRole(e.target.value)}
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700",
                    }}
                  >
                    <SelectItem key="user">
                      User - Standard member access
                    </SelectItem>
                    <SelectItem key="admin">
                      Administrator - Full system access
                    </SelectItem>
                  </Select>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-xs text-gray-300">
                      ⚠️ Changing a user's role will immediately affect their access permissions.
                    </p>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleUpdateRole}>
                Update Role
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
