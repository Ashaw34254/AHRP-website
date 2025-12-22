import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const warrantId = searchParams.get("id");

    if (!warrantId) {
      return NextResponse.json({ error: "Warrant ID is required" }, { status: 400 });
    }

    await prisma.warrant.delete({
      where: { id: warrantId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting warrant:", error);
    return NextResponse.json({ error: "Failed to delete warrant" }, { status: 500 });
  }
}
