import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch active dispatcher sessions
export async function GET() {
  try {
    const sessions = await prisma.dispatcherSession.findMany({
      where: { status: { in: ["ACTIVE", "BREAK"] } },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching dispatcher sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST - Create new dispatcher session (clock in)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: "User ID and name are required" },
        { status: 400 }
      );
    }

    const session = await prisma.dispatcherSession.create({
      data: {
        userId,
        name,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error("Error creating dispatcher session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
