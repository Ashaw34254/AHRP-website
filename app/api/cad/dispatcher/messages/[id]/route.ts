import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Mark message as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    const message = await prisma.dispatcherMessage.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error updating dispatcher message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
