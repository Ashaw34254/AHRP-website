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

    if (
      !["ACKNOWLEDGED", "ENROUTE", "ARRIVED", "CANCELLED"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const backupRequest = await prisma.backupRequest.update({
      where: { id },
      data: {
        status,
        respondedAt:
          status === "ACKNOWLEDGED" || status === "ARRIVED"
            ? new Date()
            : undefined,
      },
    });

    return NextResponse.json({ backupRequest });
  } catch (error) {
    console.error("Error updating backup request:", error);
    return NextResponse.json(
      { error: "Failed to update backup request" },
      { status: 500 }
    );
  }
}
