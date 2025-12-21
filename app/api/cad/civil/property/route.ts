import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, ownerName, propertyType, assessedValue, zoning, notes } = body;

    if (!address || !ownerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        address,
        ownerName,
        propertyType: propertyType || "RESIDENTIAL",
        assessedValue: assessedValue ? parseFloat(assessedValue) : null,
        zoning: zoning || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Failed to create property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
