import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/fivem/panic - Trigger panic alert from FiveM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, playerName, x, y, z, reason } = body;

    if (!playerId) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Find the officer linked to this player
    const officer = await prisma.officer.findFirst({
      where: { userId: playerId, isActive: true },
      include: { unit: true },
    });

    const unitCallsign = officer?.unit?.callsign || officer?.callsign || playerName || playerId;
    const department = officer?.department || "UNKNOWN";

    // Create panic alert
    const alert = await prisma.panicAlert.create({
      data: {
        unitId: officer?.unit?.id || playerId,
        unitCallsign,
        department,
        location: `${x?.toFixed(2)}, ${y?.toFixed(2)}`,
        latitude: x || null,
        longitude: y || null,
        reason: reason || "FiveM panic button activated",
        status: "ACTIVE",
      },
    });

    // Update officer duty status to PANIC
    if (officer) {
      await prisma.officer.update({
        where: { id: officer.id },
        data: { dutyStatus: "PANIC" },
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: "system",
        type: "PANIC",
        title: `PANIC ALERT - ${unitCallsign}`,
        message: `${department} unit ${unitCallsign} has activated panic button via FiveM${reason ? `: ${reason}` : ""}`,
        priority: "CRITICAL",
        referenceId: alert.id,
        referenceType: "panic",
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("Error creating FiveM panic alert:", error);
    return NextResponse.json(
      { error: "Failed to create panic alert" },
      { status: 500 }
    );
  }
}
