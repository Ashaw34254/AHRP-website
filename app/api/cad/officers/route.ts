import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const department = searchParams.get("department");

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { callsign: { contains: search } },
        { badge: { contains: search } },
      ];
    }

    if (department && department !== "ALL") {
      where.department = department;
    }

    const officers = await prisma.officer.findMany({
      where,
      include: {
        unit: true,
      },
      orderBy: {
        callsign: "asc",
      },
    });

    return NextResponse.json({ officers });
  } catch (error) {
    console.error("Error fetching officers:", error);
    return NextResponse.json(
      { error: "Failed to fetch officers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, callsign, name, badge, department, rank } = body;

    if (!userId || !callsign || !name || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const officer = await prisma.officer.create({
      data: {
        userId,
        callsign,
        name,
        badge,
        department,
        rank,
        isActive: true,
        dutyStatus: "OUT_OF_SERVICE",
      },
    });

    return NextResponse.json({ officer });
  } catch (error) {
    console.error("Error creating officer:", error);
    return NextResponse.json(
      { error: "Failed to create officer" },
      { status: 500 }
    );
  }
}
