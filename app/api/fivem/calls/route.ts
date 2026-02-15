import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/fivem/calls - Get active calls for FiveM integration
export async function GET() {
  try {
    const calls = await prisma.call.findMany({
      where: {
        status: {
          in: ["PENDING", "DISPATCHED", "ENROUTE", "ON_SCENE"],
        },
      },
      include: {
        units: {
          include: { officers: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format for FiveM consumption
    const formatted = calls.map((call: typeof calls[number]) => ({
      id: call.id,
      callNumber: call.callNumber,
      type: call.type,
      priority: call.priority,
      location: call.location,
      latitude: call.latitude,
      longitude: call.longitude,
      description: call.description,
      status: call.status,
      units: call.units.map((u: typeof call.units[number]) => u.callsign),
      createdAt: call.createdAt,
    }));

    return NextResponse.json({ calls: formatted });
  } catch (error) {
    console.error("Error fetching calls for FiveM:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

// POST /api/fivem/calls - Create a call from FiveM (e.g. 911 call in-game)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, location, description, caller, latitude, longitude, createdById } = body;

    if (!type || !location) {
      return NextResponse.json(
        { error: "Call type and location are required" },
        { status: 400 }
      );
    }

    // Generate call number
    const count = await prisma.call.count();
    const callNumber = `911-${String(count + 1).padStart(5, "0")}`;

    const call = await prisma.call.create({
      data: {
        callNumber,
        type,
        priority: body.priority || "MEDIUM",
        location,
        description: description || "",
        caller: caller || "In-Game 911",
        latitude: latitude || null,
        longitude: longitude || null,
        status: "PENDING",
        createdById: createdById || "system",
      },
    });

    return NextResponse.json({ call }, { status: 201 });
  } catch (error) {
    console.error("Error creating FiveM call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}
