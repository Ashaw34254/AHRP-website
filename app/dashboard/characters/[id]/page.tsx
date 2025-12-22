"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Avatar, Chip, Button, Input, Textarea, Select, SelectItem, Tabs, Tab, Spinner } from "@nextui-org/react";
import { ArrowLeft, Edit, Save, Plus, Car, Trash2, Shield, User, IdCard, Briefcase, FileText, Crosshair } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { toast } from "@/lib/toast";

export default function CharacterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [weapons, setWeapons] = useState<any[]>([]);
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

  useEffect(() => {
    loadCharacter();
  }, [resolvedParams.id]);

  const loadCharacter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/characters/${resolvedParams.id}`);
      const data = await res.json();
      
      if (data.success) {
        setCharacter(data.character);
      } else {
        toast.error("Failed to load character");
      }
    } catch (error) {
      console.error("Error loading character:", error);
      toast.error("Failed to load character");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/dashboard/characters/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(character),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Character updated successfully!");
        setIsEditing(false);
        loadCharacter();
      } else {
        toast.error(data.message || "Failed to update character");
      }
    } catch (error) {
      console.error("Error updating character:", error);
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
            <Button as={Link} href="/dashboard/characters" variant="flat" isIconOnly>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                {loading ? "Loading..." : `${character?.firstName} ${character?.lastName}`}
              </h1>
              <p className="text-gray-400">Character Details</p>
            </div>
          </div>
          {!loading && character && (
            <Button
              color={isEditing ? "success" : "primary"}
              startContent={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Save Changes" : "Edit Character"}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : !character ? (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardBody className="text-center py-12">
              <p className="text-gray-400">Character not found</p>
              <Button as={Link} href="/dashboard/characters" color="primary" className="mt-4">
                Back to Characters
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* Character Overview */}
            <Card className="bg-gray-900/50 border border-gray-800">
              <CardBody className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar src={character.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${character.firstName}`} className="w-32 h-32" isBordered />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">
                        {character.firstName} {character.lastName}
                      </h2>
                      {character.department && (
                        <Chip color={getDepartmentColor(character.department) as any} variant="flat">
                          {character.department} {character.rank && `- ${character.rank}`}
                        </Chip>
                      )}
                      <Chip color="success" variant="dot">Active</Chip>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Date of Birth</p>
                        <p className="text-white font-medium">{character.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Gender</p>
                        <p className="text-white font-medium">{character.gender || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white font-medium">{character.phoneNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Occupation</p>
                        <p className="text-white font-medium">{character.occupation || "Civilian"}</p>
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
                        <Input label="First Name" value={character.firstName || ""} onChange={(e) => setCharacter({ ...character, firstName: e.target.value })} />
                        <Input label="Last Name" value={character.lastName || ""} onChange={(e) => setCharacter({ ...character, lastName: e.target.value })} />
                      </div>
                      <Input label="Date of Birth" type="date" value={character.dateOfBirth || ""} onChange={(e) => setCharacter({ ...character, dateOfBirth: e.target.value })} />
                      <Input label="Phone Number" value={character.phoneNumber || ""} onChange={(e) => setCharacter({ ...character, phoneNumber: e.target.value })} />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-gray-400">Date of Birth:</span><span className="text-white">{character.dateOfBirth || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Gender:</span><span className="text-white">{character.gender || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Height:</span><span className="text-white">{character.height || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Weight:</span><span className="text-white">{character.weight || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Phone:</span><span className="text-white">{character.phoneNumber || "N/A"}</span></div>
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
                      <Input label="Department" value={character.department || ""} onChange={(e) => setCharacter({ ...character, department: e.target.value })} />
                      <Input label="Rank" value={character.rank || ""} onChange={(e) => setCharacter({ ...character, rank: e.target.value })} />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span className="text-gray-400">Department:</span><span className="text-white">{character.department || "Civilian"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Rank:</span><span className="text-white">{character.rank || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Occupation:</span><span className="text-white">{character.occupation || "N/A"}</span></div>
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
                    <Textarea value={character.backstory || ""} onChange={(e) => setCharacter({ ...character, backstory: e.target.value })} minRows={6} />
                  ) : (
                    <p className="text-gray-300">{character.backstory || "No backstory provided."}</p>
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
