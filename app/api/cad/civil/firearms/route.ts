import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const firearms = await prisma.firearmRegistry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ firearms });
  } catch (error) {
    console.error("Failed to fetch firearms:", error);
    return NextResponse.json({ error: "Failed to fetch firearms" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ownerName,
      ownerStateId,
      weaponType,
      make,
      model,
      serialNumber,
      caliber,
      notes,
    } = body;

    if (!ownerName || !make || !model || !serialNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const firearm = await prisma.firearmRegistry.create({
      data: {
        ownerName,
        ownerId: ownerStateId || null,
        type: weaponType || "HANDGUN",
        make,
        model,
        serialNumber,
        caliber: caliber || "Unknown",
        registrationDate: new Date(),
        isStolen: false,
        notes: notes || null,
      },
    });

    return NextResponse.json({ firearm });
  } catch (error) {
    console.error("Failed to register firearm:", error);
    return NextResponse.json({ error: "Failed to register firearm" }, { status: 500 });
  }
}
