import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { noteIndex } = await req.json();
    
    // Get the vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Parse notes
    let notes = [];
    if (vehicle.notes) {
      try {
        notes = JSON.parse(vehicle.notes);
      } catch (e) {
        notes = [];
      }
    }

    // Remove the note at the specified index
    if (noteIndex >= 0 && noteIndex < notes.length) {
      notes.splice(noteIndex, 1);
    }

    // Update vehicle
    await prisma.vehicle.update({
      where: { id: params.id },
      data: { notes: JSON.stringify(notes) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting vehicle note:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
