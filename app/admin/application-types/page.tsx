"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
} from "@nextui-org/react";
import { toast } from "@/lib/toast";
import { Plus, Trash2, FileText, Edit } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ApplicationType {
  name: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function ApplicationTypesPage() {
  const [types, setTypes] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState({
    name: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/application-types");
      const data = await res.json();
      
      if (data.success) {
        setTypes(data.types);
      } else {
        toast.error("Failed to load application types");
      }
    } catch (error) {
      console.error("Error loading types:", error);
      toast.error("Failed to load application types");
    } finally {
      setLoading(false);
    }
  };

  const createType = async () => {
    if (!newType.name || !newType.title) {
      toast.error("Name and title are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/application-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newType),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Application type created successfully!");
        setShowModal(false);
        setNewType({ name: "", title: "", description: "" });
        loadTypes();
      } else {
        toast.error(data.message || "Failed to create application type");
      }
    } catch (error) {
      console.error("Error creating type:", error);
      toast.error("Failed to create application type");
    }
  };

  const deleteType = async (name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will delete all associated forms and applications.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/application-types?name=${name}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Application type deleted successfully");
        loadTypes();
      } else {
        toast.error(data.message || "Failed to delete application type");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
      toast.error("Failed to delete application type");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Application Types
            </h1>
            <p className="text-gray-400 mt-2">
              Manage application categories - create new types without code
            </p>
          </div>
          <Button
            startContent={<Plus size={18} />}
            color="primary"
            onPress={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600"
          >
            New Application Type
          </Button>
        </div>

        {/* Types List */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody>
            {loading ? (
              <p className="text-center text-gray-400 py-8">Loading...</p>
            ) : types.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No application types yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first application type to get started
                </p>
              </div>
            ) : (
              <Table
                aria-label="Application types table"
                classNames={{
                  wrapper: "bg-transparent shadow-none",
                  th: "bg-gray-800/50 text-gray-300",
                  td: "text-gray-300",
                }}
              >
                <TableHeader>
                  <TableColumn>TYPE</TableColumn>
                  <TableColumn>TITLE</TableColumn>
                  <TableColumn>DESCRIPTION</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {types.map((type) => (
                    <TableRow key={type.name}>
                      <TableCell>
                        <code className="text-purple-400">{type.name}</code>
                      </TableCell>
                      <TableCell>{type.title}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {type.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={type.isActive ? "success" : "default"}
                          size="sm"
                        >
                          {type.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/admin/form-builder?type=${type.name}`}>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              color="secondary"
                            >
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => deleteType(type.name)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Create Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="2xl"
        >
          <ModalContent>
            <ModalHeader>Create New Application Type</ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Internal Name"
                placeholder="e.g., mechanic, lawyer, civilian-job"
                value={newType.name}
                onChange={(e) =>
                  setNewType({ ...newType, name: e.target.value })
                }
                description="Lowercase, no spaces (use hyphens). This cannot be changed later."
                isRequired
              />
              <Input
                label="Display Title"
                placeholder="e.g., Mechanic Application"
                value={newType.title}
                onChange={(e) =>
                  setNewType({ ...newType, title: e.target.value })
                }
                description="User-friendly name shown on forms"
                isRequired
              />
              <Textarea
                label="Description"
                placeholder="Brief description of this application type"
                value={newType.description}
                onChange={(e) =>
                  setNewType({ ...newType, description: e.target.value })
                }
                minRows={2}
              />
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>After creating:</strong> Go to the Form Builder to add
                  fields to this application type.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={createType}>
                Create Application Type
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AdminLayout>
  );
}
