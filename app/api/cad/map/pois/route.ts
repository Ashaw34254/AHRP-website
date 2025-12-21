import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all POIs
export async function GET() {
  try {
    const pois = await prisma.pointOfInterest.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ pois });
  } catch (error) {
    console.error("Error fetching POIs:", error);
    return NextResponse.json(
      { error: "Failed to fetch POIs" },
      { status: 500 }
    );
  }
}

// POST - Create new POI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, address, latitude, longitude, description, icon } = body;

    if (!name || !type || !address || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Name, type, address, and coordinates are required" },
        { status: 400 }
      );
    }

    const poi = await prisma.pointOfInterest.create({
      data: {
        name,
        type,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description,
        icon,
      },
    });

    return NextResponse.json({ poi }, { status: 201 });
  } catch (error) {
    console.error("Error creating POI:", error);
    return NextResponse.json(
      { error: "Failed to create POI" },
      { status: 500 }
    );
  }
}
