import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { noteIndex } = await req.json();
    
    // Get the citizen
    const citizen = await prisma.citizen.findUnique({
      where: { id: params.id },
    });

    if (!citizen) {
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }

    // Parse notes
    let notes = [];
    if (citizen.notes) {
      try {
        notes = JSON.parse(citizen.notes);
      } catch (e) {
        notes = [];
      }
    }

    // Remove the note at the specified index
    if (noteIndex >= 0 && noteIndex < notes.length) {
      notes.splice(noteIndex, 1);
    }

    // Update citizen
    await prisma.citizen.update({
      where: { id: params.id },
      data: { notes: JSON.stringify(notes) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { noteIndex, content } = await req.json();
    
    // Get the citizen
    const citizen = await prisma.citizen.findUnique({
      where: { id: params.id },
    });

    if (!citizen) {
      return NextResponse.json({ error: "Citizen not found" }, { status: 404 });
    }

    // Parse notes
    let notes = [];
    if (citizen.notes) {
      try {
        notes = JSON.parse(citizen.notes);
      } catch (e) {
        notes = [];
      }
    }

    // Update the note at the specified index
    if (noteIndex >= 0 && noteIndex < notes.length) {
      notes[noteIndex].content = content;
      notes[noteIndex].lastModified = new Date().toISOString();
    }

    // Update citizen
    await prisma.citizen.update({
      where: { id: params.id },
      data: { notes: JSON.stringify(notes) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
