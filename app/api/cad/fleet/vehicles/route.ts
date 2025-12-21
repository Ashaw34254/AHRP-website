import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const vehicles = await prisma.fleetVehicle.findMany({
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: "desc" },
          take: 5,
        },
      },
      orderBy: { callsign: "asc" },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      callsign,
      type,
      make,
      model,
      year,
      vin,
      plate,
      department,
      mileage,
      assignedUnitId,
    } = body;

    if (!callsign || !make || !model || !year || !plate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.fleetVehicle.create({
      data: {
        callsign,
        type: type || "PATROL_CAR",
        make,
        model,
        year: parseInt(year),
        vin: vin || null,
        plate,
        department: department || "POLICE",
        status: "AVAILABLE",
        mileage: parseInt(mileage) || 0,
        assignedUnitId: assignedUnitId || null,
      },
      include: {
        maintenanceLogs: true,
      },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
