import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const plate = searchParams.get("plate");

    if (!plate) {
      return NextResponse.json(
        { error: "License plate is required" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        plate: {
          equals: plate,
        },
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("Error searching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to search vehicle" },
      { status: 500 }
    );
  }
}
