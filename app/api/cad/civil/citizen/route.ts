import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const dateOfBirth = searchParams.get("dateOfBirth");
    const stateId = searchParams.get("stateId");

    // Check if we have either the old query param or new separate params
    if (!query && !firstName && !lastName && !dateOfBirth && !stateId) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Build search conditions based on what parameters were provided
    const searchConditions: any[] = [];

    if (query) {
      // Old-style query - parse it
      const queryParts = query.trim().split(/\s+/);
      const [firstPart, lastPart] = queryParts;

      searchConditions.push(
        {
          stateId: {
            contains: query,
          },
        }
      );

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
    } else {
      // New-style separate parameters - build precise search
      const andConditions: any[] = [];

      if (firstName) {
        andConditions.push({
          firstName: {
            contains: firstName,
          },
        });
      }

      if (lastName) {
        andConditions.push({
          lastName: {
            contains: lastName,
          },
        });
      }

      if (dateOfBirth) {
        andConditions.push({
          dateOfBirth: {
            equals: new Date(dateOfBirth),
          },
        });
      }

      if (stateId) {
        andConditions.push({
          stateId: {
            contains: stateId,
          },
        });
      }

      if (andConditions.length > 0) {
        searchConditions.push({
          AND: andConditions,
        });
      }
    }

    // Search by name or State ID in both Citizen AND Character tables
    let citizens = await prisma.citizen.findMany({
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
      take: 10, // Limit to 10 results
    });

    // If no citizens found, search Character table
    if (citizens.length === 0) {
      const characters = await prisma.character.findMany({
        where: {
          OR: searchConditions,
        },
        take: 10,
      });

      // Convert Characters to Citizen format
      citizens = characters.map((character: typeof characters[number]) => ({
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
      } as any));
    }

    // If exactly one result, return it as before for backward compatibility
    if (citizens.length === 1) {
      const citizen = citizens[0];
      
      // Parse JSON fields
      let notes: any[] = [];
      if (citizen.notes) {
        try {
          notes = JSON.parse(citizen.notes);
        } catch {
          notes = [];
        }
      }

      let flags: string[] = [];
      if (citizen.flags) {
        try {
          flags = JSON.parse(citizen.flags);
        } catch {
          if (typeof citizen.flags === 'string') {
            flags = citizen.flags.split(',').map((f: string) => f.trim()).filter(Boolean);
          }
        }
      }

      let aliases: string[] = [];
      if (citizen.aliases) {
        try {
          aliases = JSON.parse(citizen.aliases);
        } catch {
          aliases = [];
        }
      }

      let medicalInfo: any[] = [];
      if (citizen.medicalInfo) {
        try {
          medicalInfo = JSON.parse(citizen.medicalInfo);
        } catch {
          medicalInfo = [];
        }
      }

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

    // If multiple results, return them as an array
    if (citizens.length > 1) {
      return NextResponse.json({ 
        citizens: citizens.map((c: typeof citizens[number]) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          dateOfBirth: c.dateOfBirth,
          stateId: c.stateId,
          hasWarrants: c.warrants && c.warrants.length > 0,
          hasFlags: (c.flags && (Array.isArray(c.flags) ? c.flags.length > 0 : c.flags !== null)),
        })),
        count: citizens.length
      });
    }

    // Return null if not found
    return NextResponse.json({ citizen: null });
  } catch (error) {
    console.error("Error searching citizen:", error);
    return NextResponse.json(
      { error: "Failed to search citizen" },
      { status: 500 }
    );
  }
}
