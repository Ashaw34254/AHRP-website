"use client";

import { useEffect, useState } from "react";
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
  Switch,
} from "@nextui-org/react";
import {
  Keyboard,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Command,
  Check,
  X,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface KeyboardShortcut {
  id: string;
  name: string;
  description: string;
  keys: string;
  action: string;
  category: string;
  isEnabled: boolean;
}

const DEFAULT_SHORTCUTS: Omit<KeyboardShortcut, "id">[] = [
  {
    name: "New Call",
    description: "Create a new emergency call",
    keys: "Ctrl+Shift+N",
    action: "CREATE_CALL",
    category: "CALLS",
    isEnabled: true,
  },
  {
    name: "Search Calls",
    description: "Focus on call search box",
    keys: "Ctrl+K",
    action: "SEARCH_CALLS",
    category: "CALLS",
    isEnabled: true,
  },
  {
    name: "Panic Button",
    description: "Trigger emergency panic alert",
    keys: "Ctrl+Shift+P",
    action: "PANIC",
    category: "EMERGENCY",
    isEnabled: true,
  },
  {
    name: "Available Status",
    description: "Set unit status to available",
    keys: "Alt+1",
    action: "STATUS_AVAILABLE",
    category: "STATUS",
    isEnabled: true,
  },
  {
    name: "Busy Status",
    description: "Set unit status to busy",
    keys: "Alt+2",
    action: "STATUS_BUSY",
    category: "STATUS",
    isEnabled: true,
  },
  {
    name: "En Route Status",
    description: "Set unit status to en route",
    keys: "Alt+3",
    action: "STATUS_ENROUTE",
    category: "STATUS",
    isEnabled: true,
  },
  {
    name: "On Scene Status",
    description: "Set unit status to on scene",
    keys: "Alt+4",
    action: "STATUS_ONSCENE",
    category: "STATUS",
    isEnabled: true,
  },
  {
    name: "Toggle MDT",
    description: "Show/hide MDT messaging",
    keys: "Ctrl+M",
    action: "TOGGLE_MDT",
    category: "NAVIGATION",
    isEnabled: true,
  },
  {
    name: "Quick Actions",
    description: "Open quick actions panel",
    keys: "Ctrl+Space",
    action: "QUICK_ACTIONS",
    category: "NAVIGATION",
    isEnabled: true,
  },
  {
    name: "Live Map",
    description: "Navigate to live map view",
    keys: "Ctrl+Shift+M",
    action: "NAV_MAP",
    category: "NAVIGATION",
    isEnabled: true,
  },
];

export function KeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [selectedShortcut, setSelectedShortcut] = useState<KeyboardShortcut | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordingKeys, setRecordingKeys] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [shortcutForm, setShortcutForm] = useState({
    name: "",
    description: "",
    keys: "",
    action: "",
    category: "GENERAL",
    isEnabled: true,
  });

  useEffect(() => {
    // Load shortcuts from localStorage
    const saved = localStorage.getItem("keyboard-shortcuts");
    if (saved) {
      setShortcuts(JSON.parse(saved));
    } else {
      // Initialize with default shortcuts
      const defaults = DEFAULT_SHORTCUTS.map((s, i) => ({
        ...s,
        id: `default-${i}`,
      }));
      setShortcuts(defaults);
      localStorage.setItem("keyboard-shortcuts", JSON.stringify(defaults));
    }
  }, []);

  useEffect(() => {
    // Register global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeShortcuts = shortcuts.filter((s) => s.isEnabled);
      
      for (const shortcut of activeShortcuts) {
        if (matchesShortcut(e, shortcut.keys)) {
          e.preventDefault();
          executeShortcut(shortcut);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  const matchesShortcut = (e: KeyboardEvent, keys: string): boolean => {
    const parts = keys.split("+").map((k) => k.trim().toLowerCase());
    const ctrl = parts.includes("ctrl") && e.ctrlKey;
    const shift = parts.includes("shift") && e.shiftKey;
    const alt = parts.includes("alt") && e.altKey;
    const key = parts[parts.length - 1];

    const expectedModifiers = {
      ctrl: parts.includes("ctrl"),
      shift: parts.includes("shift"),
      alt: parts.includes("alt"),
    };

    const actualModifiers = {
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
    };

    return (
      expectedModifiers.ctrl === actualModifiers.ctrl &&
      expectedModifiers.shift === actualModifiers.shift &&
      expectedModifiers.alt === actualModifiers.alt &&
      e.key.toLowerCase() === key.toLowerCase()
    );
  };

  const executeShortcut = (shortcut: KeyboardShortcut) => {
    toast.success(`Shortcut: ${shortcut.name}`);
    console.log("Executing shortcut:", shortcut.action);
    // In a real implementation, this would execute the actual action
  };

  const handleSaveShortcut = () => {
    if (!shortcutForm.name || !shortcutForm.keys || !shortcutForm.action) {
      toast.error("Name, keys, and action are required");
      return;
    }

    let updated: KeyboardShortcut[];
    if (isEditMode && selectedShortcut) {
      updated = shortcuts.map((s) =>
        s.id === selectedShortcut.id ? { ...shortcutForm, id: s.id } : s
      );
    } else {
      const newShortcut: KeyboardShortcut = {
        ...shortcutForm,
        id: `custom-${Date.now()}`,
      };
      updated = [...shortcuts, newShortcut];
    }

    setShortcuts(updated);
    localStorage.setItem("keyboard-shortcuts", JSON.stringify(updated));
    toast.success(isEditMode ? "Shortcut updated" : "Shortcut created");
    resetForm();
    onClose();
  };

  const handleEditShortcut = (shortcut: KeyboardShortcut) => {
    setSelectedShortcut(shortcut);
    setShortcutForm({
      name: shortcut.name,
      description: shortcut.description,
      keys: shortcut.keys,
      action: shortcut.action,
      category: shortcut.category,
      isEnabled: shortcut.isEnabled,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDeleteShortcut = () => {
    if (!selectedShortcut) return;

    const updated = shortcuts.filter((s) => s.id !== selectedShortcut.id);
    setShortcuts(updated);
    localStorage.setItem("keyboard-shortcuts", JSON.stringify(updated));
    toast.success("Shortcut deleted");
    onDeleteClose();
    setSelectedShortcut(null);
  };

  const handleToggleShortcut = (id: string) => {
    const updated = shortcuts.map((s) =>
      s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
    );
    setShortcuts(updated);
    localStorage.setItem("keyboard-shortcuts", JSON.stringify(updated));
  };

  const handleResetDefaults = () => {
    const defaults = DEFAULT_SHORTCUTS.map((s, i) => ({
      ...s,
      id: `default-${i}`,
    }));
    setShortcuts(defaults);
    localStorage.setItem("keyboard-shortcuts", JSON.stringify(defaults));
    toast.success("Shortcuts reset to defaults");
  };

  const resetForm = () => {
    setShortcutForm({
      name: "",
      description: "",
      keys: "",
      action: "",
      category: "GENERAL",
      isEnabled: true,
    });
    setIsEditMode(false);
    setSelectedShortcut(null);
    setRecordingKeys(false);
    setPressedKeys(new Set());
  };

  const startRecording = () => {
    setRecordingKeys(true);
    setPressedKeys(new Set());
    toast.info("Press keys combination...");
  };

  const stopRecording = () => {
    setRecordingKeys(false);
    const keys = Array.from(pressedKeys).join("+");
    if (keys) {
      setShortcutForm({ ...shortcutForm, keys });
    }
  };

  useEffect(() => {
    if (!recordingKeys) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const newKeys = new Set(pressedKeys);
      
      if (e.ctrlKey) newKeys.add("Ctrl");
      if (e.shiftKey) newKeys.add("Shift");
      if (e.altKey) newKeys.add("Alt");
      if (e.key !== "Control" && e.key !== "Shift" && e.key !== "Alt") {
        newKeys.add(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }
      
      setPressedKeys(newKeys);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (pressedKeys.size > 0) {
        stopRecording();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [recordingKeys, pressedKeys]);

  const categories = ["CALLS", "STATUS", "EMERGENCY", "NAVIGATION", "GENERAL"];
  const groupedShortcuts = categories.reduce((acc, cat) => {
    acc[cat] = shortcuts.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border-2 border-indigo-500/30">
            <Keyboard className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Keyboard Shortcuts</h1>
            <p className="text-gray-400">Customize hotkeys for quick actions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            color="default"
            variant="flat"
            onPress={handleResetDefaults}
          >
            Reset to Defaults
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => {
              resetForm();
              onOpen();
            }}
          >
            New Shortcut
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-900/80 to-indigo-800/80 border border-indigo-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm">Total Shortcuts</p>
                <p className="text-3xl font-bold text-white">{shortcuts.length}</p>
              </div>
              <Keyboard className="w-8 h-8 text-indigo-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/80 to-green-800/80 border border-green-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Enabled</p>
                <p className="text-3xl font-bold text-white">
                  {shortcuts.filter((s) => s.isEnabled).length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/80 to-red-800/80 border border-red-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Disabled</p>
                <p className="text-3xl font-bold text-white">
                  {shortcuts.filter((s) => !s.isEnabled).length}
                </p>
              </div>
              <X className="w-8 h-8 text-red-300" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 border border-blue-700/50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Categories</p>
                <p className="text-3xl font-bold text-white">{categories.length}</p>
              </div>
              <Command className="w-8 h-8 text-blue-300" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Shortcuts by Category */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryShortcuts = groupedShortcuts[category];
          if (categoryShortcuts.length === 0) return null;

          return (
            <Card key={category} className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Chip size="sm" color="primary" variant="flat">
                    {category}
                  </Chip>
                  <span className="text-gray-400 text-sm font-normal">
                    ({categoryShortcuts.length} shortcuts)
                  </span>
                </h3>

                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border transition-all
                        ${
                          shortcut.isEnabled
                            ? "bg-gray-800/50 border-gray-700 hover:border-indigo-500/50"
                            : "bg-gray-900/50 border-gray-800 opacity-50"
                        }
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-white">{shortcut.name}</h4>
                          <Chip
                            size="sm"
                            variant="bordered"
                            className="font-mono"
                            color={shortcut.isEnabled ? "primary" : "default"}
                          >
                            {shortcut.keys}
                          </Chip>
                        </div>
                        <p className="text-sm text-gray-400">{shortcut.description}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          Action: {shortcut.action}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          size="sm"
                          isSelected={shortcut.isEnabled}
                          onValueChange={() => handleToggleShortcut(shortcut.id)}
                        />
                        <Button
                          size="sm"
                          variant="flat"
                          color="default"
                          isIconOnly
                          onPress={() => handleEditShortcut(shortcut)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => {
                            setSelectedShortcut(shortcut);
                            onDeleteOpen();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-indigo-400" />
              <span>{isEditMode ? "Edit Shortcut" : "New Shortcut"}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Shortcut Name"
                placeholder="Enter shortcut name"
                value={shortcutForm.name}
                onChange={(e) =>
                  setShortcutForm({ ...shortcutForm, name: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Input
                label="Description"
                placeholder="Enter description"
                value={shortcutForm.description}
                onChange={(e) =>
                  setShortcutForm({ ...shortcutForm, description: e.target.value })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Keys Combination</label>
                <div className="flex gap-2">
                  <Input
                    value={recordingKeys ? Array.from(pressedKeys).join("+") : shortcutForm.keys}
                    placeholder="Click record or type manually"
                    readOnly={recordingKeys}
                    onChange={(e) =>
                      !recordingKeys && setShortcutForm({ ...shortcutForm, keys: e.target.value })
                    }
                    classNames={{
                      input: "bg-gray-900 font-mono",
                      inputWrapper: "bg-gray-900 border border-gray-800",
                    }}
                  />
                  <Button
                    color={recordingKeys ? "danger" : "primary"}
                    variant="flat"
                    onPress={recordingKeys ? stopRecording : startRecording}
                  >
                    {recordingKeys ? "Stop" : "Record"}
                  </Button>
                </div>
              </div>

              <Input
                label="Action"
                placeholder="e.g., CREATE_CALL, STATUS_AVAILABLE"
                value={shortcutForm.action}
                onChange={(e) =>
                  setShortcutForm({ ...shortcutForm, action: e.target.value.toUpperCase() })
                }
                classNames={{
                  input: "bg-gray-900 font-mono",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <Input
                label="Category"
                placeholder="e.g., CALLS, STATUS, NAVIGATION"
                value={shortcutForm.category}
                onChange={(e) =>
                  setShortcutForm({ ...shortcutForm, category: e.target.value.toUpperCase() })
                }
                classNames={{
                  input: "bg-gray-900",
                  inputWrapper: "bg-gray-900 border border-gray-800",
                }}
              />

              <div className="flex items-center gap-2">
                <Switch
                  isSelected={shortcutForm.isEnabled}
                  onValueChange={(val) =>
                    setShortcutForm({ ...shortcutForm, isEnabled: val })
                  }
                />
                <label className="text-sm text-gray-300">Shortcut is enabled</label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSaveShortcut}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>Delete Shortcut</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">
              Are you sure you want to delete "{selectedShortcut?.name}"?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteShortcut}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
