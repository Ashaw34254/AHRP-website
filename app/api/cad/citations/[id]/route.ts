import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Update citation (mark as paid)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isPaid } = body;

    const citation = await prisma.citation.update({
      where: { id },
      data: { isPaid },
    });

    return NextResponse.json({ citation });
  } catch (error) {
    console.error("Error updating citation:", error);
    return NextResponse.json(
      { error: "Failed to update citation" },
      { status: 500 }
    );
  }
}

// DELETE - Remove citation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.citation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting citation:", error);
    return NextResponse.json(
      { error: "Failed to delete citation" },
      { status: 500 }
    );
  }
}
