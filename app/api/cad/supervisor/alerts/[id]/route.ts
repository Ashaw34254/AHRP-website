import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isApproved, isDismissed } = body;

    const updateData: any = {};

    if (isApproved !== undefined) {
      updateData.isApproved = isApproved;
      updateData.approvedAt = new Date();
      updateData.approvedBy = "SUPERVISOR"; // Replace with actual user from session
    }

    if (isDismissed !== undefined) {
      updateData.isDismissed = isDismissed;
      if (isDismissed) {
        updateData.dismissedAt = new Date();
      }
    }

    const alert = await prisma.supervisorAlert.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Failed to update alert:", error);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.supervisorAlert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete alert:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
