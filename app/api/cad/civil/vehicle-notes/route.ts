import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevSession } from "@/lib/dev-session";

export async function POST(req: NextRequest) {
  try {
    const session = await getDevSession();
    const { vehicleId, note } = await req.json();

    if (!vehicleId || !note) {
      return NextResponse.json(
        { error: "Vehicle ID and note are required" },
        { status: 400 }
      );
    }

    // Get the vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Parse existing notes
    let notes: any[] = [];
    if (vehicle.notes) {
      try {
        notes = JSON.parse(vehicle.notes);
      } catch (e) {
        notes = [];
      }
    }

    // Add new note
    const newNote = {
      text: note,
      officerId: session?.user?.id || "unknown",
      officerName: session?.user?.name || "Officer",
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);

    // Update vehicle
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { notes: JSON.stringify(notes) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding vehicle note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
