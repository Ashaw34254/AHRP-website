import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      include: {
        officers: true,
        call: true,
      },
      orderBy: {
        callsign: "asc",
      },
    });

    return NextResponse.json({ units });
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callsign, department, status, location } = body;

    const unit = await prisma.unit.create({
      data: {
        callsign,
        department,
        status: status || "OUT_OF_SERVICE",
        location,
      },
    });

    return NextResponse.json({ unit }, { status: 201 });
  } catch (error) {
    console.error("Error creating unit:", error);
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    );
  }
}
