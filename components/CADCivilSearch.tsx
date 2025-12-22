"use client";

import { Card, CardBody, Input, Button, Spinner, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Avatar, Chip } from "@nextui-org/react";
import { Search, User, Car, AlertTriangle, Flag, Plus, FileWarning, Edit, FileText, Clock, MapPin, Users, Printer, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";
import { useVoice } from "@/lib/voice-context";

interface Citizen {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string | null;
  stateId: string | null;
  phoneNumber: string | null;
  address: string | null;
  image: string | null;
  
  // Physical Description
  height: string | null;
  weight: string | null;
  eyeColor: string | null;
  hairColor: string | null;
  build: string | null;
  
  // Status
  isWanted: boolean;
  isMissing: boolean;
  driversLicense: boolean;
  weaponsPermit: boolean;
  flags: string | null;
  
  // Additional Information
  aliases: string[] | null;
  tattoos: string | null;
  emergencyContact: { name: string; relationship: string; phone: string } | null;
  medicalInfo: Array<{ type: string; detail: string }> | null;
  gangAffiliation: string | null;
  gangStatus: string | null;
  gangNotes: string | null;
  
  warrants: Array<{
    id: string;
    offense: string;
    bail: number | null;
    isActive: boolean;
  }>;
  vehicles: Array<{
    plate: string;
    model: string;
    color: string;
  }>;
  citations: Array<{
    id: string;
    offense: string;
    fineAmount: number;
    issueDate: string;
  }>;
  arrests: Array<{
    id: string;
    charges: string;
    arrestDate: string;
  }>;
  notes: Array<{
    text: string;
    officerId: string;
    officerName: string;
    createdAt: string;
  }>;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
  year: number | null;
  isStolen: boolean;
  isWanted: boolean;
  owner: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
}

type SearchType = "citizen" | "vehicle";

export function CADCivilSearch() {
  const { speak, isEnabled: voiceEnabled } = useVoice();
  const [searchType, setSearchType] = useState<SearchType>("citizen");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Warrant modal
  const { isOpen: isWarrantOpen, onOpen: onWarrantOpen, onClose: onWarrantClose } = useDisclosure();
  const [warrantOffense, setWarrantOffense] = useState("");
  const [warrantBail, setWarrantBail] = useState("");
  const [warrantNotes, setWarrantNotes] = useState("");
  const [addingWarrant, setAddingWarrant] = useState(false);

  // Flag modal
  const { isOpen: isFlagOpen, onOpen: onFlagOpen, onClose: onFlagClose } = useDisclosure();
  const [flagType, setFlagType] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [addingFlag, setAddingFlag] = useState(false);
  const [removingFlag, setRemovingFlag] = useState(false);

  // Note modal
  const { isOpen: isNoteOpen, onOpen: onNoteOpen, onClose: onNoteClose } = useDisclosure();
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Vehicle modal
  const { isOpen: isVehicleOpen, onOpen: onVehicleOpen, onClose: onVehicleClose } = useDisclosure();
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [addingVehicle, setAddingVehicle] = useState(false);

  // Edit modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Alias modal
  const { isOpen: isAliasOpen, onOpen: onAliasOpen, onClose: onAliasClose } = useDisclosure();
  const [aliasName, setAliasName] = useState("");
  const [addingAlias, setAddingAlias] = useState(false);

  // Photo modal
  const { isOpen: isPhotoOpen, onOpen: onPhotoOpen, onClose: onPhotoClose } = useDisclosure();
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Tattoos modal
  const { isOpen: isTattoosOpen, onOpen: onTattoosOpen, onClose: onTattoosClose } = useDisclosure();
  const [tattoosDescription, setTattoosDescription] = useState("");
  const [savingTattoos, setSavingTattoos] = useState(false);

  // Emergency Contact modal
  const { isOpen: isEmergencyOpen, onOpen: onEmergencyOpen, onClose: onEmergencyClose } = useDisclosure();
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [savingEmergency, setSavingEmergency] = useState(false);

  // Medical Alert modal
  const { isOpen: isMedicalOpen, onOpen: onMedicalOpen, onClose: onMedicalClose } = useDisclosure();
  const [medicalType, setMedicalType] = useState("");
  const [medicalDetail, setMedicalDetail] = useState("");
  const [addingMedical, setAddingMedical] = useState(false);

  // Gang Info modal
  const { isOpen: isGangOpen, onOpen: onGangOpen, onClose: onGangClose } = useDisclosure();
  const [gangAffiliation, setGangAffiliation] = useState("");
  const [gangStatus, setGangStatus] = useState("");
  const [gangNotes, setGangNotes] = useState("");
  const [savingGang, setSavingGang] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setCitizen(null);
    setVehicle(null);

    try {
      const endpoint = searchType === "citizen" 
        ? `/api/cad/civil/citizen?q=${encodeURIComponent(searchQuery)}`
        : `/api/cad/civil/vehicle?plate=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(endpoint);
      
      if (response.status === 404) {
        setError(`${searchType === "citizen" ? "Citizen" : "Vehicle"} not found`);
        return;
      }

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      
      if (searchType === "citizen") {
        setCitizen(data.citizen);
      } else {
        setVehicle(data.vehicle);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarrant = async () => {
    if (!citizen || !warrantOffense.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAddingWarrant(true);
    try {
      const response = await fetch("/api/cad/warrants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          offense: warrantOffense,
          bail: warrantBail ? parseFloat(warrantBail) : null,
          notes: warrantNotes,
          isActive: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to add warrant");

      toast.success("Warrant added successfully");
      onWarrantClose();
      setWarrantOffense("");
      setWarrantBail("");
      setWarrantNotes("");
      
      // Refresh citizen data
      handleSearch();
    } catch (error) {
      console.error("Error adding warrant:", error);
      toast.error("Failed to add warrant");
    } finally {
      setAddingWarrant(false);
    }
  };

  const handleAddFlag = async () => {
    if (!citizen || !flagType.trim() || !flagReason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAddingFlag(true);
    try {
      // Use universal update endpoint that handles both Citizens and Characters
      const response = await fetch(`/api/cad/civil/update-flags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: citizen.id,
          isWanted: flagType === "wanted" ? true : citizen.isWanted,
          isMissing: flagType === "missing" ? true : citizen.isMissing,
          flagType: flagType, // Pass the flag type to be added to flags array
          flagReason: flagReason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add flag");
      }

      toast.success(`${flagType.toUpperCase()} flag added successfully`);
      onFlagClose();
      setFlagType("");
      setFlagReason("");
      
      // Refresh citizen data
      handleSearch();
    } catch (error) {
      console.error("Error adding flag:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add flag");
    } finally {
      setAddingFlag(false);
    }
  };

  const handleRemoveFlag = async (flagToRemove: string) => {
    if (!citizen) return;

    setRemovingFlag(true);
    try {
      const response = await fetch(`/api/cad/civil/update-flags`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: citizen.id,
          flagType: flagToRemove,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove flag");
      }

      toast.success(`${flagToRemove.toUpperCase()} flag removed`);
      
      // Refresh citizen data
      handleSearch();
    } catch (error) {
      console.error("Error removing flag:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove flag");
    } finally {
      setRemovingFlag(false);
    }
  };

  const handleAddNote = async () => {
    if (!citizen || !noteText.trim()) {
      toast.error("Please enter a note");
      return;
    }

    setAddingNote(true);
    try {
      const response = await fetch("/api/cad/civil/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          note: noteText,
        }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      toast.success("Note added successfully");
      onNoteClose();
      setNoteText("");
      
      // Refresh citizen data
      handleSearch();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!citizen || !vehiclePlate.trim() || !vehicleModel.trim() || !vehicleColor.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAddingVehicle(true);
    try {
      const response = await fetch("/api/cad/civil/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          plate: vehiclePlate,
          model: vehicleModel,
          color: vehicleColor,
          year: vehicleYear ? parseInt(vehicleYear) : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to add vehicle");

      toast.success("Vehicle registered successfully");
      onVehicleClose();
      setVehiclePlate("");
      setVehicleModel("");
      setVehicleColor("");
      setVehicleYear("");
      
      // Refresh citizen data
      handleSearch();
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to register vehicle");
    } finally {
      setAddingVehicle(false);
    }
  };

  const handleEditCitizen = async () => {
    if (!citizen) return;

    setSavingEdit(true);
    try {
      const response = await fetch(`/api/cad/civil/citizen/${citizen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: editAddress || citizen.address,
          phoneNumber: editPhone || citizen.phoneNumber,
        }),
      });

      if (!response.ok) throw new Error("Failed to update citizen");

      toast.success("Citizen information updated");
      onEditClose();
      
      // Refresh citizen data
      handleSearch();
    } catch (error) {
      console.error("Error updating citizen:", error);
      toast.error("Failed to update citizen");
    } finally {
      setSavingEdit(false);
    }
  };

  const openEditModal = () => {
    if (citizen) {
      setEditAddress(citizen.address || "");
      setEditPhone(citizen.phoneNumber || "");
      onEditOpen();
    }
  };

  const handlePrint = () => {
    if (citizen) {
      window.print();
      toast.success("Print dialog opened");
    }
  };

  // New handlers for comprehensive features
  const handleAddAlias = async () => {
    if (!citizen || !aliasName.trim()) {
      toast.error("Please enter an alias");
      return;
    }

    setAddingAlias(true);
    try {
      const response = await fetch("/api/cad/civil/aliases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          alias: aliasName,
        }),
      });

      if (!response.ok) throw new Error("Failed to add alias");

      toast.success("Alias added successfully");
      onAliasClose();
      setAliasName("");
      handleSearch();
    } catch (error) {
      console.error("Error adding alias:", error);
      toast.error("Failed to add alias");
    } finally {
      setAddingAlias(false);
    }
  };

  const handleRemoveAlias = async (alias: string) => {
    if (!citizen) return;

    try {
      const response = await fetch(`/api/cad/civil/aliases?citizenId=${citizen.id}&alias=${encodeURIComponent(alias)}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove alias");

      toast.success("Alias removed");
      handleSearch();
    } catch (error) {
      console.error("Error removing alias:", error);
      toast.error("Failed to remove alias");
    }
  };

  const handleUpdatePhoto = async () => {
    if (!citizen || !photoUrl.trim()) {
      toast.error("Please enter a photo URL");
      return;
    }

    setUploadingPhoto(true);
    try {
      const response = await fetch("/api/cad/civil/update-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          image: photoUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update photo");

      toast.success("Photo updated successfully");
      onPhotoClose();
      setPhotoUrl("");
      handleSearch();
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveTattoos = async () => {
    if (!citizen) return;

    setSavingTattoos(true);
    try {
      const response = await fetch("/api/cad/civil/update-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          tattoos: tattoosDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to save tattoos");

      toast.success("Tattoos/marks saved successfully");
      onTattoosClose();
      handleSearch();
    } catch (error) {
      console.error("Error saving tattoos:", error);
      toast.error("Failed to save tattoos");
    } finally {
      setSavingTattoos(false);
    }
  };

  const handleSaveEmergencyContact = async () => {
    if (!citizen) return;

    if (!emergencyName.trim() || !emergencyRelationship.trim() || !emergencyPhone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSavingEmergency(true);
    try {
      const response = await fetch("/api/cad/civil/update-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          emergencyContact: {
            name: emergencyName,
            relationship: emergencyRelationship,
            phone: emergencyPhone,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to save emergency contact");

      toast.success("Emergency contact saved successfully");
      onEmergencyClose();
      handleSearch();
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      toast.error("Failed to save emergency contact");
    } finally {
      setSavingEmergency(false);
    }
  };

  const handleAddMedicalAlert = async () => {
    if (!citizen || !medicalType.trim() || !medicalDetail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setAddingMedical(true);
    try {
      // Get existing medical info
      let medicalInfo = [];
      if (citizen.medicalInfo) {
        try {
          medicalInfo = typeof citizen.medicalInfo === 'string' 
            ? JSON.parse(citizen.medicalInfo) 
            : citizen.medicalInfo;
        } catch (e) {
          medicalInfo = [];
        }
      }

      // Add new alert
      medicalInfo.push({
        type: medicalType,
        detail: medicalDetail,
      });

      const response = await fetch("/api/cad/civil/update-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          medicalInfo,
        }),
      });

      if (!response.ok) throw new Error("Failed to add medical alert");

      toast.success("Medical alert added successfully");
      onMedicalClose();
      setMedicalType("");
      setMedicalDetail("");
      handleSearch();
    } catch (error) {
      console.error("Error adding medical alert:", error);
      toast.error("Failed to add medical alert");
    } finally {
      setAddingMedical(false);
    }
  };

  const handleSaveGangInfo = async () => {
    if (!citizen) return;

    setSavingGang(true);
    try {
      const response = await fetch("/api/cad/civil/update-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenId: citizen.id,
          gangAffiliation,
          gangStatus,
          gangNotes,
        }),
      });

      if (!response.ok) throw new Error("Failed to save gang info");

      toast.success("Gang information saved successfully");
      onGangClose();
      handleSearch();
    } catch (error) {
      console.error("Error saving gang info:", error);
      toast.error("Failed to save gang info");
    } finally {
      setSavingGang(false);
    }
  };

  const handleRemoveWarrant = async (warrantId: string) => {
    if (!citizen) return;

    try {
      const response = await fetch(`/api/cad/civil/warrants?id=${warrantId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove warrant");

      toast.success("Warrant removed");
      handleSearch();
    } catch (error) {
      console.error("Error removing warrant:", error);
      toast.error("Failed to remove warrant");
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    if (!citizen) return;

    try {
      const response = await fetch(`/api/cad/civil/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove vehicle");

      toast.success("Vehicle removed");
      handleSearch();
    } catch (error) {
      console.error("Error removing vehicle:", error);
      toast.error("Failed to remove vehicle");
    }
  };

  const handleDeleteNote = async (noteIndex: number) => {
    if (!citizen) return;

    try {
      const response = await fetch(`/api/cad/civil/notes/${citizen.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteIndex }),
      });

      if (!response.ok) throw new Error("Failed to delete note");

      toast.success("Note deleted");
      handleSearch();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const openAliasModal = () => {
    onAliasOpen();
  };

  const openPhotoModal = () => {
    if (citizen) {
      setPhotoUrl(citizen.image || "");
      onPhotoOpen();
    }
  };

  const openTattoosModal = () => {
    if (citizen) {
      setTattoosDescription(citizen.tattoos || "");
      onTattoosOpen();
    }
  };

  const openEmergencyModal = () => {
    if (citizen && citizen.emergencyContact) {
      const ec = typeof citizen.emergencyContact === 'string' 
        ? JSON.parse(citizen.emergencyContact) 
        : citizen.emergencyContact;
      setEmergencyName(ec.name || "");
      setEmergencyRelationship(ec.relationship || "");
      setEmergencyPhone(ec.phone || "");
    }
    onEmergencyOpen();
  };

  const openMedicalModal = () => {
    onMedicalOpen();
  };

  const openGangModal = () => {
    if (citizen) {
      setGangAffiliation(citizen.gangAffiliation || "");
      setGangStatus(citizen.gangStatus || "");
      setGangNotes(citizen.gangNotes || "");
      onGangOpen();
    }
  };

  const calculateRiskScore = (citizen: Citizen): { score: number; level: string; color: string } => {
    let score = 0;
    
    if (citizen.isWanted) score += 30;
    if (citizen.warrants.length > 0) score += 20 * citizen.warrants.length;
    
    let flags: string[] = [];
    if (citizen.flags) {
      // Check if already an array (parsed by API) or still a string
      if (Array.isArray(citizen.flags)) {
        flags = citizen.flags;
      } else if (typeof citizen.flags === 'string') {
        try {
          flags = JSON.parse(citizen.flags);
        } catch {
          flags = citizen.flags.split(',').map(f => f.trim()).filter(Boolean);
        }
      }
    }
    if (flags.includes("armed")) score += 25;
    if (flags.includes("violent")) score += 20;
    if (flags.includes("gang")) score += 15;
    if (flags.includes("mental")) score += 10;
    if (flags.includes("suicidal")) score += 15;
    
    if (citizen.arrests?.length > 0) score += 10 * Math.min(citizen.arrests.length, 5);
    
    let level = "LOW";
    let color = "success";
    
    if (score >= 70) {
      level = "CRITICAL";
      color = "danger";
    } else if (score >= 40) {
      level = "HIGH";
      color = "warning";
    } else if (score >= 20) {
      level = "MODERATE";
      color = "warning";
    }
    
    return { score: Math.min(score, 100), level, color };
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const speakCitizenInfo = (citizen: Citizen) => {
    if (!voiceEnabled) return;

    const age = calculateAge(citizen.dateOfBirth);
    let flags: string[] = [];
    if (citizen.flags) {
      // Check if already an array (parsed by API) or still a string
      if (Array.isArray(citizen.flags)) {
        flags = citizen.flags;
      } else if (typeof citizen.flags === 'string') {
        try {
          flags = JSON.parse(citizen.flags);
        } catch {
          flags = citizen.flags.split(',').map(f => f.trim()).filter(Boolean);
        }
      }
    }
    const riskData = calculateRiskScore(citizen);

    // Build alert message
    let message = `Attention. Citizen located. ${citizen.firstName} ${citizen.lastName}. Age ${age}. `;

    // License status
    if (citizen.driversLicense) {
      message += "Valid drivers license. ";
    } else {
      message += "No drivers license. ";
    }

    // Weapons permit
    if (citizen.weaponsPermit) {
      message += "Valid weapons permit. ";
    } else {
      message += "No weapons permit. ";
    }

    // Flags
    if (flags.length > 0) {
      message += `Caution flags: ${flags.join(", ")}. `;
    }

    // Warrants
    if (citizen.warrants.length > 0) {
      message += `Active warrants: ${citizen.warrants.length}. `;
      citizen.warrants.forEach((warrant) => {
        message += `${warrant.offense}. `;
      });
    }

    // Risk level
    if (riskData.level !== "LOW") {
      message += `Threat level: ${riskData.level}. `;
    }

    // Use the voice system's speak function with appropriate priority
    speak(message, {
      priority: riskData.level === "CRITICAL" ? "critical" : riskData.level === "HIGH" ? "high" : "normal",
      type: "admin",
      soundEffect: riskData.level !== "LOW",
      department: "POLICE",
      metadata: {
        citizenId: citizen.id,
        riskScore: riskData.score,
        riskLevel: riskData.level,
      },
    });

    // Send notifications based on risk score thresholds
    if (riskData.score > 80) {
      // Critical risk - Code 3 supervisor response required
      toast.error(
        `CRITICAL ALERT: ${citizen.firstName} ${citizen.lastName} - Risk Score ${riskData.score}. CODE 3 SUPERVISOR RESPONSE REQUIRED.`,
        { duration: 10000 }
      );
      speak("Code 3. Supervisor response required. High risk individual detected.", {
        priority: "critical",
        type: "panic",
        soundEffect: true,
        supervisorOverride: true,
        department: "POLICE",
      });
    } else if (riskData.score > 50) {
      // High risk - Dispatcher notification
      toast.warning(
        `High Risk Alert: ${citizen.firstName} ${citizen.lastName} - Risk Score ${riskData.score}. Dispatcher notified.`,
        { duration: 7000 }
      );
      speak("Dispatcher alert. High risk individual detected. Proceed with caution.", {
        priority: "high",
        type: "admin",
        soundEffect: true,
        department: "POLICE",
      });
    }
  };

  // Auto-play voice alert when citizen is found
  useEffect(() => {
    if (citizen && voiceEnabled) {
      speakCitizenInfo(citizen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citizen?.id, voiceEnabled]);

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/50 border border-gray-800">
        <CardBody className="p-4">
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                color={searchType === "citizen" ? "primary" : "default"}
                variant={searchType === "citizen" ? "solid" : "flat"}
                startContent={<User className="w-4 h-4" />}
                onPress={() => {
                  setSearchType("citizen");
                  setSearchQuery("");
                  setCitizen(null);
                  setVehicle(null);
                  setError(null);
                }}
              >
                Citizen
              </Button>
              <Button
                size="sm"
                color={searchType === "vehicle" ? "primary" : "default"}
                variant={searchType === "vehicle" ? "solid" : "flat"}
                startContent={<Car className="w-4 h-4" />}
                onPress={() => {
                  setSearchType("vehicle");
                  setSearchQuery("");
                  setCitizen(null);
                  setVehicle(null);
                  setError(null);
                }}
              >
                Vehicle
              </Button>
            </div>

            <Input
              placeholder={
                searchType === "citizen"
                  ? "Search by name or State ID..."
                  : "Search by license plate..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-1"
            />

            <Button
              color="primary"
              onPress={handleSearch}
              isLoading={loading}
            >
              Search
            </Button>
          </div>
        </CardBody>
      </Card>

      {loading && (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6 flex items-center justify-center">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      )}

      {error && (
        <Card className="bg-red-900/20 border border-red-800">
          <CardBody className="p-6">
            <p className="text-red-400 text-center">{error}</p>
          </CardBody>
        </Card>
      )}

      {citizen && (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6 space-y-6">
            {/* Header with Photo and Basic Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {citizen.image && (
                  <Avatar
                    src={citizen.image}
                    className="w-24 h-24"
                    isBordered
                    color="primary"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {citizen.firstName} {citizen.lastName}
                  </h3>
                  {citizen.stateId && (
                    <p className="text-sm text-gray-400">State ID: {citizen.stateId}</p>
                  )}
                  {citizen.gender && (
                    <p className="text-sm text-gray-400">{citizen.gender}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 items-start">
                {citizen.isWanted && (
                  <Chip color="danger" variant="flat" size="sm">WANTED</Chip>
                )}
                {citizen.isMissing && (
                  <Chip color="warning" variant="flat" size="sm">MISSING</Chip>
                )}
                {(() => {
                  let flags: string[] = [];
                  if (citizen.flags) {
                    // Check if already an array (parsed by API) or still a string
                    if (Array.isArray(citizen.flags)) {
                      flags = citizen.flags;
                    } else if (typeof citizen.flags === 'string') {
                      try {
                        flags = JSON.parse(citizen.flags);
                      } catch {
                        flags = citizen.flags.split(',').map(f => f.trim()).filter(Boolean);
                      }
                    }
                  }
                  return flags.map((flag: string) => (
                    <Chip 
                      key={flag}
                      color={["armed", "violent", "suicidal"].includes(flag) ? "danger" : ["gang", "caution"].includes(flag) ? "warning" : "primary"}
                      variant="flat"
                      size="sm"
                      onClose={() => handleRemoveFlag(flag)}
                    >
                      {flag.toUpperCase().replace("_", " ")}
                    </Chip>
                  ));
                })()}
                {(() => {
                  const risk = calculateRiskScore(citizen);
                  return (
                    <Chip color={risk.color as any} variant="solid" size="sm">
                      RISK: {risk.level} ({risk.score})
                    </Chip>
                  );
                })()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" color="primary" startContent={<Edit className="w-4 h-4" />} onPress={openEditModal}>
                Edit Info
              </Button>
              <Button size="sm" color="secondary" startContent={<FileText className="w-4 h-4" />} onPress={onNoteOpen}>
                Add Note
              </Button>
              <Button size="sm" color="success" startContent={<Car className="w-4 h-4" />} onPress={onVehicleOpen}>
                Add Vehicle
              </Button>
              <Button size="sm" color="warning" variant="flat" startContent={<Flag className="w-4 h-4" />} onPress={onFlagOpen}>
                Add Flag
              </Button>
              <Button size="sm" color="danger" variant="flat" startContent={<FileWarning className="w-4 h-4" />} onPress={onWarrantOpen}>
                Add Warrant
              </Button>
              <Button size="sm" color="secondary" variant="flat" startContent={<Volume2 className="w-4 h-4" />} onPress={() => citizen && speakCitizenInfo(citizen)}>
                Voice Alert
              </Button>
              <Button size="sm" variant="flat" startContent={<Printer className="w-4 h-4" />} onPress={handlePrint}>
                Print
              </Button>
              <Button size="sm" variant="flat" onPress={openPhotoModal}>
                📷 Photo
              </Button>
              <Button size="sm" variant="flat" onPress={openAliasModal}>
                🏷️ Alias
              </Button>
              <Button size="sm" variant="flat" onPress={openTattoosModal}>
                ✏️ Tattoos
              </Button>
              <Button size="sm" variant="flat" onPress={openEmergencyModal}>
                🚨 Emergency
              </Button>
              <Button size="sm" variant="flat" onPress={openMedicalModal}>
                ⚕️ Medical
              </Button>
              <Button size="sm" variant="flat" onPress={openGangModal}>
                👥 Gang Info
              </Button>
            </div>

            {/* Known Aliases */}
            {citizen.aliases && citizen.aliases.length > 0 && (
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardBody className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    🏷️ Known Aliases
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {citizen.aliases.map((alias: string, idx: number) => (
                      <Chip
                        key={idx}
                        color="secondary"
                        variant="flat"
                        size="sm"
                        onClose={() => handleRemoveAlias(alias)}
                      >
                        {alias}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Tattoos/Identifying Marks */}
            {citizen.tattoos && (
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardBody className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    ✏️ Identifying Marks / Tattoos
                  </h4>
                  <p className="text-sm text-gray-300">{citizen.tattoos}</p>
                </CardBody>
              </Card>
            )}

            {/* Emergency Contact */}
            {citizen.emergencyContact && (() => {
              const ec = typeof citizen.emergencyContact === 'string' 
                ? JSON.parse(citizen.emergencyContact) 
                : citizen.emergencyContact;
              return (
                <Card className="bg-gray-800/50 border border-gray-700">
                  <CardBody className="p-4">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      🚨 Emergency Contact
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400">Name</p>
                        <p className="text-white font-medium">{ec.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Relationship</p>
                        <p className="text-white font-medium">{ec.relationship}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white font-medium">{ec.phone}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })()}

            {/* Medical Alerts */}
            {citizen.medicalInfo && citizen.medicalInfo.length > 0 && (
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardBody className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    ⚕️ Medical Alerts
                  </h4>
                  <div className="space-y-2">
                    {citizen.medicalInfo.map((alert: any, idx: number) => (
                      <div key={idx} className="p-3 bg-red-900/20 border border-red-800 rounded">
                        <p className="text-sm font-medium text-red-400">{alert.type}</p>
                        <p className="text-xs text-gray-300">{alert.detail}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Gang Intelligence */}
            {(citizen.gangAffiliation || citizen.gangStatus || citizen.gangNotes) && (
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardBody className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    👥 Gang Intelligence
                  </h4>
                  <div className="space-y-3 text-sm">
                    {citizen.gangAffiliation && (
                      <div>
                        <p className="text-gray-400">Affiliation</p>
                        <p className="text-white font-medium">{citizen.gangAffiliation}</p>
                      </div>
                    )}
                    {citizen.gangStatus && (
                      <div>
                        <p className="text-gray-400">Status</p>
                        <Chip 
                          size="sm" 
                          color={citizen.gangStatus === "verified" ? "danger" : citizen.gangStatus === "suspected" ? "warning" : "default"}
                          variant="flat"
                        >
                          {citizen.gangStatus.toUpperCase()}
                        </Chip>
                      </div>
                    )}
                    {citizen.gangNotes && (
                      <div>
                        <p className="text-gray-400">Notes</p>
                        <p className="text-gray-300">{citizen.gangNotes}</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Physical Description */}
            {(citizen.height || citizen.weight || citizen.eyeColor || citizen.hairColor || citizen.build) && (
              <Card className="bg-gray-800/50 border border-gray-700">
                <CardBody className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    Physical Description
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    {citizen.height && (
                      <div>
                        <p className="text-gray-400">Height</p>
                        <p className="text-white font-medium">{citizen.height}</p>
                      </div>
                    )}
                    {citizen.weight && (
                      <div>
                        <p className="text-gray-400">Weight</p>
                        <p className="text-white font-medium">{citizen.weight}</p>
                      </div>
                    )}
                    {citizen.eyeColor && (
                      <div>
                        <p className="text-gray-400">Eyes</p>
                        <p className="text-white font-medium">{citizen.eyeColor}</p>
                      </div>
                    )}
                    {citizen.hairColor && (
                      <div>
                        <p className="text-gray-400">Hair</p>
                        <p className="text-white font-medium">{citizen.hairColor}</p>
                      </div>
                    )}
                    {citizen.build && (
                      <div>
                        <p className="text-gray-400">Build</p>
                        <p className="text-white font-medium">{citizen.build}</p>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p className="text-white" suppressHydrationWarning>
                  {new Date(citizen.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              {citizen.gender && (
                <div>
                  <p className="text-gray-400">Gender</p>
                  <p className="text-white">{citizen.gender}</p>
                </div>
              )}
              {citizen.phoneNumber && (
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white">{citizen.phoneNumber}</p>
                </div>
              )}
              {citizen.address && (
                <div className="col-span-2">
                  <p className="text-gray-400">Address</p>
                  <p className="text-white">{citizen.address}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Driver's License:</span>
                <span className={citizen.driversLicense ? "text-green-400" : "text-red-400"}>
                  {citizen.driversLicense ? "Valid" : "Invalid"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Weapons Permit:</span>
                <span className={citizen.weaponsPermit ? "text-green-400" : "text-red-400"}>
                  {citizen.weaponsPermit ? "Valid" : "None"}
                </span>
              </div>
            </div>

            {citizen.warrants.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Active Warrants</h4>
                <div className="space-y-2">
                  {citizen.warrants.filter(w => w.isActive).map((warrant) => (
                    <div key={warrant.id} className="p-3 bg-red-900/20 border border-red-800 rounded">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-400">{warrant.offense}</p>
                          {warrant.bail && (
                            <p className="text-xs text-gray-400">Bail: ${warrant.bail.toLocaleString()}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <button
                            onClick={() => handleRemoveWarrant(warrant.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Remove warrant"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citations */}
            {citizen.citations && citizen.citations.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-yellow-400" />
                  Recent Citations ({citizen.citations.length})
                </h4>
                <div className="space-y-2">
                  {citizen.citations.slice(0, 3).map((citation) => (
                    <div key={citation.id} className="p-3 bg-yellow-900/20 border border-yellow-800 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-yellow-400">{citation.offense}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(citation.issueDate).toLocaleDateString()} • Fine: ${citation.fineAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Arrest Records */}
            {citizen.arrests && citizen.arrests.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Arrest History ({citizen.arrests.length})
                </h4>
                <div className="space-y-2">
                  {citizen.arrests.slice(0, 3).map((arrest) => (
                    <div key={arrest.id} className="p-3 bg-red-900/20 border border-red-800 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-red-400">{arrest.charges}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(arrest.arrestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Officer Notes */}
            {citizen.notes && citizen.notes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Officer Notes ({citizen.notes.length})
                </h4>
                <div className="space-y-2">
                  {citizen.notes.slice(-5).reverse().map((note, idx) => {
                    // Calculate actual index in the original array
                    const actualIndex = citizen.notes.length - idx - 1;
                    return (
                      <div key={idx} className="p-3 bg-blue-900/20 border border-blue-800 rounded">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-300 mb-2 flex-1">{note.text}</p>
                          <button
                            onClick={() => handleDeleteNote(actualIndex)}
                            className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
                            title="Delete note"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {note.officerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {citizen.vehicles.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Registered Vehicles</h4>
                <div className="space-y-2">
                  {citizen.vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="p-3 bg-gray-800/50 border border-gray-700 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {vehicle.color} {vehicle.model}
                          </p>
                          <p className="text-xs text-gray-400">Plate: {vehicle.plate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          <button
                            onClick={() => handleRemoveVehicle(vehicle.id)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            title="Remove vehicle"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {vehicle && (
        <Card className="bg-gray-900/50 border border-gray-800">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {vehicle.color} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-400">Plate: {vehicle.plate}</p>
                {vehicle.year && (
                  <p className="text-sm text-gray-400">Year: {vehicle.year}</p>
                )}
              </div>
              <div className="flex gap-2">
                {vehicle.isStolen && (
                  <div className="px-3 py-1 bg-red-900/50 border border-red-700 rounded-full">
                    <span className="text-xs font-semibold text-red-400">STOLEN</span>
                  </div>
                )}
                {vehicle.isWanted && (
                  <div className="px-3 py-1 bg-yellow-900/50 border border-yellow-700 rounded-full">
                    <span className="text-xs font-semibold text-yellow-400">WANTED</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Registered Owner</h4>
              <div className="p-3 bg-gray-800/50 border border-gray-700 rounded">
                <p className="text-white font-medium">
                  {vehicle.owner.firstName} {vehicle.owner.lastName}
                </p>
                {vehicle.owner.phoneNumber && (
                  <p className="text-sm text-gray-400">{vehicle.owner.phoneNumber}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Add Flag Modal */}
      <Modal isOpen={isWarrantOpen} onClose={onWarrantClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-red-400" />
              <span>Add Warrant</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Offense"
                placeholder="e.g., Armed Robbery, Drug Possession"
                value={warrantOffense}
                onChange={(e) => setWarrantOffense(e.target.value)}
                isRequired
              />
              <Input
                label="Bail Amount"
                placeholder="Optional"
                type="number"
                value={warrantBail}
                onChange={(e) => setWarrantBail(e.target.value)}
                startContent={<span className="text-gray-400">$</span>}
              />
              <Textarea
                label="Notes"
                placeholder="Additional details..."
                value={warrantNotes}
                onChange={(e) => setWarrantNotes(e.target.value)}
                minRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onWarrantClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleAddWarrant}
              isLoading={addingWarrant}
            >
              Add Warrant
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Note Modal */}
      <Modal isOpen={isNoteOpen} onClose={onNoteClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Add Officer Note</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Textarea
              label="Note"
              placeholder="Enter details about this encounter or observation..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              minRows={5}
              isRequired
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onNoteClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAddNote}
              isLoading={addingNote}
            >
              Add Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal isOpen={isVehicleOpen} onClose={onVehicleClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-green-400" />
              <span>Register Vehicle</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="License Plate"
                placeholder="ABC123"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                isRequired
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Model"
                  placeholder="e.g., Honda Civic"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  isRequired
                />
                <Input
                  label="Color"
                  placeholder="e.g., Black"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  isRequired
                />
              </div>
              <Input
                label="Year (Optional)"
                placeholder="2020"
                type="number"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onVehicleClose}>
              Cancel
            </Button>
            <Button
              color="success"
              onPress={handleAddVehicle}
              isLoading={addingVehicle}
            >
              Register Vehicle
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Citizen Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-indigo-400" />
              <span>Edit Citizen Information</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Address"
                placeholder="123 Main St, City, State"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                startContent={<MapPin className="w-4 h-4 text-gray-400" />}
              />
              <Input
                label="Phone Number"
                placeholder="555-1234"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onEditClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleEditCitizen}
              isLoading={savingEdit}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Warrant Modal */}
      <Modal isOpen={isFlagOpen} onClose={onFlagClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-yellow-400" />
              <span>Add Flag</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Flag Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    color={flagType === "wanted" ? "danger" : "default"}
                    variant={flagType === "wanted" ? "solid" : "flat"}
                    onPress={() => setFlagType("wanted")}
                    size="sm"
                  >
                    WANTED
                  </Button>
                  <Button
                    color={flagType === "missing" ? "warning" : "default"}
                    variant={flagType === "missing" ? "solid" : "flat"}
                    onPress={() => setFlagType("missing")}
                    size="sm"
                  >
                    MISSING
                  </Button>
                  <Button
                    color={flagType === "armed" ? "danger" : "default"}
                    variant={flagType === "armed" ? "solid" : "flat"}
                    onPress={() => setFlagType("armed")}
                    size="sm"
                  >
                    ARMED & DANGEROUS
                  </Button>
                  <Button
                    color={flagType === "violent" ? "danger" : "default"}
                    variant={flagType === "violent" ? "solid" : "flat"}
                    onPress={() => setFlagType("violent")}
                    size="sm"
                  >
                    VIOLENT
                  </Button>
                  <Button
                    color={flagType === "gang" ? "warning" : "default"}
                    variant={flagType === "gang" ? "solid" : "flat"}
                    onPress={() => setFlagType("gang")}
                    size="sm"
                  >
                    GANG MEMBER
                  </Button>
                  <Button
                    color={flagType === "caution" ? "warning" : "default"}
                    variant={flagType === "caution" ? "solid" : "flat"}
                    onPress={() => setFlagType("caution")}
                    size="sm"
                  >
                    CAUTION
                  </Button>
                  <Button
                    color={flagType === "mental" ? "primary" : "default"}
                    variant={flagType === "mental" ? "solid" : "flat"}
                    onPress={() => setFlagType("mental")}
                    size="sm"
                  >
                    MENTAL HEALTH
                  </Button>
                  <Button
                    color={flagType === "suicidal" ? "danger" : "default"}
                    variant={flagType === "suicidal" ? "solid" : "flat"}
                    onPress={() => setFlagType("suicidal")}
                    size="sm"
                  >
                    SUICIDAL
                  </Button>
                </div>
              </div>
              <Textarea
                label="Reason"
                placeholder="Why is this flag being added?"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                minRows={3}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onFlagClose}>
              Cancel
            </Button>
            <Button
              color="warning"
              onPress={handleAddFlag}
              isLoading={addingFlag}
            >
              Add Flag
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Alias Modal */}
      <Modal isOpen={isAliasOpen} onClose={onAliasClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              🏷️
              <span>Add Known Alias</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Alias Name"
              placeholder="e.g., Johnny, Big Mike"
              value={aliasName}
              onChange={(e) => setAliasName(e.target.value)}
              isRequired
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onAliasClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAddAlias}
              isLoading={addingAlias}
            >
              Add Alias
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Photo Modal */}
      <Modal isOpen={isPhotoOpen} onClose={onPhotoClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              📷
              <span>Update Photo</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Input
              label="Photo URL"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              isRequired
            />
            <p className="text-xs text-gray-400">
              Enter a direct link to the citizen's photo (URL must end in .jpg, .png, etc.)
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onPhotoClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpdatePhoto}
              isLoading={uploadingPhoto}
            >
              Update Photo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Tattoos Modal */}
      <Modal isOpen={isTattoosOpen} onClose={onTattoosClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              ✏️
              <span>Edit Tattoos / Identifying Marks</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <Textarea
              label="Description"
              placeholder="Describe tattoos, scars, or other identifying marks..."
              value={tattoosDescription}
              onChange={(e) => setTattoosDescription(e.target.value)}
              minRows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onTattoosClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSaveTattoos}
              isLoading={savingTattoos}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Emergency Contact Modal */}
      <Modal isOpen={isEmergencyOpen} onClose={onEmergencyClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              🚨
              <span>Edit Emergency Contact</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Contact Name"
                placeholder="Full name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                isRequired
              />
              <Input
                label="Relationship"
                placeholder="e.g., Spouse, Parent, Friend"
                value={emergencyRelationship}
                onChange={(e) => setEmergencyRelationship(e.target.value)}
                isRequired
              />
              <Input
                label="Phone Number"
                placeholder="555-1234"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onEmergencyClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSaveEmergencyContact}
              isLoading={savingEmergency}
            >
              Save Contact
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Medical Alert Modal */}
      <Modal isOpen={isMedicalOpen} onClose={onMedicalClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              ⚕️
              <span>Add Medical Alert</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Alert Type"
                placeholder="e.g., Allergy, Medication, Condition"
                value={medicalType}
                onChange={(e) => setMedicalType(e.target.value)}
                isRequired
              />
              <Textarea
                label="Details"
                placeholder="Provide specific information about this medical alert..."
                value={medicalDetail}
                onChange={(e) => setMedicalDetail(e.target.value)}
                minRows={3}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onMedicalClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAddMedicalAlert}
              isLoading={addingMedical}
            >
              Add Alert
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Gang Information Modal */}
      <Modal isOpen={isGangOpen} onClose={onGangClose} size="lg">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              👥
              <span>Edit Gang Information</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Gang Affiliation"
                placeholder="Gang name or organization"
                value={gangAffiliation}
                onChange={(e) => setGangAffiliation(e.target.value)}
              />
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <div className="flex gap-2">
                  <Button
                    color={gangStatus === "verified" ? "danger" : "default"}
                    variant={gangStatus === "verified" ? "solid" : "flat"}
                    onPress={() => setGangStatus("verified")}
                    size="sm"
                  >
                    Verified
                  </Button>
                  <Button
                    color={gangStatus === "suspected" ? "warning" : "default"}
                    variant={gangStatus === "suspected" ? "solid" : "flat"}
                    onPress={() => setGangStatus("suspected")}
                    size="sm"
                  >
                    Suspected
                  </Button>
                  <Button
                    color={gangStatus === "former" ? "default" : "default"}
                    variant={gangStatus === "former" ? "solid" : "flat"}
                    onPress={() => setGangStatus("former")}
                    size="sm"
                  >
                    Former Member
                  </Button>
                </div>
              </div>
              <Textarea
                label="Intelligence Notes"
                placeholder="Additional intelligence about gang involvement..."
                value={gangNotes}
                onChange={(e) => setGangNotes(e.target.value)}
                minRows={4}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onGangClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSaveGangInfo}
              isLoading={savingGang}
            >
              Save Gang Info
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
