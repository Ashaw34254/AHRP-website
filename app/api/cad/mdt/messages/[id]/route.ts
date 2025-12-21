import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    const updateData: any = {};

    if (isRead !== undefined) {
      updateData.isRead = isRead;
      if (isRead) {
        updateData.readAt = new Date();
      }
    }

    const message = await prisma.mDTMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Failed to update message:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.mDTMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
