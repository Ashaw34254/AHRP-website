import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, location } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (location) updateData.location = location;

    const unit = await prisma.unit.update({
      where: { id },
      data: updateData,
      include: {
        officers: true,
        call: true,
      },
    });

    return NextResponse.json({ unit });
  } catch (error) {
    console.error("Error updating unit:", error);
    return NextResponse.json(
      { error: "Failed to update unit" },
      { status: 500 }
    );
  }
}
