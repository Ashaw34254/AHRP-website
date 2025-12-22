import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/characters/[id] - Get a single character
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const character = await prisma.character.findFirst({
      where: {
        id,
        userId: session.user.id!,
      },
    });

    if (!character) {
      return NextResponse.json(
        { success: false, message: "Character not found" },
        { status: 404 }
      );
    }

    // Get associated officer for this character
    const officer = await prisma.officer.findFirst({
      where: {
        userId: session.user.id!,
        department: character.department || undefined,
      },
      select: {
        id: true,
        callsign: true,
        rank: true,
        department: true,
        dutyStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      character: {
        ...character,
        officer: officer || null,
      },
    });
  } catch (error) {
    console.error("Error fetching character:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/dashboard/characters/[id] - Update a character
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.character.findFirst({
      where: {
        id,
        userId: session.user.id!,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Character not found" },
        { status: 404 }
      );
    }

    // Update character
    const character = await prisma.character.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        backstory: body.backstory,
        image: body.image,
        department: body.department,
        rank: body.rank,
        occupation: body.occupation,
        phoneNumber: body.phoneNumber,
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
