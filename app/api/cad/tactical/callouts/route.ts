import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const callouts = await prisma.tacticalCallout.findMany({
      include: {
        officers: {
          select: {
            id: true,
            name: true,
            callsign: true,
          },
        },
        call: true,
      },
      orderBy: {
        calloutTime: "desc",
      },
    });

    const formattedCallouts = callouts.map((callout) => ({
      id: callout.id,
      calloutTime: callout.calloutTime.toISOString(),
      incidentType: callout.incidentType,
      location: callout.location,
      priority: callout.priority,
      status: callout.status,
      team: callout.team,
      requestedBy: callout.requestedBy,
      approvedBy: callout.approvedBy,
      officers: callout.officers.map((o) => o.id),
      briefing: callout.briefing,
      stagingArea: callout.stagingArea,
    }));

    return NextResponse.json({ callouts: formattedCallouts });
  } catch (error) {
    console.error("Failed to fetch tactical callouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch tactical callouts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      incidentType,
      location,
      priority,
      team,
      briefing,
      stagingArea,
      requestedBy,
      callId,
    } = body;

    // Create the callout
    const callout = await prisma.tacticalCallout.create({
      data: {
        incidentType,
        location,
        priority: priority || "URGENT",
        team,
        briefing,
        stagingArea,
        requestedBy: requestedBy || "Dispatch",
        callId: callId || null,
      },
    });

    // Find available tactical officers from the specified team(s)
    const teamFilter: any = {};
    if (team === "BOTH") {
      teamFilter.tacticalTeam = { in: ["CIRT", "SOG"] };
    } else {
      teamFilter.tacticalTeam = team;
    }

    const availableOfficers = await prisma.officer.findMany({
      where: {
        isTactical: true,
        ...teamFilter,
        dutyStatus: { in: ["AVAILABLE", "OUT_OF_SERVICE"] },
      },
      take: team === "BOTH" ? 10 : 5,
    });

    // Update callout with assigned officers
    if (availableOfficers.length > 0) {
      await prisma.tacticalCallout.update({
        where: { id: callout.id },
        data: {
          officers: {
            connect: availableOfficers.map((o) => ({ id: o.id })),
          },
        },
      });

      // Update officer statuses to DEPLOYED
      await prisma.officer.updateMany({
        where: {
          id: { in: availableOfficers.map((o) => o.id) },
        },
        data: {
          dutyStatus: "BUSY",
        },
      });
    }

    return NextResponse.json({ callout, assignedOfficers: availableOfficers.length });
  } catch (error) {
    console.error("Failed to create tactical callout:", error);
    return NextResponse.json(
      { error: "Failed to create tactical callout" },
      { status: 500 }
    );
  }
}
