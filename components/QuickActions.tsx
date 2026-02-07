"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Zap,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Radio,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  UserPlus,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface QuickAction {
  id: string;
  name: string;
  description: string | null;
  actionType: string;
  hotkey: string | null;
  targetEndpoint: string | null;
  defaultPayload: string | null;
  buttonColor: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
}

export function QuickActions() {
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Action form
  const [actionForm, setActionForm] = useState({
    name: "",
    description: "",
    actionType: "CALL_CREATE",
    hotkey: "",
    targetEndpoint: "",
    defaultPayload: "",
    buttonColor: "primary",
    icon: "Zap",
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await fetch("/api/cad/quick-actions");
      const data = await response.json();
      setActions(data.actions || []);
    } catch (error) {
      console.error("Failed to fetch quick actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAction = async () => {
    if (!actionForm.name || !actionForm.actionType) {
      toast.error("Name and action type are required");
      return;
    }

    try {
      const url = isEditMode && selectedAction
        ? `/api/cad/quick-actions/${selectedAction.id}`
        : "/api/cad/quick-actions";
      
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionForm),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Action updated successfully" : "Action created successfully");
        resetForm();
        fetchActions();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save action");
      }
    } catch (error) {
      toast.error("Failed to save action");
    }
  };

  const handleEditAction = (action: QuickAction) => {
    setSelectedAction(action);
    setActionForm({
      name: action.name,
      description: action.description || "",
      actionType: action.actionType,
      hotkey: action.hotkey || "",
      targetEndpoint: action.targetEndpoint || "",
      defaultPayload: action.defaultPayload || "",
      buttonColor: action.buttonColor,
      icon: action.icon,
      isActive: action.isActive,
      displayOrder: action.displayOrder,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDeleteAction = async () => {
    if (!selectedAction) return;

    try {
      const response = await fetch(`/api/cad/quick-actions/${selectedAction.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Action deleted successfully");
        fetchActions();
        onDeleteClose();
        setSelectedAction(null);
      } else {
        toast.error("Failed to delete action");
      }
    } catch (error) {
      toast.error("Failed to delete action");
    }
  };

  const handleExecuteAction = async (action: QuickAction) => {
    toast.success(`Executing: ${action.name}`);
    // In a real implementation, this would execute the action based on actionType
    // e.g., create call, change unit status, send notification, etc.
  };

  const resetForm = () => {
    setActionForm({
      name: "",
      description: "",
      actionType: "CALL_CREATE",
      hotkey: "",
      targetEndpoint: "",
      defaultPayload: "",
      buttonColor: "primary",
      icon: "Zap",
      isActive: true,
      displayOrder: 0,
    });
    setIsEditMode(false);
    setSelectedAction(null);
  };

  const getActionIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Zap,
      Phone,
      Radio,
      AlertCircle,
      CheckCircle,
      XCircle,
      Shield,
      UserPlus,
      MapPin,
      Clock,
    };
    const Icon = icons[iconName] || Zap;
    return <Icon className="w-5 h-5" />;
  };

  const getFilteredActions = () => {
    let filtered = actions.filter((a) => a.isActive);

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const filteredActions = getFilteredActions();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading quick actions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl border-2 border-purple-500/30">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Quick Actions</h1>
            <p className="text-gray-400">Customizable shortcuts for common operations</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => {
            resetForm();
            onOpen();
          }}
          className="font-semibold"
        >
          New Action
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/80 to-purple-800/80 border border-purple-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Actions</p>
                <p className="text-3xl font-bold text-white">{actions.filter(a => a.isActive).length}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border border-blue-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Call Actions</p>
                <p className="text-3xl font-bold text-white">
                  {actions.filter(a => a.actionType === "CALL_CREATE" && a.isActive).length}
                </p>
              </div>
              <Phone className="w-8 h-8 text-blue-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/80 to-green-800/80 border border-green-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Status Actions</p>
                <p className="text-3xl font-bold text-white">
                  {actions.filter(a => a.actionType === "UNIT_STATUS" && a.isActive).length}
                </p>
              </div>
              <Radio className="w-8 h-8 text-green-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/80 to-orange-800/80 border border-orange-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">With Hotkeys</p>
                <p className="text-3xl font-bold text-white">
                  {actions.filter(a => a.hotkey && a.isActive).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-300" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search actions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          className="max-w-xs"
          classNames={{
            input: "bg-gray-900",
            inputWrapper: "bg-gray-900 border border-gray-800",
          }}
        />
      </div>

      {/* Actions Grid */}
      {filteredActions.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800">
          <CardBody className="p-12 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-2xl border-2 border-purple-500/30">
              <Zap className="w-12 h-12 text-purple-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Quick Actions</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm
                  ? "No actions match your search"
                  : "Create quick action shortcuts to speed up your workflow"}
              </p>
              <Button
                color="primary"
                onPress={() => {
                  resetForm();
                  onOpen();
                }}
                startContent={<Plus />}
              >
                Create Action
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filteredActions.map((action) => (
            <Card
              key={action.id}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800 hover:border-purple-500/50 transition-all group"
            >
              <CardBody className="p-4 flex flex-col items-center gap-3">
                <div className="flex items-center justify-between w-full">
                  <Chip size="sm" variant="flat" className="text-xs">
                    #{action.displayOrder}
                  </Chip>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      color="default"
                      onPress={() => handleEditAction(action)}
                      className="h-6 w-6 min-w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      color="danger"
                      onPress={() => {
                        setSelectedAction(action);
                        onDeleteOpen();
                      }}
                      className="h-6 w-6 min-w-6"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  color={action.buttonColor as any}
                  variant="solid"
                  className="w-full h-20 flex flex-col gap-2"
                  onPress={() => handleExecuteAction(action)}
                >
                  {getActionIcon(action.icon)}
                  <span className="text-xs font-semibold">{action.name}</span>
                </Button>

                {action.hotkey && (
                  <Chip size="sm" variant="bordered" className="font-mono text-xs">
                    {action.hotkey}
                  </Chip>
                )}

                {action.description && (
                  <p className="text-xs text-gray-400 text-center line-clamp-2">
                    {action.description}
                  </p>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Action Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>{isEditMode ? "Edit Quick Action" : "New Quick Action"}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Action Name"
                placeholder="Enter action name"
                value={actionForm.name}
                onChange={(e) =>
                  setActionForm({ ...actionForm, name: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Input
                label="Description (Optional)"
                placeholder="Enter action description"
                value={actionForm.description}
                onChange={(e) =>
                  setActionForm({ ...actionForm, description: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Action Type"
                  placeholder="Select type"
                  selectedKeys={[actionForm.actionType]}
                  onChange={(e) =>
                    setActionForm({ ...actionForm, actionType: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="CALL_CREATE">Create Call</SelectItem>
                  <SelectItem key="UNIT_STATUS">Change Unit Status</SelectItem>
                  <SelectItem key="NOTIFICATION">Send Notification</SelectItem>
                  <SelectItem key="CUSTOM">Custom Action</SelectItem>
                </Select>

                <Select
                  label="Button Color"
                  placeholder="Select color"
                  selectedKeys={[actionForm.buttonColor]}
                  onChange={(e) =>
                    setActionForm({ ...actionForm, buttonColor: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="primary">Primary (Blue)</SelectItem>
                  <SelectItem key="success">Success (Green)</SelectItem>
                  <SelectItem key="warning">Warning (Orange)</SelectItem>
                  <SelectItem key="danger">Danger (Red)</SelectItem>
                  <SelectItem key="secondary">Secondary (Purple)</SelectItem>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Icon"
                  placeholder="Select icon"
                  selectedKeys={[actionForm.icon]}
                  onChange={(e) =>
                    setActionForm({ ...actionForm, icon: e.target.value })
                  }
                  classNames={{
                    trigger: "bg-gray-900 border-gray-800",
                  }}
                >
                  <SelectItem key="Zap">Zap</SelectItem>
                  <SelectItem key="Phone">Phone</SelectItem>
                  <SelectItem key="Radio">Radio</SelectItem>
                  <SelectItem key="AlertCircle">Alert Circle</SelectItem>
                  <SelectItem key="CheckCircle">Check Circle</SelectItem>
                  <SelectItem key="XCircle">X Circle</SelectItem>
                  <SelectItem key="Shield">Shield</SelectItem>
                  <SelectItem key="UserPlus">User Plus</SelectItem>
                  <SelectItem key="MapPin">Map Pin</SelectItem>
                  <SelectItem key="Clock">Clock</SelectItem>
                </Select>

                <Input
                  label="Hotkey (Optional)"
                  placeholder="e.g., Ctrl+Shift+N"
                  value={actionForm.hotkey}
                  onChange={(e) =>
                    setActionForm({ ...actionForm, hotkey: e.target.value })
                  }
                  classNames={{
                    input: "bg-gray-900",
                    inputWrapper: "bg-gray-900 border border-gray-800",
                  }}
                />
              </div>

              <Input
                label="Display Order"
                type="number"
                placeholder="Enter display order"
                value={actionForm.displayOrder.toString()}
                onChange={(e) =>
                  setActionForm({ ...actionForm, displayOrder: parseInt(e.target.value) || 0 })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Input
                label="Target Endpoint (Optional)"
                placeholder="e.g., /api/cad/calls"
                value={actionForm.targetEndpoint}
                onChange={(e) =>
                  setActionForm({ ...actionForm, targetEndpoint: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Input
                label="Default Payload (Optional JSON)"
                placeholder='e.g., {"priority": "HIGH"}'
                value={actionForm.defaultPayload}
                onChange={(e) =>
                  setActionForm({ ...actionForm, defaultPayload: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={actionForm.isActive}
                  onChange={(e) =>
                    setActionForm({ ...actionForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Action is active
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => {
              resetForm();
              onClose();
            }}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateAction}
              startContent={<Plus className="w-4 h-4" />}
            >
              {isEditMode ? "Update Action" : "Create Action"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>Delete Quick Action</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">
              Are you sure you want to delete the action "{selectedAction?.name}"?
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteAction}
              startContent={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
