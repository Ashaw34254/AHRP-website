import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bolos = await prisma.bOLO.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: [
        { priority: "desc" },
        { issuedAt: "desc" },
      ],
    });

    return NextResponse.json({ bolos });
  } catch (error) {
    console.error("Error fetching BOLOs:", error);
    return NextResponse.json(
      { error: "Failed to fetch BOLOs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      title,
      description,
      personName,
      personDesc,
      vehiclePlate,
      vehicleModel,
      vehicleColor,
      imageUrl,
      priority,
      issuedBy,
    } = body;

    if (!title || !description || !issuedBy) {
      return NextResponse.json(
        { error: "Title, description, and issuedBy are required" },
        { status: 400 }
      );
    }

    const bolo = await prisma.bOLO.create({
      data: {
        type,
        title,
        description,
        personName,
        personDesc,
        vehiclePlate,
        vehicleModel,
        vehicleColor,
        imageUrl,
        priority: priority || "MEDIUM",
        issuedBy,
        status: "ACTIVE",
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: "system",
        type: "BOLO",
        title: `New BOLO: ${title}`,
        message: description,
        priority: priority || "NORMAL",
        referenceId: bolo.id,
        referenceType: "bolo",
      },
    });

    return NextResponse.json({ bolo }, { status: 201 });
  } catch (error) {
    console.error("Error creating BOLO:", error);
    return NextResponse.json(
      { error: "Failed to create BOLO" },
      { status: 500 }
    );
  }
}
