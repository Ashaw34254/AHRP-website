import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, officerId } = body;

    if (!content || !officerId) {
      return NextResponse.json(
        { error: "Content and officer ID are required" },
        { status: 400 }
      );
    }

    // Check if officer exists, if not create a dev officer profile
    const officerExists = await prisma.officerProfile.findUnique({
      where: { id: officerId },
    });

    if (!officerExists) {
      // Create dev officer profile
      await prisma.officerProfile.create({
        data: {
          id: officerId,
          firstName: "Dev",
          lastName: "Officer",
          badgeNumber: "DEV-001",
          rank: "Officer",
          department: "POLICE",
          status: "ACTIVE",
        },
      });
    }

    const note = await prisma.callNote.create({
      data: {
        callId: id,
        officerId,
        content,
      },
      include: {
        officer: {
          select: {
            firstName: true,
            lastName: true,
            badgeNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
