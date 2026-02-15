import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const alerts = await prisma.supervisorAlert.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, unitId, unitCallsign, department, location, reason } = body;

    if (!type || !unitId || !unitCallsign || !department) {
      return NextResponse.json({ error: "Type, unitId, unitCallsign, and department are required" }, { status: 400 });
    }

    const alert = await prisma.supervisorAlert.create({
      data: {
        type,
        unitId,
        unitCallsign,
        department,
        location: location || null,
        reason: reason || null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Failed to create alert:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
