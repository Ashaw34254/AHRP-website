import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Parse query - handle full name searches like "John Doe" or single terms
    const queryParts = query.trim().split(/\s+/);
    const [firstPart, lastPart] = queryParts;

    // Build search conditions (SQLite doesn't support mode: 'insensitive', but LIKE is case-insensitive by default)
    const searchConditions: any[] = [
      // Search by State ID
      {
        stateId: {
          contains: query,
        },
      },
    ];

    // If two parts, assume "FirstName LastName"
    if (queryParts.length >= 2) {
      searchConditions.push({
        AND: [
          {
            firstName: {
              contains: firstPart,
            },
          },
          {
            lastName: {
              contains: lastPart,
            },
          },
        ],
      });
    }

    // Also search each part individually
    searchConditions.push(
      {
        firstName: {
          contains: query,
        },
      },
      {
        lastName: {
          contains: query,
        },
      }
    );

    // Search by name or State ID in both Citizen AND Character tables
    let citizen = await prisma.citizen.findFirst({
      where: {
        OR: searchConditions,
      },
      include: {
        warrants: {
          where: {
            isActive: true,
          },
        },
        vehicles: true,
        citations: true,
        arrests: true,
      },
    });

    // Parse JSON fields if citizen was found
    if (citizen) {
      // Parse notes safely
      let notes: any[] = [];
      if (citizen.notes) {
        try {
          notes = JSON.parse(citizen.notes);
        } catch {
          notes = [];
        }
      }

      // Parse flags safely - handle both JSON array and comma-separated string
      let flags: string[] = [];
      if (citizen.flags) {
        try {
          flags = JSON.parse(citizen.flags);
        } catch {
          // If not JSON, treat as comma-separated string
          if (typeof citizen.flags === 'string') {
            flags = citizen.flags.split(',').map(f => f.trim()).filter(Boolean);
          }
        }
      }

      // Parse aliases safely
      let aliases: string[] = [];
      if (citizen.aliases) {
        try {
          aliases = JSON.parse(citizen.aliases);
        } catch {
          aliases = [];
        }
      }

      // Parse medical info safely
      let medicalInfo: any[] = [];
      if (citizen.medicalInfo) {
        try {
          medicalInfo = JSON.parse(citizen.medicalInfo);
        } catch {
          medicalInfo = [];
        }
      }

      // Parse emergency contact safely
      let emergencyContact: any = null;
      if (citizen.emergencyContact) {
        try {
          emergencyContact = JSON.parse(citizen.emergencyContact);
        } catch {
          emergencyContact = null;
        }
      }

      const citizenData = {
        ...citizen,
        notes,
        flags,
        aliases,
        medicalInfo,
        emergencyContact,
      };
      return NextResponse.json({ citizen: citizenData });
    }

    // If not found in Citizen, search Character table
    if (!citizen) {
      const character = await prisma.character.findFirst({
        where: {
          OR: searchConditions,
        },
      });

      // Convert Character to Citizen format for CAD display
      if (character) {
        citizen = {
          id: character.id,
          firstName: character.firstName,
          lastName: character.lastName,
          dateOfBirth: new Date(character.dateOfBirth),
          gender: character.gender,
          stateId: character.stateId,
          phoneNumber: character.phoneNumber,
          address: null,
          isWanted: false,
          isMissing: false,
          driversLicense: character.licenseStatus === "VALID",
          weaponsPermit: character.firearmPermit,
          image: character.image,
          height: character.height,
          weight: character.weight,
          eyeColor: character.eyeColor,
          hairColor: character.hairColor,
          build: character.build,
          createdAt: character.createdAt,
          updatedAt: character.updatedAt,
          vehicles: [],
          warrants: [],
          citations: [],
          arrests: [],
          notes: [],
          flags: [],
        } as any;
        return NextResponse.json({ citizen });
      }
    }

    // Return null if not found (not an error - just no match)
    return NextResponse.json({ citizen: null });
  } catch (error) {
    console.error("Error searching citizen:", error);
    return NextResponse.json(
      { error: "Failed to search citizen" },
      { status: 500 }
    );
  }
}
