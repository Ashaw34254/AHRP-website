import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Update message (read status, pin, edit, reactions)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead, isPinned, message, reactions } = body;

    const updateData: any = {};
    
    if (isRead !== undefined) updateData.isRead = isRead;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (message !== undefined) {
      updateData.message = message;
      updateData.editedAt = new Date();
    }
    if (reactions !== undefined) {
      updateData.reactions = JSON.stringify(reactions);
    }

    const updatedMessage = await prisma.dispatcherMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error) {
    console.error("Error updating dispatcher message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.dispatcherMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dispatcher message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}

