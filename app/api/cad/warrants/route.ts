import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all warrants
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    
    const warrants = await prisma.warrant.findMany({
      where: isActive ? { isActive: isActive === "true" } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ warrants });
  } catch (error) {
    console.error("Error fetching warrants:", error);
    return NextResponse.json(
      { error: "Failed to fetch warrants" },
      { status: 500 }
    );
  }
}

// POST - Create new warrant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { citizenName, charge, description, issuedBy } = body;

    if (!citizenName || !charge) {
      return NextResponse.json(
        { error: "Citizen name and charge are required" },
        { status: 400 }
      );
    }

    // Check if citizen exists, create if not
    let citizen = await prisma.citizen.findFirst({
      where: { 
        OR: [
          { firstName: { contains: citizenName } },
          { lastName: { contains: citizenName } },
        ],
      },
    });

    if (!citizen) {
      const names = citizenName.split(' ');
      citizen = await prisma.citizen.create({
        data: {
          firstName: names[0] || citizenName,
          lastName: names.slice(1).join(' ') || 'Unknown',
          stateId: `SID-${Date.now().toString().slice(-6)}`,
          dateOfBirth: new Date('1990-01-01'),
        },
      });
    }

    const warrant = await prisma.warrant.create({
      data: {
        citizenId: citizen.id,
        offense: charge,
        description: description || "",
        issuedBy,
        isActive: true,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: "system",
        type: "WARRANT",
        title: "New Warrant Issued",
        message: `Warrant issued for ${citizenName}: ${charge}`,
        priority: "HIGH",
        referenceId: warrant.id,
        referenceType: "warrant",
      },
    });

    return NextResponse.json({ warrant }, { status: 201 });
  } catch (error) {
    console.error("Error creating warrant:", error);
    return NextResponse.json(
      { error: "Failed to create warrant" },
      { status: 500 }
    );
  }
}
