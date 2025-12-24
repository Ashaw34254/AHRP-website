import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const interactions = await prisma.fieldInteraction.findMany({
      take: limit,
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error("Failed to fetch field interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch field interactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.type || !body.location || !body.officerCallsign) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const interaction = await prisma.fieldInteraction.create({
      data: {
        type: body.type,
        location: body.location,
        officerCallsign: body.officerCallsign,
        officerId: body.officerId,
        unitId: body.unitId,
        persons: body.persons ? JSON.stringify(body.persons) : null,
        vehicles: body.vehicles ? JSON.stringify(body.vehicles) : null,
        outcome: body.outcome || "NO_ACTION",
        reason: body.reason,
        notes: body.notes,
        escalatedToCIB: body.escalatedToCIB || false,
        escalationNotes: body.escalationNotes,
        duration: body.duration,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ interaction }, { status: 201 });
  } catch (error) {
    console.error("Failed to create field interaction:", error);
    return NextResponse.json(
      { error: "Failed to create field interaction" },
      { status: 500 }
    );
  }
}
