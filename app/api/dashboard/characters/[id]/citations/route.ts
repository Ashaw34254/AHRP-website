import { NextRequest, NextResponse } from "next/server";
import { getDevSession } from "@/lib/dev-session";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/dashboard/characters/[id]/citations
 * Create a new citation
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

    const { violation, fine, notes, location } = body;

    if (!violation || fine === undefined) {
      return NextResponse.json(
        { error: "Violation and fine are required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return NextResponse.json({
        success: true,
        citation: {
          id: `citation-${Date.now()}`,
          characterId: id,
          violation,
          fine: parseInt(fine),
          notes: notes || null,
          location: location || null,
          isPaid: false,
          issuedBy: session.user.name || "User",
          source: "user",
          issuedAt: new Date().toISOString(),
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

    const citation = await prisma.characterCitation.create({
      data: {
        characterId: id,
        violation,
        fine: parseInt(fine),
        notes: notes || null,
        location: location || null,
        issuedBy: session.user.name || session.user.id,
        source: "user",
      },
    });

    return NextResponse.json({ success: true, citation });
  } catch (error: any) {
    console.error("Error creating citation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create citation" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/characters/[id]/citations
 * Update citation (user-created only)
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

    const { citationId, violation, fine, notes, location, isPaid } = body;

    if (!citationId) {
      return NextResponse.json(
        { error: "Citation ID is required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return NextResponse.json({
        success: true,
        citation: {
          id: citationId,
          characterId: id,
          violation,
          fine,
          notes,
          location,
          isPaid,
          issuedBy: session.user.name || "User",
          source: "user",
          issuedAt: new Date(Date.now() - 86400000).toISOString(),
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

    const existingCitation = await prisma.characterCitation.findFirst({
      where: {
        id: citationId,
        characterId: id,
        source: "user",
      },
    });

    if (!existingCitation) {
      return NextResponse.json(
        { error: "Citation not found or cannot be edited (CAD-sourced)" },
        { status: 404 }
      );
    }

    const citation = await prisma.characterCitation.update({
      where: { id: citationId },
      data: {
        violation: violation || existingCitation.violation,
        fine: fine !== undefined ? parseInt(fine) : existingCitation.fine,
        notes: notes !== undefined ? notes : existingCitation.notes,
        location: location !== undefined ? location : existingCitation.location,
        isPaid: isPaid !== undefined ? isPaid : existingCitation.isPaid,
      },
    });

    return NextResponse.json({ success: true, citation });
  } catch (error: any) {
    console.error("Error updating citation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update citation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/characters/[id]/citations
 * Delete citation (user-created only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getDevSession();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const citationId = searchParams.get("citationId");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!citationId) {
      return NextResponse.json(
        { error: "Citation ID is required" },
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

    const existingCitation = await prisma.characterCitation.findFirst({
      where: {
        id: citationId,
        characterId: id,
        source: "user",
      },
    });

    if (!existingCitation) {
      return NextResponse.json(
        { error: "Citation not found or cannot be deleted (CAD-sourced)" },
        { status: 404 }
      );
    }

    await prisma.characterCitation.delete({
      where: { id: citationId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting citation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete citation" },
      { status: 500 }
    );
  }
}
