import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cad/officers/[id] - Get single officer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const officer = await prisma.officer.findUnique({
      where: { id },
      include: { unit: true },
    });

    if (!officer) {
      return NextResponse.json(
        { error: "Officer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ officer });
  } catch (error) {
    console.error("Error fetching officer:", error);
    return NextResponse.json(
      { error: "Failed to fetch officer" },
      { status: 500 }
    );
  }
}

// PATCH /api/cad/officers/[id] - Update officer details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.callsign !== undefined) updateData.callsign = body.callsign;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.rank !== undefined) updateData.rank = body.rank;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.dutyStatus !== undefined) updateData.dutyStatus = body.dutyStatus;
    if (body.isTactical !== undefined) updateData.isTactical = body.isTactical;
    if (body.tacticalTeam !== undefined) updateData.tacticalTeam = body.tacticalTeam;
    if (body.tacticalRole !== undefined) updateData.tacticalRole = body.tacticalRole;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.unitId !== undefined) updateData.unitId = body.unitId;

    const officer = await prisma.officer.update({
      where: { id },
      data: updateData,
      include: { unit: true },
    });

    return NextResponse.json({ officer });
  } catch (error) {
    console.error("Error updating officer:", error);
    return NextResponse.json(
      { error: "Failed to update officer" },
      { status: 500 }
    );
  }
}

// DELETE /api/cad/officers/[id] - Deactivate officer (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const officer = await prisma.officer.update({
      where: { id },
      data: { isActive: false, dutyStatus: "OUT_OF_SERVICE" },
    });

    return NextResponse.json({ officer });
  } catch (error) {
    console.error("Error deactivating officer:", error);
    return NextResponse.json(
      { error: "Failed to deactivate officer" },
      { status: 500 }
    );
  }
}
