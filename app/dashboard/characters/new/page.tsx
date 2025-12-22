"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardBody, CardHeader, Input, Textarea, Select, SelectItem, Button, DateInput } from "@nextui-org/react";
import { User, Calendar, Briefcase, Shield, ArrowLeft } from "lucide-react";
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

export default function NewCharacterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    department: "CIVILIAN",
    occupation: "",
    rank: "",
    phoneNumber: "",
    backstory: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender) {
      toast("Please fill in all required fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast("Character created successfully!", "success");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast(error.error || "Failed to create character", "error");
      }
    } catch (error) {
      toast("Error creating character", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            as={Link}
            href="/dashboard"
            variant="flat"
            isIconOnly
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Create New Character
            </h1>
            <p className="text-gray-400 mt-1">Fill in the details for your new character</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Basic Information</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  isRequired
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  isRequired
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  placeholder="MM/DD/YYYY"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  isRequired
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={formData.gender ? [formData.gender] : []}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  isRequired
                >
                  {genders.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <Input
                label="Phone Number (Optional)"
                placeholder="555-0123"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />

              <Input
                label="Character Image URL (Optional)"
                placeholder="https://example.com/avatar.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                description="Direct link to a character photo or avatar"
              />
            </CardBody>
          </Card>

          {/* Employment */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Employment & Department</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Department"
                placeholder="Select department"
                selectedKeys={formData.department ? [formData.department] : []}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                description="Choose Civilian if not employed by a department"
              >
                {departments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </Select>

              {formData.department !== "CIVILIAN" ? (
                <Input
                  label="Rank/Position"
                  placeholder="e.g., Officer, Sergeant, Firefighter"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                />
              ) : (
                <Input
                  label="Occupation"
                  placeholder="e.g., Mechanic, Doctor, Business Owner"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                />
              )}
            </CardBody>
          </Card>

          {/* Backstory */}
          <Card className="bg-gray-900/50 border border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Character Backstory</h2>
              </div>
            </CardHeader>
            <CardBody>
              <Textarea
                label="Backstory (Optional)"
                placeholder="Tell us about your character's history, personality, and motivations..."
                value={formData.backstory}
                onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                minRows={6}
                maxRows={12}
                description="This will be visible to admins during approval"
              />
            </CardBody>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={submitting}
              className="flex-1"
            >
              Create Character
            </Button>
            <Button
              as={Link}
              href="/dashboard"
              variant="flat"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
