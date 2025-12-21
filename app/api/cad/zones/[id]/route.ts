import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: params.id },
    });

    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    return NextResponse.json(zone);
  } catch (error) {
    console.error("Error fetching zone:", error);
    return NextResponse.json({ error: "Failed to fetch zone" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const zone = await prisma.zone.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        department: body.department,
        coordinates: body.coordinates,
        color: body.color,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(zone);
  } catch (error) {
    console.error("Error updating zone:", error);
    return NextResponse.json({ error: "Failed to update zone" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.zone.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting zone:", error);
    return NextResponse.json({ error: "Failed to delete zone" }, { status: 500 });
  }
}
