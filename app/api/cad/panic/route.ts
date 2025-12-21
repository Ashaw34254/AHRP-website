import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.panicAlert.findMany({
      where: {
        status: {
          in: ["ACTIVE", "RESPONDED"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error fetching panic alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch panic alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      unitId,
      unitCallsign,
      department,
      location,
      latitude,
      longitude,
      reason,
    } = body;

    if (!unitCallsign || !department) {
      return NextResponse.json(
        { error: "Unit callsign and department are required" },
        { status: 400 }
      );
    }

    const alert = await prisma.panicAlert.create({
      data: {
        unitId: unitId || unitCallsign,
        unitCallsign,
        department,
        location,
        latitude,
        longitude,
        reason,
        status: "ACTIVE",
      },
    });

    // Create notification for all dispatchers
    await prisma.notification.create({
      data: {
        userId: "system", // System notification
        type: "PANIC",
        title: `🚨 PANIC ALERT - ${unitCallsign}`,
        message: `${department} unit ${unitCallsign} has activated panic button${
          location ? ` at ${location}` : ""
        }`,
        priority: "CRITICAL",
        referenceId: alert.id,
        referenceType: "panic",
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("Error creating panic alert:", error);
    return NextResponse.json(
      { error: "Failed to create panic alert" },
      { status: 500 }
    );
  }
}
