import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["RESPONDED", "CANCELLED", "RESOLVED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const alert = await prisma.panicAlert.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === "RESOLVED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Error updating panic alert:", error);
    return NextResponse.json(
      { error: "Failed to update panic alert" },
      { status: 500 }
    );
  }
}
