import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cad/units/[id]/history - Get status history for a unit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");

    // First get the unit to verify it exists and get callsign
    const unit = await prisma.unit.findUnique({
      where: { id },
      select: { id: true, callsign: true },
    });

    if (!unit) {
      return NextResponse.json(
        { error: "Unit not found" },
        { status: 404 }
      );
    }

    const history = await prisma.statusLog.findMany({
      where: { unitId: id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ history, unit });
  } catch (error) {
    console.error("Error fetching unit history:", error);
    return NextResponse.json(
      { error: "Failed to fetch unit history" },
      { status: 500 }
    );
  }
}
