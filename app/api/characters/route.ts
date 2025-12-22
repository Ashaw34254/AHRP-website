import { NextRequest, NextResponse } from "next/server";
import { getDevSession } from "@/lib/dev-session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/characters
 * Get all characters for the current user
 */
export async function GET() {
  try {
    const session = await getDevSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // Return mock characters in dev mode
      const mockCharacters = [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          department: "POLICE",
          rank: "Sergeant",
          isActive: true,
          playTime: 1200,
        },
        {
          id: "2",
          firstName: "Jane",
          lastName: "Smith",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
          department: "FIRE",
          rank: "Firefighter",
          isActive: false,
          playTime: 800,
        },
        {
          id: "3",
          firstName: "Mike",
          lastName: "Johnson",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          department: "CIVILIAN",
          occupation: "Mechanic",
          isActive: false,
          playTime: 450,
        },
      ];
      return NextResponse.json(mockCharacters);
    }

    const characters = await prisma.character.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(characters);
  } catch (error: any) {
    console.error("Character fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch characters" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/characters
 * Create a new character
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getDevSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      height,
      weight,
      eyeColor,
      hairColor,
      build,
      distinguishingFeatures,
      bloodType,
      licenseStatus,
      stateId,
      firearmPermit,
      organDonor,
      veteranStatus,
      allergies,
      medicalConditions,
      placeOfBirth,
      nationality,
      education,
      department,
      occupation,
      rank,
      phoneNumber,
      backstory,
      personalityTraits,
      skills,
      image,
    } = body;

    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // In dev mode, return success with mock data
      const mockCharacter = {
        id: `char-${Date.now()}`,
        userId: session.user.id,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        height: height || null,
        weight: weight || null,
        eyeColor: eyeColor || null,
        hairColor: hairColor || null,
        build: build || null,
        distinguishingFeatures: distinguishingFeatures || null,
        bloodType: bloodType || null,
        licenseStatus: licenseStatus || "NONE",
        stateId: stateId || null,
        firearmPermit: firearmPermit || false,
        organDonor: organDonor || false,
        veteranStatus: veteranStatus || false,
        allergies: allergies || null,
        medicalConditions: medicalConditions || null,
        placeOfBirth: placeOfBirth || null,
        nationality: nationality || null,
        education: education || null,
        department: department || "CIVILIAN",
        occupation: occupation || null,
        rank: rank || null,
        phoneNumber: phoneNumber || null,
        backstory: backstory || null,
        personalityTraits: personalityTraits || null,
        skills: skills || null,
        image: image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
        isActive: false,
        isApproved: false,
        playTime: 0,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(mockCharacter);
    }

    const character = await prisma.character.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        height: height || null,
        weight: weight || null,
        eyeColor: eyeColor || null,
        hairColor: hairColor || null,
        build: build || null,
        distinguishingFeatures: distinguishingFeatures || null,
        bloodType: bloodType || null,
        licenseStatus: licenseStatus || "NONE",
        stateId: stateId || null,
        firearmPermit: firearmPermit || false,
        organDonor: organDonor || false,
        veteranStatus: veteranStatus || false,
        allergies: allergies || null,
        medicalConditions: medicalConditions || null,
        placeOfBirth: placeOfBirth || null,
        nationality: nationality || null,
        education: education || null,
        department: department || "CIVILIAN",
        occupation: occupation || null,
        rank: rank || null,
        phoneNumber: phoneNumber || null,
        backstory: backstory || null,
        personalityTraits: personalityTraits || null,
        skills: skills || null,
        image: image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
        isActive: false,
        isApproved: false,
      },
    });

    return NextResponse.json(character);
  } catch (error: any) {
    console.error("Character creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create character" },
      { status: 500 }
    );
  }
}
