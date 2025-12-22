import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { citizenId, ...fields } = await req.json();

    if (!citizenId) {
      return NextResponse.json({ error: "Citizen ID is required" }, { status: 400 });
    }

    // Build update data object
    const updateData: any = {};

    if (fields.tattoos !== undefined) {
      updateData.tattoos = fields.tattoos;
    }

    if (fields.emergencyContact !== undefined) {
      updateData.emergencyContact = fields.emergencyContact
        ? JSON.stringify(fields.emergencyContact)
        : null;
    }

    if (fields.medicalInfo !== undefined) {
      updateData.medicalInfo = fields.medicalInfo
        ? JSON.stringify(fields.medicalInfo)
        : null;
    }

    if (fields.gangAffiliation !== undefined) {
      updateData.gangAffiliation = fields.gangAffiliation;
    }

    if (fields.gangStatus !== undefined) {
      updateData.gangStatus = fields.gangStatus;
    }

    if (fields.gangNotes !== undefined) {
      updateData.gangNotes = fields.gangNotes;
    }

    if (fields.image !== undefined) {
      updateData.image = fields.image;
    }

    // Try to find existing Citizen record
    let citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
    });

    // If not found, check if it's a Character and create Citizen record
    if (!citizen) {
      const character = await prisma.character.findUnique({
        where: { id: citizenId },
      });

      if (character) {
        // Create Citizen from Character
        citizen = await prisma.citizen.create({
          data: {
            id: character.id,
            firstName: character.firstName,
            lastName: character.lastName,
            dateOfBirth: new Date(character.dateOfBirth),
            gender: character.gender,
            stateId: character.stateId,
            phoneNumber: character.phoneNumber,
            driversLicense: character.licenseStatus === "VALID",
            weaponsPermit: character.firearmPermit,
            image: character.image,
            height: character.height,
            weight: character.weight,
            eyeColor: character.eyeColor,
            hairColor: character.hairColor,
            build: character.build,
            ...updateData,
          },
        });
      } else {
        return NextResponse.json({ error: "Citizen or Character not found" }, { status: 404 });
      }
    } else {
      // Update existing Citizen
      citizen = await prisma.citizen.update({
        where: { id: citizenId },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating citizen info:", error);
    return NextResponse.json({ error: "Failed to update citizen info" }, { status: 500 });
  }
}
