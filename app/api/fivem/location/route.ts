import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/fivem/location - Receive player location update from FiveM server
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, playerName, x, y, z, heading, speed } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Update the unit location if linked to a player
    const officer = await prisma.officer.findFirst({
      where: { userId: playerId, isActive: true },
      include: { unit: true },
    });

    if (officer?.unit) {
      await prisma.unit.update({
        where: { id: officer.unit.id },
        data: {
          latitude: x || null,
          longitude: y || null,
          location: `${x?.toFixed(2)}, ${y?.toFixed(2)}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing location update:", error);
    return NextResponse.json(
      { error: "Failed to process location update" },
      { status: 500 }
    );
  }
}
