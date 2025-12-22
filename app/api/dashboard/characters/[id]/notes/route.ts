import { NextRequest, NextResponse } from "next/server";
import { getDevSession } from "@/lib/dev-session";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/dashboard/characters/[id]/notes
 * Create a new character note
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

    const { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // Mock response in dev mode
      return NextResponse.json({
        success: true,
        note: {
          id: `note-${Date.now()}`,
          characterId: id,
          title,
          content,
          category: category || "GENERAL",
          createdBy: session.user.name || "User",
          source: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Verify character ownership
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

    const note = await prisma.characterNote.create({
      data: {
        characterId: id,
        title,
        content,
        category: category || "GENERAL",
        createdBy: session.user.name || session.user.id,
        source: "user",
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create note" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/characters/[id]/notes
 * Update an existing character note (user-created only)
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

    const { noteId, title, content, category } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      // Mock response in dev mode
      return NextResponse.json({
        success: true,
        note: {
          id: noteId,
          characterId: id,
          title,
          content,
          category,
          createdBy: session.user.name || "User",
          source: "user",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Verify character ownership
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

    // Verify note exists, belongs to character, and is user-created
    const existingNote = await prisma.characterNote.findFirst({
      where: {
        id: noteId,
        characterId: id,
        source: "user", // Only allow editing user-created notes
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found or cannot be edited (CAD-sourced)" },
        { status: 404 }
      );
    }

    const note = await prisma.characterNote.update({
      where: { id: noteId },
      data: {
        title: title || existingNote.title,
        content: content || existingNote.content,
        category: category || existingNote.category,
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update note" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/characters/[id]/notes
 * Delete a character note (user-created only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getDevSession();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("noteId");

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return NextResponse.json({ success: true });
    }

    // Verify character ownership
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

    // Verify note exists, belongs to character, and is user-created
    const existingNote = await prisma.characterNote.findFirst({
      where: {
        id: noteId,
        characterId: id,
        source: "user", // Only allow deleting user-created notes
      },
    });

    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found or cannot be deleted (CAD-sourced)" },
        { status: 404 }
      );
    }

    await prisma.characterNote.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete note" },
      { status: 500 }
    );
  }
}
