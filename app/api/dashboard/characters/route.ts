import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/characters - Get user's characters
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const characters = await prisma.character.findMany({
      where: { userId: session.user.id! },
      orderBy: { createdAt: 'desc' },
    });

    // Get associated officers for this user
    const officers = await prisma.officer.findMany({
      where: { userId: session.user.id! },
      select: {
        id: true,
        callsign: true,
        rank: true,
        department: true,
        dutyStatus: true,
      },
    });

    // Merge officer data with characters where applicable
    const charactersWithOfficers = characters.map(char => {
      const officer = officers.find(o => o.department === char.department);
      return {
        ...char,
        officer: officer || null,
      };
    });

    return NextResponse.json({
      success: true,
      characters: charactersWithOfficers,
    });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/characters - Create a new character
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, gender, backstory, image } = body;

    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: {
        userId: session.user.id!,
        firstName,
        lastName,
        dateOfBirth, // Keep as string, don't convert to Date
        gender: gender || null,
        backstory: backstory || null,
        image: image || null,
      },
    });

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/dashboard/characters - Update a character
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { characterId, updates } = body;

    if (!characterId) {
      return NextResponse.json(
        { success: false, message: "Character ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.character.findUnique({
      where: { id: characterId },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Character not found or access denied" },
        { status: 404 }
      );
    }

    // Update character
    const character = await prisma.character.update({
      where: { id: characterId },
      data: {
        ...updates,
        dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Error updating character:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/characters - Delete a character
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get("id");

    if (!characterId) {
      return NextResponse.json(
        { success: false, message: "Character ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.character.findUnique({
      where: { id: characterId },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Character not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.character.delete({
      where: { id: characterId },
    });

    return NextResponse.json({
      success: true,
      message: "Character deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting character:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
