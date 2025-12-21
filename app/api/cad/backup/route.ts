import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.backupRequest.findMany({
      where: {
        status: {
          in: ["PENDING", "ACKNOWLEDGED", "ENROUTE"],
        },
      },
      orderBy: [
        { urgency: "desc" },
        { requestedAt: "desc" },
      ],
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching backup requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch backup requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      requestingUnit,
      department,
      callNumber,
      location,
      latitude,
      longitude,
      urgency,
      reason,
    } = body;

    if (!requestingUnit || !department || !location) {
      return NextResponse.json(
        { error: "Unit, department, and location are required" },
        { status: 400 }
      );
    }

    const backupRequest = await prisma.backupRequest.create({
      data: {
        requestingUnitId: requestingUnit,
        requestingUnit,
        department,
        callNumber,
        location,
        latitude,
        longitude,
        urgency: urgency || "ROUTINE",
        reason,
        status: "PENDING",
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: "system",
        type: "BACKUP",
        title: `Backup Requested - ${requestingUnit}`,
        message: `${department} unit ${requestingUnit} requests backup at ${location}`,
        priority: urgency === "EMERGENCY" ? "CRITICAL" : "HIGH",
        referenceId: backupRequest.id,
        referenceType: "backup",
      },
    });

    return NextResponse.json({ backupRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating backup request:", error);
    return NextResponse.json(
      { error: "Failed to create backup request" },
      { status: 500 }
    );
  }
}
