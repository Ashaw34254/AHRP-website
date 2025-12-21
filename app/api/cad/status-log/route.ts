import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { unitId, unitCallsign, code, callId, notes } = body;

    if (!unitId || !unitCallsign || !code) {
      return NextResponse.json(
        { error: "Unit ID, callsign, and code are required" },
        { status: 400 }
      );
    }

    // Get the status code details
    const statusCode = await prisma.statusCode.findUnique({
      where: { code },
    });

    // Create status log
    const log = await prisma.statusLog.create({
      data: {
        unitId,
        unitCallsign,
        code,
        status: statusCode?.meaning || code,
        callId,
      },
    });

    // If call ID provided, add note to call
    if (callId && notes) {
      await prisma.callNote.create({
        data: {
          callId,
          officerId: unitId,
          content: `${code} - ${statusCode?.meaning || "Status update"}${
            notes ? `\n${notes}` : ""
          }`,
        },
      });
    }

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("Error creating status log:", error);
    return NextResponse.json(
      { error: "Failed to create status log" },
      { status: 500 }
    );
  }
}
