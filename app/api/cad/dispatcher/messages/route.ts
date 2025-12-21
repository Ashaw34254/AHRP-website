import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "system";

    const messages = await prisma.dispatcherMessage.findMany({
      where: {
        OR: [
          { toUserId: userId }, // Direct messages to user
          { toUserId: null }, // Broadcast messages
          { fromUserId: userId }, // Messages sent by user
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching dispatcher messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromUserId, fromName, toUserId, message, priority } = body;

    if (!fromUserId || !fromName || !message) {
      return NextResponse.json(
        { error: "From user ID, name, and message are required" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.dispatcherMessage.create({
      data: {
        fromUserId,
        fromName,
        toUserId: toUserId || null,
        message,
        priority: priority || "NORMAL",
      },
    });

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending dispatcher message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
