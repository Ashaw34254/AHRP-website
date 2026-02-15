import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, isWanted, isMissing, flagType, flagReason } = body;

    // First try to update as Citizen
    let updated = false;
    try {
      const citizen = await prisma.citizen.findUnique({ where: { id } });
      
      if (citizen) {
        // Parse existing flags safely
        let existingFlags: string[] = [];
        if (citizen.flags) {
          try {
            existingFlags = JSON.parse(citizen.flags);
          } catch {
            // If not JSON, treat as comma-separated string
            if (typeof citizen.flags === 'string') {
              existingFlags = citizen.flags.split(',').map((f: string) => f.trim()).filter(Boolean);
            }
          }
        }
        
        // Add new flag if provided
        if (flagType && !existingFlags.includes(flagType)) {
          existingFlags.push(flagType);
        }

        await prisma.citizen.update({
          where: { id },
          data: {
            isWanted: isWanted !== undefined ? isWanted : undefined,
            isMissing: isMissing !== undefined ? isMissing : undefined,
            flags: JSON.stringify(existingFlags),
          },
        });
        updated = true;
      }
    } catch (error) {
      // Not a citizen, might be a character
    }

    // If not found as Citizen, check if it's a Character
    if (!updated) {
      const character = await prisma.character.findUnique({
        where: { id },
      });

      if (character) {
        // Create a Citizen record for this Character if it doesn't exist
        const existingCitizen = await prisma.citizen.findFirst({
          where: {
            AND: [
              { firstName: character.firstName },
              { lastName: character.lastName },
              { dateOfBirth: new Date(character.dateOfBirth) },
            ],
          },
        });

        if (existingCitizen) {
          // Update existing citizen - Parse flags safely
          let existingFlags: string[] = [];
          if (existingCitizen.flags) {
            try {
              existingFlags = JSON.parse(existingCitizen.flags);
            } catch {
              // If not JSON, treat as comma-separated string
              if (typeof existingCitizen.flags === 'string') {
                existingFlags = existingCitizen.flags.split(',').map((f: string) => f.trim()).filter(Boolean);
              }
            }
          }
          
          // Add new flag if provided
          if (flagType && !existingFlags.includes(flagType)) {
            existingFlags.push(flagType);
          }

          await prisma.citizen.update({
            where: { id: existingCitizen.id },
            data: {
              isWanted: isWanted !== undefined ? isWanted : undefined,
              isMissing: isMissing !== undefined ? isMissing : undefined,
              flags: JSON.stringify(existingFlags),
            },
          });
        } else {
          // Create new citizen from character
          const flags = flagType ? [flagType] : [];
          
          await prisma.citizen.create({
            data: {
              firstName: character.firstName,
              lastName: character.lastName,
              dateOfBirth: new Date(character.dateOfBirth),
              gender: character.gender,
              stateId: character.stateId,
              phoneNumber: character.phoneNumber,
              address: null,
              isWanted: isWanted || false,
              isMissing: isMissing || false,
              driversLicense: character.licenseStatus === "VALID",
              weaponsPermit: character.firearmPermit,
              flags: JSON.stringify(flags),
            },
          });
        }
        updated = true;
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating flags:", error);
    return NextResponse.json(
      { error: "Failed to update flags" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, flagType } = body;

    if (!id || !flagType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Try to find and update as Citizen
    let updated = false;
    const citizen = await prisma.citizen.findUnique({ where: { id } });
    
    if (citizen) {
      // Parse existing flags safely
      let existingFlags: string[] = [];
      if (citizen.flags) {
        try {
          existingFlags = JSON.parse(citizen.flags);
        } catch {
          if (typeof citizen.flags === 'string') {
            existingFlags = citizen.flags.split(',').map((f: string) => f.trim()).filter(Boolean);
          }
        }
      }

      // Remove the flag
      existingFlags = existingFlags.filter((f: string) => f !== flagType);

      await prisma.citizen.update({
        where: { id },
        data: {
          flags: JSON.stringify(existingFlags),
        },
      });
      updated = true;
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Citizen not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing flag:", error);
    return NextResponse.json(
      { error: "Failed to remove flag" },
      { status: 500 }
    );
  }
}
