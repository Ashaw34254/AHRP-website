import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { completedDate, expiresAt, notes } = body;

    const record = await prisma.trainingRecord.update({
      where: { id },
      data: {
        ...(completedDate !== undefined && { completedDate: new Date(completedDate) }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            badgeNumber: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Failed to update training record:", error);
    return NextResponse.json(
      { error: "Failed to update training record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.trainingRecord.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete training record:", error);
    return NextResponse.json(
      { error: "Failed to delete training record" },
      { status: 500 }
    );
  }
}
