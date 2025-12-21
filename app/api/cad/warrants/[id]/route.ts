import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Update warrant (resolve)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    const warrant = await prisma.warrant.update({
      where: { id },
      data: {
        isActive,
      },
    });

    return NextResponse.json({ warrant });
  } catch (error) {
    console.error("Error updating warrant:", error);
    return NextResponse.json(
      { error: "Failed to update warrant" },
      { status: 500 }
    );
  }
}

// DELETE - Remove warrant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.warrant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting warrant:", error);
    return NextResponse.json(
      { error: "Failed to delete warrant" },
      { status: 500 }
    );
  }
}
