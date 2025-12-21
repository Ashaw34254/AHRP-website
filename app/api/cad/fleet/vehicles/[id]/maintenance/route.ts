import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      type,
      description,
      cost,
      performedBy,
    } = body;

    if (!type || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create maintenance log
    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        vehicleId: id,
        type,
        description,
        cost: parseFloat(cost) || 0,
        performedBy: performedBy || "Unknown",
        performedAt: new Date(),
      },
    });

    // Update vehicle's last maintenance date
    await prisma.fleetVehicle.update({
      where: { id },
      data: {
        lastMaintenance: new Date(),
      },
    });

    return NextResponse.json({ maintenanceLog }, { status: 201 });
  } catch (error) {
    console.error("Failed to add maintenance log:", error);
    return NextResponse.json(
      { error: "Failed to add maintenance log" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const logs = await prisma.maintenanceLog.findMany({
      where: { vehicleId: id },
      orderBy: { performedAt: "desc" },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Failed to fetch maintenance logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance logs" },
      { status: 500 }
    );
  }
}
