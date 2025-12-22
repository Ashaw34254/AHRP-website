import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { citizenId, alias } = await req.json();

    if (!citizenId || !alias) {
      return NextResponse.json(
        { error: "Citizen ID and alias are required" },
        { status: 400 }
      );
    }

    // Get the citizen
    let citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
    });

    if (!citizen) {
      // Check if it's a Character and create Citizen record
      const character = await prisma.character.findUnique({
        where: { id: citizenId },
      });

      if (character) {
        // Create Citizen from Character with the alias
        await prisma.citizen.create({
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
            aliases: JSON.stringify([alias]),
          },
        });
        return NextResponse.json({ success: true });
      }
      
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }

    // Parse existing aliases
    let aliases = [];
    if (citizen.aliases) {
      try {
        aliases = JSON.parse(citizen.aliases);
      } catch (e) {
        aliases = [];
      }
    }

    // Add new alias if not already present
    if (!aliases.includes(alias)) {
      aliases.push(alias);
    }

    // Update citizen
    await prisma.citizen.update({
      where: { id: citizenId },
      data: { aliases: JSON.stringify(aliases) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding alias:", error);
    return NextResponse.json({ error: "Failed to add alias" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const citizenId = searchParams.get("citizenId");
    const alias = searchParams.get("alias");

    if (!citizenId || !alias) {
      return NextResponse.json(
        { error: "Citizen ID and alias are required" },
        { status: 400 }
      );
    }

    // Get the citizen
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
    });

    if (!citizen) {
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }

    // Parse existing aliases
    let aliases = [];
    if (citizen.aliases) {
      try {
        aliases = JSON.parse(citizen.aliases);
      } catch (e) {
        aliases = [];
      }
    }

    // Remove the alias
    aliases = aliases.filter((a: string) => a !== alias);

    // Update citizen
    await prisma.citizen.update({
      where: { id: citizenId },
      data: { aliases: JSON.stringify(aliases) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing alias:", error);
    return NextResponse.json({ error: "Failed to remove alias" }, { status: 500 });
  }
}
