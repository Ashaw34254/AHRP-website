"use client";

import { useState } from "react";
import {
  Card, CardBody, Button, Input, Textarea, Select, SelectItem,
  Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Tooltip, Checkbox
} from "@heroui/react";
import {
  CheckSquare, Plus, Circle, CheckCircle, X, Calendar, User, Clock, Edit
} from "lucide-react";
import { toast } from "@/lib/toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  priority: string;
  status: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  result?: string;
  createdBy: string;
  createdAt: string;
}

interface Props {
  investigationId: string;
  tasks: Task[];
  onUpdate: () => void;
}

export function CIBTaskManager({ investigationId, tasks, onUpdate }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // New task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "Current User",
    priority: "MEDIUM",
    dueDate: ""
  });

  const handleAddTask = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/cad/investigations/${investigationId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          createdBy: "Current User"
        })
      });

      if (response.ok) {
        toast.success("Task created successfully");
        onClose();
        onUpdate();
        setNewTask({
          title: "",
          description: "",
          assignedTo: "Current User",
          priority: "MEDIUM",
          dueDate: ""
        });
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      const response = await fetch(`/api/cad/investigations/${investigationId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          completedBy: "Current User"
        })
      });

      if (response.ok) {
        toast.success("Task marked as completed");
        onUpdate();
      } else {
        throw new Error("Failed to complete task");
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Failed to complete task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/cad/investigations/${investigationId}/tasks/${taskId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Task deleted");
        onUpdate();
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "default",
      MEDIUM: "primary",
      HIGH: "warning",
      URGENT: "danger"
    };
    return colors[priority] || "default";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "warning",
      IN_PROGRESS: "primary",
      COMPLETED: "success",
      CANCELLED: "default"
    };
    return colors[status] || "default";
  };

  const pendingTasks = tasks.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const completedTasks = tasks.filter(t => t.status === "COMPLETED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Tasks & Actions</h3>
          <p className="text-sm text-gray-400">
            {pendingTasks.length} pending · {completedTasks.length} completed
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={onOpen}
        >
          New Task
        </Button>
      </div>

      {/* Pending Tasks */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Circle className="w-4 h-4" />
          Pending Tasks ({pendingTasks.length})
        </h4>

        {pendingTasks.length === 0 ? (
          <Card className="bg-gray-800/50 border border-gray-700">
            <CardBody className="p-6 text-center">
              <CheckSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No pending tasks</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <Card 
                key={task.id}
                className="bg-gray-800/50 border border-gray-700 hover:border-indigo-600/50 transition-all"
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <Checkbox
                        isSelected={task.status === "COMPLETED"}
                        onChange={() => handleCompleteTask(task)}
                        color="success"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h5 className="text-white font-medium">{task.title}</h5>
                        <div className="flex items-center gap-2">
                          <Chip 
                            size="sm" 
                            color={getPriorityColor(task.priority) as any}
                            variant="flat"
                          >
                            {task.priority}
                          </Chip>
                          <Chip 
                            size="sm" 
                            color={getStatusColor(task.status) as any}
                            variant="flat"
                          >
                            {task.status.replace("_", " ")}
                          </Chip>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Assigned to: {task.assignedTo}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Tooltip content="Delete Task">
                        <Button
                          size="sm"
                          isIconOnly
                          variant="flat"
                          color="danger"
                          onPress={() => handleDeleteTask(task.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed Tasks ({completedTasks.length})
          </h4>

          <div className="space-y-3">
            {completedTasks.map((task) => (
              <Card 
                key={task.id}
                className="bg-gray-800/30 border border-gray-700 opacity-75"
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h5 className="text-white font-medium line-through decoration-gray-600">
                          {task.title}
                        </h5>
                        <Chip size="sm" color="success" variant="flat">
                          COMPLETED
                        </Chip>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                      )}

                      {task.result && (
                        <div className="bg-gray-900/50 p-2 rounded border border-gray-700 mb-2">
                          <p className="text-sm text-gray-400">
                            <span className="text-gray-500">Result:</span> {task.result}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Completed by: {task.completedBy || task.assignedTo}</span>
                        </div>
                        {task.completedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.completedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Create New Task</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />

              <Textarea
                label="Description"
                placeholder="Additional details..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                minRows={3}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Assigned To"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
                />

                <Select
                  label="Priority"
                  selectedKeys={[newTask.priority]}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  classNames={{ trigger: "bg-gray-800/50 border border-gray-700" }}
                >
                  <SelectItem key="LOW">Low</SelectItem>
                  <SelectItem key="MEDIUM">Medium</SelectItem>
                  <SelectItem key="HIGH">High</SelectItem>
                  <SelectItem key="URGENT">Urgent</SelectItem>
                </Select>
              </div>

              <Input
                label="Due Date (Optional)"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                classNames={{ inputWrapper: "bg-gray-800/50 border border-gray-700" }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancel</Button>
            <Button 
              color="primary" 
              onPress={handleAddTask}
              isLoading={saving}
              isDisabled={!newTask.title.trim()}
            >
              Create Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
