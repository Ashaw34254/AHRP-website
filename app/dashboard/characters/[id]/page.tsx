"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Avatar, Chip, Button, Input, Textarea, Select, SelectItem, Tabs, Tab } from "@nextui-org/react";
import { ArrowLeft, Edit, Save, Plus, Car, Trash2, Shield, User, IdCard, Briefcase, FileText, Crosshair } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/lib/toast";

// Mock character data
const mockCharacter = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-05-15",
  gender: "MALE",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  height: "6'2\"",
  weight: "180lbs",
  eyeColor: "BLUE",
  hairColor: "BROWN",
  build: "ATHLETIC",
  bloodType: "O+",
  licenseStatus: "VALID",
  stateId: "SA-123456",
  firearmPermit: true,
  organDonor: true,
  veteranStatus: false,
  department: "POLICE",
  rank: "Sergeant",
  phoneNumber: "555-0123",
  backstory: "A dedicated police officer with years of experience serving the community.",
  isActive: true,
  playTime: 1200,
};

const mockVehicles = [
  { id: "1", make: "Dodge", model: "Charger", year: 2021, plate: "POLICE1", color: "Black", vin: "1C3CDZCB1JN123456" },
  { id: "2", make: "Ford", model: "F-150", year: 2020, plate: "ABC-123", color: "Blue", vin: "1FTEW1EP5LFB12345" },
];

const mockWeapons = [
  { id: "1", type: "Handgun", make: "Glock", model: "17", caliber: "9mm", serialNumber: "GLK123456", registered: true },
  { id: "2", type: "Rifle", make: "Smith & Wesson", model: "M&P15", caliber: "5.56mm", serialNumber: "SW789012", registered: true },
];

const mockWeapons = [
  { id: "1", type: "Pistol", make: "Glock", model: "17", caliber: "9mm", serialNumber: "ABC123456", registered: true },
  { id: "2", type: "Rifle", make: "Smith & Wesson", model: "M&P15", caliber: "5.56mm", serialNumber: "XYZ789012", registered: true },
];

export default function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState(mockCharacter);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [weapons, setWeapons] = useState(mockWeapons);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddWeapon, setShowAddWeapon] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
    plate: "",
    color: "",
    vin: "",
  });
  const [newWeapon, setNewWeapon] = useState({
    type: "",
    make: "",
    model: "",
    caliber: "",
    serialNumber: "",
    registered: true,
  });

  const handleSave = async () => {
    try {
      // API call would go here
      toast.success("Character updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update character");
    }
  };

  const handleAddVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.plate) {
      toast.error("Please fill in required vehicle fields");
      return;
    }

    const vehicle = {
      id: `${Date.now()}`,
      ...newVehicle,
      year: parseInt(newVehicle.year) || new Date().getFullYear(),
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ make: "", model: "", year: "", plate: "", color: "", vin: "" });
    setShowAddVehicle(false);
    toast.success("Vehicle added successfully!");
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
    toast.success("Vehicle removed");
  };

  const handleAddWeapon = () => {
    if (!newWeapon.type || !newWeapon.make || !newWeapon.model) {
      toast.error("Please fill in required weapon fields");
      return;
    }

    const weapon = {
      id: `${Date.now()}`,
      ...newWeapon,
    };

    setWeapons([...weapons, weapon]);
    setNewWeapon({ type: "", make: "", model: "", caliber: "", serialNumber: "", registered: true });
    setShowAddWeapon(false);
    toast.success("Weapon added successfully!");
  };

  const handleDeleteWeapon = (id: string) => {
    setWeapons(weapons.filter((w) => w.id !== id));
    toast.success("Weapon removed");
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "POLICE": return "primary";
      case "FIRE": return "danger";
      case "EMS": return "success";
      default: return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button as={Link} href="/dashboard" variant="flat" isIconOnly>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                {character.firstName} {character.lastName}
              </h1>
              <p className="text-gray-400">Character Details</p>
            </div>
          </div>
          <Button
            color={isEditing ? "success" : "primary"}
            startContent={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save Changes" : "Edit Character"}
          </Button>
        </div>

        {/* Character Overview */}
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6">
            <div className="flex items-start gap-6">
              <Avatar src={character.image} className="w-32 h-32" isBordered />
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">
                    {character.firstName} {character.lastName}
                  </h2>
                  <Chip color={getDepartmentColor(character.department) as any} variant="flat">
                    {character.department} - {character.rank}
                  </Chip>
                  {character.isActive && <Chip color="success" variant="dot">Active</Chip>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">State ID</p>
                    <p className="text-white font-medium">{character.stateId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Blood Type</p>
                    <p className="text-white font-medium">{character.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">License</p>
                    <p className="text-white font-medium">{character.licenseStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Play Time</p>
                    <p className="text-white font-medium">{Math.floor(character.playTime / 60)}h</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabbed Content */}
        <Tabs aria-label="Character sections" color="primary" variant="underlined" classNames={{ tabList: "bg-gray-900/50 border border-gray-800 p-2 rounded-lg" }}>
          <Tab key="details" title={<div className="flex items-center gap-2"><User className="w-4 h-4" />Details</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IdCard className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Basic Information</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="First Name" value={character.firstName} onChange={(e) => setCharacter({ ...character, firstName: e.target.value })} />
                        <Input label="Last Name" value={character.lastName} onChange={(e) => setCharacter({ ...character, lastName: e.target.value })} />
                      </div>
                      <Input label="Date of Birth" type="date" value={character.dateOfBirth} onChange={(e) => setCharacter({ ...character, dateOfBirth: e.target.value })} />
                      <Input label="Phone Number" value={character.phoneNumber} onChange={(e) => setCharacter({ ...character, phoneNumber: e.target.value })} />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-gray-400">Date of Birth:</span><span className="text-white">{character.dateOfBirth}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Gender:</span><span className="text-white">{character.gender}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Height:</span><span className="text-white">{character.height}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Weight:</span><span className="text-white">{character.weight}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Phone:</span><span className="text-white">{character.phoneNumber}</span></div>
                    </>
                  )}
                </CardBody>
              </Card>

              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Employment</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input label="Department" value={character.department} onChange={(e) => setCharacter({ ...character, department: e.target.value })} />
                      <Input label="Rank" value={character.rank} onChange={(e) => setCharacter({ ...character, rank: e.target.value })} />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-gray-400">Department:</span><span className="text-white">{character.department}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Rank:</span><span className="text-white">{character.rank}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Firearm Permit:</span><span className="text-white">{character.firearmPermit ? "Yes" : "No"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Organ Donor:</span><span className="text-white">{character.organDonor ? "Yes" : "No"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Veteran:</span><span className="text-white">{character.veteranStatus ? "Yes" : "No"}</span></div>
                    </>
                  )}
                </CardBody>
              </Card>

              <Card className="bg-gray-900/50 border border-gray-800 md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Backstory</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  {isEditing ? (
                    <Textarea value={character.backstory} onChange={(e) => setCharacter({ ...character, backstory: e.target.value })} minRows={6} />
                  ) : (
                    <p className="text-gray-300">{character.backstory}</p>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="vehicles" title={<div className="flex items-center gap-2"><Car className="w-4 h-4" />Vehicles ({vehicles.length})</div>}>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Registered Vehicles</h3>
                <Button color="primary" startContent={<Plus className="w-4 h-4" />} onPress={() => setShowAddVehicle(!showAddVehicle)}>
                  Add Vehicle
                </Button>
              </div>

              {showAddVehicle && (
                <Card className="bg-gray-900/50 border border-green-500">
                  <CardHeader>
                    <h4 className="text-lg font-bold text-white">New Vehicle</h4>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="Make" placeholder="Ford" value={newVehicle.make} onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })} isRequired />
                      <Input label="Model" placeholder="Mustang" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} isRequired />
                      <Input label="Year" placeholder="2024" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="License Plate" placeholder="ABC-123" value={newVehicle.plate} onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })} isRequired />
                      <Input label="Color" placeholder="Blue" value={newVehicle.color} onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })} />
                      <Input label="VIN" placeholder="1HGBH41JXMN109186" value={newVehicle.vin} onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <Button color="success" onPress={handleAddVehicle}>Save Vehicle</Button>
                      <Button variant="flat" onPress={() => setShowAddVehicle(false)}>Cancel</Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="bg-gray-900/50 border border-gray-800">
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                            <p className="text-sm text-gray-400 mb-2">{vehicle.color}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">Plate:</span>
                                <Chip size="sm" variant="flat" color="primary">{vehicle.plate}</Chip>
                              </div>
                              {vehicle.vin && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">VIN:</span>
                                  <span className="text-white font-mono">{vehicle.vin}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button isIconOnly size="sm" color="danger" variant="flat" onPress={() => handleDeleteVehicle(vehicle.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {vehicles.length === 0 && !showAddVehicle && (
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardBody className="p-12 text-center">
                    <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No vehicles registered</p>
                    <Button color="primary" onPress={() => setShowAddVehicle(true)}>Add First Vehicle</Button>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
