import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { clockOut, notes, callsHandled } = body;

    const updateData: any = {};

    if (clockOut) {
      updateData.clockOut = new Date(clockOut);
      
      // Calculate hours worked if both clockIn and clockOut exist
      const shift = await prisma.shiftLog.findUnique({
        where: { id: params.id },
      });
      
      if (shift?.clockIn) {
        const hours = (new Date(clockOut).getTime() - shift.clockIn.getTime()) / (1000 * 60 * 60);
        updateData.hoursWorked = Math.round(hours * 10) / 10; // Round to 1 decimal
      }
    }

    if (callsHandled !== undefined) updateData.callsHandled = callsHandled;
    if (notes !== undefined) updateData.notes = notes;

    const shift = await prisma.shiftLog.update({
      where: { id: params.id },
      data: updateData,
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            badgeNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      shift: {
        id: shift.id,
        officerId: shift.officerId,
        officerName: `${shift.officer.firstName} ${shift.officer.lastName}`,
        officerBadge: shift.officer.badgeNumber,
        clockIn: shift.clockIn.toISOString(),
        clockOut: shift.clockOut?.toISOString() || null,
        hoursWorked: shift.hoursWorked,
        callsHandled: shift.callsHandled,
        notes: shift.notes,
        createdAt: shift.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to update shift:", error);
    return NextResponse.json({ error: "Failed to update shift" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.shiftLog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete shift:", error);
    return NextResponse.json({ error: "Failed to delete shift" }, { status: 500 });
  }
}
