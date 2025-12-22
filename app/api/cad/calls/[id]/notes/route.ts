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

    // Check if officer exists, if not create a dev officer
    const officerExists = await prisma.officer.findUnique({
      where: { id: officerId },
    });

    if (!officerExists) {
      // Create dev officer - note: this requires a userId
      // In production, officers should be properly created with user accounts
      const devUser = await prisma.user.findFirst({
        where: { email: "dev@ahrp.local" },
      });

      if (devUser) {
        await prisma.officer.create({
          data: {
            id: officerId,
            userId: devUser.id,
            callsign: "DEV-001",
            name: "Dev Officer",
            department: "POLICE",
          },
        });
      }
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
            name: true,
            badge: true,
            callsign: true,
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
