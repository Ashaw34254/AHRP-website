import { NextRequest, NextResponse } from "next/server";
import { getDevSession } from "@/lib/dev-session";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/dashboard/characters/[id]/arrests
 * Create a new arrest record
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getDevSession();
    const { id } = await params;
    const body = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { charges, narrative, location } = body;

    if (!charges) {
      return NextResponse.json(
        { error: "Charges are required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return NextResponse.json({
        success: true,
        arrest: {
          id: `arrest-${Date.now()}`,
          characterId: id,
          charges: typeof charges === "string" ? charges : JSON.stringify(charges),
          narrative: narrative || null,
          location: location || null,
          arrestedBy: session.user.name || "User",
          source: "user",
          arrestedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const character = await prisma.character.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!character || character.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Character not found or unauthorized" },
        { status: 404 }
      );
    }

    const arrest = await prisma.characterArrest.create({
      data: {
        characterId: id,
        charges: typeof charges === "string" ? charges : JSON.stringify(charges),
        narrative: narrative || null,
        location: location || null,
        arrestedBy: session.user.name || session.user.id,
        source: "user",
      },
    });

    return NextResponse.json({ success: true, arrest });
  } catch (error: any) {
    console.error("Error creating arrest:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create arrest" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/characters/[id]/arrests
 * Update arrest record (user-created only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getDevSession();
    const { id } = await params;
    const body = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { arrestId, charges, narrative, location } = body;

    if (!arrestId) {
      return NextResponse.json(
        { error: "Arrest ID is required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return NextResponse.json({
        success: true,
        arrest: {
          id: arrestId,
          characterId: id,
          charges: typeof charges === "string" ? charges : JSON.stringify(charges),
          narrative,
          location,
          arrestedBy: session.user.name || "User",
          source: "user",
          arrestedAt: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const character = await prisma.character.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!character || character.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Character not found or unauthorized" },
        { status: 404 }
      );
    }

    const existingArrest = await prisma.characterArrest.findFirst({
      where: {
        id: arrestId,
        characterId: id,
        source: "user",
      },
    });

    if (!existingArrest) {
      return NextResponse.json(
        { error: "Arrest not found or cannot be edited (CAD-sourced)" },
        { status: 404 }
      );
    }

    const arrest = await prisma.characterArrest.update({
      where: { id: arrestId },
      data: {
        charges: charges ? (typeof charges === "string" ? charges : JSON.stringify(charges)) : existingArrest.charges,
        narrative: narrative !== undefined ? narrative : existingArrest.narrative,
        location: location !== undefined ? location : existingArrest.location,
      },
    });

    return NextResponse.json({ success: true, arrest });
  } catch (error: any) {
    console.error("Error updating arrest:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update arrest" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/characters/[id]/arrests
 * Delete arrest record (user-created only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getDevSession();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const arrestId = searchParams.get("arrestId");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!arrestId) {
      return NextResponse.json(
        { error: "Arrest ID is required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return NextResponse.json({ success: true });
    }

    const character = await prisma.character.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!character || character.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Character not found or unauthorized" },
        { status: 404 }
      );
    }

    const existingArrest = await prisma.characterArrest.findFirst({
      where: {
        id: arrestId,
        characterId: id,
        source: "user",
      },
    });

    if (!existingArrest) {
      return NextResponse.json(
        { error: "Arrest not found or cannot be deleted (CAD-sourced)" },
        { status: 404 }
      );
    }

    await prisma.characterArrest.delete({
      where: { id: arrestId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting arrest:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete arrest" },
      { status: 500 }
    );
  }
}
