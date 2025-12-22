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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { 
  Search,
  RefreshCw,
  Shield,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
  characterCount: number;
}

export default function UsersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
      });
      
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.users);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
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

  const handleUpdateRole = async () => {
    if (!selectedUser || !editRole) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          updates: { role: editRole },
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("User role updated successfully");
        onClose();
        loadUsers();
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("User deleted successfully");
        loadUsers();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role || "user");
    onOpen();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              User Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage community members and their roles
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
            <CardBody className="p-6">
              <p className="text-sm text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{total}</p>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
            <CardBody className="p-6">
              <p className="text-sm text-gray-400 mb-1">Admin Users</p>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => u.role === "admin").length}
              </p>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
            <CardBody className="p-6">
              <p className="text-sm text-gray-400 mb-1">Regular Users</p>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => u.role !== "admin").length}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            <Input
              placeholder="Search users by name or email..."
              startContent={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              classNames={{
                inputWrapper: "bg-gray-800 border-gray-700",
              }}
            />
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
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
                <TableColumn>ROLE</TableColumn>
                <TableColumn>CHARACTERS</TableColumn>
                <TableColumn>JOINED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={loading ? "Loading users..." : "No users found"}
                isLoading={loading}
              >
                {users.map((user) => (
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
                      <span className="text-gray-400">{user.email}</span>
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
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => openEditModal(user)}
                        >
                          Edit Role
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
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
          </CardBody>
        </Card>

        {/* Edit Role Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Edit User Role</ModalHeader>
            <ModalBody>
              {selectedUser && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">User</p>
                    <p className="text-white font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-gray-400">{selectedUser.email}</p>
                  </div>
                  <Select
                    label="Role"
                    selectedKeys={[editRole]}
                    onChange={(e) => setEditRole(e.target.value)}
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700",
                    }}
                  >
                    <SelectItem key="user" value="user">User</SelectItem>
                    <SelectItem key="admin" value="admin">Admin</SelectItem>
                  </Select>
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
