import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let whereClause: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const shifts = await prisma.shiftLog.findMany({
      where: whereClause,
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            badgeNumber: true,
            department: true,
          },
        },
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    const formattedShifts = shifts.map((shift: typeof shifts[number]) => ({
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
    }));

    return NextResponse.json({ shifts: formattedShifts });
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    return NextResponse.json({ error: "Failed to fetch shifts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { officerId, clockIn, notes } = body;

    if (!officerId || !clockIn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shift = await prisma.shiftLog.create({
      data: {
        officerId,
        clockIn: new Date(clockIn),
        notes,
      },
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
    console.error("Failed to create shift:", error);
    return NextResponse.json({ error: "Failed to create shift" }, { status: 500 });
  }
}
