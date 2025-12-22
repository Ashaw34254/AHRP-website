"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Input, Textarea, Select, SelectItem, Button, Chip, Avatar, Progress } from "@nextui-org/react";
import { User, Briefcase, Shield, ArrowLeft, Eye, Ruler, Heart, IdCard, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const departments = [
  { value: "CIVILIAN", label: "Civilian" },
  { value: "POLICE", label: "Police Department" },
  { value: "FIRE", label: "Fire Department" },
  { value: "EMS", label: "EMS/Medical" },
];

const genders = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const eyeColors = [
  { value: "BROWN", label: "Brown" },
  { value: "BLUE", label: "Blue" },
  { value: "GREEN", label: "Green" },
  { value: "HAZEL", label: "Hazel" },
  { value: "GRAY", label: "Gray" },
  { value: "AMBER", label: "Amber" },
];

const hairColors = [
  { value: "BLACK", label: "Black" },
  { value: "BROWN", label: "Brown" },
  { value: "BLONDE", label: "Blonde" },
  { value: "RED", label: "Red" },
  { value: "GRAY", label: "Gray" },
  { value: "WHITE", label: "White" },
];

const builds = [
  { value: "SLIM", label: "Slim" },
  { value: "ATHLETIC", label: "Athletic" },
  { value: "MUSCULAR", label: "Muscular" },
  { value: "HEAVY", label: "Heavy" },
  { value: "AVERAGE", label: "Average" },
];

const bloodTypes = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const licenseStatuses = [
  { value: "NONE", label: "No License" },
  { value: "VALID", label: "Valid License" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REVOKED", label: "Revoked" },
];

const characterTemplates = [
  {
    name: "Street Racer",
    data: {
      occupation: "Mechanic",
      department: "CIVILIAN",
      backstory: "A skilled mechanic who loves the thrill of street racing. Known for building custom cars and pushing limits.",
      skills: { driving: 90, mechanics: 85, charisma: 60 },
    },
  },
  {
    name: "Police Detective",
    data: {
      department: "POLICE",
      rank: "Detective",
      backstory: "A seasoned detective with years of experience solving complex cases. Dedicated to justice and protecting the community.",
      skills: { investigation: 85, firearms: 75, observation: 90 },
    },
  },
  {
    name: "Paramedic",
    data: {
      department: "EMS",
      rank: "Paramedic",
      backstory: "A compassionate medical professional who rushes into danger to save lives. Always ready for the next emergency call.",
      skills: { medical: 90, driving: 70, communication: 80 },
    },
  },
  {
    name: "Firefighter",
    data: {
      department: "FIRE",
      rank: "Firefighter",
      backstory: "Brave and strong, always first on scene when disaster strikes. Trained in rescue operations and fire suppression.",
      skills: { strength: 85, endurance: 90, teamwork: 85 },
    },
  },
  {
    name: "Business Owner",
    data: {
      occupation: "Business Owner",
      department: "CIVILIAN",
      backstory: "An ambitious entrepreneur running their own business. Focused on profits, networking, and growing their empire.",
      skills: { business: 85, negotiation: 80, charisma: 75 },
    },
  },
];

export default function NewCharacterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    height: "",
    weight: "",
    eyeColor: "",
    hairColor: "",
    build: "",
    distinguishingFeatures: "",
    image: "",
    bloodType: "",
    licenseStatus: "NONE",
    stateId: "",
    firearmPermit: false,
    organDonor: false,
    veteranStatus: false,
    allergies: "",
    medicalConditions: "",
    placeOfBirth: "",
    nationality: "United States",
    education: "",
    department: "CIVILIAN",
    occupation: "",
    rank: "",
    backstory: "",
    personalityTraits: [] as string[],
  });

  const applyTemplate = (template: typeof characterTemplates[0]) => {
    setFormData({
      ...formData,
      ...template.data,
    });
    toast.success(`Applied "${template.name}" template!`);
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        personalityTraits: JSON.stringify(formData.personalityTraits),
      };

      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Character created successfully!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create character");
      }
    } catch (error) {
      toast.error("Error creating character");
    } finally {
      setSubmitting(false);
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "POLICE": return "blue";
      case "FIRE": return "red";
      case "EMS": return "green";
      default: return "gray";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Button as={Link} href="/dashboard" variant="flat" isIconOnly>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Create New Character
            </h1>
            <p className="text-gray-400 mt-1">
              Step {step} of {totalSteps}: {step === 1 ? "Basic Information" : step === 2 ? "Appearance & Identity" : "Employment & Story"}
            </p>
          </div>
        </div>

        <Progress value={progress} color="primary" className="max-w-full" size="sm" />

        {step === 1 && (
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Quick Start Templates</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {characterTemplates.map((template) => (
                  <Button key={template.name} variant="flat" size="sm" onPress={() => applyTemplate(template)}>
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <Card className="bg-gray-900/50 border border-gray-800">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-400" />
                      <h2 className="text-xl font-bold text-white">Basic Information</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} isRequired />
                      <Input label="Last Name" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} isRequired />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} isRequired />
                      <Select label="Gender" placeholder="Select gender" selectedKeys={formData.gender ? [formData.gender] : []} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} isRequired>
                        {genders.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Phone Number" placeholder="555-0123" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                      <Input label="Place of Birth" placeholder="Los Santos, SA" value={formData.placeOfBirth} onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Nationality" placeholder="United States" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                      <Input label="Education Level" placeholder="High School, College, etc." value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                    </div>
                  </CardBody>
                </Card>
              )}

              {step === 2 && (
                <>
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white">Physical Appearance</h2>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Height" placeholder="6'2&quot; or 188cm" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} startContent={<Ruler className="w-4 h-4 text-gray-400" />} />
                        <Input label="Weight" placeholder="180lbs or 82kg" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                        <Select label="Build" placeholder="Select build" selectedKeys={formData.build ? [formData.build] : []} onChange={(e) => setFormData({ ...formData, build: e.target.value })}>
                          {builds.map((build) => (
                            <SelectItem key={build.value} value={build.value}>{build.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select label="Eye Color" placeholder="Select eye color" selectedKeys={formData.eyeColor ? [formData.eyeColor] : []} onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value })}>
                          {eyeColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                          ))}
                        </Select>
                        <Select label="Hair Color" placeholder="Select hair color" selectedKeys={formData.hairColor ? [formData.hairColor] : []} onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}>
                          {hairColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <Textarea label="Distinguishing Features" placeholder="Tattoos, scars, piercings, etc." value={formData.distinguishingFeatures} onChange={(e) => setFormData({ ...formData, distinguishingFeatures: e.target.value })} minRows={2} />
                      <Input label="Character Image URL" placeholder="https://example.com/avatar.jpg" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} description="Direct link to a character photo or avatar" />
                    </CardBody>
                  </Card>
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <IdCard className="w-5 h-5 text-green-400" />
                        <h2 className="text-xl font-bold text-white">Identification</h2>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="State ID Number" placeholder="Auto-generated or enter custom" value={formData.stateId} onChange={(e) => setFormData({ ...formData, stateId: e.target.value })} description="Leave blank for auto-generation" />
                        <Select label="Driver's License Status" placeholder="Select license status" selectedKeys={formData.licenseStatus ? [formData.licenseStatus] : []} onChange={(e) => setFormData({ ...formData, licenseStatus: e.target.value })}>
                          {licenseStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select label="Blood Type" placeholder="Select blood type" selectedKeys={formData.bloodType ? [formData.bloodType] : []} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })} startContent={<Heart className="w-4 h-4 text-red-400" />}>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </Select>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-gray-300">Status Indicators</label>
                          <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={formData.firearmPermit} onChange={(e) => setFormData({ ...formData, firearmPermit: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600" />
                              <span className="text-sm text-gray-300">Firearm Permit</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={formData.organDonor} onChange={(e) => setFormData({ ...formData, organDonor: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600" />
                              <span className="text-sm text-gray-300">Organ Donor</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={formData.veteranStatus} onChange={(e) => setFormData({ ...formData, veteranStatus: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600" />
                              <span className="text-sm text-gray-300">Veteran</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Textarea label="Allergies" placeholder="e.g., Penicillin, Peanuts, None" value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} minRows={2} description="Important for medical scenarios" />
                        <Textarea label="Medical Conditions" placeholder="e.g., Asthma, Diabetes, None" value={formData.medicalConditions} onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })} minRows={2} description="Chronic conditions or disabilities" />
                      </div>
                    </CardBody>
                  </Card>
                </>
              )}

              {step === 3 && (
                <>
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-bold text-white">Employment & Department</h2>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <Select label="Department" placeholder="Select department" selectedKeys={formData.department ? [formData.department] : []} onChange={(e) => setFormData({ ...formData, department: e.target.value })} description="Choose Civilian if not employed by a department">
                        {departments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                        ))}
                      </Select>
                      {formData.department !== "CIVILIAN" ? (
                        <Input label="Rank/Position" placeholder="e.g., Officer, Sergeant, Firefighter" value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: e.target.value })} />
                      ) : (
                        <Input label="Occupation" placeholder="e.g., Mechanic, Doctor, Business Owner" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                      )}
                    </CardBody>
                  </Card>
                  <Card className="bg-gray-900/50 border border-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white">Character Backstory</h2>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Textarea label="Backstory" placeholder="Tell us about your character's history, personality, and motivations..." value={formData.backstory} onChange={(e) => setFormData({ ...formData, backstory: e.target.value })} minRows={6} maxRows={12} description="This will be visible to admins during approval" />
                    </CardBody>
                  </Card>
                </>
              )}

              <div className="flex gap-3">
                {step > 1 && (
                  <Button variant="flat" size="lg" onPress={() => setStep(step - 1)}>Previous</Button>
                )}
                {step < totalSteps ? (
                  <Button color="primary" size="lg" className="flex-1" onPress={() => setStep(step + 1)}>Next Step</Button>
                ) : (
                  <Button type="submit" color="success" size="lg" isLoading={submitting} className="flex-1" startContent={!submitting && <Check className="w-4 h-4" />}>Create Character</Button>
                )}
                <Button as={Link} href="/dashboard" variant="flat" size="lg">Cancel</Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <h3 className="text-lg font-bold text-white">Live Preview</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar src={formData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`} className="w-24 h-24 mb-3" />
                    <h3 className="text-xl font-bold text-white">
                      {formData.firstName || "First"} {formData.lastName || "Last"}
                    </h3>
                    {formData.department && (
                      <Chip color={getDepartmentColor(formData.department) as any} size="sm" variant="flat" className="mt-2">
                        {formData.department === "CIVILIAN" ? (formData.occupation || "Civilian") : `${formData.department} - ${formData.rank || "Officer"}`}
                      </Chip>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    {formData.dateOfBirth && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">DOB:</span>
                        <span className="text-white">{formData.dateOfBirth}</span>
                      </div>
                    )}
                    {formData.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gender:</span>
                        <span className="text-white">{formData.gender}</span>
                      </div>
                    )}
                    {formData.height && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Height:</span>
                        <span className="text-white">{formData.height}</span>
                      </div>
                    )}
                    {formData.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-white">{formData.weight}</span>
                      </div>
                    )}
                    {formData.eyeColor && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eyes:</span>
                        <span className="text-white">{formData.eyeColor}</span>
                      </div>
                    )}
                    {formData.hairColor && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hair:</span>
                        <span className="text-white">{formData.hairColor}</span>
                      </div>
                    )}
                    {formData.bloodType && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Blood Type:</span>
                        <span className="text-white">{formData.bloodType}</span>
                      </div>
                    )}
                    {formData.phoneNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{formData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  {formData.backstory && (
                    <div className="pt-2 border-t border-gray-800">
                      <p className="text-xs text-gray-400 line-clamp-4">{formData.backstory}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
