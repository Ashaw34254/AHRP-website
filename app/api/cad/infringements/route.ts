import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const vehiclePlate = searchParams.get("vehiclePlate");
    const driverName = searchParams.get("driverName");
    const isPaid = searchParams.get("isPaid");

    const where: any = {};
    if (vehiclePlate) {
      where.vehiclePlate = { contains: vehiclePlate };
    }
    if (driverName) {
      where.driverName = { contains: driverName };
    }
    if (isPaid !== null && isPaid !== undefined) {
      where.isPaid = isPaid === "true";
    }

    const infringements = await prisma.infringement.findMany({
      where,
      take: limit,
      orderBy: { issuedAt: "desc" },
    });

    // Parse JSON fields for response
    const infringementsWithParsedData = infringements.map((inf: typeof infringements[number]) => ({
      ...inf,
      witnessOfficers: inf.witnessOfficers ? JSON.parse(inf.witnessOfficers) : [],
      photoEvidence: inf.photoEvidence ? JSON.parse(inf.photoEvidence) : [],
    }));

    return NextResponse.json({ infringements: infringementsWithParsedData });
  } catch (error) {
    console.error("Failed to fetch infringements:", error);
    return NextResponse.json(
      { error: "Failed to fetch infringements" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.vehiclePlate || !body.driverName || !body.offence || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate infringement number
    const year = new Date().getFullYear();
    const lastInfringement = await prisma.infringement.findFirst({
      where: {
        infringementNumber: {
          startsWith: `INF-${year}-`,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (lastInfringement) {
      const lastNumber = parseInt(lastInfringement.infringementNumber.split("-")[2]);
      nextNumber = lastNumber + 1;
    }

    const infringementNumber = `INF-${year}-${nextNumber.toString().padStart(6, "0")}`;

    // Look up vehicle if it exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { plate: body.vehiclePlate },
    });

    const infringement = await prisma.infringement.create({
      data: {
        infringementNumber,
        vehiclePlate: body.vehiclePlate,
        vehicleId: vehicle?.id,
        driverName: body.driverName,
        driverLicense: body.driverLicense,
        driverAddress: body.driverAddress,
        offence: body.offence,
        offenceDescription: body.offenceDescription,
        location: body.location,
        fineAmount: body.fineAmount || 100,
        demeritPoints: body.demeritPoints || 0,
        isPaid: false,
        courtAppearanceRequired: body.courtAppearanceRequired || false,
        disputed: body.disputed || false,
        issuedBy: body.issuedBy,
        witnessOfficers: body.witnessOfficers ? JSON.stringify(body.witnessOfficers) : null,
        photoEvidence: body.photoEvidence ? JSON.stringify(body.photoEvidence) : null,
        radarReading: body.radarReading,
        videoEvidence: body.videoEvidence,
        notes: body.notes,
        conditions: body.conditions,
        issuedAt: new Date(),
      },
    });

    return NextResponse.json({ infringement }, { status: 201 });
  } catch (error) {
    console.error("Failed to create infringement:", error);
    return NextResponse.json(
      { error: "Failed to create infringement" },
      { status: 500 }
    );
  }
}
