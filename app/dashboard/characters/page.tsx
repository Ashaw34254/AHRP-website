"use client";

import { useState } from "react";
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
  Select,
  SelectItem,
  useDisclosure,
  Chip,
  Avatar,
  Tabs,
  Tab
} from "@nextui-org/react";
import { Plus, User, Edit, Trash2, Users } from "lucide-react";
import { toast } from "@/lib/toast";
import { OfficerProfiles } from "@/components/OfficerProfiles";

interface Character {
  id: string;
  name: string;
  age: number;
  gender: string;
  backstory: string;
  department: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

const mockCharacters: Character[] = [
  {
    id: "1",
    name: "John Doe",
    age: 32,
    gender: "Male",
    backstory: "A former military veteran turned police officer...",
    department: "Police",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    backstory: "An experienced paramedic dedicated to saving lives...",
    department: "EMS",
    status: "active",
    createdAt: "2024-02-20",
  },
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCreateCharacter = () => {
    setSelectedCharacter(null);
    onOpen();
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    onOpen();
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter(c => c.id !== id));
    toast.success("Character deleted successfully");
  };

  const handleSave = () => {
    if (selectedCharacter) {
      toast.success("Character updated successfully");
    } else {
      toast.success("Character created successfully");
    }
    onOpenChange();
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
                  color="primary"
                  startContent={<Plus className="w-5 h-5" />}
                  onPress={handleCreateCharacter}
                >
                  Create Character
                </Button>
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <Card key={character.id} className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar
                          icon={<User />}
                          className="w-16 h-16"
                          color="primary"
                        />
                        <Chip
                          color={character.status === "active" ? "success" : "warning"}
                          variant="flat"
                          size="sm"
                        >
                          {character.status}
                        </Chip>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {character.name}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-gray-400 mb-4">
                        <p>Age: {character.age} • {character.gender}</p>
                        <p>Department: {character.department}</p>
                        <p className="line-clamp-2">{character.backstory}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="bordered"
                          startContent={<Edit className="w-4 h-4" />}
                          onPress={() => handleEditCharacter(character)}
                        >
                          Edit
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
          onOpenChange={onOpenChange}
          size="2xl"
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
                  {selectedCharacter ? "Edit Character" : "Create New Character"}
                </ModalHeader>
                <ModalBody className="py-6">
                  <div className="space-y-4">
                    <Input
                      label="Character Name"
                      placeholder="Enter character name"
                      defaultValue={selectedCharacter?.name}
                      variant="bordered"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Age"
                        type="number"
                        placeholder="25"
                        defaultValue={selectedCharacter?.age.toString()}
                        variant="bordered"
                      />
                      <Select
                        label="Gender"
                        placeholder="Select gender"
                        defaultSelectedKeys={selectedCharacter ? [selectedCharacter.gender] : []}
                        variant="bordered"
                      >
                        <SelectItem key="Male" value="Male">Male</SelectItem>
                        <SelectItem key="Female" value="Female">Female</SelectItem>
                        <SelectItem key="Other" value="Other">Other</SelectItem>
                      </Select>
                    </div>

                    <Select
                      label="Department"
                      placeholder="Select department"
                      defaultSelectedKeys={selectedCharacter ? [selectedCharacter.department] : []}
                      variant="bordered"
                    >
                      <SelectItem key="Police" value="Police">Police</SelectItem>
                      <SelectItem key="EMS" value="EMS">Fire & EMS</SelectItem>
                      <SelectItem key="Civilian" value="Civilian">Civilian</SelectItem>
                      <SelectItem key="Criminal" value="Criminal">Criminal</SelectItem>
                    </Select>

                    <Textarea
                      label="Backstory"
                      placeholder="Tell us about your character's background..."
                      defaultValue={selectedCharacter?.backstory}
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
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
