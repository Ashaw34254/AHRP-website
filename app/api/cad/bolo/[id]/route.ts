import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bolo = await prisma.bOLO.findUnique({
      where: { id },
    });

    if (!bolo) {
      return NextResponse.json({ error: "BOLO not found" }, { status: 404 });
    }

    return NextResponse.json({ bolo });
  } catch (error) {
    console.error("Error fetching BOLO:", error);
    return NextResponse.json(
      { error: "Failed to fetch BOLO" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["CANCELLED", "RESOLVED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const bolo = await prisma.bOLO.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ bolo });
  } catch (error) {
    console.error("Error updating BOLO:", error);
    return NextResponse.json(
      { error: "Failed to update BOLO" },
      { status: 500 }
    );
  }
}
