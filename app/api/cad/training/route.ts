import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const officerId = searchParams.get("officerId");

    const where = officerId ? { officerId } : {};

    const records = await prisma.trainingRecord.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    const formattedRecords = records.map((record: typeof records[number]) => ({
      id: record.id,
      officerId: record.officerId,
      officerName: `${record.officer.firstName} ${record.officer.lastName}`,
      officerBadge: record.officer.badgeNumber,
      trainingType: record.trainingType,
      certificationName: record.certificationName,
      completedDate: record.completedDate.toISOString(),
      instructor: record.instructor,
      expiresAt: record.expiresAt?.toISOString() || null,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
    }));

    return NextResponse.json({ records: formattedRecords });
  } catch (error) {
    console.error("Failed to fetch training records:", error);
    return NextResponse.json(
      { error: "Failed to fetch training records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      officerId,
      trainingType,
      certificationName,
      completedDate,
      instructor,
      expiresAt,
      notes,
    } = body;

    if (!officerId || !certificationName || !completedDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record = await prisma.trainingRecord.create({
      data: {
        officerId,
        trainingType: trainingType || "OTHER",
        certificationName,
        completedDate: new Date(completedDate),
        instructor: instructor || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        notes: notes || null,
      },
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
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Failed to create training record:", error);
    return NextResponse.json(
      { error: "Failed to create training record" },
      { status: 500 }
    );
  }
}
