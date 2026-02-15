import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const pursuits = await prisma.pursuit.findMany({
      where,
      orderBy: { startedAt: "desc" },
    });

    // Parse JSON fields for response
    const pursuitsWithParsedData = pursuits.map((pursuit: typeof pursuits[number]) => ({
      ...pursuit,
      unitsInvolved: pursuit.unitsInvolved ? JSON.parse(pursuit.unitsInvolved) : [],
      route: pursuit.route ? JSON.parse(pursuit.route) : [],
      tactics: pursuit.tactics ? JSON.parse(pursuit.tactics) : [],
    }));

    return NextResponse.json({ pursuits: pursuitsWithParsedData });
  } catch (error) {
    console.error("Failed to fetch pursuits:", error);
    return NextResponse.json(
      { error: "Failed to fetch pursuits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.startLocation || !body.reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate pursuit number
    const year = new Date().getFullYear();
    const lastPursuit = await prisma.pursuit.findFirst({
      where: {
        pursuitNumber: {
          startsWith: `PUR-${year}-`,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (lastPursuit) {
      const lastNumber = parseInt(lastPursuit.pursuitNumber.split("-")[2]);
      nextNumber = lastNumber + 1;
    }

    const pursuitNumber = `PUR-${year}-${nextNumber.toString().padStart(6, "0")}`;

    const pursuit = await prisma.pursuit.create({
      data: {
        pursuitNumber,
        vehiclePlate: body.vehiclePlate,
        vehicleDesc: body.vehicleDesc,
        suspectDesc: body.suspectDesc,
        startLocation: body.startLocation,
        endLocation: body.endLocation,
        route: body.route ? JSON.stringify(body.route) : null,
        reason: body.reason,
        status: body.status || "ACTIVE",
        riskLevel: body.riskLevel || "MEDIUM",
        peakSpeed: body.peakSpeed,
        duration: body.duration || 0,
        distance: body.distance,
        primaryUnit: body.primaryUnit || body.unitsInvolved?.[0] || "Unknown",
        unitsInvolved: body.unitsInvolved ? JSON.stringify(body.unitsInvolved) : JSON.stringify([]),
        airSupportUsed: body.airSupportUsed || false,
        outcome: body.outcome,
        injuriesReported: body.injuriesReported || false,
        damageReported: body.damageReported || false,
        terminatedBy: body.terminatedBy,
        terminationReason: body.terminationReason,
        notes: body.notes,
        tactics: body.tactics ? JSON.stringify(body.tactics) : null,
        startedAt: new Date(),
        endedAt: body.endedAt ? new Date(body.endedAt) : null,
      },
    });

    return NextResponse.json({ pursuit }, { status: 201 });
  } catch (error) {
    console.error("Failed to create pursuit:", error);
    return NextResponse.json(
      { error: "Failed to create pursuit" },
      { status: 500 }
    );
  }
}
