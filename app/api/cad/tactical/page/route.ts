import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { team } = body;

    if (!team || !["CIRT", "SOG", "BOTH"].includes(team)) {
      return NextResponse.json(
        { error: "Invalid team specified" },
        { status: 400 }
      );
    }

    // Find all tactical officers from the specified team
    const teamFilter: any = {};
    if (team === "BOTH") {
      teamFilter.tacticalTeam = { in: ["CIRT", "SOG"] };
    } else {
      teamFilter.tacticalTeam = team;
    }

    const officers = await prisma.officer.findMany({
      where: {
        isTactical: true,
        isActive: true,
        ...teamFilter,
      },
      select: {
        id: true,
        name: true,
        callsign: true,
        phone: true,
        tacticalTeam: true,
      },
    });

    // In a real system, this would integrate with a paging/notification system
    // For now, we'll just log and return the officers that would be paged
    console.log(`Paging ${officers.length} officers from ${team}`);
    
    // Update officer statuses to indicate they've been paged
    await prisma.officer.updateMany({
      where: {
        id: { in: officers.map((o: typeof officers[number]) => o.id) },
      },
      data: {
        dutyStatus: "BUSY", // Or create a "PAGED" status
      },
    });

    return NextResponse.json({
      success: true,
      officersPaged: officers.length,
      officers: officers.map((o: typeof officers[number]) => ({
        callsign: o.callsign,
        name: o.name,
        team: o.tacticalTeam,
      })),
    });
  } catch (error) {
    console.error("Failed to page tactical officers:", error);
    return NextResponse.json(
      { error: "Failed to page tactical officers" },
      { status: 500 }
    );
  }
}
