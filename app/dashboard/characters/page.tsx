"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Card, 
  CardBody, 
  Button, 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Skeleton,
} from "@nextui-org/react";
import { Plus, User, Edit, Trash2, Users, Calendar, Shield } from "lucide-react";
import { toast } from "@/lib/toast";
import { OfficerProfiles } from "@/components/OfficerProfiles";

interface Character {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string | null;
  backstory: string | null;
  image: string | null;
  department: string | null;
  rank: string | null;
  occupation: string | null;
  createdAt: string;
  officer: {
    id: string;
    callsign: string;
    rank: string;
    department: string;
    dutyStatus: string;
  } | null;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    backstory: "",
    image: "",
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/characters");
      const data = await res.json();
      
      if (data.success) {
        setCharacters(data.characters);
      } else {
        toast.error("Failed to load characters");
      }
    } catch (error) {
      console.error("Error loading characters:", error);
      toast.error("Failed to load characters");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      backstory: "",
      image: "",
    });
    onOpen();
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setFormData({
      firstName: character.firstName,
      lastName: character.lastName,
      dateOfBirth: character.dateOfBirth.split('T')[0],
      gender: character.gender || "",
      backstory: character.backstory || "",
      image: character.image || "",
    });
    onOpen();
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      const res = await fetch(`/api/dashboard/characters?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Character deleted successfully");
        loadCharacters();
      } else {
        toast.error(data.message || "Failed to delete character");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character");
    }
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = "/api/dashboard/characters";
      const method = selectedCharacter ? "PATCH" : "POST";
      const body = selectedCharacter
        ? { characterId: selectedCharacter.id, updates: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(selectedCharacter ? "Character updated" : "Character created");
        onClose();
        loadCharacters();
      } else {
        toast.error(data.message || "Failed to save character");
      }
    } catch (error) {
      console.error("Error saving character:", error);
      toast.error("Failed to save character");
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Characters & Personnel</h1>
          <p className="text-gray-400">Manage your roleplay characters and officer profiles</p>
        </div>

        <Tabs 
          aria-label="Character management tabs"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab
            key="characters"
            title={
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>My Characters</span>
              </div>
            }
          >
            <div className="py-6 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Manage your roleplay characters</p>
                <Button
                  as={Link}
                  href="/dashboard/characters/new"
                  color="success"
                  startContent={<Plus className="w-5 h-5" />}
                >
                  Create Character
                </Button>
              </div>

              {/* Characters Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Skeleton className="w-16 h-16 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
                        <Skeleton className="h-4 w-full mb-1 rounded-lg" />
                        <Skeleton className="h-4 w-2/3 mb-4 rounded-lg" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-20 rounded-lg" />
                          <Skeleton className="h-8 w-20 rounded-lg" />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : characters.length === 0 ? (
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="text-center py-12">
                    <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-300 font-semibold mb-2">No characters yet</p>
                    <p className="text-gray-400 text-sm mb-4">
                      Create your first character to get started
                    </p>
                    <Button
                      as={Link}
                      href="/dashboard/characters/new"
                      color="success"
                      startContent={<Plus className="w-5 h-5" />}
                    >
                      Create Character
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {characters.map((character) => (
                    <Card key={character.id} className="bg-gray-900/50 border border-gray-800">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Avatar
                            src={character.image || undefined}
                            name={`${character.firstName} ${character.lastName}`}
                            className="w-16 h-16"
                            isBordered
                          />
                          {character.officer && (
                            <Chip
                              color={
                                character.officer.department === "POLICE" ? "primary" :
                                character.officer.department === "FIRE" ? "danger" :
                                character.officer.department === "EMS" ? "success" : "default"
                              }
                              variant="flat"
                              size="sm"
                            >
                              {character.officer.department}
                            </Chip>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          {character.firstName} {character.lastName}
                        </h3>
                        
                        <div className="space-y-1 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Age: {calculateAge(character.dateOfBirth)}</span>
                            {character.gender && <span>• {character.gender}</span>}
                          </div>
                          {character.officer && (
                            <p>
                              {character.officer.rank} - {character.officer.callsign}
                            </p>
                          )}
                          {character.backstory && (
                            <p className="line-clamp-2 mt-2">{character.backstory}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            as={Link}
                            href={`/dashboard/characters/${character.id}`}
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={<Edit className="w-4 h-4" />}
                          >
                            View Details
                          </Button>
                          <Button
                            as={Link}
                            href={`/dashboard/police/cad?search=${encodeURIComponent(character.firstName + ' ' + character.lastName)}&type=citizen`}
                            size="sm"
                            color="secondary"
                            variant="flat"
                            startContent={<Shield className="w-4 h-4" />}
                          >
                            CAD
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            startContent={<Trash2 className="w-4 h-4" />}
                            onPress={() => handleDeleteCharacter(character.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>

          <Tab
            key="officers"
            title={
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Officer Profiles</span>
              </div>
            }
          >
            <div className="py-6">
              <OfficerProfiles />
            </div>
          </Tab>
        </Tabs>

        {/* Create/Edit Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="2xl"
          classNames={{
            base: "bg-gray-900 border border-gray-800",
            header: "border-b border-gray-800",
            footer: "border-t border-gray-800",
          }}
        >
          <ModalContent>
            <ModalHeader className="text-white">
              {selectedCharacter ? "Edit Character" : "Create New Character"}
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    variant="bordered"
                    isRequired
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    variant="bordered"
                    isRequired
                  />
                  <Input
                    label="Gender"
                    placeholder="Male, Female, Other"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    variant="bordered"
                  />
                </div>

                <Input
                  label="Profile Image URL"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  variant="bordered"
                />

                <Textarea
                  label="Backstory"
                  placeholder="Tell us about your character's background..."
                  value={formData.backstory}
                  onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                  minRows={4}
                  variant="bordered"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave}>
                {selectedCharacter ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
