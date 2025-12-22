import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { vehicleId, registrationStatus, insuranceStatus, insuranceCompany, insurancePolicy } = await req.json();

    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
    }

    const updateData: any = {};

    if (registrationStatus !== undefined) {
      updateData.registrationStatus = registrationStatus;
    }

    if (insuranceStatus !== undefined) {
      updateData.insuranceStatus = insuranceStatus;
    }

    if (insuranceCompany !== undefined) {
      updateData.insuranceCompany = insuranceCompany;
    }

    if (insurancePolicy !== undefined) {
      updateData.insurancePolicy = insurancePolicy;
    }

    // Update vehicle
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    return NextResponse.json({ error: "Failed to update vehicle status" }, { status: 500 });
  }
}
