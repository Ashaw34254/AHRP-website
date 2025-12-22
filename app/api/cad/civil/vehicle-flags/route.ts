import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { vehicleId, flagType, value } = await req.json();

    if (!vehicleId || !flagType) {
      return NextResponse.json({ error: "Vehicle ID and flag type are required" }, { status: 400 });
    }

    const updateData: any = {};

    if (flagType === "stolen") {
      updateData.isStolen = value;
    } else if (flagType === "wanted") {
      updateData.isWanted = value;
    } else if (flagType === "impounded") {
      updateData.isImpounded = value;
    }

    // Update vehicle
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating vehicle flag:", error);
    return NextResponse.json({ error: "Failed to update vehicle flag" }, { status: 500 });
  }
}
