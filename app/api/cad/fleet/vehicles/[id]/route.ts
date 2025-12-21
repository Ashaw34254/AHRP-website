import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, mileage, assignedTo, lastService, nextService, notes } = body;

    const vehicle = await prisma.fleetVehicle.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(mileage !== undefined && { mileage: parseInt(mileage) }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(lastService !== undefined && { lastService: lastService ? new Date(lastService) : null }),
        ...(nextService !== undefined && { nextService: nextService ? new Date(nextService) : null }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        maintenanceLogs: {
          orderBy: { performedAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("Failed to update vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}
