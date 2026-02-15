import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const vehiclePlate = searchParams.get("vehiclePlate");

    const where: any = {};
    if (vehiclePlate) {
      where.vehiclePlate = vehiclePlate;
    }

    const stops = await prisma.trafficStop.findMany({
      where,
      take: limit,
      orderBy: { timestamp: "desc" },
    });

    // Parse JSON fields for response
    const stopsWithParsedData = stops.map((stop: typeof stops[number]) => ({
      ...stop,
      citationIds: stop.citationIds ? JSON.parse(stop.citationIds) : [],
      backupUnits: stop.backupUnits ? JSON.parse(stop.backupUnits) : [],
    }));

    return NextResponse.json({ stops: stopsWithParsedData });
  } catch (error) {
    console.error("Failed to fetch traffic stops:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic stops" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.vehiclePlate || !body.location || !body.reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate stop number
    const year = new Date().getFullYear();
    const lastStop = await prisma.trafficStop.findFirst({
      where: {
        stopNumber: {
          startsWith: `TS-${year}-`,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (lastStop) {
      const lastNumber = parseInt(lastStop.stopNumber.split("-")[2]);
      nextNumber = lastNumber + 1;
    }

    const stopNumber = `TS-${year}-${nextNumber.toString().padStart(6, "0")}`;

    // Look up vehicle if it exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { plate: body.vehiclePlate },
    });

    const stop = await prisma.trafficStop.create({
      data: {
        stopNumber,
        vehiclePlate: body.vehiclePlate,
        vehicleId: vehicle?.id,
        driverName: body.driverName,
        driverLicense: body.driverLicense,
        location: body.location,
        reason: body.reason,
        outcome: body.outcome || "WARNING",
        officerCallsign: body.officerCallsign,
        officerId: body.officerId,
        backupUnits: body.backupUnits ? JSON.stringify(body.backupUnits) : null,
        duration: body.duration,
        occupants: body.occupants || 1,
        citationIds: body.citationIds ? JSON.stringify(body.citationIds) : null,
        warningIssued: body.warningIssued || false,
        arrestMade: body.arrestMade || false,
        vehicleImpounded: body.vehicleImpounded || false,
        notes: body.notes,
        conditions: body.conditions,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ stop }, { status: 201 });
  } catch (error) {
    console.error("Failed to create traffic stop:", error);
    return NextResponse.json(
      { error: "Failed to create traffic stop" },
      { status: 500 }
    );
  }
}
