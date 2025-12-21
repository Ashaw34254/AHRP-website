"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { User, Plus, Search, Award, TrendingUp, Clock, Shield, Phone, FileWarning } from "lucide-react";
import { toast } from "@/lib/toast";

interface OfficerProfile {
  id: string;
  officerId: string;
  firstName: string;
  lastName: string;
  badgeNumber: string;
  department: string;
  rank: string;
  division?: string;
  hireDate: string;
  isActive: boolean;
  certifications?: string;
  specializations?: string;
  totalCalls: number;
  totalArrests: number;
  totalCitations: number;
  hoursLogged: number;
  avatarUrl?: string;
}

export function OfficerProfiles() {
  const [profiles, setProfiles] = useState<OfficerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    badgeNumber: "",
    department: "POLICE",
    rank: "Officer",
    division: "",
    certifications: "",
    specializations: "",
    avatarUrl: "",
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/cad/officers/profiles");
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error("Failed to fetch officer profiles:", error);
    }
  };

  const handleCreateProfile = async () => {
    if (!form.firstName || !form.badgeNumber || !form.department) {
      toast.error("First name, badge number, and department are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cad/officers/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          certifications: form.certifications.split(",").map((c) => c.trim()),
          specializations: form.specializations.split(",").map((s) => s.trim()),
        }),
      });

      if (response.ok) {
        toast.success("Officer profile created");
        fetchProfiles();
        onClose();
        setForm({
          firstName: "",
          lastName: "",
          badgeNumber: "",
          department: "POLICE",
          rank: "Officer",
          division: "",
          certifications: "",
          specializations: "",
          avatarUrl: "",
        });
      } else {
        toast.error("Failed to create profile");
      }
    } catch (error) {
      toast.error("Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles
    .filter((p) =>
      selectedDepartment === "ALL" ? true : p.department === selectedDepartment
    )
    .filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "POLICE":
        return "primary";
      case "FIRE":
        return "danger";
      case "EMS":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardHeader className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <User className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Officer Profiles</h2>
              <p className="text-sm text-gray-400">
                {filteredProfiles.length} {filteredProfiles.length === 1 ? 'officer' : 'officers'} • Personnel management and statistics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by name or badge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              classNames={{
                input: "bg-gray-800/50",
                inputWrapper: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
              }}
              className="w-80"
              size="sm"
            />
            <Select
              size="sm"
              placeholder="Department"
              selectedKeys={[selectedDepartment]}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-44"
              classNames={{
                trigger: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
              }}
            >
              <SelectItem key="ALL">All Departments</SelectItem>
              <SelectItem key="POLICE">Police</SelectItem>
              <SelectItem key="FIRE">Fire</SelectItem>
              <SelectItem key="EMS">EMS</SelectItem>
            </Select>
            <Button 
              color="primary" 
              onPress={onOpen} 
              startContent={<Plus className="w-4 h-4" />}
              className="font-semibold"
            >
              Add Officer
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 mb-6">
                <User className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Officers Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery || selectedDepartment !== "ALL" 
                  ? "No officers match your search criteria. Try adjusting your filters."
                  : "Get started by adding your first officer profile to track personnel, statistics, and certifications."
                }
              </p>
              {!searchQuery && selectedDepartment === "ALL" && (
                <Button 
                  color="primary" 
                  size="lg"
                  onPress={onOpen}
                  startContent={<Plus className="w-5 h-5" />}
                  className="font-semibold"
                >
                  Add Your First Officer
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card
                  key={profile.id}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <CardBody className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <Avatar
                          name={`${profile.firstName} ${profile.lastName}`}
                          size="lg"
                          src={profile.avatarUrl}
                          className="w-16 h-16 text-lg"
                          classNames={{
                            base: "ring-2 ring-gray-700",
                          }}
                        />
                        {profile.isActive && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Chip
                            size="sm"
                            color={getDepartmentColor(profile.department)}
                            variant="flat"
                            className="font-semibold"
                          >
                            {profile.department}
                          </Chip>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{profile.rank}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="px-2 py-1 bg-gray-900/50 rounded">
                            <span className="text-gray-500 text-xs">Badge:</span>
                            <span className="ml-1 text-white font-mono font-bold">{profile.badgeNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {profile.division && (
                      <div className="mb-4 p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-500 mb-0.5">Division</p>
                        <p className="text-sm text-white font-semibold">{profile.division}</p>
                      </div>
                    )}

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-3 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-3 h-3 text-blue-400" />
                          <p className="text-xs text-blue-300">Calls</p>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {profile.totalCalls}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-lg p-3 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-3 h-3 text-red-400" />
                          <p className="text-xs text-red-300">Arrests</p>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {profile.totalArrests}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg p-3 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <FileWarning className="w-3 h-3 text-yellow-400" />
                          <p className="text-xs text-yellow-300">Citations</p>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {profile.totalCitations}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg p-3 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <p className="text-xs text-purple-300">Hours</p>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {profile.hoursLogged.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* Certifications */}
                    {profile.certifications && JSON.parse(profile.certifications).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Certifications</p>
                        <div className="flex flex-wrap gap-1.5">
                          {JSON.parse(profile.certifications).map(
                            (cert: string, idx: number) => (
                              <Chip
                                key={idx}
                                size="sm"
                                variant="flat"
                                color="success"
                                startContent={<Award className="w-3 h-3" />}
                                classNames={{
                                  base: "border border-green-500/30",
                                  content: "font-semibold",
                                }}
                              >
                                {cert}
                              </Chip>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hired Date */}
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Hired</span>
                        <span className="text-gray-400 font-medium">
                          {new Date(profile.hireDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <User className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl">Create Officer Profile</h2>
              <p className="text-sm text-gray-400 font-normal">Add a new officer to the personnel system</p>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                isRequired
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                isRequired
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Input
                label="Badge Number"
                placeholder="e.g., 1234"
                value={form.badgeNumber}
                onChange={(e) => setForm({ ...form, badgeNumber: e.target.value })}
                isRequired
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50 font-mono",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Select
                label="Department"
                selectedKeys={[form.department]}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                isRequired
                variant="bordered"
                classNames={{
                  trigger: "border-gray-700 hover:border-gray-600",
                }}
              >
                <SelectItem key="POLICE">Police</SelectItem>
                <SelectItem key="FIRE">Fire</SelectItem>
                <SelectItem key="EMS">EMS</SelectItem>
              </Select>
              <Input
                label="Rank"
                placeholder="e.g., Officer, Lieutenant"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Input
                label="Division"
                placeholder="e.g., Patrol, SWAT, K9"
                value={form.division}
                onChange={(e) => setForm({ ...form, division: e.target.value })}
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Input
                label="Certifications"
                placeholder="e.g., Firearms, First Aid, TASER"
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                description="Comma separated"
                className="col-span-2"
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Input
                label="Specializations"
                placeholder="e.g., Sniper, Negotiator, K9 Handler"
                value={form.specializations}
                onChange={(e) =>
                  setForm({ ...form, specializations: e.target.value })
                }
                description="Comma separated"
                className="col-span-2"
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
              <Input
                label="Avatar URL"
                placeholder="https://example.com/avatar.jpg"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                className="col-span-2"
                variant="bordered"
                classNames={{
                  input: "bg-gray-900/50",
                  inputWrapper: "border-gray-700 hover:border-gray-600",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleCreateProfile} 
              isLoading={loading}
              startContent={!loading && <Plus className="w-4 h-4" />}
              className="font-semibold"
            >
              Create Profile
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
