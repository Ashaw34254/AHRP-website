import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update call status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, priority } = body;

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      
      // Set timestamps based on status changes
      if (status === "DISPATCHED" && !updateData.dispatchedAt) {
        updateData.dispatchedAt = new Date();
      }
      if (status === "CLOSED" || status === "CANCELLED") {
        updateData.closedAt = new Date();
      }
    }
    if (priority) {
      updateData.priority = priority;
    }

    const call = await prisma.call.update({
      where: { id },
      data: updateData,
      include: {
        units: true,
        createdBy: {
          select: { name: true, email: true },
        },
        notes: {
          include: {
            officer: {
              select: { name: true, callsign: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ call });
  } catch (error) {
    console.error("Error updating call:", error);
    return NextResponse.json(
      { error: "Failed to update call" },
      { status: 500 }
    );
  }
}

// Get single call details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const call = await prisma.call.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            officers: true,
          },
        },
        createdBy: {
          select: { name: true, email: true },
        },
        notes: {
          include: {
            officer: {
              select: { name: true, callsign: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json({ call });
  } catch (error) {
    console.error("Error fetching call:", error);
    return NextResponse.json(
      { error: "Failed to fetch call" },
      { status: 500 }
    );
  }
}
