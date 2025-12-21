"use client";

import { useState } from "react";
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
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Checkbox,
  useDisclosure
} from "@nextui-org/react";
import { Shield, Plus, Edit, Trash2, Users } from "lucide-react";
import { toast } from "@/lib/toast";

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access and control",
    color: "danger",
    permissions: ["all"],
    userCount: 5,
  },
  {
    id: "2",
    name: "Moderator",
    description: "Manage users and applications",
    color: "warning",
    permissions: ["manage_users", "manage_applications", "view_logs"],
    userCount: 12,
  },
  {
    id: "3",
    name: "Police Chief",
    description: "Manage police department",
    color: "primary",
    permissions: ["manage_police", "view_reports"],
    userCount: 3,
  },
  {
    id: "4",
    name: "EMS Chief",
    description: "Manage EMS department",
    color: "success",
    permissions: ["manage_ems", "view_reports"],
    userCount: 2,
  },
  {
    id: "5",
    name: "Member",
    description: "Standard community member",
    color: "default",
    permissions: ["basic_access"],
    userCount: 1225,
  },
];

const availablePermissions = [
  "all",
  "manage_users",
  "manage_applications",
  "manage_roles",
  "manage_police",
  "manage_ems",
  "manage_fire",
  "view_logs",
  "view_reports",
  "ban_users",
  "kick_users",
  "basic_access",
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "default",
    permissions: [] as string[],
  });

  const handleCreate = () => {
    setSelectedRole(null);
    setFormData({
      name: "",
      description: "",
      color: "default",
      permissions: [],
    });
    onOpen();
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: role.permissions,
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
    toast.success("Role deleted successfully");
  };

  const handleSave = () => {
    if (selectedRole) {
      setRoles(roles.map(r => 
        r.id === selectedRole.id 
          ? { ...r, ...formData }
          : r
      ));
      toast.success("Role updated successfully");
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
      toast.success("Role created successfully");
    }
    onOpenChange();
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Role Management</h1>
              <p className="text-gray-400">Manage user roles and permissions</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-5 h-5" />}
            onPress={handleCreate}
          >
            Create Role
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-red-400 mb-2">{roles.length}</div>
              <p className="text-gray-400">Total Roles</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {roles.reduce((sum, r) => sum + r.userCount, 0)}
              </div>
              <p className="text-gray-400">Total Users</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {availablePermissions.length}
              </div>
              <p className="text-gray-400">Permissions</p>
            </CardBody>
          </Card>
        </div>

        {/* Roles Table */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <Table 
              aria-label="Roles table"
              classNames={{
                wrapper: "bg-transparent",
                th: "bg-gray-800 text-gray-300",
                td: "text-gray-400",
              }}
            >
              <TableHeader>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>PERMISSIONS</TableColumn>
                <TableColumn>USERS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Chip color={role.color as any} variant="flat" size="sm">
                          {role.name}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{role.description}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{role.permissions.length} permissions</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{role.userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          isIconOnly
                          onPress={() => handleEdit(role)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDelete(role.id)}
                          isDisabled={role.name === "Administrator" || role.name === "Member"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Create/Edit Modal */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          size="2xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-gray-900 border border-gray-800",
            header: "border-b border-gray-800",
            footer: "border-t border-gray-800",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-white">
                  {selectedRole ? "Edit Role" : "Create New Role"}
                </ModalHeader>
                <ModalBody className="py-6">
                  <div className="space-y-4">
                    <Input
                      label="Role Name"
                      placeholder="Enter role name"
                      value={formData.name}
                      onValueChange={(value) => setFormData({ ...formData, name: value })}
                      variant="bordered"
                    />
                    
                    <Textarea
                      label="Description"
                      placeholder="Describe the role's purpose"
                      value={formData.description}
                      onValueChange={(value) => setFormData({ ...formData, description: value })}
                      variant="bordered"
                    />

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Permissions</label>
                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 bg-gray-800/50 rounded-lg">
                        {availablePermissions.map((permission) => (
                          <Checkbox
                            key={permission}
                            isSelected={formData.permissions.includes(permission)}
                            onValueChange={() => togglePermission(permission)}
                          >
                            <span className="text-sm text-gray-300">{permission}</span>
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSave}>
                    {selectedRole ? "Update" : "Create"}
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
