import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all citations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPaid = searchParams.get("isPaid");
    
    const citations = await prisma.citation.findMany({
      where: isPaid ? { isPaid: isPaid === "true" } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ citations });
  } catch (error) {
    console.error("Error fetching citations:", error);
    return NextResponse.json(
      { error: "Failed to fetch citations" },
      { status: 500 }
    );
  }
}

// POST - Create new citation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { citizenName, violation, fineAmount, location, issuedBy } = body;

    if (!citizenName || !violation || fineAmount === undefined) {
      return NextResponse.json(
        { error: "Citizen name, violation, and fine amount are required" },
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

    const citation = await prisma.citation.create({
      data: {
        citizenId: citizen.id,
        violation,
        fine: parseFloat(fineAmount),
        notes: location || "",
        issuedBy,
        isPaid: false,
      },
    });

    return NextResponse.json({ citation }, { status: 201 });
  } catch (error) {
    console.error("Error creating citation:", error);
    return NextResponse.json(
      { error: "Failed to create citation" },
      { status: 500 }
    );
  }
}
