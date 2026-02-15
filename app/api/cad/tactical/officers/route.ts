import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const officers = await prisma.officer.findMany({
      where: {
        isTactical: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        unit: true,
      },
      orderBy: {
        tacticalTeam: "asc",
      },
    });

    const formattedOfficers = officers.map((officer: typeof officers[number]) => ({
      id: officer.id,
      name: officer.name,
      callsign: officer.callsign,
      role: officer.tacticalRole || "ENTRY_TEAM",
      team: officer.tacticalTeam || "CIRT",
      status: officer.dutyStatus,
      qualifications: officer.qualifications ? JSON.parse(officer.qualifications) : [],
      lastTraining: officer.lastTraining?.toISOString() || null,
      responseTime: officer.responseTime || 15,
      equipment: officer.equipment ? JSON.parse(officer.equipment) : [],
      phone: officer.phone || "Not provided",
      location: officer.unit?.location || "Unknown",
    }));

    return NextResponse.json({ officers: formattedOfficers });
  } catch (error) {
    console.error("Failed to fetch tactical officers:", error);
    return NextResponse.json(
      { error: "Failed to fetch tactical officers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      callsign,
      name,
      badge,
      tacticalTeam,
      tacticalRole,
      qualifications,
      responseTime,
      equipment,
      phone,
    } = body;

    const officer = await prisma.officer.create({
      data: {
        userId,
        callsign,
        name,
        badge,
        department: "POLICE",
        isTactical: true,
        tacticalTeam,
        tacticalRole,
        qualifications: qualifications ? JSON.stringify(qualifications) : null,
        responseTime: responseTime || 15,
        equipment: equipment ? JSON.stringify(equipment) : null,
        phone,
      },
    });

    return NextResponse.json({ officer });
  } catch (error) {
    console.error("Failed to create tactical officer:", error);
    return NextResponse.json(
      { error: "Failed to create tactical officer" },
      { status: 500 }
    );
  }
}
