import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Assign unit to call
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { unitId } = body;

    if (!unitId) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    // Update unit with call assignment
    const unit = await prisma.unit.update({
      where: { id: unitId },
      data: {
        callId: id,
        status: "ENROUTE",
      },
      include: {
        officers: true,
        call: true,
      },
    });

    // Update call status to DISPATCHED if it was PENDING
    await prisma.call.updateMany({
      where: {
        id,
        status: "PENDING",
      },
      data: {
        status: "DISPATCHED",
        dispatchedAt: new Date(),
      },
    });

    return NextResponse.json({ unit });
  } catch (error) {
    console.error("Error assigning unit:", error);
    return NextResponse.json(
      { error: "Failed to assign unit" },
      { status: 500 }
    );
  }
}

// Unassign unit from call
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get("unitId");

    if (!unitId) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    const unit = await prisma.unit.update({
      where: { id: unitId },
      data: {
        callId: null,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({ unit });
  } catch (error) {
    console.error("Error unassigning unit:", error);
    return NextResponse.json(
      { error: "Failed to unassign unit" },
      { status: 500 }
    );
  }
}
